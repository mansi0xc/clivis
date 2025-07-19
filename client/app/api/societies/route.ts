import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/societies - List user's societies
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const societies = await prisma.society.findMany({
      where: {
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
        _count: {
          select: {
            outings: true,
            members: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({ societies })
  } catch (error) {
    console.error('Error fetching societies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/societies - Create new society
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description } = await request.json()

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Society name is required' }, { status: 400 })
    }

    if (name.length > 100) {
      return NextResponse.json({ error: 'Society name must be less than 100 characters' }, { status: 400 })
    }

    if (description && description.length > 500) {
      return NextResponse.json({ error: 'Description must be less than 500 characters' }, { status: 400 })
    }

    // Create society with creator as admin member
    const society = await prisma.society.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        createdBy: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'ADMIN',
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
        _count: {
          select: {
            outings: true,
            members: true
          }
        }
      }
    })

    return NextResponse.json({ society }, { status: 201 })
  } catch (error) {
    console.error('Error creating society:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 