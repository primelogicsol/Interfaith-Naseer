import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause: Record<string, unknown> = {}

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      whereClause = { status: 'published' }
    }

    const sections = await prisma.founderPageSection.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching founder sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch founder sections' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'founder_sections', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create founder sections' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { slug, pageTitle, pageSubtitle, cardTitle, cardSubtitle, cardDescription, imagePath, badgeLabel, order } = body

    if (!slug || !pageTitle) {
      return NextResponse.json(
        { error: 'Slug and page title are required' },
        { status: 400 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    let status = 'published'
    if (userWithRole?.role === 'editor') {
      status = 'pending_moderator'
    } else if (userWithRole?.role === 'moderator') {
      status = 'pending_admin'
    }

    const section = await prisma.founderPageSection.create({
      data: {
        slug,
        pageTitle,
        pageSubtitle: pageSubtitle || '',
        cardTitle: cardTitle || '',
        cardSubtitle: cardSubtitle || '',
        cardDescription: cardDescription || [],
        imagePath: imagePath || '',
        badgeLabel: badgeLabel || '',
        order: order ?? 0,
        status,
        createdBy: user.id,
      },
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error('Error creating founder section:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create founder section' },
      { status: 500 }
    )
  }
}
