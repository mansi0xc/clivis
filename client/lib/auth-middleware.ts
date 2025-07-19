import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'
import { prisma } from './db'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

export async function withAuth(handler: (session: any) => Promise<NextResponse>) {
  try {
    const session = await requireAuth()
    return await handler(session)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error in auth middleware:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function optionalAuth() {
  try {
    const session = await getServerSession(authOptions)
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Society-specific authorization functions
export async function requireSocietyMember(societyId: string, userId: string) {
  const member = await prisma.societyMember.findFirst({
    where: {
      societyId,
      userId,
      status: 'ACTIVE'
    }
  })
  
  if (!member) {
    throw new Error('Not a member of this society')
  }
  
  return member
}

export async function requireSocietyAdmin(societyId: string, userId: string) {
  const member = await prisma.societyMember.findFirst({
    where: {
      societyId,
      userId,
      status: 'ACTIVE',
      role: 'ADMIN'
    }
  })
  
  if (!member) {
    throw new Error('Admin access required')
  }
  
  return member
}

export async function withSocietyAccess(
  societyId: string,
  requireAdmin: boolean = false,
  handler: (session: any, member: any) => Promise<NextResponse>
) {
  try {
    const session = await requireAuth()
    
    if (requireAdmin) {
      const member = await requireSocietyAdmin(societyId, session.user.id)
      return await handler(session, member)
    } else {
      const member = await requireSocietyMember(societyId, session.user.id)
      return await handler(session, member)
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message === 'Not a member of this society') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
      if (error.message === 'Admin access required') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
      }
    }
    console.error('Error in society access middleware:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to check if user can modify society
export async function canModifySociety(societyId: string, userId: string) {
  const member = await prisma.societyMember.findFirst({
    where: {
      societyId,
      userId,
      status: 'ACTIVE',
      role: 'ADMIN'
    }
  })
  
  return !!member
}

// Helper function to get user's role in society
export async function getUserSocietyRole(societyId: string, userId: string) {
  const member = await prisma.societyMember.findFirst({
    where: {
      societyId,
      userId,
      status: 'ACTIVE'
    },
    select: {
      role: true
    }
  })
  
  return member?.role || null
} 