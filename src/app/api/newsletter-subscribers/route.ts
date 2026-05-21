import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, subscriptionTopics, frequency, source, userId } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      // Update existing subscription
      const updatedSubscriber = await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          name: name || existingSubscriber.name,
          subscriptionTopics: subscriptionTopics || existingSubscriber.subscriptionTopics,
          frequency: frequency || existingSubscriber.frequency,
          source: source || existingSubscriber.source,
          userId: userId || existingSubscriber.userId,
          isActive: true,
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        message: 'Newsletter subscription updated successfully',
        subscriber: {
          id: updatedSubscriber.id,
          email: updatedSubscriber.email,
          name: updatedSubscriber.name,
          subscriptionTopics: updatedSubscriber.subscriptionTopics,
          frequency: updatedSubscriber.frequency,
        },
      })
    }

    // Create new subscription
    const newSubscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        subscriptionTopics: subscriptionTopics || [],
        frequency: frequency || 'weekly',
        source,
        userId,
        isActive: true,
      },
    })

    return NextResponse.json({
      message: 'Newsletter subscription created successfully',
      subscriber: {
        id: newSubscriber.id,
        email: newSubscriber.email,
        name: newSubscriber.name,
        subscriptionTopics: newSubscriber.subscriptionTopics,
        frequency: newSubscriber.frequency,
      },
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing newsletter subscription' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { subscribedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            }
          }
        },
      }),
      prisma.newsletterSubscriber.count({ where }),
    ])

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get newsletter subscribers error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching newsletter subscribers' },
      { status: 500 }
    )
  }
}
