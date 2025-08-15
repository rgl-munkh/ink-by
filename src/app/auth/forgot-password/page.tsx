import { Suspense } from 'react'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  )
}

export const metadata = {
  title: 'Reset Password | Ink By',
  description: 'Reset your Ink By account password',
}
