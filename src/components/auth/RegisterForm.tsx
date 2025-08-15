'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'
import { USER_TYPES, type UserTypeValues } from '@/types'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  userType: z.enum([USER_TYPES.CUSTOMER, USER_TYPES.TATTOOIST]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: USER_TYPES.CUSTOMER,
    },
  })

  const selectedUserType = watch('userType')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signUp(
        data.email,
        data.password,
        data.userType,
        data.fullName
      )
      
      if (result.error) {
        setError(result.error.message || 'An error occurred during registration')
        return
      }

      setSuccess(true)
      // Redirect to login with success message
      setTimeout(() => {
        router.push(`${ROUTES.AUTH.LOGIN}?message=Account created successfully. Please sign in.`)
      }, 2000)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-medium">
              Registration Successful!
            </div>
            <p className="text-gray-600">
              Your account has been created. Redirecting to login...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join our community of tattoo artists and enthusiasts
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* User Type Selection */}
          <div className="space-y-3">
            <Label>I am a:</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`
                flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors
                ${selectedUserType === USER_TYPES.CUSTOMER 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  value={USER_TYPES.CUSTOMER}
                  {...register('userType')}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium">Customer</div>
                  <div className="text-sm text-gray-500">Looking for tattoo artists</div>
                </div>
              </label>
              
              <label className={`
                flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors
                ${selectedUserType === USER_TYPES.TATTOOIST 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  value={USER_TYPES.TATTOOIST}
                  {...register('userType')}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium">Tattoo Artist</div>
                  <div className="text-sm text-gray-500">Offering tattoo services</div>
                </div>
              </label>
            </div>
            {errors.userType && (
              <p className="text-sm text-red-600">{errors.userType.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...register('fullName')}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link 
              href={ROUTES.AUTH.LOGIN}
              className="text-blue-600 hover:text-blue-500 underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
