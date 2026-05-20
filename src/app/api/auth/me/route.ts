import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'

const SESSION_COOKIE_NAME = 'session_token'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      const response = NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
      response.cookies.set(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      })
      return response
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get current user error:', error)
    const response = NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })
    return response
  }
}
