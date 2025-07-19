import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/societies/[id] - Get society details
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
    const society = await prisma.society.findFirst({
      where: {
        id: id,
        members: {
          some: {
            userId: session.user.id,
            status: 'ACTIVE'
          }
        }
      },
      include: {
        members: {
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
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        outings: {
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
            _count: {
              select: {
                instances: true
              }
            }
          },
          orderBy: {
            date: 'desc'
          }
        },
        _count: {
          select: {
            outings: true,
            members: true
          }
        }
      }
    })

    if (!society) {
      return NextResponse.json({ error: 'Society not found' }, { status: 404 })
    }

    return NextResponse.json({ society })
  } catch (error) {
    console.error('Error fetching society:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/societies/[id] - Update society
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Check if user is admin of the society
    const member = await prisma.societyMember.findFirst({
      where: {
        societyId: id,
        userId: session.user.id,
        status: 'ACTIVE',
        role: 'ADMIN'
      }
    })

    if (!member) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { name, description } = await request.json()

    // Validate input
    if (name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'Society name is required' }, { status: 400 })
      }
      if (name.length > 100) {
        return NextResponse.json({ error: 'Society name must be less than 100 characters' }, { status: 400 })
      }
    }

    if (description !== undefined && description && description.length > 500) {
      return NextResponse.json({ error: 'Description must be less than 500 characters' }, { status: 400 })
    }

    const society = await prisma.society.update({
      where: {
        id: id
      },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null })
      },
      include: {
        members: {
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
            outings: true,
            members: true
          }
        }
      }
    })

    return NextResponse.json({ society })
  } catch (error) {
    console.error('Error updating society:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/societies/[id] - Delete society
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin of the society
    const member = await prisma.societyMember.findFirst({
      where: {
        societyId: params.id,
        userId: session.user.id,
        status: 'ACTIVE',
        role: 'ADMIN'
      }
    })

    if (!member) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Delete society (cascade will handle related records)
    await prisma.society.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Society deleted successfully' })
  } catch (error) {
    console.error('Error deleting society:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 