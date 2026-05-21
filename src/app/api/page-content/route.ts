import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    const pageKey = searchParams.get('pageKey')

    let whereClause: Record<string, unknown> = {}

    if (pageKey) {
      whereClause.pageKey = pageKey
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      whereClause.status = 'published'
    }

    const content = await prisma.pageContent.findMany({
      where: whereClause,
      orderBy: [
        { pageKey: 'asc' },
        { orderIndex: 'asc' },
      ]
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching page content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'page_content', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create page content' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { pageKey, sectionKey, title, content, orderIndex } = body

    if (!pageKey || !sectionKey) {
      return NextResponse.json(
        { error: 'Page key and section key are required' },
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

    const pageContent = await prisma.pageContent.create({
      data: {
        pageKey,
        sectionKey,
        title,
        content,
        orderIndex: orderIndex ?? 0,
        status,
      },
    })

    return NextResponse.json(pageContent, { status: 201 })
  } catch (error) {
    console.error('Error creating page content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create page content' },
      { status: 500 }
    )
  }
}
