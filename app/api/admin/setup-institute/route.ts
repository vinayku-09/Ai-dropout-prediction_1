// Create this file: /api/admin/setup-institute/route.ts
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

    console.log('Setting up institute for user:', session.user)

    // Check if institute already exists
    let institute = await prisma.institute.findUnique({
      where: { id: session.user.instituteId }
    })

    if (!institute) {
      // Create the institute record
      institute = await prisma.institute.create({
        data: {
          id: session.user.instituteId, // Use the existing ID from user
          name: "LTCE Institute", // You can customize this
          code: "LTCE001",
          adminId: session.user.id,
          address: "Mumbai, Maharashtra",
          phone: "+91 22 1234 5678",
          website: "https://ltce.edu"
        }
      })

      console.log('Created institute:', institute)
    }

    // Also create institute config if it doesn't exist
    let config = await prisma.instituteConfig.findUnique({
      where: { instituteId: institute.id }
    })

    if (!config) {
      config = await prisma.instituteConfig.create({
        data: {
          instituteId: institute.id,
          attendanceCutoff: 75,
          ia1Cutoff: 40,
          ia2Cutoff: 40,
          midSemCutoff: 40,
          finalSemCutoff: 40,
          emailNotifications: true,
          whatsappNotifications: false
        }
      })

      console.log('Created institute config:', config)
    }

    return NextResponse.json({
      message: 'Institute setup completed',
      institute,
      config
    })

  } catch (error) {
    console.error('Institute setup error:', error)
    return NextResponse.json({ 
      error: 'Failed to setup institute',
      details: error.message 
    }, { status: 500 })
  }
}