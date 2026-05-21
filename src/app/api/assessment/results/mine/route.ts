import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await requireAuth()

    const result = await prisma.assessmentResult.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Error fetching own assessment result:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}
