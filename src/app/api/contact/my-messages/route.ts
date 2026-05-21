import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

export async function GET() {
  try {
    const user = await requireAuth()

    const messages = await prisma.contactMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        message: true,
        adminReply: true,
        repliedAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching my messages:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
