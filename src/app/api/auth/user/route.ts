import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { userQueries } from '@/db/queries/users'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ 
        data: null, 
        error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } 
      }, { status: 401 })
    }

    const userProfile = await userQueries.getUserWithProfile(user.id)
    
    return NextResponse.json({ 
      data: { user, userProfile },
      error: null 
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { 
        data: null, 
        error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } 
      }, 
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ 
        data: null, 
        error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } 
      }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'updateLastLogin':
        await userQueries.updateLastLogin(user.id)
        return NextResponse.json({ success: true })

      case 'markEmailVerified':
        await userQueries.markEmailVerified(user.id)
        return NextResponse.json({ success: true })

      case 'updateProfile':
        const updatedProfile = await userQueries.updateUserProfile(user.id, data)
        return NextResponse.json({ userProfile: updatedProfile })

      case 'checkProfileComplete':
        const isComplete = await userQueries.checkProfileComplete(user.id)
        return NextResponse.json({ isComplete })

      default:
        return NextResponse.json({ 
          error: { message: 'Invalid action', code: 'INVALID_ACTION' } 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, 
      { status: 500 }
    )
  }
}
