import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/societies/[id]/outings/[outingId]/participants - List outing participants
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

    const participants = await prisma.outingParticipant.findMany({
      where: {
        outingId: outingId
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
        { status: 'desc' }, // CONFIRMED first
        { joinedAt: 'asc' }
      ]
    })

    return NextResponse.json({ participants })
  } catch (error) {
    console.error('Error fetching outing participants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/societies/[id]/outings/[outingId]/participants - Join outing
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

    // Check if user is already a participant
    const existingParticipant = await prisma.outingParticipant.findFirst({
      where: {
        outingId: outingId,
        userId: session.user.id
      }
    })

    if (existingParticipant) {
      if (existingParticipant.status === 'CONFIRMED') {
        return NextResponse.json({ error: 'Already participating in this outing' }, { status: 400 })
      } else {
        // Update existing participant status
        const participant = await prisma.outingParticipant.update({
          where: { id: existingParticipant.id },
          data: {
            status: 'CONFIRMED'
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
      }
    }

    // Add new participant
    const participant = await prisma.outingParticipant.create({
      data: {
        outingId: outingId,
        userId: session.user.id,
        status: 'CONFIRMED'
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

    return NextResponse.json({ participant }, { status: 201 })
  } catch (error) {
    console.error('Error joining outing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 