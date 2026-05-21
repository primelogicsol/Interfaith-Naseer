'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Pencil, X, Check, ExternalLink } from 'lucide-react'
import ContentSectionEditor from '@/components/ContentSectionEditor'

interface WisdomItem {
  id: string
  title: string
  content: string
}

interface PeaceInitiative {
  id: string
  title: string
  description: string
  status: string | null
}

export default function PeaceAdmin() {
  const [wisdom, setWisdom] = useState<WisdomItem[]>([])
  const [initiatives, setInitiatives] = useState<PeaceInitiative[]>([])
  const [loading, setLoading] = useState(true)

  const [wisdomEditingId, setWisdomEditingId] = useState<string | null>(null)
  const [wisdomEditForm, setWisdomEditForm] = useState({ title: '', content: '' })
  const [wisdomSaving, setWisdomSaving] = useState(false)

  async function fetchAll() {
    try {
      const [wRes, pRes] = await Promise.all([
        fetch('/api/wisdom-to-action'),
        fetch('/api/peace-initiatives')
      ])
      if (wRes.ok) setWisdom(await wRes.json())
      if (pRes.ok) setInitiatives(await pRes.json())
    } catch (err) {
      console.error('Error loading peace data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  // â”€â”€ Wisdom CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function handleWisdomEdit(item: WisdomItem) {
    setWisdomEditingId(item.id)
    setWisdomEditForm({ title: item.title, content: item.content })
  }

  async function handleWisdomSave(id: string) {
    setWisdomSaving(true)
    try {
      const res = await fetch(`/api/wisdom-to-action/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wisdomEditForm)
      })
      if (res.ok) { setWisdomEditingId(null); await fetchAll() }
    } catch (err) {
      console.error('Error saving:', err)
    } finally {
      setWisdomSaving(false)
    }
  }

  // â”€â”€ Render helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function renderField(label: string, value: string, onChange: (v: string) => void, multiline = false) {
    if (multiline) {
      return (
        <div>
          <label className="block text-xs text-premium-light mb-1">{label}</label>
          <textarea value={value} onChange={e => onChange(e.target.value)} rows={5}
            className="w-full px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y" />
        </div>
      )
    }
    return (
      <div>
        <label className="block text-xs text-premium-light mb-1">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" />
      </div>
    )
  }

  function renderActions(onSave: () => void, onCancel: () => void, saving?: boolean) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <button onClick={onSave} disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-colors text-xs font-medium disabled:opacity-50">
          {saving ? <div className="w-3.5 h-3.5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save
        </button>
        <button onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-premium-light rounded-xl transition-colors text-xs font-medium">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading Peace Admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Peace Page Admin</h1>
        <p className="text-premium-light mt-1 text-xs sm:text-sm lg:text-base">
          Manage the &ldquo;The Path from Wisdom to Action&rdquo; quote and Active Initiatives
        </p>
      </div>

      <div className="grid gap-6">

         <ContentSectionEditor pageKey="peace" />

        {/* The Path from Wisdom to Action */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="space-y-3">
            {wisdom.length > 0 ? wisdom.map(w => (
              wisdomEditingId === w.id ? (
                <div key={w.id}>
                  <div className="mb-2">
                    {renderField('Title', wisdomEditForm.title, v => setWisdomEditForm(p => ({ ...p, title: v })))}
                  </div>
                  <div>
                    {renderField('Content', wisdomEditForm.content, v => setWisdomEditForm(p => ({ ...p, content: v })), true)}
                  </div>
                  {renderActions(() => handleWisdomSave(w.id), () => setWisdomEditingId(null), wisdomSaving)}
                </div>
              ) : (
                <div key={w.id}>
                  <p className="text-xs font-medium text-premium-light mb-1">Title</p>
                  <p className="text-sm font-medium text-[#f5f3ee] mb-3">{w.title}</p>
                  <p className="text-xs font-medium text-premium-light mb-1">Content</p>
                  <p className="text-sm text-premium-light leading-relaxed mb-3">
                    {w.content.length > 200 ? w.content.slice(0, 200) + '...' : w.content}
                  </p>
                  <button onClick={() => handleWisdomEdit(w)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-xs font-medium">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
              )
            )) : (
              <p className="text-sm text-premium-light italic">No quotes found</p>
            )}
          </div>
        </div>

        {/* Active Initiatives */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg sm:rounded-xl">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Active Initiatives</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400 mt-1">
                  {initiatives.length} initiative{initiatives.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {initiatives.length > 0 ? initiatives.map(p => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0b0f2a]/20">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-[#f5f3ee] truncate">{p.title}</p>
                  <p className="text-[10px] sm:text-xs text-premium-light truncate">{p.description.length > 80 ? p.description.slice(0, 80) + '...' : p.description}</p>
                </div>
                <span className={`self-start sm:self-auto px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {p.status || 'draft'}
                </span>
              </div>
            )) : (
              <p className="text-sm text-premium-light italic">No initiatives found</p>
            )}
          </div>
          <div className="pt-3 border-t border-[#c8a75e]/10">
            <Link href="/admin/peace-initiatives"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium">
              <ExternalLink className="w-4 h-4" /> Manage Initiatives
            </Link>
          </div>
        </div>

      </div>

     
    </div>
  )
}
