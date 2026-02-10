import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
   
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all uploaded data for this institute
    const students = await prisma.studentProfile.findMany({
      where: { instituteId: session.user.instituteId },
      include: {
        attendances: true,
        assessments: true,
        activities: true,
        fees: true
      }
    })

    if (students.length === 0) {
      return NextResponse.json({ error: 'No student data found. Please upload required files first.' }, { status: 400 })
    }

    // Prepare data for FastAPI
    const formData = new FormData()
    
    // Create Excel files from database data
    const studentsData = students.map(s => ({
      student_id: s.student_id,
      course: s.course || '',
      admission_year: s.admission_year || 2023,
      entry_exam_percentile: s.entry_exam_percentile || 0,
      first_generation_learner: s.first_generation_learner || false
    }))

    const attendanceData = students.flatMap(s => 
      s.attendances.map(a => ({
        student_id: s.student_id,
        date: a.date.toISOString().split('T')[0],
        is_present: a.is_present,
        subject_code: a.subject_code || ''
      }))
    )

    const assessmentData = students.flatMap(s =>
      s.assessments.map(a => ({
        student_id: s.student_id,
        assessment_name: a.assessment_name,
        max_score: a.max_score,
        score_obtained: a.score_obtained,
        due_date: a.due_date?.toISOString().split('T')[0] || '',
        submission_date: a.submission_date?.toISOString().split('T')[0] || ''
      }))
    )

    const activitiesData = students.flatMap(s =>
      s.activities.map(a => ({
        student_id: s.student_id,
        date: a.date.toISOString().split('T')[0],
        activity_type: a.activity_type
      }))
    )

    const feesData = students.flatMap(s =>
      s.fees.map(f => ({
        student_id: s.student_id,
        due_date: f.due_date.toISOString().split('T')[0],
        amount_due: f.amount_due,
        amount_paid: f.amount_paid,
        payment_date: f.payment_date?.toISOString().split('T')[0] || '',
        reminders_sent: f.reminders_sent
      }))
    )

    // Convert to Excel buffers (simplified - in production use a proper Excel library)
    const createCSVBuffer = (data: any[], filename: string) => {
      const headers = Object.keys(data[0] || {})
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => row[h] || '').join(','))
      ].join('\n')
      return new Blob([csvContent], { type: 'text/csv' })
    }

    // Create form data with files
    formData.append('files', createCSVBuffer(studentsData, 'students.xlsx'), 'students.xlsx')
    formData.append('files', createCSVBuffer(attendanceData, 'attendance.xlsx'), 'attendance.xlsx')
    formData.append('files', createCSVBuffer(assessmentData, 'assessments.xlsx'), 'assessments.xlsx')
    formData.append('files', createCSVBuffer(activitiesData, 'activities.xlsx'), 'activities.xlsx')
    formData.append('files', createCSVBuffer(feesData, 'fees.xlsx'), 'fees.xlsx')

    // Call FastAPI prediction service
    const fastApiResponse = await fetch(`${process.env.FASTAPI_URL || 'http://127.0.0.1:8000'}/predict`, {
      method: 'POST',
      body: formData
    })

    if (!fastApiResponse.ok) {
      throw new Error(`FastAPI error: ${fastApiResponse.statusText}`)
    }

    const predictions = await fastApiResponse.json()

    // Store predictions in database
    for (const prediction of predictions.predictions) {
      const student = await prisma.studentProfile.findFirst({
        where: {
          instituteId: session.user.instituteId,
          student_id: prediction.student_id
        }
      })

      if (student) {
        await prisma.dropoutPrediction.create({
          data: {
            studentId: student.id,
            risk_score: prediction.risk_score,
            risk_level: prediction.risk_category,
            confidence: prediction.risk_score,
            contributing_factors: prediction.explanation ? { explanation: prediction.explanation } : {},
            model_version: 'v1.0.0'
          }
        })
      }
    }

    return NextResponse.json({
      message: 'Predictions generated successfully',
      predictions: predictions.predictions,
      total: predictions.predictions.length
    })

  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate predictions',
      details: error.message 
    }, { status: 500 })
  }
}