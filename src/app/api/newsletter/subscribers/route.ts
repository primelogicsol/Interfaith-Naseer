import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        subscribedAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        }
      }
    })

    return NextResponse.json(subscribers)
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}
