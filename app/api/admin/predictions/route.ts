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

    // Fetch all predictions with student details
    const predictions = await prisma.dropoutPrediction.findMany({
      where: {
        student: {
          instituteId: session.user.instituteId
        }
      },
      include: {
        student: {
          include: {
            user: true,
            attendances: {
              select: {
                is_present: true
              }
            },
            assessments: {
              select: {
                score_obtained: true,
                max_score: true
              }
            },
            activities: {
              where: {
                activity_type: 'LMS Login'
              },
              orderBy: {
                date: 'desc'
              },
              take: 1
            }
          }
        }
      },
      orderBy: {
        risk_score: 'desc'
      }
    })

    // Process predictions for frontend
    const processedPredictions = predictions.map(p => {
      // Calculate attendance percentage
      const totalClasses = p.student.attendances.length
      const attendedClasses = p.student.attendances.filter(a => a.is_present).length
      const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0

      // Calculate average score
      const scores = p.student.assessments
      const avgScore = scores.length > 0 
        ? (scores.reduce((sum, a) => sum + (a.score_obtained / a.max_score) * 100, 0) / scores.length)
        : 0

      // Get last login
      const lastLogin = p.student.activities[0]?.date || null

      return {
        id: p.id,
        student_id: p.student.student_id,
        name: p.student.user?.name || 'Unknown',
        email: p.student.user?.email || '',
        phone: p.student.phone || '',
        course: p.student.course || '',
        risk_score: p.risk_score,
        risk_category: p.risk_level,
        explanation: p.contributing_factors?.explanation || null,
        attendance: Math.round(attendancePercentage * 100) / 100,
        avgScore: Math.round(avgScore * 100) / 100,
        lastLogin: lastLogin ? lastLogin.toISOString().split('T')[0] : 'Never',
        prediction_date: p.prediction_date
      }
    })

    return NextResponse.json({
      predictions: processedPredictions
    })

  } catch (error) {
    console.error('Predictions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}