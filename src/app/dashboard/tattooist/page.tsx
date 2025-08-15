'use client'

import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { USER_TYPES } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function TattooistDashboardContent() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name || user?.email}!</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Manage your tattoo portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Manage Portfolio</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>Set your available time slots</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Manage Schedule</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bookings</CardTitle>
                <CardDescription>View and manage appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">View Bookings</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest appointment requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No recent bookings to show.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your artist profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Add portfolio images, bio, and contact information to attract more clients.</p>
                  <Button className="w-full" variant="outline">Complete Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TattooistDashboard() {
  return (
    <ProtectedRoute requiredRole={USER_TYPES.TATTOOIST}>
      <TattooistDashboardContent />
    </ProtectedRoute>
  )
}
