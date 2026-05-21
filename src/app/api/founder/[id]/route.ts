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

    const section = await prisma.founderPageSection.findUnique({
      where: { id },
    })

    if (!section) {
      return NextResponse.json(
        { error: 'Founder section not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (section.status !== 'published') {
        return NextResponse.json(
          { error: 'Founder section not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching founder section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch founder section' },
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

    const hasPermission = await checkPermission(user.id, 'founder_sections', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update founder sections' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { slug, pageTitle, pageSubtitle, cardTitle, cardSubtitle, cardDescription, imagePath, badgeLabel, order } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const section = await prisma.founderPageSection.update({
        where: { id },
        data: {
          ...(slug !== undefined && { slug }),
          ...(pageTitle !== undefined && { pageTitle }),
          ...(pageSubtitle !== undefined && { pageSubtitle }),
          ...(cardTitle !== undefined && { cardTitle }),
          ...(cardSubtitle !== undefined && { cardSubtitle }),
          ...(cardDescription !== undefined && { cardDescription }),
          ...(imagePath !== undefined && { imagePath }),
          ...(badgeLabel !== undefined && { badgeLabel }),
          ...(order !== undefined && { order }),
          status: 'published',
          lastModifiedBy: user.id,
        },
      })
      return NextResponse.json(section)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'founder_sections',
        contentId: id,
        changes: { slug, pageTitle, pageSubtitle, cardTitle, cardSubtitle, cardDescription, imagePath, badgeLabel, order },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating founder section:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update founder section' },
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

    const hasPermission = await checkPermission(user.id, 'founder_sections', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete founder sections' },
        { status: 403 }
      )
    }

    await prisma.founderPageSection.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting founder section:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete founder section' },
      { status: 500 }
    )
  }
}
