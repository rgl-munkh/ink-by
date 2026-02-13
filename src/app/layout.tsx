import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import { Inter_Tight as font } from "next/font/google";
import { AuthNav } from "@/components/auth/AuthNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = font({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ink By - Tattoo Booking",
  description:
    "Book your tattoo appointment. Request a quote, accept, and pay the booking fee.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {/* <header className="border-b px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">
            Ink By
          </Link>
          <AuthNav />
        </header> */}
        {children}
      </body>
    </html>
  );
}
