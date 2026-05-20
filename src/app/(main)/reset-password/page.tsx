'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#c8a75e]/20 border-t-[#c8a75e] rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const handleChange = (field: 'password' | 'confirmPassword', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
    setFieldErrors(prev => {
      const next = { ...prev }
      delete next[field]
      if (field === 'password' && formData.confirmPassword.length > 0) {
        if (value === formData.confirmPassword) {
          delete next.confirmPassword
        } else {
          next.confirmPassword = 'Passwords do not match'
        }
      }
      if (field === 'confirmPassword' && value.length > 0 && value !== formData.password) {
        next.confirmPassword = 'Passwords do not match'
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Password reset failed')
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 sacred-pattern">
        <div className="max-w-md w-full">
          <div className="card-premium p-6 sm:p-8 md:p-10 text-center">
            <div className="pulse-glow inline-flex p-4 sm:p-5 rounded-xl bg-[#27AE60] mb-6">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-[#f5f3ee]" />
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">
              Password Reset Successful!
            </h1>
            <p className="text-sm sm:text-base text-premium leading-relaxed mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Link href="/login" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-4">
            Set New Password
          </h1>
          <p className="text-sm sm:text-base text-premium">
            Enter your new password below
          </p>
        </div>

        <div className="card-premium p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-11 pr-12 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aab0d6]/50 hover:text-[#c8a75e] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[#e74c3c] text-xs mt-1.5 flex items-center gap-1">{fieldErrors.password}</p>
              )}
              <p className="text-xs text-[#aab0d6]/70 mt-2">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.confirmPassword ? (
                <p className="text-[#e74c3c] text-xs mt-1.5 flex items-center gap-1">{fieldErrors.confirmPassword}</p>
              ) : formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword ? (
                <p className="text-[#27AE60] text-xs mt-1.5 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Passwords match
                </p>
              ) : null}
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
                <p className="text-[#e74c3c] text-xs sm:text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full btn-primary text-sm sm:text-base px-6 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
