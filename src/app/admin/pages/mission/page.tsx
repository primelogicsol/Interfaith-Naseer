'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Shield, LayoutDashboard, ExternalLink, Pencil, X, Check, ArrowLeft } from 'lucide-react'

interface MissionContent {
  id: string
  sectionKey: string
  title: string
  content: string
  status: string
}

interface CorePillar {
  id: string
  title: string
}

export default function MissionPageEditor() {
  const [missionContent, setMissionContent] = useState<MissionContent[]>([])
  const [corePillars, setCorePillars] = useState<CorePillar[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const [mcRes, cpRes] = await Promise.all([
        fetch('/api/mission-content'),
        fetch('/api/core-pillars')
      ])
      if (mcRes.ok) setMissionContent(await mcRes.json())
      if (cpRes.ok) setCorePillars(await cpRes.json())
    } catch (err) {
      console.error('Error loading mission page data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!editingId) return
    try {
      await fetch(`/api/mission-content/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      })
      setEditingId(null)
      load()
    } catch (err) {
      console.error('Error saving:', err)
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
          <p className="text-lg text-premium-light">Loading Mission Page Editor...</p>
        </div>
      </div>
    )
  }

  const header = missionContent.find(m => m.sectionKey === 'header')
  const sufiPath = missionContent.find(m => m.sectionKey === 'sufi_path')

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Mission Page Editor</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">
          Manage all content for the Mission page
        </p>
      </div>

      <div className="grid gap-6">
        {/* Our Mission Header */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Our Mission Header</h2>
                {header && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    header.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    header.status === 'pending_moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                    header.status === 'pending_admin' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {header.status.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          {header ? (
            editingId === header.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Title</label>
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Content</label>
                  <textarea rows={5} value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium"><Check className="w-3 h-3 sm:w-4 sm:h-4" /> Save</button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium"><X className="w-3 h-3 sm:w-4 sm:h-4" /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#f5f3ee]">{header.title}</p>
                <p className="text-sm text-premium-light leading-relaxed">
                  {header.content.length > 200 ? header.content.slice(0, 200) + '...' : header.content}
                </p>
                <div className="pt-3">
                  <button onClick={() => { setEditingId(header.id); setEditTitle(header.title); setEditContent(header.content); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium">
                    <Pencil className="w-4 h-4" /> Edit Section
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-premium-light italic">No header content found</p>
          )}
        </div>

        {/* Sufi Path Content */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Sufi Path Content</h2>
                {sufiPath && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    sufiPath.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    sufiPath.status === 'pending_moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                    sufiPath.status === 'pending_admin' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {sufiPath.status.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          {sufiPath ? (
            editingId === sufiPath.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Title</label>
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-premium-light mb-1">Content</label>
                  <textarea rows={8} value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium"><Check className="w-3 h-3 sm:w-4 sm:h-4" /> Save</button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium"><X className="w-3 h-3 sm:w-4 sm:h-4" /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#f5f3ee]">{sufiPath.title}</p>
                <p className="text-sm text-premium-light leading-relaxed">
                  {sufiPath.content.length > 200 ? sufiPath.content.slice(0, 200) + '...' : sufiPath.content}
                </p>
                <div className="pt-3">
                  <button onClick={() => { setEditingId(sufiPath.id); setEditTitle(sufiPath.title); setEditContent(sufiPath.content); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium">
                    <Pencil className="w-4 h-4" /> Edit Section
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-premium-light italic">No Sufi path content found</p>
          )}
        </div>

        {/* Core Pillars */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg sm:rounded-xl">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Core Pillars</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 mt-1">
                  {corePillars.length} pillar{corePillars.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          {corePillars.length > 0 ? (
            <div className="space-y-2 mb-4">
              {corePillars.map(p => (
                <p key={p.id} className="text-sm text-premium-light">Ã¢â‚¬Â¢ {p.title}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-premium-light italic mb-4">No core pillars found</p>
          )}
          <div className="pt-3 border-t border-[#c8a75e]/10">
            <Link
              href="/admin/core-pillars"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Manage Core Pillars
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
