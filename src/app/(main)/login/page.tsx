'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#c8a75e]/20 border-t-[#c8a75e] rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [retryAfter, setRetryAfter] = useState<number | null>(null)

  const validateField = (field: 'email' | 'password', value: string) => {
    const errors: { email?: string; password?: string } = {}
    if (field === 'email') {
      if (value.length > 0 && !validateEmail(value)) {
        errors.email = 'Please enter a valid email address'
      }
      if (value.length > 255) {
        errors.email = 'Email is too long'
      }
    }
    if (field === 'password') {
      if (value.length > 128) {
        errors.password = 'Password is too long'
      }
    }
    return errors
  }

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    const errors = validateField(field, value)
    setFieldErrors(prev => {
      const next = { ...prev }
      delete next[field]
      Object.assign(next, errors)
      return next
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowResendVerification(false)
    setRetryAfter(null)

    const trimmedEmail = formData.email.trim()
    const fieldErrors: { email?: string; password?: string } = {}

    if (!trimmedEmail) fieldErrors.email = 'Email is required'
    else if (!validateEmail(trimmedEmail)) fieldErrors.email = 'Please enter a valid email address'
    if (!formData.password) fieldErrors.password = 'Password is required'

    if (Object.keys(fieldErrors).length > 0) {
      setFieldErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: formData.password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          const retrySeconds = parseInt(response.headers.get('Retry-After') || '60', 10)
          setRetryAfter(retrySeconds)
          setError(data.error || 'Too many attempts. Please wait before trying again.')
        } else {
          setError(data.error || 'Login failed')
          if (data.error?.includes('verify your email')) {
            setShowResendVerification(true)
            setError(data.error + ' Click below to verify.')
          }
        }
        setIsSubmitting(false)
        return
      }

      if (data.user.role === 'admin') {
        router.push(redirect.startsWith('/admin') ? redirect : '/admin')
      } else {
        router.push(redirect.startsWith('/admin') ? '/' : redirect)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleResendVerification = async () => {
    if (!formData.email.trim()) {
      setResendMessage('Please enter your email address first')
      return
    }

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() }),
      })

      const data = await response.json()
      if (!response.ok) {
        setResendMessage(data.error || 'Failed to resend verification email')
        setIsResending(false)
        return
      }

      setResendMessage('Verification email sent! Please check your inbox.')
      setError(null)
    } catch (error) {
      setResendMessage('An error occurred. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-4">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-premium">
            Log in to your account
          </p>
        </div>

        <div className="card-premium p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[#e74c3c] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={128}
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
                <p className="text-[#e74c3c] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <Link
                href="/forgot-password"
                className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
                <p className="text-[#e74c3c] text-xs sm:text-sm">{error}</p>
                {showResendVerification && (
                  <div className="mt-3 space-y-2">
                    <Link
                      href={`/verify-email?email=${encodeURIComponent(formData.email.trim())}`}
                      className="block text-center px-4 py-2 bg-[#c8a75e] hover:bg-[#d4b56d] text-[#0b0f2a] font-semibold rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      Go to Verification Page
                    </Link>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="w-full text-xs sm:text-sm text-[#c8a75e] hover:text-[#d4b56d] font-semibold underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResending ? 'Sending...' : 'Resend OTP to Email'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {resendMessage && (
              <div className={`p-3 sm:p-4 rounded-xl ${resendMessage.includes('sent') ? 'bg-[#27AE60]/10 border border-[#27AE60]/30' : 'bg-[#e74c3c]/10 border border-[#e74c3c]/30'}`}>
                <p className={`text-xs sm:text-sm ${resendMessage.includes('sent') ? 'text-[#27AE60]' : 'text-[#e74c3c]'}`}>
                  {resendMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || retryAfter !== null}
              className="w-full btn-primary text-sm sm:text-base px-6 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : retryAfter ? `Try again in ${retryAfter}s` : 'Log In'}
            </button>

            <p className="text-center text-xs sm:text-sm text-[#aab0d6]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
