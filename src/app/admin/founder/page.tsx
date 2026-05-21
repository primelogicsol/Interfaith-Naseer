'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import ContentSectionEditor from '@/components/ContentSectionEditor'

interface FounderSection {
  id: string
  slug: string
  pageTitle: string
  pageSubtitle: string
  cardTitle: string
  cardSubtitle: string
  cardDescription: string[]
  imagePath: string
  badgeLabel: string
  order: number
  status: string
}

export default function FounderSectionsManagement() {
  const [sections, setSections] = useState<FounderSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/founder')
      if (res.ok) setSections(await res.json())
    } catch (err) {
      console.error('Error loading founder sections:', err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSection(id: string) {
    if (!confirm('Delete this founder section?')) return
    try {
      const res = await fetch(`/api/founder/${id}`, { method: 'DELETE' })
      if (res.ok) setSections(sections.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting:', err)
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
          <p className="text-lg text-premium-light">Loading founder sections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Founder Page Sections</h1>
            <p className="text-premium-light mt-1 text-sm lg:text-base">Manage founder profiles and content</p>
          </div>
          <Link
            href="/admin/founder/new"
            className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            Add Section
          </Link>
        </div>
      </div>

      <ContentSectionEditor pageKey="founder" />

      <div className="grid gap-4">
        {sections.map((section) => (
          <div key={section.id} className="glass-effect rounded-xl p-4 sm:p-6 border border-[#c8a75e]/20">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm sm:text-lg font-semibold text-[#f5f3ee] truncate">{section.pageTitle}</h3>
                  <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[#0b0f2a]/20 rounded text-[10px] sm:text-xs text-premium-light whitespace-nowrap">
                    #{section.order}
                  </span>
                  {section.status !== 'published' && (
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      section.status === 'pending_moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                      section.status === 'pending_admin' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {section.status.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-premium-light mb-1 truncate">/{section.slug}</p>
                <p className="text-xs text-premium-light truncate">{section.cardSubtitle}</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 self-end sm:self-auto">
                <Link
                  href={`/admin/founder/${section.id}`}
                  className="p-1.5 sm:p-2 hover:bg-[#c8a75e]/20 rounded-lg sm:rounded-xl transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8a75e]" />
                </Link>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="glass-effect rounded-xl p-12 text-center border border-[#c8a75e]/20">
          <p className="text-premium-light">No founder sections found</p>
        </div>
      )}

      <div className="text-center text-premium-light text-sm">
        Showing {sections.length} founder sections
      </div>
    </div>
  )
}
