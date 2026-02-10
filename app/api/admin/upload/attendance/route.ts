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

    const requiredColumns = ['student_id', 'date', 'is_present']
   
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

    for (const row of rows) {
      try {
        const studentProfile = await prisma.studentProfile.findFirst({
          where: {
            instituteId: session.user.instituteId,
            student_id: String(row.student_id)
          }
        })

        if (!studentProfile) {
          errors++
          continue
        }

       

        await prisma.attendance.upsert({
          where: {
            studentId_date_subject_code: {
              studentId: studentProfile.id,
              date: new Date(row.date),
              subject_code: row.subject_code || 'default'
            }
          },
          update: {
            is_present: Boolean(row.is_present)
          },
          create: {
            instituteId: session.user.instituteId,
            studentId: studentProfile.id,
            date: new Date(row.date),
            is_present: Boolean(row.is_present),
            subject_code: row.subject_code || 'default',
            subject_name: row.subject_name ?? undefined
          }
        })
        processed++
      } catch (error) {
        console.error('Error processing attendance row:', row, error)
        errors++
      }
    }

    return NextResponse.json({
      message: 'Attendance upload completed',
      processed,
      errors,
      total: rows.length
    })
  } catch (error) {
    console.error('Attendance upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}