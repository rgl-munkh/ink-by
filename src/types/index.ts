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
