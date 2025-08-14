// Import database types
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
}

// App-specific types
export type UserType = 'customer' | 'tattooist'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type PaymentStatus = 'pending' | 'paid' | 'refunded'

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
