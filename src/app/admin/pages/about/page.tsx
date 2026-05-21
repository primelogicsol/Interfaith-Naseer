'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Heart, Users, Pencil, X, Check, Plus, Edit, Trash2, Save, Eye, Globe, BookHeart, Sparkles, Target, ArrowLeft } from 'lucide-react'
import { IconPicker } from '@/components/admin/IconPicker'
import ContentSectionEditor from '@/components/ContentSectionEditor'

const VALUE_ICON_MAP: Record<string, React.ElementType> = {
  Heart, Globe, BookHeart, Users, Sparkles, Target,
}

interface AboutContent {
  id: string
  sectionKey: string
  title: string
  content: string
  status: string
}

interface AboutValue {
  id: string
  title: string
  description: string
  icon: string | null
  color: string | null
  orderIndex: number
}

interface AboutLeader {
  id: string
  name: string
  role: string
  description: string
  image: string | null
  orderIndex: number
}

const EMPTY_VALUE = { title: '', description: '', icon: 'Heart', color: '#c8a75e', orderIndex: 0 }
const EMPTY_LEADER = { name: '', role: '', description: '', orderIndex: 0 }

export default function AboutPageEditor() {
  const [sections, setSections] = useState<AboutContent[]>([])
  const [values, setValues] = useState<AboutValue[]>([])
  const [leaders, setLeaders] = useState<AboutLeader[]>([])
  const [loading, setLoading] = useState(true)

  const [editSectionId, setEditSectionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const [valueEditId, setValueEditId] = useState<string | null>(null)
  const [valueEditForm, setValueEditForm] = useState(EMPTY_VALUE)
  const [valueAddForm, setValueAddForm] = useState(EMPTY_VALUE)
  const [showValueAdd, setShowValueAdd] = useState(false)

  const [leaderEditId, setLeaderEditId] = useState<string | null>(null)
  const [leaderEditForm, setLeaderEditForm] = useState(EMPTY_LEADER)
  const [leaderAddForm, setLeaderAddForm] = useState(EMPTY_LEADER)
  const [showLeaderAdd, setShowLeaderAdd] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [secRes, valRes, leadRes] = await Promise.all([
        fetch('/api/about-content'),
        fetch('/api/about-values'),
        fetch('/api/about-leaders'),
      ])
      if (secRes.ok) setSections(await secRes.json())
      if (valRes.ok) setValues(await valRes.json())
      if (leadRes.ok) setLeaders(await leadRes.json())
    } catch (err) {
      console.error('Error loading about page data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSectionSave(id: string) {
    try {
      await fetch(`/api/about-content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      })
      setEditSectionId(null)
      load()
    } catch (err) { console.error(err) }
  }

  async function handleValueAdd() {
    try {
      const res = await fetch('/api/about-values', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valueAddForm) })
      if (res.ok) { setShowValueAdd(false); setValueAddForm(EMPTY_VALUE); load() }
    } catch {}
  }

  async function handleValueSave(id: string) {
    try {
      const res = await fetch(`/api/about-values/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valueEditForm) })
      if (res.ok) { setValueEditId(null); load() }
    } catch {}
  }

  async function handleValueDelete(id: string) {
    if (!confirm('Delete this value?')) return
    try { await fetch(`/api/about-values/${id}`, { method: 'DELETE' }); load() } catch {}
  }

  async function handleLeaderAdd() {
    try {
      const res = await fetch('/api/about-leaders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leaderAddForm) })
      if (res.ok) { setShowLeaderAdd(false); setLeaderAddForm(EMPTY_LEADER); load() }
    } catch {}
  }

  async function handleLeaderSave(id: string) {
    try {
      const res = await fetch(`/api/about-leaders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leaderEditForm) })
      if (res.ok) { setLeaderEditId(null); load() }
    } catch {}
  }

  async function handleLeaderDelete(id: string) {
    if (!confirm('Delete this leader?')) return
    try { await fetch(`/api/about-leaders/${id}`, { method: 'DELETE' }); load() } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading About Page Editor...</p>
        </div>
      </div>
    )
  }

  const story = sections.find(s => s.sectionKey === 'story')
  const vision = sections.find(s => s.sectionKey === 'vision')

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">About Page Editor</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">Manage all content for the About page</p>
      </div>

      <div className="grid gap-6">
        {/* Our Story */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Our Story</h2>
                {story && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    story.status === 'published' || story.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>{story.status}</span>
                )}
              </div>
            </div>
          </div>
          {story ? (
            editSectionId === story.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Title</label>
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Content</label>
                  <textarea rows={5} value={editContent} onChange={e => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSectionSave(story.id)} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors text-sm font-medium"><Check className="w-4 h-4" /> Save</button>
                  <button onClick={() => setEditSectionId(null)} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium"><X className="w-3 h-3 sm:w-4 sm:h-4" /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#f5f3ee]">{story.title}</p>
                <p className="text-sm text-premium-light leading-relaxed whitespace-pre-line">{story.content.length > 300 ? story.content.slice(0, 300) + '...' : story.content}</p>
                <div className="pt-3">
                  <button onClick={() => { setEditSectionId(story.id); setEditTitle(story.title); setEditContent(story.content); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium">
                    <Pencil className="w-4 h-4" /> Edit Section
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-premium-light italic">No story content found</p>
          )}
        </div>

        {/* Our Vision */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg sm:rounded-xl">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Our Vision</h2>
                {vision && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    vision.status === 'published' || vision.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>{vision.status}</span>
                )}
              </div>
            </div>
          </div>
          {vision ? (
            editSectionId === vision.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Title</label>
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Content</label>
                  <textarea rows={4} value={editContent} onChange={e => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSectionSave(vision.id)} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors text-sm font-medium"><Check className="w-4 h-4" /> Save</button>
                  <button onClick={() => setEditSectionId(null)} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium"><X className="w-3 h-3 sm:w-4 sm:h-4" /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#f5f3ee]">{vision.title}</p>
                <p className="text-sm text-premium-light leading-relaxed">{vision.content.length > 300 ? vision.content.slice(0, 300) + '...' : vision.content}</p>
                <div className="pt-3">
                  <button onClick={() => { setEditSectionId(vision.id); setEditTitle(vision.title); setEditContent(vision.content); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium">
                    <Pencil className="w-4 h-4" /> Edit Section
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-premium-light italic">No vision content found</p>
          )}
        </div>

        {/* Core Values */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg sm:rounded-xl">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Core Values</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 mt-1">
                  {values.length} value{values.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <button onClick={() => setShowValueAdd(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all text-xs font-medium">
              <Plus className="w-3.5 h-3.5" /> Add Value
            </button>
          </div>

          {showValueAdd && (
            <div className="mb-4 p-4 rounded-xl bg-[#0b0f2a]/40 border border-[#c8a75e]/20 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Title</label>
                  <input type="text" value={valueAddForm.title} onChange={e => setValueAddForm({ ...valueAddForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <IconPicker value={valueAddForm.icon} onChange={v => setValueAddForm({ ...valueAddForm, icon: v })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Color</label>
                  <input type="color" value={valueAddForm.color} onChange={e => setValueAddForm({ ...valueAddForm, color: e.target.value })}
                    className="w-full h-10 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Order</label>
                  <input type="number" value={valueAddForm.orderIndex} onChange={e => setValueAddForm({ ...valueAddForm, orderIndex: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Description</label>
                  <textarea value={valueAddForm.description} onChange={e => setValueAddForm({ ...valueAddForm, description: e.target.value })}
                    rows={2} className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleValueAdd}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl text-xs font-medium">
                  Save
                </button>
                <button onClick={() => { setShowValueAdd(false); setValueAddForm(EMPTY_VALUE) }}
                  className="px-3 py-1.5 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] rounded-xl text-xs">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {values.length > 0 ? (
            <div className="space-y-2">
              {values.sort((a, b) => a.orderIndex - b.orderIndex).map(v => (
                <div key={v.id} className="p-3 rounded-xl bg-[#0b0f2a]/40 border border-[#c8a75e]/10">
                  {valueEditId === v.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Title</label>
                          <input type="text" value={valueEditForm.title} onChange={e => setValueEditForm({ ...valueEditForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <IconPicker value={valueEditForm.icon} onChange={v => setValueEditForm({ ...valueEditForm, icon: v })} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Color</label>
                          <input type="color" value={valueEditForm.color} onChange={e => setValueEditForm({ ...valueEditForm, color: e.target.value })}
                            className="w-full h-10 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 cursor-pointer" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Order</label>
                          <input type="number" value={valueEditForm.orderIndex} onChange={e => setValueEditForm({ ...valueEditForm, orderIndex: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Description</label>
                          <textarea value={valueEditForm.description} onChange={e => setValueEditForm({ ...valueEditForm, description: e.target.value })}
                            rows={2} className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleValueSave(v.id)} className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl text-xs font-medium">Save</button>
                        <button onClick={() => setValueEditId(null)} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-medium">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: v.color || '#c8a75e' }}>
                        {(() => { const Icon = VALUE_ICON_MAP[v.icon || 'Heart'] || Heart; return <Icon className="w-4 h-4 text-[#f5f3ee]" /> })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-semibold text-[#f5f3ee]">{v.title}</h4>
                            <span className="text-[10px] text-[#c8a75e]">Order: {v.orderIndex}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setValueEditId(v.id); setValueEditForm({ title: v.title, description: v.description, icon: v.icon || 'Heart', color: v.color || '#c8a75e', orderIndex: v.orderIndex }) }}
                              className="p-1 hover:bg-[#c8a75e]/20 rounded-lg transition-colors"><Edit className="w-3.5 h-3.5 text-[#c8a75e]" /></button>
                            <button onClick={() => handleValueDelete(v.id)} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                          </div>
                        </div>
                        <p className="text-premium-light text-xs mt-1">{v.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-premium-light italic">No values found</p>
          )}
        </div>

        {/* Leadership */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Leadership</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 mt-1">
                  {leaders.length} leader{leaders.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <button onClick={() => setShowLeaderAdd(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all text-xs font-medium">
              <Plus className="w-3.5 h-3.5" /> Add Leader
            </button>
          </div>

          {showLeaderAdd && (
            <div className="mb-4 p-4 rounded-xl bg-[#0b0f2a]/40 border border-[#c8a75e]/20 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Name</label>
                  <input type="text" value={leaderAddForm.name} onChange={e => setLeaderAddForm({ ...leaderAddForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Role</label>
                  <input type="text" value={leaderAddForm.role} onChange={e => setLeaderAddForm({ ...leaderAddForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Order</label>
                  <input type="number" value={leaderAddForm.orderIndex} onChange={e => setLeaderAddForm({ ...leaderAddForm, orderIndex: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Description</label>
                  <textarea value={leaderAddForm.description} onChange={e => setLeaderAddForm({ ...leaderAddForm, description: e.target.value })}
                    rows={2} className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleLeaderAdd}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl text-xs font-medium">
                  Save
                </button>
                <button onClick={() => { setShowLeaderAdd(false); setLeaderAddForm(EMPTY_LEADER) }}
                  className="px-3 py-1.5 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] rounded-xl text-xs">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {leaders.length > 0 ? (
            <div className="space-y-2">
              {leaders.sort((a, b) => a.orderIndex - b.orderIndex).map(l => (
                <div key={l.id} className="p-3 rounded-xl bg-[#0b0f2a]/40 border border-[#c8a75e]/10">
                  {leaderEditId === l.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Name</label>
                          <input type="text" value={leaderEditForm.name} onChange={e => setLeaderEditForm({ ...leaderEditForm, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Role</label>
                          <input type="text" value={leaderEditForm.role} onChange={e => setLeaderEditForm({ ...leaderEditForm, role: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Order</label>
                          <input type="number" value={leaderEditForm.orderIndex} onChange={e => setLeaderEditForm({ ...leaderEditForm, orderIndex: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-[#aab0d6] mb-1 uppercase">Description</label>
                          <textarea value={leaderEditForm.description} onChange={e => setLeaderEditForm({ ...leaderEditForm, description: e.target.value })}
                            rows={2} className="w-full px-3 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] text-sm" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleLeaderSave(l.id)} className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl text-xs font-medium">Save</button>
                        <button onClick={() => setLeaderEditId(null)} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-medium">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#6B7280] flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-[#f5f3ee]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-semibold text-[#f5f3ee]">{l.name}</h4>
                            <span className="text-[10px] text-[#c8a75e]">{l.role}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setLeaderEditId(l.id); setLeaderEditForm({ name: l.name, role: l.role, description: l.description, orderIndex: l.orderIndex }) }}
                              className="p-1 hover:bg-[#c8a75e]/20 rounded-lg transition-colors"><Edit className="w-3.5 h-3.5 text-[#c8a75e]" /></button>
                            <button onClick={() => handleLeaderDelete(l.id)} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                          </div>
                        </div>
                        <p className="text-premium-light text-xs mt-1">{l.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-premium-light italic">No leaders found</p>
          )}
        </div>
      </div>

      <ContentSectionEditor pageKey="about" />
    </div>
  )
}
