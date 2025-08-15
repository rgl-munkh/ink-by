import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}

export const metadata = {
  title: 'Create Account | Ink By',
  description: 'Create your Ink By account and join our community',
}
