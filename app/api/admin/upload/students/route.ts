// Update your /api/admin/upload/students/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
   
    if (!session?.user || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Student upload - Session:', session.user)
    console.log('Institute ID:', session.user.instituteId)

    // Check if institute exists
    const institute = await prisma.institute.findUnique({
      where: { id: session.user.instituteId }
    })

    if (!institute) {
      return NextResponse.json({ 
        error: 'Institute not found. Please run institute setup first.',
        needsSetup: true 
      }, { status: 400 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
   
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(worksheet) as any[]

    const requiredColumns = ['student_id']
   
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 })
    }

    const fileColumns = Object.keys(rows[0])
    const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col))
   
    if (missingColumns.length > 0) {
      return NextResponse.json({
        error: `Missing required columns: ${missingColumns.join(', ')}`
      }, { status: 400 })
    }

    let processed = 0
    let errors = 0
    const errorDetails = []

    for (const row of rows) {
      try {
        console.log('Processing student:', row.student_id)
        
        const result = await prisma.studentProfile.upsert({
          where: {
            instituteId_student_id: {
              instituteId: session.user.instituteId,
              student_id: String(row.student_id)
            }
          },
          update: {
            course: row.course || null,
            department: row.department || null,
            admission_year: row.admission_year ? parseInt(row.admission_year) : null,
            entry_exam_percentile: row.entry_exam_percentile ? parseFloat(row.entry_exam_percentile) : null,
            first_generation_learner: row.first_generation_learner ? Boolean(row.first_generation_learner) : null,
            current_semester: row.current_semester ? parseInt(row.current_semester) : null,
            phone: row.phone || null,
            parentPhone: row.parent_phone || null,
            address: row.address || null
          },
          create: {
            instituteId: session.user.instituteId,
            student_id: String(row.student_id),
            course: row.course || null,
            department: row.department || null,
            admission_year: row.admission_year ? parseInt(row.admission_year) : null,
            entry_exam_percentile: row.entry_exam_percentile ? parseFloat(row.entry_exam_percentile) : null,
            first_generation_learner: row.first_generation_learner ? Boolean(row.first_generation_learner) : null,
            current_semester: row.current_semester ? parseInt(row.current_semester) : null,
            phone: row.phone || null,
            parentPhone: row.parent_phone || null,
            address: row.address || null
          }
        })

        console.log('Successfully processed student:', result.student_id)
        processed++
      } catch (error) {
        console.error('Error processing student row:', row, error)
        errorDetails.push({
          student_id: row.student_id,
          error: error.message
        })
        errors++
      }
    }

    // Verify data was actually saved
    const savedStudents = await prisma.studentProfile.count({
      where: { instituteId: session.user.instituteId }
    })

    console.log('Total students saved:', savedStudents)

    return NextResponse.json({
      message: 'Student upload completed',
      processed,
      errors,
      total: rows.length,
      savedCount: savedStudents,
      errorDetails: errorDetails.slice(0, 5) // First 5 errors only
    })

  } catch (error) {
    console.error('Student upload error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}