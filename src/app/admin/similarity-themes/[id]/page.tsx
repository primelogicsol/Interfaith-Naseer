'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2, Edit3, X, Check, Loader2 } from 'lucide-react'
import { IconPicker } from '@/components/admin/IconPicker'

interface Tradition {
  id: string
  name: string
}

interface Teaching {
  id: string
  teaching: string
  source: string
  context: string | null
  traditionId: string
  orderIndex: number
  tradition: { id: string; name: string }
}

export default function EditSimilarityTheme({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [traditions, setTraditions] = useState<Tradition[]>([])
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [showTeachingForm, setShowTeachingForm] = useState(false)
  const [editingTeaching, setEditingTeaching] = useState<Teaching | null>(null)
  const [teachingSaving, setTeachingSaving] = useState(false)
  const [teachingForm, setTeachingForm] = useState({
    traditionId: '',
    teaching: '',
    source: '',
    context: '',
    orderIndex: 0,
  })
  const [themeData, setThemeData] = useState({
    title: '',
    description: '',
    icon: 'Heart',
    color: '#C8A75E',
    slug: '',
    orderIndex: 0,
  })

  useEffect(() => {
    Promise.all([loadTheme(), loadTraditions(), loadTeachings()])
  }, [resolvedParams.id])

  async function loadTheme() {
    try {
      const response = await fetch(`/api/similarity-themes/${resolvedParams.id}`)
      if (!response.ok) throw new Error('Failed to load similarity theme')
      const data = await response.json()
      setThemeData({
        title: data.title || '',
        description: data.description || '',
        icon: data.icon || 'Heart',
        color: data.color || '#C8A75E',
        slug: data.slug || '',
        orderIndex: data.orderIndex || 0,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadTraditions() {
    try {
      const res = await fetch('/api/traditions')
      if (res.ok) setTraditions(await res.json())
    } catch {}
  }

  async function loadTeachings() {
    try {
      const res = await fetch(`/api/similarity-teachings?themeId=${resolvedParams.id}`)
      if (res.ok) setTeachings(await res.json())
    } catch {}
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setThemeData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug === generateSlug(prev.title) ? generateSlug(value) : prev.slug,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const response = await fetch(`/api/similarity-themes/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeData),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update similarity theme')
      }
      router.push('/admin/similarity-themes')
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  const openNewTeaching = () => {
    setEditingTeaching(null)
    setTeachingForm({ traditionId: '', teaching: '', source: '', context: '', orderIndex: teachings.length })
    setShowTeachingForm(true)
  }

  const openEditTeaching = (t: Teaching) => {
    setEditingTeaching(t)
    setTeachingForm({
      traditionId: t.traditionId,
      teaching: t.teaching,
      source: t.source,
      context: t.context || '',
      orderIndex: t.orderIndex,
    })
    setShowTeachingForm(true)
  }

  const saveTeaching = async () => {
    if (!teachingForm.traditionId || !teachingForm.teaching || !teachingForm.source) return
    setTeachingSaving(true)
    try {
      if (editingTeaching) {
        const res = await fetch(`/api/similarity-teachings/${editingTeaching.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...teachingForm,
            themeId: resolvedParams.id,
          }),
        })
        if (!res.ok) throw new Error('Failed to update teaching')
      } else {
        const res = await fetch('/api/similarity-teachings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...teachingForm,
            themeId: resolvedParams.id,
          }),
        })
        if (!res.ok) throw new Error('Failed to create teaching')
      }
      setShowTeachingForm(false)
      setEditingTeaching(null)
      await loadTeachings()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setTeachingSaving(false)
    }
  }

  const deleteTeaching = async (id: string) => {
    if (!confirm('Delete this similarity teaching?')) return
    try {
      const res = await fetch(`/api/similarity-teachings/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTeachings(teachings.filter(t => t.id !== id))
      }
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/similarity-themes" className="p-2 hover:bg-[#c8a75e]/10 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#f5f3ee]" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Edit Similarity Theme</h1>
          <p className="text-premium-light mt-1 text-sm">Update theme and manage teachings</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
          <p className="text-[#e74c3c] text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20 space-y-6">
        <h2 className="text-lg font-bold text-[#f5f3ee] border-b border-[#c8a75e]/20 pb-3">Theme Details</h2>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Title *</label>
          <input
            type="text"
            required
            value={themeData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Description *</label>
          <textarea
            required
            value={themeData.description}
            onChange={(e) => setThemeData({ ...themeData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IconPicker value={themeData.icon} onChange={(icon) => setThemeData({ ...themeData, icon })} label="Icon" />

          <div>
            <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeData.color}
                onChange={(e) => setThemeData({ ...themeData, color: e.target.value })}
                className="w-12 h-12 rounded-xl border border-[#c8a75e]/20 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={themeData.color}
                onChange={(e) => setThemeData({ ...themeData, color: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all font-mono"
                placeholder="#C8A75E"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Slug *</label>
            <input
              type="text"
              required
              value={themeData.slug}
              onChange={(e) => setThemeData({ ...themeData, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Order Index</label>
            <input
              type="number"
              value={themeData.orderIndex}
              onChange={(e) => setThemeData({ ...themeData, orderIndex: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Theme'}
          </button>
          <Link
            href="/admin/similarity-themes"
            className="px-6 py-3 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] rounded-xl hover:bg-[#0b0f2a]/80 transition-all font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20 space-y-4">
        <div className="flex items-center justify-between border-b border-[#c8a75e]/20 pb-3">
          <h2 className="text-lg font-bold text-[#f5f3ee]">Teachings ({teachings.length})</h2>
          {!showTeachingForm && (
            <button
              onClick={openNewTeaching}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 border border-[#c8a75e]/30 text-[#c8a75e] rounded-xl hover:bg-[#c8a75e]/20 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Teaching
            </button>
          )}
        </div>

        {showTeachingForm && (
          <div className="bg-[#0b0f2a]/40 rounded-xl p-5 border border-[#c8a75e]/20 space-y-4">
            <h3 className="text-sm font-bold text-[#f5f3ee] uppercase tracking-wider">
              {editingTeaching ? 'Edit Teaching' : 'New Teaching'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#aab0d6] mb-1.5">Tradition *</label>
                <select
                  value={teachingForm.traditionId}
                  onChange={(e) => setTeachingForm({ ...teachingForm, traditionId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 transition-all"
                >
                  <option value="">Select tradition...</option>
                  {traditions.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#aab0d6] mb-1.5">Source *</label>
                <input
                  type="text"
                  value={teachingForm.source}
                  onChange={(e) => setTeachingForm({ ...teachingForm, source: e.target.value })}
                  placeholder="e.g., Quran 49:13"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#aab0d6] mb-1.5">Teaching *</label>
              <textarea
                value={teachingForm.teaching}
                onChange={(e) => setTeachingForm({ ...teachingForm, teaching: e.target.value })}
                rows={3}
                placeholder="The actual teaching quote or text..."
                className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#aab0d6] mb-1.5">Context (optional)</label>
              <input
                type="text"
                value={teachingForm.context}
                onChange={(e) => setTeachingForm({ ...teachingForm, context: e.target.value })}
                placeholder="Historical or interpretive context..."
                className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#aab0d6] mb-1.5">Order Index</label>
                <input
                  type="number"
                  value={teachingForm.orderIndex}
                  onChange={(e) => setTeachingForm({ ...teachingForm, orderIndex: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={saveTeaching}
                disabled={teachingSaving || !teachingForm.traditionId || !teachingForm.teaching || !teachingForm.source}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl font-medium hover:shadow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {teachingSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {teachingSaving ? 'Saving...' : editingTeaching ? 'Update Teaching' : 'Add Teaching'}
              </button>
              <button
                onClick={() => { setShowTeachingForm(false); setEditingTeaching(null) }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-premium-light hover:text-[#f5f3ee] transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {teachings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-premium-light text-sm">No teachings yet. Click "Add Teaching" to create one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teachings
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((t) => (
                <div key={t.id} className="flex items-start gap-4 bg-[#0b0f2a]/30 rounded-xl p-4 border border-[#c8a75e]/10 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-[#c8a75e]/20 text-[#c8a75e] text-xs rounded-lg font-medium">{t.tradition?.name || 'Unknown'}</span>
                      <span className="text-xs text-premium-light">#{t.orderIndex}</span>
                    </div>
                    <p className="text-sm text-[#f5f3ee] leading-relaxed mb-1">&ldquo;{t.teaching}&rdquo;</p>
                    <p className="text-xs text-premium-light">Source: {t.source}</p>
                    {t.context && <p className="text-xs text-premium-light mt-1">{t.context}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEditTeaching(t)} className="p-1.5 hover:bg-[#c8a75e]/20 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4 text-[#c8a75e]" />
                    </button>
                    <button onClick={() => deleteTeaching(t.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
