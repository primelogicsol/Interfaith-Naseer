'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, Calendar, CheckCircle, Download, Users } from 'lucide-react'

interface MovementMember {
  id: string
  full_name: string
  email: string
  tradition_affiliation: string | null
  message: string | null
  how_heard: string | null
  wants_newsletter: boolean
  wants_volunteer: boolean
  created_at: string
}

export default function MovementMembersManagement() {
  const [members, setMembers] = useState<MovementMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMembers()
  }, [])

  async function loadMembers() {
    try {
      const response = await fetch('/api/movement-members')
      const data = await response.json()
      if (Array.isArray(data)) {
        setMembers(data)
      } else {
        setMembers([])
      }
    } catch (error) {
      console.error('Error loading members:', error)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  function exportToCSV() {
    const headers = ['Name', 'Email', 'Tradition', 'How Heard', 'Newsletter', 'Volunteer', 'Date Joined']
    const rows = members.map(m => [
      m.full_name,
      m.email,
      m.tradition_affiliation || 'N/A',
      m.how_heard || 'N/A',
      m.wants_newsletter ? 'Yes' : 'No',
      m.wants_volunteer ? 'Yes' : 'No',
      new Date(m.created_at).toLocaleDateString()
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `movement-members-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Movement Members</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Registered movement members</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Download className="w-4 h-4 lg:w-5 lg:h-5" />
          Export CSV
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid gap-4">
          {members.map((member) => (
            <div key={member.id} className="glass-effect rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#f5f3ee] mb-2 truncate">{member.full_name}</h3>
                  <div className="flex items-center gap-2 text-premium-light mb-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${member.email}`} className="hover:text-[#c8a75e] transition-colors truncate">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-premium-light text-sm">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(member.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {member.wants_newsletter && (
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-xl text-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Newsletter
                    </div>
                  )}
                  {member.wants_volunteer && (
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-xl text-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Volunteer
                    </div>
                  )}
                </div>
              </div>

              {member.tradition_affiliation && (
                <div className="mb-3">
                  <span className="text-premium-light text-sm">Tradition: </span>
                  <span className="text-[#f5f3ee] truncate">{member.tradition_affiliation}</span>
                </div>
              )}

              {member.how_heard && (
                <div className="mb-3">
                  <span className="text-premium-light text-sm">How they heard: </span>
                  <span className="text-[#f5f3ee] truncate">{member.how_heard}</span>
                </div>
              )}

              {member.message && (
                <div className="mt-4 p-4 bg-[#0b0f2a]/30 rounded-xl">
                  <p className="text-premium-light text-sm mb-1">Message:</p>
                  <p className="text-[#f5f3ee] line-clamp-3">{member.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      {members.length === 0 && (
        <div className="glass-effect rounded-xl p-12 text-center border border-[#c8a75e]/20">
          <Users className="w-16 h-16 text-premium-light mx-auto mb-4" />
          <p className="text-premium-light">No movement members yet</p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="text-center text-premium-light text-sm">
        Total Members: {members.length}
      </div>
    </div>
  )
}
