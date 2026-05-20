'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, TrendingUp, MessageSquare, ExternalLink, Pencil, X, Check, ArrowLeft } from 'lucide-react'

interface Teaching {
  id: string
  title: string
}

interface SimilarityTheme {
  id: string
  title: string
}

interface TeachingSection {
  id: string
  sectionKey: string
  title: string
  content: string
  status: string
}

export default function TeachingsPageEditor() {
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [similarityThemes, setSimilarityThemes] = useState<SimilarityTheme[]>([])
  const [teachingSections, setTeachingSections] = useState<TeachingSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [tRes, stRes, tsRes] = await Promise.all([
          fetch('/api/teachings'),
          fetch('/api/similarity-themes'),
          fetch('/api/teaching-sections')
        ])
        if (tRes.ok) setTeachings(await tRes.json())
        if (stRes.ok) setSimilarityThemes(await stRes.json())
        if (tsRes.ok) setTeachingSections(await tsRes.json())
      } catch (err) {
        console.error('Error loading teachings page data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading Teachings Page Editor...</p>
        </div>
      </div>
    )
  }

  const universalMessage = teachingSections.find(s => s.sectionKey === 'universal_message')

  const handleSave = async () => {
    if (!editingId) return
    try {
      const res = await fetch(`/api/teaching-sections/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent })
      })
      if (res.ok) {
        setEditingId(null)
        const tsRes = await fetch('/api/teaching-sections')
        if (tsRes.ok) setTeachingSections(await tsRes.json())
      }
    } catch (err) {
      console.error('Error saving section:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Teachings Page Editor</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">
          Manage all content for the Teachings page
        </p>
      </div>

      <div className="grid gap-6">
        {/* Teachings */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Teachings</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 mt-1">
                  {teachings.length} teaching{teachings.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          {teachings.length > 0 && (
            <div className="space-y-2 mb-4">
              {teachings.slice(0, 5).map(t => (
                <p key={t.id} className="text-sm text-premium-light">Ã¢â‚¬Â¢ {t.title}</p>
              ))}
              {teachings.length > 5 && (
                <p className="text-sm text-premium-light italic">...and {teachings.length - 5} more</p>
              )}
            </div>
          )}
          <div className="pt-3 border-t border-[#c8a75e]/10">
            <Link
              href="/admin/teachings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Manage Teachings
            </Link>
          </div>
        </div>

        {/* Similarity Themes */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Similarity Themes</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 mt-1">
                  {similarityThemes.length} theme{similarityThemes.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          {similarityThemes.length > 0 && (
            <div className="space-y-2 mb-4">
              {similarityThemes.map(t => (
                <p key={t.id} className="text-sm text-premium-light">Ã¢â‚¬Â¢ {t.title}</p>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-[#c8a75e]/10">
            <Link
              href="/admin/similarity-themes"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Manage Similarity Themes
            </Link>
          </div>
        </div>

        {/* The Universal Message */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg sm:rounded-xl">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">The Universal Message</h2>
                {universalMessage && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    universalMessage.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    universalMessage.status === 'pending_moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                    universalMessage.status === 'pending_admin' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {universalMessage.status.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          {universalMessage ? (
            editingId === universalMessage.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Content</label>
                  <textarea
                    rows={6}
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium">
                    <X className="w-3 h-3 sm:w-4 sm:h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#f5f3ee]">{universalMessage.title}</p>
                <p className="text-sm text-premium-light leading-relaxed">
                  {universalMessage.content.length > 200 ? universalMessage.content.slice(0, 200) + '...' : universalMessage.content}
                </p>
                <div className="pt-3">
                  <button onClick={() => { setEditingId(universalMessage.id); setEditTitle(universalMessage.title); setEditContent(universalMessage.content); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium">
                    <Pencil className="w-4 h-4" /> Edit Section
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-premium-light italic">No universal message content found</p>
          )}
        </div>
      </div>
    </div>
  )
}
