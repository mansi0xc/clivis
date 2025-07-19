import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/societies/[id]/members - List society members
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a member of the society
    const userMember = await prisma.societyMember.findFirst({
      where: {
        societyId: params.id,
        userId: session.user.id,
        status: 'ACTIVE'
      }
    })

    if (!userMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const members = await prisma.societyMember.findMany({
      where: {
        societyId: params.id,
        status: 'ACTIVE'
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
      },
      orderBy: [
        { role: 'desc' }, // Admins first
        { joinedAt: 'asc' }
      ]
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Error fetching society members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/societies/[id]/members - Add member to society
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { email, role = 'MEMBER' } = await request.json()

    // Validate input
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (!['ADMIN', 'MEMBER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is already a member
    const existingMember = await prisma.societyMember.findFirst({
      where: {
        societyId: params.id,
        userId: user.id
      }
    })

    if (existingMember) {
      if (existingMember.status === 'ACTIVE') {
        return NextResponse.json({ error: 'User is already a member' }, { status: 400 })
      } else {
        // Reactivate inactive member
        const member = await prisma.societyMember.update({
          where: { id: existingMember.id },
          data: {
            status: 'ACTIVE',
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
      }
    }

    // Add new member
    const member = await prisma.societyMember.create({
      data: {
        societyId: params.id,
        userId: user.id,
        role: role,
        status: 'ACTIVE'
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

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error('Error adding society member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 