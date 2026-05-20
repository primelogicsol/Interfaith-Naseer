'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Lightbulb, ExternalLink, Pencil, X, Check, ArrowLeft } from 'lucide-react'
import BulkUpload from '@/components/admin/BulkUpload'

interface Misconception {
  id: string
  misconception: string
}

interface TruthSection {
  id: string
  sectionKey: string
  title: string
  content: string
  status: string
}

export default function TruthPageEditor() {
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([])
  const [truthSections, setTruthSections] = useState<TruthSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  async function loadData() {
    try {
      const [mRes, tsRes] = await Promise.all([
        fetch('/api/misconceptions'),
        fetch('/api/truth-sections')
      ])
      if (mRes.ok) setMisconceptions(await mRes.json())
      if (tsRes.ok) setTruthSections(await tsRes.json())
    } catch (err) {
      console.error('Error loading truth page data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const dispellingSection = truthSections.find(s => s.sectionKey === 'dispelling_misconceptions')

  const handleSave = async () => {
    if (!editingId) return
    try {
      const res = await fetch(`/api/truth-sections/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent })
      })
      if (res.ok) {
        setEditingId(null)
        const tsRes = await fetch('/api/truth-sections')
        if (tsRes.ok) setTruthSections(await tsRes.json())
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
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Truth Page Editor</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">
          Manage all content for the Truth page
        </p>
        <div className="mt-4">
          <BulkUpload type="truth-sections" onComplete={loadData} />
        </div>
      </div>

      <div className="grid gap-6">
        {/* Misconceptions */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Misconceptions</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 mt-1">
                  {misconceptions.length} total
                </span>
              </div>
            </div>
          </div>
          {misconceptions.length > 0 && (
            <div className="space-y-2 mb-4">
              {misconceptions.slice(0, 5).map(m => (
                <p key={m.id} className="text-sm text-premium-light">
                  Ã¢â‚¬Â¢ {m.misconception.length > 80 ? m.misconception.slice(0, 80) + '...' : m.misconception}
                </p>
              ))}
              {misconceptions.length > 5 && (
                <p className="text-sm text-premium-light italic">...and {misconceptions.length - 5} more</p>
              )}
            </div>
          )}
          <div className="pt-3 border-t border-[#c8a75e]/10">
            <Link
              href="/admin/misconceptions"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Manage Misconceptions
            </Link>
          </div>
        </div>

        {/* Why Dispelling Misconceptions Matters */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg sm:rounded-xl">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Why Dispelling Misconceptions Matters</h2>
                {dispellingSection && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    dispellingSection.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    dispellingSection.status === 'pending_moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                    dispellingSection.status === 'pending_admin' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {dispellingSection.status.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          {dispellingSection ? (
            editingId === dispellingSection.id ? (
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
                <p className="text-sm font-medium text-[#f5f3ee]">{dispellingSection.title}</p>
                <p className="text-sm text-premium-light leading-relaxed">
                  {dispellingSection.content.length > 200 ? dispellingSection.content.slice(0, 200) + '...' : dispellingSection.content}
                </p>
                <div className="pt-3">
                  <button onClick={() => { setEditingId(dispellingSection.id); setEditTitle(dispellingSection.title); setEditContent(dispellingSection.content); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium">
                    <Pencil className="w-4 h-4" /> Edit Section
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-premium-light italic">No dispelling misconceptions content found</p>
          )}
        </div>
      </div>
    </div>
  )
}
