import { pgTable, text, timestamp, uuid, boolean, integer, jsonb } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// Users table - extends Supabase auth.users
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Links to auth.users.id
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  userType: text('user_type').notNull().$type<'customer' | 'tattooist'>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

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
})

// Portfolio items for tattooists
export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tattooistId: uuid('tattooist_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  category: text('category'), // e.g., 'traditional', 'realistic', 'geometric'
  bodyPart: text('body_part'), // e.g., 'arm', 'back', 'leg'
  tags: text('tags').array(),
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

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
})

// Bookings/appointments
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => users.id).notNull(),
  tattooistId: uuid('tattooist_id').references(() => users.id).notNull(),
  slotId: uuid('slot_id').references(() => availabilitySlots.id).notNull(),
  status: text('status').notNull().$type<'pending' | 'confirmed' | 'cancelled' | 'completed'>(),
  depositAmount: integer('deposit_amount'), // Amount in cents
  totalAmount: integer('total_amount'), // Amount in cents
  paymentStatus: text('payment_status').$type<'pending' | 'paid' | 'refunded'>(),
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
})

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

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert

export type PortfolioItem = typeof portfolioItems.$inferSelect
export type NewPortfolioItem = typeof portfolioItems.$inferInsert

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect
export type NewAvailabilitySlot = typeof availabilitySlots.$inferInsert

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
