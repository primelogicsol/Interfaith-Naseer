'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, BookOpen, Save, X, Lightbulb } from 'lucide-react'
import { IconPicker } from '@/components/admin/IconPicker'

interface ApproachCard {
  id: string
  sectionType: string
  title: string
  description: string | null
  features: any | null
  icon: string | null
  color: string | null
  orderIndex: number
}

const SECTION_TYPES = [
  { value: 'pillar', label: 'Pillars' },
  { value: 'step', label: 'Steps' },
  { value: 'principle', label: 'Principles' },
  { value: 'differentiator', label: 'Differentiators' },
]

export default function ApproachCardsManagement() {
  const [cards, setCards] = useState<ApproachCard[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ sectionType: '', title: '', description: '', features: '', icon: '', color: '', orderIndex: 0 })
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ sectionType: 'pillar', title: '', description: '', features: '', icon: '', color: '', orderIndex: 0 })
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => { loadCards() }, [])

  async function loadCards() {
    try {
      const res = await fetch('/api/approach-cards')
      const data = await res.json()
      setCards(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error loading approach cards:', e)
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit(id: string) {
    const c = cards.find(x => x.id === id)
    if (!c) return
    setEditingId(id)
    setEditForm({
      sectionType: c.sectionType,
      title: c.title,
      description: c.description || '',
      features: c.features ? JSON.stringify(c.features, null, 2) : '',
      icon: c.icon || '',
      color: c.color || '',
      orderIndex: c.orderIndex,
    })
  }

  function cancelEdit() { setEditingId(null) }

  function parseFeatures(raw: string): any {
    if (!raw.trim()) return null
    try { return JSON.parse(raw) } catch { return raw }
  }

  async function handleSave(id: string) {
    try {
      const res = await fetch(`/api/approach-cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          features: parseFeatures(editForm.features),
          description: editForm.description || null,
          icon: editForm.icon || null,
          color: editForm.color || null,
        })
      })
      if (!res.ok) throw new Error('Failed to update')
      setEditingId(null)
      await loadCards()
    } catch (e) {
      console.error('Error saving:', e)
      alert('Failed to save card')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this approach card?')) return
    try {
      const res = await fetch(`/api/approach-cards/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setCards(cards.filter(c => c.id !== id))
    } catch (e) {
      console.error('Error deleting:', e)
      alert('Failed to delete card')
    }
  }

  async function handleAdd() {
    if (!addForm.title.trim() || !addForm.sectionType) return
    try {
      const res = await fetch('/api/approach-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addForm,
          features: parseFeatures(addForm.features),
          description: addForm.description || null,
          icon: addForm.icon || null,
          color: addForm.color || null,
        })
      })
      if (!res.ok) throw new Error('Failed to create')
      setShowAdd(false)
      setAddForm({ sectionType: 'pillar', title: '', description: '', features: '', icon: '', color: '', orderIndex: 0 })
      await loadCards()
    } catch (e) {
      console.error('Error creating:', e)
      alert('Failed to create card')
    }
  }

  function cancelAdd() {
    setShowAdd(false)
    setAddForm({ sectionType: 'pillar', title: '', description: '', features: '', icon: '', color: '', orderIndex: 0 })
  }

  const filteredCards = filterType === 'all'
    ? cards
    : cards.filter(c => c.sectionType === filterType)

  const sectionColors: Record<string, string> = {
    pillar: 'bg-emerald-500/20 text-emerald-400',
    step: 'bg-blue-500/20 text-blue-400',
    principle: 'bg-violet-500/20 text-violet-400',
    differentiator: 'bg-amber-500/20 text-amber-400',
  }

  function getSectionBadge(type: string) {
    const st = SECTION_TYPES.find(s => s.value === type)
    const color = sectionColors[type] || 'bg-gray-500/20 text-gray-400'
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{st?.label || type}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading approach cards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Approach Cards</h1>
          <p className="text-premium-light mt-1 text-sm">Manage approach section cards</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm whitespace-nowrap">
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {[{ value: 'all', label: 'All' }, ...SECTION_TYPES].map(st => (
          <button key={st.value} onClick={() => setFilterType(st.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterType === st.value
                ? 'bg-[#c8a75e] text-[#0b0f2a]'
                : 'bg-[#c8a75e]/10 text-premium-light hover:bg-[#c8a75e]/20'
            }`}>
            {st.label}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="glass-effect rounded-2xl p-6 border border-[#c8a75e]/20">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#c8a75e]" />
            <span className="text-sm font-medium text-[#f5f3ee]">New Approach Card</span>
          </div>
          <div className="grid gap-4">
            <div className="flex gap-4">
              <select value={addForm.sectionType} onChange={e => setAddForm(p => ({ ...p, sectionType: e.target.value }))}
                className="p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40">
                {SECTION_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <input type="number" value={addForm.orderIndex} onChange={e => setAddForm(p => ({ ...p, orderIndex: parseInt(e.target.value) || 0 }))}
                placeholder="Order"
                className="w-20 p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
            </div>
            <input value={addForm.title} onChange={e => setAddForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Title"
              className="w-full p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
            <textarea value={addForm.description} onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Description (optional)"
              className="w-full p-3 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm min-h-[80px] resize-none focus:outline-none focus:border-[#c8a75e]/40" />
            <textarea value={addForm.features} onChange={e => setAddForm(p => ({ ...p, features: e.target.value }))}
              placeholder='Features as JSON array (optional, e.g. ["item 1", "item 2"])'
              className="w-full p-3 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm min-h-[60px] resize-none font-mono text-xs focus:outline-none focus:border-[#c8a75e]/40" />
            <IconPicker value={addForm.icon} onChange={v => setAddForm(p => ({ ...p, icon: v }))} />
            <div>
              <label className="block text-xs font-bold text-[#aab0d6] mb-1 uppercase tracking-wider">Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={addForm.color || '#c8a75e'} onChange={e => setAddForm(p => ({ ...p, color: e.target.value }))}
                  className="w-12 h-10 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 cursor-pointer" />
                <input value={addForm.color} onChange={e => setAddForm(p => ({ ...p, color: e.target.value }))}
                  placeholder="#hex"
                  className="flex-1 p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c8a75e] text-[#0b0f2a] rounded-xl text-sm font-medium hover:bg-[#d4b56d] transition-colors">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={cancelAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b0f2a]/30 text-premium-light rounded-xl text-sm hover:bg-[#0b0f2a]/50 transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredCards.map(c => (
          <div key={c.id} className="glass-effect rounded-2xl p-5 border border-[#c8a75e]/10">
            {editingId === c.id ? (
              <div className="grid gap-4">
                <div className="flex gap-4">
                  <select value={editForm.sectionType} onChange={e => setEditForm(p => ({ ...p, sectionType: e.target.value }))}
                    className="p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40">
                    {SECTION_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <input type="number" value={editForm.orderIndex} onChange={e => setEditForm(p => ({ ...p, orderIndex: parseInt(e.target.value) || 0 }))}
                    placeholder="Order"
                    className="w-20 p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
                </div>
                <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Title"
                  className="w-full p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
                <textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Description (optional)"
                  className="w-full p-3 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm min-h-[80px] resize-none focus:outline-none focus:border-[#c8a75e]/40" />
                <textarea value={editForm.features} onChange={e => setEditForm(p => ({ ...p, features: e.target.value }))}
                  placeholder='Features as JSON array (optional)'
                  className="w-full p-3 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm min-h-[60px] resize-none font-mono text-xs focus:outline-none focus:border-[#c8a75e]/40" />
                <IconPicker value={editForm.icon} onChange={v => setEditForm(p => ({ ...p, icon: v }))} />
                <div>
                  <label className="block text-xs font-bold text-[#aab0d6] mb-1 uppercase tracking-wider">Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={editForm.color || '#c8a75e'} onChange={e => setEditForm(p => ({ ...p, color: e.target.value }))}
                      className="w-12 h-10 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 cursor-pointer" />
                    <input value={editForm.color} onChange={e => setEditForm(p => ({ ...p, color: e.target.value }))}
                      placeholder="#hex"
                      className="flex-1 p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSave(c.id)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c8a75e] text-[#0b0f2a] rounded-xl text-sm font-medium hover:bg-[#d4b56d] transition-colors">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b0f2a]/30 text-premium-light rounded-xl text-sm hover:bg-[#0b0f2a]/50 transition-colors">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-premium-light font-mono">#{c.orderIndex}</span>
                    {getSectionBadge(c.sectionType)}
                  </div>
                  <h3 className="text-base font-semibold text-[#f5f3ee] mb-1 truncate">{c.title}</h3>
                  {c.description && (
                    <p className="text-sm text-[#f5f3ee]/70 line-clamp-2 mb-1">{c.description}</p>
                  )}
                  {c.features && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(Array.isArray(c.features) ? c.features : []).map((f: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-[#c8a75e]/10 text-[#c8a75e] rounded-lg text-xs">{f}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {c.icon && <span className="text-xs text-premium-light">Icon: {c.icon}</span>}
                    {c.color && (
                      <span className="flex items-center gap-1 text-xs text-premium-light">
                        Color: <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(c.id)} className="p-2 hover:bg-[#c8a75e]/20 rounded-xl transition-colors">
                    <Edit className="w-4 h-4 text-[#c8a75e]" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-500/20 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-premium-light mx-auto mb-4" />
          <p className="text-premium-light">No approach cards found</p>
        </div>
      )}
    </div>
  )
}
