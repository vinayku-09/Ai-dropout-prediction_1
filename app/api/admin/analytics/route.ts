import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
   
    if (!session?.user || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const instituteId = session.user.instituteId

    // Get total students
    const totalStudents = await prisma.studentProfile.count({
      where: { instituteId }
    })

    // Get predictions summary
    const predictions = await prisma.dropoutPrediction.findMany({
      where: {
        student: { instituteId }
      },
      include: {
        student: {
          include: {
            attendances: true,
            assessments: true,
            fees: true,
            activities: true
          }
        }
      }
    })

    // Calculate risk distribution
    const highRisk = predictions.filter(p => p.risk_score > 0.5).length
    const mediumRisk = predictions.filter(p => p.risk_score > 0.3 && p.risk_score <= 0.5).length
    const lowRisk = predictions.filter(p => p.risk_score <= 0.3).length

    // Calculate monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthPredictions = predictions.filter(p => 
        p.prediction_date >= monthStart && p.prediction_date <= monthEnd
      )

      const avgRisk = monthPredictions.length > 0 
        ? (monthPredictions.reduce((sum, p) => sum + p.risk_score, 0) / monthPredictions.length) * 100
        : 0

      // Calculate average attendance for the month
      const attendanceData = await prisma.attendance.findMany({
        where: {
          instituteId,
          date: { gte: monthStart, lte: monthEnd }
        }
      })

      const avgAttendance = attendanceData.length > 0
        ? (attendanceData.filter(a => a.is_present).length / attendanceData.length) * 100
        : 0

      monthlyTrends.push({
        month: date.toLocaleDateString('en', { month: 'short' }),
        risk: Math.round(avgRisk * 10) / 10,
        attendance: Math.round(avgAttendance * 10) / 10
      })
    }

    // Calculate top risk factors
    let lowAttendanceCount = 0
    let poorScoresCount = 0
    let feeDelayCount = 0
    let inactiveCount = 0
    let lateSubmissionCount = 0

    for (const prediction of predictions) {
      const student = prediction.student
      
      // Calculate attendance percentage
      const totalClasses = student.attendances.length
      const attendedClasses = student.attendances.filter(a => a.is_present).length
      const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0
      
      if (attendancePercentage < 75) lowAttendanceCount++

      // Calculate average score
      const scores = student.assessments
      const avgScore = scores.length > 0 
        ? (scores.reduce((sum, a) => sum + (a.score_obtained / a.max_score) * 100, 0) / scores.length)
        : 0
      
      if (avgScore < 40) poorScoresCount++

      // Check fee delays
      const unpaidFees = student.fees.filter(f => f.status === 'PENDING' && new Date() > f.due_date)
      if (unpaidFees.length > 0) feeDelayCount++

      // Check LMS activity
      const recentLogins = student.activities.filter(a => 
        a.activity_type === 'LMS Login' && 
        new Date() - new Date(a.date) < 7 * 24 * 60 * 60 * 1000
      )
      if (recentLogins.length === 0) inactiveCount++

      // Check late submissions
      const lateSubmissions = student.assessments.filter(a => 
        a.submission_date && a.due_date && a.submission_date > a.due_date
      )
      if (lateSubmissions.length > 0) lateSubmissionCount++
    }

    const totalAtRisk = Math.max(highRisk, 1) // Prevent division by zero

    const topRiskFactors = [
      { 
        factor: 'Low Attendance', 
        count: lowAttendanceCount, 
        percentage: Math.round((lowAttendanceCount / totalAtRisk) * 100 * 10) / 10 
      },
      { 
        factor: 'Poor Assessment Scores', 
        count: poorScoresCount, 
        percentage: Math.round((poorScoresCount / totalAtRisk) * 100 * 10) / 10 
      },
      { 
        factor: 'Fee Payment Delays', 
        count: feeDelayCount, 
        percentage: Math.round((feeDelayCount / totalAtRisk) * 100 * 10) / 10 
      },
      { 
        factor: 'Reduced LMS Activity', 
        count: inactiveCount, 
        percentage: Math.round((inactiveCount / totalAtRisk) * 100 * 10) / 10 
      },
      { 
        factor: 'Late Submissions', 
        count: lateSubmissionCount, 
        percentage: Math.round((lateSubmissionCount / totalAtRisk) * 100 * 10) / 10 
      }
    ].sort((a, b) => b.count - a.count)

    return NextResponse.json({
      totalStudents,
      atRiskStudents: highRisk,
      mediumRiskStudents: mediumRisk,
      lowRiskStudents: lowRisk,
      avgRiskScore: predictions.length > 0 
        ? (predictions.reduce((sum, p) => sum + p.risk_score, 0) / predictions.length)
        : 0,
      riskDistribution: [
        { name: 'Low Risk', value: lowRisk, color: '#10b981' },
        { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b' },
        { name: 'High Risk', value: highRisk, color: '#ef4444' }
      ],
      monthlyTrends,
      topRiskFactors
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}