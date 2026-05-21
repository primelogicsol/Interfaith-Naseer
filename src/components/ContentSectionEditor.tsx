'use client'

import { useEffect, useState } from 'react'
import { Pencil, X, Check, FileText } from 'lucide-react'

interface PageContentItem {
  id: string
  pageKey: string
  sectionKey: string
  title: string | null
  content: string | null
  orderIndex: number
  status: string
}

const SECTION_LABELS: Record<string, string> = {
  hero_badge: 'Hero Badge',
  hero_heading_1: 'Hero Heading (Line 1)',
  hero_heading_2: 'Hero Heading (Line 2)',
  hero_subtitle: 'Hero Subtitle',
  section_heading: 'Section Heading',
  section_subtitle: 'Section Subtitle',
  badge: 'Badge',
  heading: 'Heading',
  subtitle: 'Subtitle',
}

function formatSectionKey(key: string): string {
  return SECTION_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function ContentSectionEditor({ pageKey }: { pageKey: string }) {
  const [sections, setSections] = useState<PageContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [pageKey])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/page-content?pageKey=${pageKey}`)
      if (res.ok) setSections(await res.json())
    } catch {} finally {
      setLoading(false)
    }
  }

  async function handleSave(id: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/page-content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      })
      if (res.ok) {
        setEditingId(null)
        load()
      }
    } catch {} finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border-3 border-[#c8a75e]/20 rounded-full"></div>
          <div className="absolute inset-0 border-3 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const visibleSections = sections.filter(s => s.title || s.content)
  if (visibleSections.length === 0) return null

  return (
    <div className="glass-effect rounded-2xl p-6 border border-[#c8a75e]/20">
      <h3 className="text-base font-bold text-[#f5f3ee] mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#c8a75e]" />
        Page Content Sections
      </h3>
      <p className="text-xs text-premium-light mb-4">
        Edit headings, subtitles, and text blocks for this page
      </p>
      <div className="space-y-3">
        {visibleSections.map((item) => (
          <div key={item.id} className="p-3 rounded-xl bg-[#0b0f2a]/20 border border-[#c8a75e]/10">
            {editingId === item.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Content</label>
                  <textarea
                    rows={3}
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(item.id)}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-xs font-medium"
                  >
                    <Check className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-xs font-medium"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-medium text-[#c8a75e] uppercase tracking-wide">
                      {formatSectionKey(item.sectionKey)}
                    </span>
                    {item.status !== 'published' && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        item.status === 'pending_moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.status === 'pending_admin' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  {item.title && <p className="text-sm font-medium text-[#f5f3ee] truncate">{item.title}</p>}
                  {item.content && <p className="text-xs text-premium-light mt-1 line-clamp-2">{item.content}</p>}
                  {!item.title && !item.content && <p className="text-xs text-premium-light italic">Empty</p>}
                </div>
                <button
                  onClick={() => {
                    setEditingId(item.id)
                    setEditTitle(item.title || '')
                    setEditContent(item.content || '')
                  }}
                  className="p-1.5 hover:bg-[#c8a75e]/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#c8a75e]" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
