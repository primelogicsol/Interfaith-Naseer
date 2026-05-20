'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, LogOut, Settings } from 'lucide-react'

interface UserData {
  id: string
  email: string
  fullName: string
  role: string
  emailVerified: boolean
  profileImage?: string
}

export default function AuthButton() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [imgError, setImgError] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [pathname])

  useEffect(() => {
    const handleProfileUpdate = () => checkAuth()
    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate)
  }, [])

  useEffect(() => {
    setImgError(false)
  }, [user?.profileImage])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setShowDropdown(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  function showDropdownWithDelay() {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setShowDropdown(true)
  }

  function hideDropdownWithDelay() {
    hideTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false)
    }, 200)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-dropdown')) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#c8a75e]/20 animate-pulse"></div>
    )
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="btn-primary px-6 py-2.5 text-sm font-semibold"
      >
        Login
      </Link>
    )
  }

  // Get initials for avatar
  const initials = user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const showImage = user.profileImage && !imgError

  return (
    <div
      className="relative profile-dropdown flex items-center justify-center"
      onMouseEnter={showDropdownWithDelay}
      onMouseLeave={hideDropdownWithDelay}
    >
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8a75e] to-[#d4b56d] flex items-center justify-center text-[#0b0f2a] font-bold text-sm overflow-hidden shrink-0">
          {showImage ? (
            <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            initials
          )}
        </div>
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 top-full mt-2 w-64 bg-[#1a1f3a] border border-[#c8a75e]/20 rounded-xl shadow-xl overflow-hidden z-50"
          onMouseEnter={showDropdownWithDelay}
          onMouseLeave={hideDropdownWithDelay}
        >
          {/* User Info */}
          <div className="p-4 border-b border-[#c8a75e]/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c8a75e] to-[#d4b56d] flex items-center justify-center text-[#0b0f2a] font-bold overflow-hidden shrink-0">
                {showImage ? (
                  <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" onError={() => setImgError(true)} />
                ) : (
                  initials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#f5f3ee] font-semibold truncate">{user.fullName}</p>
                <p className="text-[#aab0d6] text-xs truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-[#c8a75e]/20 text-[#c8a75e] text-xs font-semibold rounded">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#c8a75e]/10 transition-colors text-[#f5f3ee]"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">My Profile</span>
            </Link>

            {(user.role === 'admin' || user.role === 'moderator' || user.role === 'editor') && (
              <Link
                href={user.role === 'admin' ? '/admin' : user.role === 'moderator' ? '/admin/content-review' : '/admin/traditions'}
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#c8a75e]/10 transition-colors text-[#f5f3ee]"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">{user.role === 'admin' ? 'Admin Dashboard' : 'Admin Panel'}</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#e74c3c]/10 transition-colors text-[#e74c3c]"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
