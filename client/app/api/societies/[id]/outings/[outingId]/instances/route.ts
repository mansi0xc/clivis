import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/societies/[id]/outings/[outingId]/instances - List outing instances
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, outingId } = await params

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

    const instances = await prisma.instance.findMany({
      where: {
        outingId: outingId
      },
      include: {
        settlements: {
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            },
            toUser: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            settlements: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ instances })
  } catch (error) {
    console.error('Error fetching instances:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/societies/[id]/outings/[outingId]/instances - Create new instance
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, outingId } = await params

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

    const { title, description, totalAmount, participants } = await request.json()

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Instance title is required' }, { status: 400 })
    }

    if (title.length > 200) {
      return NextResponse.json({ error: 'Instance title must be less than 200 characters' }, { status: 400 })
    }

    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json({ error: 'Valid total amount is required' }, { status: 400 })
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ error: 'At least one participant is required' }, { status: 400 })
    }

    if (description && description.length > 1000) {
      return NextResponse.json({ error: 'Description must be less than 1000 characters' }, { status: 400 })
    }

    // Validate participants
    for (const participant of participants) {
      if (!participant.userId || !participant.amount || typeof participant.amount !== 'number' || participant.amount < 0) {
        return NextResponse.json({ error: 'Invalid participant data' }, { status: 400 })
      }
    }

    // Create instance with settlements
    const instance = await prisma.instance.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        totalAmount: totalAmount,
        outingId: outingId,
        createdBy: session.user.id,
        settlements: {
          create: participants.map((participant: any) => ({
            fromUserId: participant.userId,
            toUserId: session.user.id, // Creator receives the money
            amount: participant.amount,
            status: 'PENDING'
          }))
        }
      },
      include: {
        settlements: {
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            },
            toUser: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            settlements: true
          }
        }
      }
    })

    return NextResponse.json({ instance }, { status: 201 })
  } catch (error) {
    console.error('Error creating instance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 