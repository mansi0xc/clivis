import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT /api/societies/[id]/members/[userId] - Update member role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin of the society
    const userMember = await prisma.societyMember.findFirst({
      where: {
        societyId: params.id,
        userId: session.user.id,
        status: 'ACTIVE',
        role: 'ADMIN'
      }
    })

    if (!userMember) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Prevent admin from demoting themselves if they're the only admin
    if (params.userId === session.user.id) {
      const adminCount = await prisma.societyMember.count({
        where: {
          societyId: params.id,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      })

      if (adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot demote the only admin' }, { status: 400 })
      }
    }

    const { role } = await request.json()

    // Validate input
    if (!['ADMIN', 'MEMBER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Update member role
    const member = await prisma.societyMember.update({
      where: {
        societyId_userId: {
          societyId: params.id,
          userId: params.userId
        }
      },
      data: {
        role: role
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

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Error updating member role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/societies/[id]/members/[userId] - Remove member from society
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin of the society
    const userMember = await prisma.societyMember.findFirst({
      where: {
        societyId: params.id,
        userId: session.user.id,
        status: 'ACTIVE',
        role: 'ADMIN'
      }
    })

    if (!userMember) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Prevent admin from removing themselves if they're the only admin
    if (params.userId === session.user.id) {
      const adminCount = await prisma.societyMember.count({
        where: {
          societyId: params.id,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      })

      if (adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot remove the only admin' }, { status: 400 })
      }
    }

    // Remove member (set status to INACTIVE instead of deleting)
    await prisma.societyMember.update({
      where: {
        societyId_userId: {
          societyId: params.id,
          userId: params.userId
        }
      },
      data: {
        status: 'INACTIVE'
      }
    })

    return NextResponse.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 