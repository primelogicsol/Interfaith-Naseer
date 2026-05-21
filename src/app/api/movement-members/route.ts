import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      country,
      interests,
      traditionAffiliation,
      message,
      howHeard,
      wantsNewsletter,
      wantsVolunteer,
      userId
    } = body

    const member = await prisma.movementMember.create({
      data: {
        fullName,
        email,
        country: country || null,
        interests: interests || [],
        traditionAffiliation: traditionAffiliation || null,
        message: message || null,
        howHeard: howHeard || null,
        wantsNewsletter: wantsNewsletter || false,
        wantsVolunteer: wantsVolunteer || false,
        userId: userId || null,
      }
    })

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Error creating movement member:', error)
    return NextResponse.json(
      { error: 'Failed to join movement' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const members = await prisma.movementMember.findMany({
      orderBy: {
        createdAt: 'desc'
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

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching movement members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}
