import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, instituteCode, studentId, department, phone } = await req.json()

    // Validate institute code
    const institute = await prisma.institute.findUnique({
      where: { code: instituteCode }
    })

    if (!institute) {
      return NextResponse.json({ error: 'Invalid institute code' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Check if student exists in master list (uploaded by admin)
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        instituteId: institute.id,
        student_id: studentId
      }
    })

    if (!studentProfile) {
      return NextResponse.json({ 
        error: 'Student ID not found in master list. Please contact your admin.' 
      }, { status: 400 })
    }

    // Check if this student profile is already linked to another user
    if (studentProfile.userId) {
      return NextResponse.json({ error: 'Student account already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and link to student profile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        instituteId: institute.id,
        studentId,
        department,
        phone
      }
    })

    // Link the user to the student profile
    await prisma.studentProfile.update({
      where: { id: studentProfile.id },
      data: { userId: user.id }
    })

    return NextResponse.json({
      message: 'Student registered successfully',
      instituteName: institute.name
    })

  } catch (error) {
    console.error('Student registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
