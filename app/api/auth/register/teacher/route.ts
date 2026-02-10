import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, instituteCode, facultyId, department, phone } = await req.json()

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

    // Check if faculty ID is already taken in this institute
    const existingFaculty = await prisma.user.findFirst({
      where: { 
        facultyId,
        instituteId: institute.id
      }
    })

    if (existingFaculty) {
      return NextResponse.json({ error: 'Faculty ID already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'TEACHER',
        instituteId: institute.id,
        facultyId,
        department,
        phone
      }
    })

    return NextResponse.json({
      message: 'Teacher registered successfully',
      instituteName: institute.name
    })

  } catch (error) {
    console.error('Teacher registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

