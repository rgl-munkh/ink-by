// Import database types and enums
import type {
  User,
  NewUser,
  UserProfile,
  NewUserProfile,
  PortfolioItem,
  NewPortfolioItem,
  AvailabilitySlot,
  NewAvailabilitySlot,
  Booking,
  NewBooking,
  UserTypeValue,
  BookingStatusValue,
  PaymentStatusValue,
  UserType as UserTypeEnum,
  BookingStatus as BookingStatusEnum,
  PaymentStatus as PaymentStatusEnum,
} from '@/db/schema'
import type { Session } from '@supabase/supabase-js'

// Re-export database types
export type {
  User,
  NewUser,
  UserProfile,
  NewUserProfile,
  PortfolioItem,
  NewPortfolioItem,
  AvailabilitySlot,
  NewAvailabilitySlot,
  Booking,
  NewBooking,
  UserTypeValue,
  BookingStatusValue,
  PaymentStatusValue,
}

// Re-export enum constants for use in components
export { UserTypeEnum as UserType, BookingStatusEnum as BookingStatus, PaymentStatusEnum as PaymentStatus }

// Type aliases for better ergonomics (using schema-derived types)
export type UserType = UserTypeValue
export type BookingStatus = BookingStatusValue  
export type PaymentStatus = PaymentStatusValue

// Centralized user type constants to avoid string literal repetition
export const USER_TYPES = {
  CUSTOMER: 'customer',
  TATTOOIST: 'tattooist'
} as const

export type UserTypeValues = typeof USER_TYPES[keyof typeof USER_TYPES]

export interface TattooIdeas {
  description: string
  images: string[]
  size: string
  placement: string
  style: string
}

export interface UserSession {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  userType: UserType
}

export interface BookingForm {
  slotId: string
  tattooIdeas: TattooIdeas
  notes?: string
}

// Auth Result types for better type safety
export interface AuthError {
  message: string
  code?: string
  details?: string
}

export interface AuthSuccess<T = unknown> {
  data: T
  error: null
}

export interface AuthFailure {
  data: null
  error: AuthError
}

export type AuthResult<T = unknown> = AuthSuccess<T> | AuthFailure

// Specific auth result types
export type SignUpResult = AuthResult<{
  user: User | null
  session: Session | null
}>

export type SignInResult = AuthResult<{
  user: User
  session: Session
}>

export type UserProfileResult = AuthResult<{
  user: User
  userProfile: UserProfile | null
}>
