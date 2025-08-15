'use client'

import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { USER_TYPES } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function CustomerDashboardContent() {
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
              <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name || user?.email}!</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Find Artists</CardTitle>
                <CardDescription>Browse tattoo artists in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Browse Artists</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">View Bookings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions and bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No recent activity to show.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  return (
    <ProtectedRoute requiredRole={USER_TYPES.CUSTOMER}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  )
}
