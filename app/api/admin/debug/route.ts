// Create this file: /api/admin/debug/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
   
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Debug session
    console.log('Session:', session.user)

    // Check institute
    const institute = await prisma.institute.findUnique({
      where: { id: session.user.instituteId }
    })

    // Get all students
    const allStudents = await prisma.studentProfile.findMany({
      select: {
        id: true,
        student_id: true,
        instituteId: true,
        course: true,
        createdAt: true
      }
    })

    // Get students for this institute
    const instituteStudents = await prisma.studentProfile.findMany({
      where: { instituteId: session.user.instituteId },
      select: {
        id: true,
        student_id: true,
        instituteId: true,
        course: true,
        createdAt: true
      }
    })

    // Check data counts
    const dataCounts = await Promise.all([
      prisma.attendance.count({ where: { instituteId: session.user.instituteId } }),
      prisma.assessment.count({ where: { instituteId: session.user.instituteId } }),
      prisma.activity.count({ where: { instituteId: session.user.instituteId } }),
      prisma.fee.count({ where: { instituteId: session.user.instituteId } })
    ])

    return NextResponse.json({
      session: {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
        instituteId: session.user.instituteId
      },
      institute: institute,
      allStudentsCount: allStudents.length,
      allStudents: allStudents,
      instituteStudentsCount: instituteStudents.length,
      instituteStudents: instituteStudents,
      dataCounts: {
        attendance: dataCounts[0],
        assessments: dataCounts[1], 
        activities: dataCounts[2],
        fees: dataCounts[3]
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error.message 
    }, { status: 500 })
  }
}