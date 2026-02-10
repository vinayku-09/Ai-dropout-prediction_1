import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { customAlphabet } from 'nanoid'

const generateCode = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, instituteName, phone, address, website } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Generate unique institute code
    let code = generateCode()
    let institute = await prisma.institute.findUnique({ where: { code } })
    
    while (institute) {
      code = generateCode()
      institute = await prisma.institute.findUnique({ where: { code } })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Create institute and admin user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create institute first
      const newInstitute = await tx.institute.create({
        data: {
          name: instituteName,
          code,
          adminId: '', // Will update after user creation
          phone,
          address,
          website
        }
      })

      // Create admin user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ADMIN',
          instituteId: newInstitute.id,
          phone
        }
      })

      // Update institute with admin ID
      await tx.institute.update({
        where: { id: newInstitute.id },
        data: { adminId: user.id }
      })

      // Create default institute config
      await tx.instituteConfig.create({
        data: {
          instituteId: newInstitute.id,
          attendanceCutoff: 75,
          ia1Cutoff: 40,
          ia2Cutoff: 40,
          midSemCutoff: 40,
          finalSemCutoff: 40,
          emailNotifications: true,
          whatsappNotifications: false
        }
      })

      return { user, institute: newInstitute }
    })

    return NextResponse.json({
      message: 'Admin registered successfully',
      instituteCode: code,
      instituteName
    })

  } catch (error) {
    console.error('Admin registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
