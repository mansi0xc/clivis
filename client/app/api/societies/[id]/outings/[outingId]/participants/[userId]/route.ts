import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT /api/societies/[id]/outings/[outingId]/participants/[userId] - Update participant status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outingId: string; userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, outingId, userId } = await params

    // Check if user is a member of the society
    const userMember = await prisma.societyMember.findFirst({
      where: {
        societyId: id,
        userId: session.user.id,
        status: 'ACTIVE'
      }
    })

    if (!userMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if outing exists and belongs to the society
    const outing = await prisma.outing.findFirst({
      where: {
        id: outingId,
        societyId: id
      }
    })

    if (!outing) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    // Only allow users to update their own status, or outing creator/admin to update others
    const isOwnStatus = session.user.id === userId
    const isCreator = outing.createdBy === session.user.id
    const isAdmin = userMember.role === 'ADMIN'

    if (!isOwnStatus && !isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { status } = await request.json()

    // Validate status
    if (!['CONFIRMED', 'PENDING', 'DECLINED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update participant status
    const participant = await prisma.outingParticipant.update({
      where: {
        outingId_userId: {
          outingId: outingId,
          userId: userId
        }
      },
      data: {
        status: status
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ participant })
  } catch (error) {
    console.error('Error updating participant status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/societies/[id]/outings/[outingId]/participants/[userId] - Remove participant from outing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outingId: string; userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, outingId, userId } = await params

    // Check if user is a member of the society
    const userMember = await prisma.societyMember.findFirst({
      where: {
        societyId: id,
        userId: session.user.id,
        status: 'ACTIVE'
      }
    })

    if (!userMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if outing exists and belongs to the society
    const outing = await prisma.outing.findFirst({
      where: {
        id: outingId,
        societyId: id
      }
    })

    if (!outing) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    // Only allow users to remove themselves, or outing creator/admin to remove others
    const isOwnRemoval = session.user.id === userId
    const isCreator = outing.createdBy === session.user.id
    const isAdmin = userMember.role === 'ADMIN'

    if (!isOwnRemoval && !isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Remove participant
    await prisma.outingParticipant.delete({
      where: {
        outingId_userId: {
          outingId: outingId,
          userId: userId
        }
      }
    })

    return NextResponse.json({ message: 'Participant removed successfully' })
  } catch (error) {
    console.error('Error removing participant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 