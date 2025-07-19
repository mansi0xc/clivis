import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'

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