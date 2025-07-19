import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/societies/[id]/outings/[outingId] - Get outing details
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

    const outing = await prisma.outing.findFirst({
      where: {
        id: outingId,
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
          },
          orderBy: {
            createdAt: 'desc'
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
            participants: true,
            instances: true
          }
        }
      }
    })

    if (!outing) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    return NextResponse.json({ outing })
  } catch (error) {
    console.error('Error fetching outing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/societies/[id]/outings/[outingId] - Update outing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, outingId } = await params

    // Check if user is the creator of the outing or admin of the society
    const outing = await prisma.outing.findFirst({
      where: {
        id: outingId,
        societyId: id
      }
    })

    if (!outing) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    const isCreator = outing.createdBy === session.user.id
    const isAdmin = await prisma.societyMember.findFirst({
      where: {
        societyId: id,
        userId: session.user.id,
        status: 'ACTIVE',
        role: 'ADMIN'
      }
    })

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { title, description, date, location, budget } = await request.json()

    // Validate input
    if (title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json({ error: 'Outing title is required' }, { status: 400 })
      }
      if (title.length > 200) {
        return NextResponse.json({ error: 'Outing title must be less than 200 characters' }, { status: 400 })
      }
    }

    if (date !== undefined && (!date || !Date.parse(date))) {
      return NextResponse.json({ error: 'Valid date is required' }, { status: 400 })
    }

    if (description !== undefined && description && description.length > 1000) {
      return NextResponse.json({ error: 'Description must be less than 1000 characters' }, { status: 400 })
    }

    if (budget !== undefined && budget && (typeof budget !== 'number' || budget < 0)) {
      return NextResponse.json({ error: 'Budget must be a positive number' }, { status: 400 })
    }

    const updatedOuting = await prisma.outing.update({
      where: {
        id: outingId
      },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(location !== undefined && { location: location?.trim() || null }),
        ...(budget !== undefined && { budget: budget || null })
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
            participants: true,
            instances: true
          }
        }
      }
    })

    return NextResponse.json({ outing: updatedOuting })
  } catch (error) {
    console.error('Error updating outing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/societies/[id]/outings/[outingId] - Delete outing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, outingId } = await params

    // Check if user is the creator of the outing or admin of the society
    const outing = await prisma.outing.findFirst({
      where: {
        id: outingId,
        societyId: id
      }
    })

    if (!outing) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    const isCreator = outing.createdBy === session.user.id
    const isAdmin = await prisma.societyMember.findFirst({
      where: {
        societyId: id,
        userId: session.user.id,
        status: 'ACTIVE',
        role: 'ADMIN'
      }
    })

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete outing (cascade will handle related records)
    await prisma.outing.delete({
      where: {
        id: outingId
      }
    })

    return NextResponse.json({ message: 'Outing deleted successfully' })
  } catch (error) {
    console.error('Error deleting outing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 