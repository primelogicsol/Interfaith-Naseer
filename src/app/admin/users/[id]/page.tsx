'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, UserCheck, UserX, Calendar, Clock, Mail, CheckCircle2, XCircle } from 'lucide-react'

interface UserDetail {
  id: string
  email: string
  fullName: string
  role: string
  emailVerified: boolean
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [isActive, setIsActive] = useState(true)

  async function fetchUser() {
    try {
      const res = await fetch(`/api/admin/users/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch user')
      const data = await res.json()
      setUser(data.user)
      setSelectedRole(data.user.role)
      setIsActive(data.user.isActive)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUser() }, [params.id])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, isActive }),
      })
      if (res.ok) {
        const data = await res.json()
        setUser(prev => prev ? { ...prev, role: data.user.role, isActive: data.user.isActive } : prev)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading user...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-[#c8a75e] hover:text-[#d4b56d] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Link>
        <div className="text-center py-12">
          <p className="text-lg text-premium-light">User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-[#c8a75e] hover:text-[#d4b56d] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Link>

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">{user.fullName}</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">User details and account management</p>
      </div>

      <div className="grid gap-6">
        {/* User Info */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee] mb-4">Account Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0f2a]/20">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8a75e]" />
              <div>
                <p className="text-[10px] sm:text-xs text-premium-light">Email</p>
                <p className="text-xs sm:text-sm text-[#f5f3ee]">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0f2a]/20">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8a75e]" />
              <div>
                <p className="text-[10px] sm:text-xs text-premium-light">Role</p>
                <p className="text-xs sm:text-sm text-[#f5f3ee] capitalize">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0f2a]/20">
              {user.isActive ? <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /> : <UserX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />}
              <div>
                <p className="text-[10px] sm:text-xs text-premium-light">Status</p>
                <p className={`text-xs sm:text-sm ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  {user.isActive ? 'Active' : 'Disabled'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0f2a]/20">
              {user.emailVerified ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /> : <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />}
              <div>
                <p className="text-[10px] sm:text-xs text-premium-light">Email Verified</p>
                <p className={`text-xs sm:text-sm ${user.emailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                  {user.emailVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0f2a]/20">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8a75e]" />
              <div>
                <p className="text-[10px] sm:text-xs text-premium-light">Member Since</p>
                <p className="text-xs sm:text-sm text-[#f5f3ee]">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0f2a]/20">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8a75e]" />
              <div>
                <p className="text-[10px] sm:text-xs text-premium-light">Last Login</p>
                <p className="text-xs sm:text-sm text-[#f5f3ee]">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Role & Status */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee] mb-4">Edit User</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs text-premium-light mb-1.5">Role</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50"
              >
                <option value="user">User</option>
                <option value="volunteer">Volunteer</option>
                <option value="editor">Editor</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-premium-light mb-1.5">Status</label>
              <div className="flex items-center gap-3 h-[38px]">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                  {isActive ? 'Active' : 'Disabled'}
                </button>
                <span className="text-xs text-premium-light">Click to toggle</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c8a75e] text-[#0b0f2a] rounded-xl text-sm font-medium hover:bg-[#d4b56d] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Role Requests */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee] mb-4">Role Requests</h2>
          <Link
            href="/admin/role-requests"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
          >
            View Role Requests
          </Link>
        </div>
      </div>
    </div>
  )
}
