import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, sendWhatsApp } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId, type } = await req.json()

    // Get student details
    const student = await prisma.studentProfile.findFirst({
      where: {
        id: studentId,
        instituteId: session.user.instituteId
      },
      include: {
        user: true,
        institute: true
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const message = `Dear ${student.user?.name || 'Student'}, 
    
Your academic performance requires attention. Please check your portal for detailed analysis and recommendations.

Regards,
${student.institute.name}`

    if (type === 'email' && student.user?.email) {
      await sendEmail(
        student.user.email,
        'Academic Alert - Immediate Attention Required',
        `<p>${message.replace(/\n/g, '<br>')}</p>`
      )
    }

    if (type === 'whatsapp' && student.phone) {
      await sendWhatsApp(student.phone, message)
    }

    // Log notification
    await prisma.notification.create({
      data: {
        studentId: student.id,
        type: type.toUpperCase(),
        content: message,
        status: 'SENT',
        recipient: type === 'email' ? student.user?.email || '' : student.phone || ''
      }
    })

    return NextResponse.json({ message: 'Notification sent successfully' })

  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
