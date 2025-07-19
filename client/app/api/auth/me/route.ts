import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error('Error getting user session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 