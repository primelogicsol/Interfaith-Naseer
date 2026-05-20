'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, MessageSquare, User, Calendar, Filter } from 'lucide-react'

interface RoleRequest {
  id: string
  requestedRole: string
  reason: string | null
  status: string | null
  createdAt: string
  reviewedAt: string | null
  adminNotes: string | null
  reviewer: {
    id: string
    fullName: string
  } | null
  user: {
    id: string
    email: string
    fullName: string
    role: string
    createdAt: string
  }
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export default function AdminRoleRequestsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Validate session and check admin role
  useEffect(() => {
    async function validateSession() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login?redirect=/admin/role-requests')
          return
        }

        const data = await response.json()
        if (data.user.role !== 'admin') {
          router.push('/')
          return
        }

        setCurrentUser(data.user)
      } catch (error) {
        router.push('/login?redirect=/admin/role-requests')
      } finally {
        setAuthLoading(false)
      }
    }
    validateSession()
  }, [router])

  useEffect(() => {
    if (!currentUser) return
    loadRequests()
  }, [currentUser, statusFilter])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/role-requests?status=${statusFilter}`)
      const data = await response.json()

      if (response.ok) {
        setRequests(data.roleRequests)
      }
    } catch (error) {
      console.error('Error loading role requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/admin/role-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminNotes }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || `Role request ${action}ed successfully`)
        setReviewingId(null)
        setAdminNotes('')
        loadRequests()
      } else {
        setError(data.error || `Failed to ${action} role request`)
      }
    } catch (error) {
      console.error('Error reviewing request:', error)
      setError('An error occurred while reviewing the request')
    }
  }

  const getStatusBadge = (status: string | null) => {
    if (!status || status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-semibold">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      )
    }
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      default:
        return <span className="text-xs text-premium-light capitalize">{status}</span>
    }
  }

  const filterButtons: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ]

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
          <p className="text-premium-light">Loading role requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#f5f3ee]">Role Requests</h1>
          <p className="text-premium-light mt-1">Review and manage user role upgrade requests</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-effect rounded-xl">
          <Clock className="w-5 h-5 text-yellow-500" />
          <span className="text-[#f5f3ee] font-bold">{requests.length}</span>
          <span className="text-premium-light text-sm">{statusFilter === 'all' ? 'Total' : statusFilter}</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="glass-effect rounded-xl p-2 flex flex-wrap items-center justify-between gap-1.5">
        <Filter className="w-4 h-4 text-premium-light shrink-0" />
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setStatusFilter(btn.value)}
            className={`flex-1 min-w-[80px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              statusFilter === btn.value
                ? 'bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a]'
                : 'text-premium-light hover:text-[#f5f3ee]'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="glass-effect rounded-xl p-4 bg-green-500/10 border border-green-500/30">
          <p className="text-green-500 text-sm">{success}</p>
        </div>
      )}
      {error && (
        <div className="glass-effect rounded-xl p-4 bg-red-500/10 border border-red-500/30">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="glass-effect rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#f5f3ee] mb-2">No Requests Found</h3>
          <p className="text-premium-light">
            {statusFilter === 'all'
              ? 'No role requests at the moment.'
              : `No ${statusFilter} role requests.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Request Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c8a75e] to-[#d4b56d] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#0b0f2a]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-[#f5f3ee] truncate">
                          {request.user.fullName}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-premium-light mb-2 truncate">{request.user.email}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-premium-light">
                          <span className="font-semibold">Current Role:</span>
                          <span className="capitalize">{request.user.role}</span>
                        </span>
                        <span className="text-[#aab0d6]/30">â†’</span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-premium-light">Requested:</span>
                          <span className="capitalize text-[#c8a75e] font-bold">
                            {request.requestedRole}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  {request.reason && (
                    <div className="bg-[#0b0f2a]/40 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-[#c8a75e] mt-0.5" />
                        <span className="text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                          Reason
                        </span>
                      </div>
                      <p className="text-sm text-[#f5f3ee] leading-relaxed line-clamp-2">{request.reason}</p>
                    </div>
                  )}

                  {/* Admin Notes (for reviewed requests) */}
                  {request.adminNotes && (
                    <div className="bg-[#0b0f2a]/40 rounded-xl p-4 mb-4 border border-[#c8a75e]/10">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-[#aab0d6] mt-0.5" />
                        <span className="text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                          Admin Notes
                        </span>
                      </div>
                      <p className="text-sm text-premium-light leading-relaxed line-clamp-2">{request.adminNotes}</p>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-premium-light">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Member since {new Date(request.user.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                    {request.reviewedAt && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Reviewed {new Date(request.reviewedAt).toLocaleDateString()}
                        {request.reviewer && ` by ${request.reviewer.fullName}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {(request.status === 'pending' || !request.status) && (
                  <div className="flex-shrink-0">
                    {reviewingId === request.id ? (
                      <div className="space-y-3 min-w-[250px]">
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Admin notes (optional)..."
                          rows={3}
                          className="w-full px-3 py-2 text-sm rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(request.id, 'approve')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-xl transition-colors text-sm font-semibold"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(request.id, 'reject')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-xl transition-colors text-sm font-semibold"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setReviewingId(null)
                            setAdminNotes('')
                          }}
                          className="w-full px-4 py-2 text-sm text-premium-light hover:text-[#f5f3ee] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReviewingId(request.id)}
                        className="px-6 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-semibold"
                      >
                        Review Request
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
