import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser()

    const content = await prisma.pageContent.findUnique({
      where: { id },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Page content not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (content.status !== 'published') {
        return NextResponse.json(
          { error: 'Page content not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching page content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page content' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'page_content', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update page content' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { pageKey, sectionKey, title, content, orderIndex } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const pageContent = await prisma.pageContent.update({
        where: { id },
        data: {
          ...(pageKey !== undefined && { pageKey }),
          ...(sectionKey !== undefined && { sectionKey }),
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(orderIndex !== undefined && { orderIndex }),
          status: 'published',
        },
      })
      return NextResponse.json(pageContent)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'page_content',
        contentId: id,
        changes: { pageKey, sectionKey, title, content, orderIndex },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating page content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update page content' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'page_content', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete page content' },
        { status: 403 }
      )
    }

    await prisma.pageContent.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete page content' },
      { status: 500 }
    )
  }
}
