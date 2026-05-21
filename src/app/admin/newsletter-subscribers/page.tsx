'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, Calendar, CheckCircle, XCircle, Download, User } from 'lucide-react'

interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  subscriptionTopics: string[]
  frequency: string | null
  subscribedAt: string
  isActive: boolean | null
  confirmedAt: string | null
  lastEmailSent: string | null
  source: string | null
  user: { id: string; email: string; fullName: string } | null
}

export default function NewsletterSubscribersManagement() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscribers()
  }, [])

  async function loadSubscribers() {
    try {
      const response = await fetch('/api/newsletter/subscribers')
      const data = await response.json()
      if (Array.isArray(data)) {
        setSubscribers(data)
      } else {
        setSubscribers([])
      }
    } catch (error) {
      console.error('Error loading subscribers:', error)
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  function exportToCSV() {
    const headers = ['Email', 'Name', 'Topics', 'Status', 'Subscribed Date', 'Confirmed']
    const rows = subscribers.map(s => [
      s.email,
      s.name || 'N/A',
      (s.subscriptionTopics || []).join('; '),
      s.isActive ? 'Active' : 'Inactive',
      new Date(s.subscribedAt).toLocaleDateString(),
      s.confirmedAt ? 'Yes' : 'No'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const activeCount = subscribers.filter(s => s.isActive).length
  const confirmedCount = subscribers.filter(s => s.confirmedAt).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading subscribers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Newsletter Subscribers</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage newsletter subscriptions</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Download className="w-4 h-4 lg:w-5 lg:h-5" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="glass-effect rounded-xl p-4 sm:p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-[#f5f3ee] mb-2">{subscribers.length}</div>
            <div className="text-premium-light">Total Subscribers</div>
          </div>
          <div className="glass-effect rounded-xl p-4 sm:p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-green-400 mb-2">{activeCount}</div>
            <div className="text-premium-light">Active</div>
          </div>
          <div className="glass-effect rounded-xl p-4 sm:p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-blue-400 mb-2">{confirmedCount}</div>
            <div className="text-premium-light">Confirmed</div>
          </div>
        </div>

      {/* Subscribers Table */}
      <div className="glass-effect rounded-xl overflow-hidden border border-[#c8a75e]/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-[#0b0f2a]/50 border-b border-[#c8a75e]/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Account</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Topics</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c8a75e]/10">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-[#0b0f2a]/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-premium-light" />
                        <a
                          href={`mailto:${subscriber.email}`}
                          className="text-[#f5f3ee] hover:text-[#c8a75e] transition-colors truncate max-w-[200px] block"
                        >
                          {subscriber.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#f5f3ee] truncate max-w-[150px]">{subscriber.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {subscriber.user ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <User className="w-4 h-4 text-premium-light" />
                          <span className="text-[#f5f3ee] truncate max-w-[150px] block">{subscriber.user.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-premium-light text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(subscriber.subscriptionTopics || []).map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-[#0b0f2a]/20 rounded text-xs text-premium-light"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {subscriber.isActive ? (
                          <span className="flex items-center gap-1 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400 text-sm">
                            <XCircle className="w-4 h-4" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-premium-light text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {subscribers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-premium-light">No subscribers yet</p>
            </div>
          )}
        </div>
    </div>
  )
}
