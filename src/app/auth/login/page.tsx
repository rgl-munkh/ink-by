import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

export const metadata = {
  title: 'Sign In | Ink By',
  description: 'Sign in to your Ink By account',
}
