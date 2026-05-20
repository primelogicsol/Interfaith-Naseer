'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

interface PasswordStrength {
  score: number
  label: string
  color: string
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: '#e74c3c' }
  if (score <= 3) return { score, label: 'Fair', color: '#f39c12' }
  if (score <= 4) return { score, label: 'Good', color: '#27AE60' }
  return { score, label: 'Strong', color: '#14B8A6' }
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#c8a75e]/20 border-t-[#c8a75e] rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [isFromJoin, setIsFromJoin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    fullName?: string
  }>({})
  const [retryAfter, setRetryAfter] = useState<number | null>(null)

  useEffect(() => {
    const joinData = sessionStorage.getItem('registerFromJoin')
    if (joinData) {
      try {
        const data = JSON.parse(joinData)
        setFormData(prev => ({
          ...prev,
          email: data.email || '',
          fullName: data.fullName || '',
        }))
        setIsFromJoin(true)
        sessionStorage.removeItem('registerFromJoin')
      } catch (error) {
        console.error('Error parsing join data:', error)
      }
    }
  }, [])

  const strength = getPasswordStrength(formData.password)
  const passwordsMatch = formData.confirmPassword.length === 0 || formData.password === formData.confirmPassword

  const validateField = (field: string, value: string) => {
    const errors: typeof fieldErrors = {}

    switch (field) {
      case 'fullName': {
        const trimmed = value.trim()
        if (trimmed.length > 0 && trimmed.length < 2) errors.fullName = 'Name must be at least 2 characters'
        if (trimmed.length > 100) errors.fullName = 'Name is too long'
        break
      }
      case 'email': {
        if (value.length > 0 && !validateEmail(value)) errors.email = 'Please enter a valid email address'
        if (value.length > 255) errors.email = 'Email is too long'
        break
      }
      case 'password': {
        if (value.length > 0 && value.length < 8) errors.password = 'Password must be at least 8 characters'
        if (value.length > 128) errors.password = 'Password is too long'
        break
      }
      case 'confirmPassword': {
        if (value.length > 0 && value !== formData.password) errors.confirmPassword = 'Passwords do not match'
        break
      }
    }

    return errors
  }

  const handleChange = (field: string, value: string) => {
    const maxLengths: Record<string, number> = { fullName: 100, email: 255, password: 128, confirmPassword: 128 }
    if (value.length > (maxLengths[field] || 999)) return

    setFormData(prev => ({ ...prev, [field]: value }))
    const errors = validateField(field, value)

    setFieldErrors(prev => {
      const next = { ...prev }
      delete next[field as keyof typeof fieldErrors]
      Object.assign(next, errors)

      if (field === 'password' && formData.confirmPassword.length > 0) {
        if (value === formData.confirmPassword) {
          delete next.confirmPassword
        } else {
          next.confirmPassword = 'Passwords do not match'
        }
      }

      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setRetryAfter(null)

    const trimmedName = formData.fullName.trim()
    const trimmedEmail = formData.email.trim()
    const errors: typeof fieldErrors = {}

    if (!trimmedName) errors.fullName = 'Full name is required'
    else if (trimmedName.length < 2) errors.fullName = 'Name must be at least 2 characters'

    if (!trimmedEmail) errors.email = 'Email is required'
    else if (!validateEmail(trimmedEmail)) errors.email = 'Please enter a valid email address'

    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters'

    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          password: formData.password,
          fullName: trimmedName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          const retrySeconds = parseInt(response.headers.get('Retry-After') || '60', 10)
          setRetryAfter(retrySeconds)
          setError(data.error || 'Too many attempts. Please wait before trying again.')
        } else {
          setError(data.error || 'Registration failed')
        }
        setIsSubmitting(false)
        return
      }

      router.push(`/verify-email?email=${encodeURIComponent(trimmedEmail)}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36  pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-4">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-premium">
            Join our interfaith community
          </p>
        </div>

        <div className="card-premium p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  disabled={isFromJoin}
                  className={`w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all ${
                    isFromJoin ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                  placeholder="Your full name"
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-[#e74c3c] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.fullName}
                </p>
              )}
              {isFromJoin && (
                <p className="text-xs text-[#c8a75e] mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Name from join form - cannot be changed
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={isFromJoin}
                  className={`w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all ${
                    isFromJoin ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[#e74c3c] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.email}
                </p>
              )}
              {isFromJoin && (
                <p className="text-xs text-[#c8a75e] mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Email from join form - cannot be changed
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Password *
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
              {formData.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-colors"
                        style={{ backgroundColor: i <= strength.score ? strength.color : '#aab0d6/20' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
              {fieldErrors.password ? (
                <p className="text-[#e74c3c] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.password}
                </p>
              ) : (
                <p className="text-xs text-[#aab0d6]/70 mt-1.5">
                  Min 8 chars with uppercase, lowercase, number & special character
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={128}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.confirmPassword ? (
                <p className="text-[#e74c3c] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.confirmPassword}
                </p>
              ) : formData.confirmPassword.length > 0 && passwordsMatch ? (
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
              disabled={isSubmitting || retryAfter !== null}
              className="w-full btn-primary text-sm sm:text-base px-6 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : retryAfter ? `Try again in ${retryAfter}s` : 'Create Account'}
            </button>

            <p className="text-center text-xs sm:text-sm text-[#aab0d6]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
