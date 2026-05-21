'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, Calendar, CheckCircle, Download, Users, User } from 'lucide-react'

interface MovementMember {
  id: string
  fullName: string
  email: string
  country: string | null
  interests: string[]
  traditionAffiliation: string | null
  message: string | null
  howHeard: string | null
  wantsNewsletter: boolean | null
  wantsVolunteer: boolean | null
  createdAt: string
  user: { id: string; email: string; fullName: string } | null
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
    const headers = ['Name', 'Email', 'Country', 'Interests', 'Tradition', 'How Heard', 'Newsletter', 'Volunteer', 'Date Joined']
    const rows = members.map(m => [
      m.fullName,
      m.email,
      m.country || 'N/A',
      (m.interests || []).join('; ') || 'N/A',
      m.traditionAffiliation || 'N/A',
      m.howHeard || 'N/A',
      m.wantsNewsletter ? 'Yes' : 'No',
      m.wantsVolunteer ? 'Yes' : 'No',
      new Date(m.createdAt).toLocaleDateString()
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
            <div key={member.id} className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-semibold text-[#f5f3ee] mb-2 truncate">{member.fullName}</h3>
                  <div className="flex items-center gap-2 text-premium-light mb-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${member.email}`} className="hover:text-[#c8a75e] transition-colors truncate">
                      {member.email}
                    </a>
                  </div>
                  {member.user && (
                    <div className="flex items-center gap-2 text-premium-light mb-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>Account: {member.user.fullName} ({member.user.email})</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-premium-light text-sm">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {member.wantsNewsletter && (
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-xl text-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Newsletter
                    </div>
                  )}
                  {member.wantsVolunteer && (
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-xl text-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Volunteer
                    </div>
                  )}
                </div>
              </div>

              {(member.country || (member.interests && member.interests.length > 0)) && (
                <div className="flex flex-wrap gap-4 mb-3 text-sm">
                  {member.country && (
                    <div>
                      <span className="text-premium-light">Country: </span>
                      <span className="text-[#f5f3ee]">{member.country}</span>
                    </div>
                  )}
                  {member.interests && member.interests.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-premium-light">Interests: </span>
                      {member.interests.map((interest, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#c8a75e]/10 text-[#c8a75e] rounded text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {member.traditionAffiliation && (
                <div className="mb-3">
                  <span className="text-premium-light text-sm">Tradition: </span>
                  <span className="text-[#f5f3ee] truncate">{member.traditionAffiliation}</span>
                </div>
              )}

              {member.howHeard && (
                <div className="mb-3">
                  <span className="text-premium-light text-sm">How they heard: </span>
                  <span className="text-[#f5f3ee] truncate">{member.howHeard}</span>
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
