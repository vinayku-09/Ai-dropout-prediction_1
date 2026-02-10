import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      attendanceCutoff,
      ia1Cutoff,
      ia2Cutoff,
      midSemCutoff,
      finalSemCutoff,
      emailNotifications,
      whatsappNotifications
    } = await req.json()

    await prisma.instituteConfig.upsert({
      where: { instituteId: session.user.instituteId },
      update: {
        attendanceCutoff,
        ia1Cutoff,
        ia2Cutoff,
        midSemCutoff,
        finalSemCutoff,
        emailNotifications,
        whatsappNotifications
      },
      create: {
        instituteId: session.user.instituteId,
        attendanceCutoff,
        ia1Cutoff,
        ia2Cutoff,
        midSemCutoff,
        finalSemCutoff,
        emailNotifications,
        whatsappNotifications
      }
    })

    return NextResponse.json({ message: 'Configuration updated successfully' })

  } catch (error) {
    console.error('Config update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}