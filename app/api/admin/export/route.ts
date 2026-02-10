import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
   
    if (!session?.user || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'xlsx'
    const type = searchParams.get('type') || 'predictions'

    if (type === 'predictions') {
      // Export all predictions with student details
      const predictions = await prisma.dropoutPrediction.findMany({
        where: {
          student: { instituteId: session.user.instituteId }
        },
        include: {
          student: {
            include: {
              user: true,
              attendances: true,
              assessments: true,
              fees: true
            }
          }
        },
        orderBy: {
          risk_score: 'desc'
        }
      })

      const exportData = predictions.map(p => {
        const student = p.student
        
        // Calculate metrics
        const totalClasses = student.attendances.length
        const attendedClasses = student.attendances.filter(a => a.is_present).length
        const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0

        const scores = student.assessments
        const avgScore = scores.length > 0 
          ? (scores.reduce((sum, a) => sum + (a.score_obtained / a.max_score) * 100, 0) / scores.length)
          : 0

        const pendingFees = student.fees.filter(f => f.status === 'PENDING').length

        return {
          'Student ID': student.student_id,
          'Name': student.user?.name || 'Unknown',
          'Email': student.user?.email || '',
          'Phone': student.phone || '',
          'Course': student.course || '',
          'Risk Score': (p.risk_score * 100).toFixed(2) + '%',
          'Risk Category': p.risk_level,
          'Attendance %': attendancePercentage.toFixed(1),
          'Average Score %': avgScore.toFixed(1),
          'Pending Fees': pendingFees,
          'AI Explanation': p.contributing_factors?.explanation || 'No specific factors identified',
          'Prediction Date': p.prediction_date.toISOString().split('T')[0],
          'Action Required': p.risk_score > 0.5 ? 'YES - Immediate Intervention' : 'Monitor',
          'Recommended Contact': p.risk_score > 0.5 ? 'Student + Parents' : 'Student Only'
        }
      })

      if (format === 'xlsx') {
        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Risk Predictions')
        
        // Style the header row
        const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
        for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
          if (!worksheet[cellAddress]) continue
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "366092" } }
          }
        }

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="student_risk_predictions_${new Date().toISOString().split('T')[0]}.xlsx"`
          }
        })
      } else {
        // Return JSON format
        return NextResponse.json({
          data: exportData,
          totalRecords: exportData.length,
          exportDate: new Date().toISOString(),
          highRiskCount: exportData.filter(d => d['Risk Category'] === 'High Risk').length
        })
      }
    }

    // Export summary analytics
    if (type === 'analytics') {
      const analytics = await generateAnalyticsExport(session.user.instituteId)
      
      if (format === 'xlsx') {
        const workbook = XLSX.utils.book_new()
        
        // Create multiple sheets
        Object.entries(analytics).forEach(([sheetName, data]) => {
          const worksheet = XLSX.utils.json_to_sheet(data as any[])
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
        })

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="institute_analytics_${new Date().toISOString().split('T')[0]}.xlsx"`
          }
        })
      } else {
        return NextResponse.json(analytics)
      }
    }

    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateAnalyticsExport(instituteId: string) {
  // Summary statistics
  const summaryStats = await prisma.$queryRaw`
    SELECT 
      COUNT(DISTINCT sp.id) as total_students,
      COUNT(DISTINCT CASE WHEN dp.risk_score > 0.5 THEN sp.id END) as high_risk,
      COUNT(DISTINCT CASE WHEN dp.risk_score BETWEEN 0.3 AND 0.5 THEN sp.id END) as medium_risk,
      COUNT(DISTINCT CASE WHEN dp.risk_score <= 0.3 THEN sp.id END) as low_risk,
      AVG(dp.risk_score) as avg_risk_score
    FROM "StudentProfile" sp
    LEFT JOIN "DropoutPrediction" dp ON sp.id = dp."studentId"
    WHERE sp."instituteId" = ${instituteId}
  `

  // Course-wise breakdown
  const courseBreakdown = await prisma.$queryRaw`
    SELECT 
      sp.course,
      COUNT(sp.id) as total_students,
      AVG(dp.risk_score) as avg_risk_score,
      COUNT(CASE WHEN dp.risk_score > 0.5 THEN 1 END) as high_risk_count
    FROM "StudentProfile" sp
    LEFT JOIN "DropoutPrediction" dp ON sp.id = dp."studentId"
    WHERE sp."instituteId" = ${instituteId}
    GROUP BY sp.course
    ORDER BY avg_risk_score DESC
  `

  // Attendance analysis
  const attendanceAnalysis = await prisma.$queryRaw`
    SELECT 
      sp.student_id,
      sp.course,
      COUNT(a.id) as total_classes,
      COUNT(CASE WHEN a.is_present THEN 1 END) as attended_classes,
      ROUND((COUNT(CASE WHEN a.is_present THEN 1 END)::numeric / COUNT(a.id)) * 100, 2) as attendance_percentage
    FROM "StudentProfile" sp
    LEFT JOIN "Attendance" a ON sp.id = a."studentId"
    WHERE sp."instituteId" = ${instituteId}
    GROUP BY sp.id, sp.student_id, sp.course
    HAVING COUNT(a.id) > 0
    ORDER BY attendance_percentage ASC
  `

  return {
    'Summary': [summaryStats[0]],
    'Course Breakdown': courseBreakdown,
    'Attendance Analysis': attendanceAnalysis
  }
}