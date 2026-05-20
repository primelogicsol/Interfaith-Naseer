'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Search, Filter, UserCheck, UserX, Shield, Calendar } from 'lucide-react'

interface User {
  id: string
  email: string
  fullName: string
  role: string
  emailVerified: boolean
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Validate session and check admin role
  useEffect(() => {
    async function validateSession() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login?redirect=/admin/users')
          return
        }

        const data = await response.json()
        if (data.user.role !== 'admin') {
          router.push('/')
          return
        }

        setCurrentUser(data.user)
      } catch (error) {
        router.push('/login?redirect=/admin/users')
      } finally {
        setAuthLoading(false)
      }
    }
    validateSession()
  }, [router])

  useEffect(() => {
    if (!currentUser) return
    loadUsers()
  }, [page, roleFilter, currentUser])

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(roleFilter && { role: roleFilter }),
        ...(search && { search }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadUsers()
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        loadUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a75e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-premium">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Don't render if user is not authenticated (will be redirected)
  if (!currentUser) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a75e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-premium-light">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#f5f3ee]">User Management</h1>
          <p className="text-premium-light mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-effect rounded-xl">
          <Users className="w-5 h-5 text-[#c8a75e]" />
          <span className="text-[#f5f3ee] font-bold">{users.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-2xl p-4 md:p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="btn-primary px-6 py-3">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="glass-effect rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0b0f2a]/60 border-b border-[#c8a75e]/10">
                  <tr>
                    <th className="px-3 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden sm:table-cell px-3 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c8a75e]/10">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#c8a75e]/5 transition-colors">
                      <td className="px-3 md:px-6 py-2 md:py-4">
                    <div className="min-w-0">
                      <div className="font-semibold text-[#f5f3ee] text-sm md:text-base truncate">{user.fullName}</div>
                      <div className="text-xs md:text-sm text-premium-light flex items-center gap-2">
                        <span className="truncate">{user.email}</span>
                        {user.emailVerified && (
                          <span className="shrink-0 text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4">
                    <div className="flex items-center gap-1 md:gap-2">
                      <Shield className="w-3 h-3 md:w-4 md:h-4 text-[#c8a75e]" />
                      <span className="text-xs md:text-base text-[#f5f3ee] capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold ${
                        user.isActive
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <UserCheck className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          <span className="hidden xs:inline">Active</span>
                          <span className="xs:hidden">On</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          <span className="hidden xs:inline">Inactive</span>
                          <span className="xs:hidden">Off</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-3 md:px-6 py-2 md:py-4">
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-premium-light">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="truncate">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4">
                    <div className="flex items-center gap-1 md:gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-xs md:text-sm text-[#c8a75e] hover:text-[#d4b56d] font-semibold"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`text-xs md:text-sm font-semibold ${
                          user.isActive
                            ? 'text-red-500 hover:text-red-400'
                            : 'text-green-500 hover:text-green-400'
                        }`}
                      >
                        {user.isActive ? 'Deact' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-t border-[#c8a75e]/10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-premium-light">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
