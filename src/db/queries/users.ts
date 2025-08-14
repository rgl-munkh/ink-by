import { eq } from 'drizzle-orm'
import { db } from '../index'
import { users, userProfiles, UserType } from '../schema'
import type { User, NewUser, UserProfile, NewUserProfile } from '../schema'

// User management functions
export const userQueries = {
  // Create a new user profile after Supabase auth user creation
  createUserWithProfile: async (authUserId: string, userData: {
    email: string
    fullName?: string
    userType: 'customer' | 'tattooist'
  }, profileData?: Partial<NewUserProfile>) => {
    const tx = await db.transaction(async (trx) => {
      // Create user record
      const [newUser] = await trx.insert(users).values({
        id: authUserId, // Use Supabase auth user ID
        email: userData.email,
        fullName: userData.fullName,
        userType: userData.userType,
      }).returning()

      // Create user profile
      const [newProfile] = await trx.insert(userProfiles).values({
        userId: authUserId,
        bio: profileData?.bio,
        location: profileData?.location,
        phone: profileData?.phone,
        website: profileData?.website,
        preferences: profileData?.preferences,
      }).returning()

      return { user: newUser, profile: newProfile }
    })

    return tx
  },

  // Get user with profile by auth ID
  getUserWithProfile: async (authUserId: string) => {
    const result = await db
      .select({
        user: users,
        profile: userProfiles,
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
      .where(eq(users.id, authUserId))
      .limit(1)

    return result[0] || null
  },

  // Get user by email
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return result[0] || null
  },

  // Update user profile
  updateUserProfile: async (authUserId: string, profileData: Partial<NewUserProfile>) => {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, authUserId))
      .returning()

    return updatedProfile
  },

  // Update user info
  updateUser: async (authUserId: string, userData: Partial<NewUser>) => {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, authUserId))
      .returning()

    return updatedUser
  },

  // Update last login timestamp
  updateLastLogin: async (authUserId: string) => {
    await db
      .update(userProfiles)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, authUserId))
  },

  // Mark email as verified
  markEmailVerified: async (authUserId: string) => {
    await db
      .update(userProfiles)
      .set({
        isEmailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, authUserId))
  },

  // Check if user profile is complete
  checkProfileComplete: async (authUserId: string) => {
    const userWithProfile = await userQueries.getUserWithProfile(authUserId)
    
    if (!userWithProfile) return false
    
    const { user, profile } = userWithProfile
    const requiredFields = ['fullName', 'email']
    const requiredProfileFields = user.userType === UserType.TATTOOIST 
      ? ['bio', 'location'] 
      : ['location']
    
    const hasRequiredFields = requiredFields.every(field => user[field as keyof User])
    const hasRequiredProfileFields = profile 
      ? requiredProfileFields.every(field => profile[field as keyof UserProfile])
      : false
    
    const isComplete = hasRequiredFields && hasRequiredProfileFields
    
    // Update profile completion status
    if (profile && profile.isProfileComplete !== isComplete) {
      await db
        .update(userProfiles)
        .set({
          isProfileComplete: isComplete,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, authUserId))
    }
    
    return isComplete
  },

  // Get users by type with pagination
  getUsersByType: async (userType: 'customer' | 'tattooist', offset = 0, limit = 50) => {
    const result = await db
      .select({
        user: users,
        profile: userProfiles,
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
      .where(eq(users.userType, userType))
      .offset(offset)
      .limit(limit)
      .orderBy(users.createdAt)

    return result
  },

  // Delete user and profile (soft delete could be implemented)
  deleteUser: async (authUserId: string) => {
    await db.transaction(async (trx) => {
      // Delete user profile first
      await trx.delete(userProfiles).where(eq(userProfiles.userId, authUserId))
      // Delete user
      await trx.delete(users).where(eq(users.id, authUserId))
    })
  }
}

// Export types for use in other parts of the app
export type UserWithProfile = NonNullable<Awaited<ReturnType<typeof userQueries.getUserWithProfile>>>
