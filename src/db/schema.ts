import { pgTable, text, timestamp, uuid, boolean, integer, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// PostgreSQL Enums for better type safety and constraints
export const userTypeEnum = pgEnum('user_type', ['customer', 'tattooist'])
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed'])
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'refunded'])

// Users table - extends Supabase auth.users
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Links to auth.users.id
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  userType: userTypeEnum('user_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Indexes for performance
  userTypeIdx: index('users_user_type_idx').on(table.userType),
  emailIdx: index('users_email_idx').on(table.email),
}))

// User profiles table for additional user information
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  bio: text('bio'),
  location: text('location'),
  phone: text('phone'),
  website: text('website'),
  preferences: jsonb('preferences').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Index for user lookup
  userIdIdx: index('user_profiles_user_id_idx').on(table.userId),
}))

// Portfolio items for tattooists
export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tattooistId: uuid('tattooist_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  category: text('category'), // e.g., 'traditional', 'realistic', 'geometric'
  bodyPart: text('body_part'), // e.g., 'arm', 'back', 'leg'
  tags: text('tags').array().$type<string[]>(),
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Indexes for performance
  tattooistIdIdx: index('portfolio_items_tattooist_id_idx').on(table.tattooistId),
  isPublicIdx: index('portfolio_items_is_public_idx').on(table.isPublic),
  categoryIdx: index('portfolio_items_category_idx').on(table.category),
}))

// Availability slots for tattooists
export const availabilitySlots = pgTable('availability_slots', {
  id: uuid('id').primaryKey().defaultRandom(),
  tattooistId: uuid('tattooist_id').references(() => users.id).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  isBooked: boolean('is_booked').default(false).notNull(),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  recurringPattern: text('recurring_pattern'), // 'weekly', 'daily', etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Indexes for performance
  tattooistIdIdx: index('availability_slots_tattooist_id_idx').on(table.tattooistId),
  startTimeIdx: index('availability_slots_start_time_idx').on(table.startTime),
  isBookedIdx: index('availability_slots_is_booked_idx').on(table.isBooked),
  timeRangeIdx: index('availability_slots_time_range_idx').on(table.startTime, table.endTime),
}))

// Bookings/appointments
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => users.id).notNull(),
  tattooistId: uuid('tattooist_id').references(() => users.id).notNull(),
  slotId: uuid('slot_id').references(() => availabilitySlots.id).notNull(),
  status: bookingStatusEnum('status').notNull(),
  depositAmount: integer('deposit_amount'), // Amount in cents
  totalAmount: integer('total_amount'), // Amount in cents
  paymentStatus: paymentStatusEnum('payment_status'),
  paymentId: text('payment_id'), // QPay payment reference
  tattooIdeas: jsonb('tattoo_ideas').$type<{
    description: string
    images: string[]
    size: string
    placement: string
    style: string
  }>(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Indexes for performance
  customerIdIdx: index('bookings_customer_id_idx').on(table.customerId),
  tattooistIdIdx: index('bookings_tattooist_id_idx').on(table.tattooistId),
  slotIdIdx: index('bookings_slot_id_idx').on(table.slotId),
  statusIdx: index('bookings_status_idx').on(table.status),
  paymentStatusIdx: index('bookings_payment_status_idx').on(table.paymentStatus),
  createdAtIdx: index('bookings_created_at_idx').on(table.createdAt),
}))

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export const insertUserProfileSchema = createInsertSchema(userProfiles)
export const selectUserProfileSchema = createSelectSchema(userProfiles)

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems)
export const selectPortfolioItemSchema = createSelectSchema(portfolioItems)

export const insertAvailabilitySlotSchema = createInsertSchema(availabilitySlots)
export const selectAvailabilitySlotSchema = createSelectSchema(availabilitySlots)

export const insertBookingSchema = createInsertSchema(bookings)
export const selectBookingSchema = createSelectSchema(bookings)

// Export enum values for use in types and validation
export const UserType = {
  CUSTOMER: 'customer' as const,
  TATTOOIST: 'tattooist' as const,
} as const

export const BookingStatus = {
  PENDING: 'pending' as const,
  CONFIRMED: 'confirmed' as const,
  CANCELLED: 'cancelled' as const,
  COMPLETED: 'completed' as const,
} as const

export const PaymentStatus = {
  PENDING: 'pending' as const,
  PAID: 'paid' as const,
  REFUNDED: 'refunded' as const,
} as const

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserTypeValue = typeof userTypeEnum.enumValues[number]

export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert

export type PortfolioItem = typeof portfolioItems.$inferSelect
export type NewPortfolioItem = typeof portfolioItems.$inferInsert

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect
export type NewAvailabilitySlot = typeof availabilitySlots.$inferInsert

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type BookingStatusValue = typeof bookingStatusEnum.enumValues[number]
export type PaymentStatusValue = typeof paymentStatusEnum.enumValues[number]
