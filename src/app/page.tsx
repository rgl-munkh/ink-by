import { MainLayout, Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ROUTES } from "@/config/routes"

export default function Home() {
  return (
    <MainLayout>
      <Container className="py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Ink By</h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with talented tattoo artists and bring your vision to life
            </p>
            <div className="flex justify-center gap-4">
              <Link href={ROUTES.AUTH.REGISTER}>
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>For Customers</CardTitle>
                <CardDescription>
                  Find the perfect tattoo artist for your next piece
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Browse artist portfolios</li>
                  <li>• Book consultations and appointments</li>
                  <li>• Share your tattoo ideas</li>
                  <li>• Read reviews and ratings</li>
                </ul>
                <Link href={ROUTES.AUTH.REGISTER} className="mt-4 inline-block">
                  <Button className="w-full">Join as Customer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Tattoo Artists</CardTitle>
                <CardDescription>
                  Showcase your work and connect with clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Display your portfolio</li>
                  <li>• Manage your schedule</li>
                  <li>• Receive booking requests</li>
                  <li>• Build your client base</li>
                </ul>
                <Link href={ROUTES.AUTH.REGISTER} className="mt-4 inline-block">
                  <Button className="w-full" variant="outline">Join as Artist</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Already have an account?{' '}
              <Link href={ROUTES.AUTH.LOGIN} className="text-blue-600 hover:text-blue-500 underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </MainLayout>
  )
}
