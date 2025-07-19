import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/societies/[id]/outings - List society outings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

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

    const outings = await prisma.outing.findMany({
      where: {
        societyId: id
      },
      include: {
        participants: {
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
        },
        instances: {
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
            _count: {
              select: {
                settlements: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
            instances: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ outings })
  } catch (error) {
    console.error('Error fetching outings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/societies/[id]/outings - Create new outing
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

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

    const { title, description, date, location, budget } = await request.json()

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Outing title is required' }, { status: 400 })
    }

    if (title.length > 200) {
      return NextResponse.json({ error: 'Outing title must be less than 200 characters' }, { status: 400 })
    }

    if (!date || !Date.parse(date)) {
      return NextResponse.json({ error: 'Valid date is required' }, { status: 400 })
    }

    if (description && description.length > 1000) {
      return NextResponse.json({ error: 'Description must be less than 1000 characters' }, { status: 400 })
    }

    if (budget && (typeof budget !== 'number' || budget < 0)) {
      return NextResponse.json({ error: 'Budget must be a positive number' }, { status: 400 })
    }

    // Create outing with creator as participant
    const outing = await prisma.outing.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        date: new Date(date),
        location: location?.trim() || null,
        budget: budget || null,
        societyId: id,
        createdBy: session.user.id,
        participants: {
          create: {
            userId: session.user.id,
            status: 'CONFIRMED'
          }
        }
      },
      include: {
        participants: {
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
        },
        instances: {
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
            _count: {
              select: {
                settlements: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
            instances: true
          }
        }
      }
    })

    return NextResponse.json({ outing }, { status: 201 })
  } catch (error) {
    console.error('Error creating outing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 