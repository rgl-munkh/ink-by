import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  authUserId: uuid("auth_user_id").unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  role: text("role").default("client").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  bio: text("bio"),
  hourlyRate: numeric("hourly_rate"),
  timezone: text("timezone").notNull().default("UTC"),
  instagramUsername: text("instagram_username"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const becomeArtistRequests = pgTable("become_artist_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  phoneNumber: text("phone_number"),
  instagramUsername: text("instagram_username"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
});

export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id")
    .references(() => artists.id, { onDelete: "cascade" })
    .notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  title: text("title"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id")
    .references(() => artists.id, { onDelete: "cascade" })
    .notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  isBooked: boolean("is_booked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookingRequests = pgTable("booking_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  artistId: integer("artist_id")
    .references(() => artists.id, { onDelete: "cascade" })
    .notNull(),
  referenceImageUrl: text("reference_image_url"),
  referenceImageUrls: jsonb("reference_image_urls").$type<string[]>().default([]),
  description: text("description"),
  size: text("size"),
  placement: text("placement"),
  preferredDates:
    jsonb("preferred_dates").$type<{ start: string; end: string }[]>(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  bookingRequestId: integer("booking_request_id")
    .references(() => bookingRequests.id, { onDelete: "cascade" })
    .notNull(),
  artistId: integer("artist_id")
    .references(() => artists.id, { onDelete: "cascade" })
    .notNull(),
  dates: jsonb("dates").$type<{ start: string; end: string }[]>().notNull(),
  durationMin: integer("duration_min").notNull(),
  notes: text("notes"),
  price: numeric("price").notNull(),
  expiresAt: timestamp("expires_at"),
  status: text("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingRequestId: integer("booking_request_id")
    .references(() => bookingRequests.id)
    .notNull(),
  quoteId: integer("quote_id")
    .references(() => quotes.id)
    .notNull(),
  scheduledStart: timestamp("scheduled_start"),
  scheduledEnd: timestamp("scheduled_end"),
  durationMin: integer("duration_min"),
  price: numeric("price"),
  bookingFee: numeric("booking_fee"),
  paymentStatus: text("payment_status").default("initiated").notNull(),
  status: text("status").default("created").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .references(() => bookings.id, { onDelete: "cascade" })
    .notNull(),
  provider: text("provider"),
  providerPaymentId: text("provider_payment_id"),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("USD").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
