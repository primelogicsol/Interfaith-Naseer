import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'contact_messages', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update messages' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const data: Record<string, unknown> = {}
    if (body.isRead !== undefined) data.isRead = body.isRead
    if (body.adminReply !== undefined) {
      data.adminReply = body.adminReply
      data.repliedAt = new Date()
      data.repliedBy = user.id
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data,
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error updating contact message:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update message' },
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

    const hasPermission = await checkPermission(user.id, 'contact_messages', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete messages' },
        { status: 403 }
      )
    }

    await prisma.contactMessage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact message:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
