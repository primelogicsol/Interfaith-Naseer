'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react'
import ContentSort, { applySort, loadSortSetting, type SortConfig } from '@/components/admin/ContentSort'
import BulkUpload from '@/components/admin/BulkUpload'

interface SacredText {
  id: string
  title: string
  source: string
  textContent: string
  theme: string | null
  context: string | null
  translation: string | null
  traditionId: string
  createdAt: string
  tradition: {
    name: string
    color: string
    symbol: string
  }
}

export default function SacredTextsManagement() {
  const [sacredTexts, setSacredTexts] = useState<SacredText[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', order: 'desc' })

  useEffect(() => {
    loadSortSetting('sort_sacred_texts').then(setSortConfig)
  }, [])

  useEffect(() => {
    loadSacredTexts()
  }, [])

  async function loadSacredTexts() {
    try {
      const response = await fetch('/api/sacred-texts')
      const data = await response.json()
      if (Array.isArray(data)) {
        setSacredTexts(data)
      } else {
        setSacredTexts([])
      }
    } catch (error) {
      console.error('Error loading sacred texts:', error)
      setSacredTexts([])
    } finally {
      setLoading(false)
    }
  }

  async function deleteSacredText(id: string) {
    if (!confirm('Are you sure you want to delete this sacred text?')) return

    try {
      const response = await fetch(`/api/sacred-texts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSacredTexts(sacredTexts.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting sacred text:', error)
      alert('Failed to delete sacred text')
    }
  }

  const filteredTexts = sacredTexts.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.textContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.tradition?.name || 'Universal').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedTexts = applySort(filteredTexts, sortConfig, 'title', 'createdAt')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading sacred texts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Sacred Texts</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage sacred text passages</p>
        </div>
        <Link
          href="/admin/sacred-texts/new"
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          Add Sacred Text
        </Link>
        <BulkUpload type="sacred-texts" onComplete={loadSacredTexts} />
      </div>

      {/* Search & Sort */}
      <div className="glass-effect rounded-xl p-4 border border-[#c8a75e]/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-premium-light" />
            <input
              type="text"
              placeholder="Search sacred texts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0b0f2a]/20 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] placeholder-premium-light focus:outline-none focus:border-[#c8a75e] transition-colors"
            />
          </div>
          <ContentSort sortConfig={sortConfig} onSortChange={setSortConfig} settingKey="sort_sacred_texts" />
        </div>
      </div>

      <div className="grid gap-6">
        {sortedTexts.map((text) => (
          <div key={text.id} className="glass-effect rounded-2xl p-6 border border-[#c8a75e]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* <div className="text-4xl">{text.tradition?.symbol || '🌍'}</div> */}
                <div className="flex-1">
                  <div className='flex justify-between '>
                  <h3 className="text-xl font-semibold text-[#f5f3ee] mb-2 truncate">{text.title}</h3>



                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/admin/sacred-texts/${text.id}`}
                      className="p-2 hover:bg-[#c8a75e]/20 rounded-xl transition-colors"
                    >
                      <Edit className="w-4 h-4 text-[#c8a75e]" />
                    </Link>
                    <button
                      onClick={() => deleteSacredText(text.id)}
                      className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  </div>



                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className="px-3 py-1 rounded-xl text-sm font-medium border"
                      style={{
                        backgroundColor: text.tradition ? `${text.tradition.color}20` : '#c8a75e20',
                        color: text.tradition?.color || '#c8a75e',
                        borderColor: text.tradition ? `${text.tradition.color}40` : '#c8a75e40'
                      }}
                    >
                      {text.tradition?.name || 'Universal'}
                    </span>
                    {text.theme && (
                      <span className="px-3 py-1 bg-[#c8a75e]/10 border border-[#c8a75e]/20 rounded-xl text-sm text-[#c8a75e] capitalize">
                        {text.theme}
                      </span>
                    )}
                    <span className="text-premium-light text-sm">• {text.source}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-[#0b0f2a]/30 rounded-xl border border-[#c8a75e]/10">
                      <p className="text-xs text-premium-light mb-1 font-semibold uppercase tracking-wide">Text Content:</p>
                      <p className="text-[#f5f3ee] leading-relaxed italic line-clamp-3">"{text.textContent}"</p>
                    </div>

                    {text.translation && (
                      <div className="p-4 bg-[#0b0f2a]/20 rounded-xl border border-[#c8a75e]/10">
                        <p className="text-xs text-premium-light mb-1 font-semibold uppercase tracking-wide">Translation:</p>
                        <p className="text-premium-light text-sm leading-relaxed line-clamp-2">{text.translation}</p>
                      </div>
                    )}

                    {text.context && (
                      <div className="p-4 bg-[#0b0f2a]/20 rounded-xl border border-[#c8a75e]/10">
                        <p className="text-xs text-premium-light mb-1 font-semibold uppercase tracking-wide">Context:</p>
                        <p className="text-premium-light text-sm leading-relaxed line-clamp-2">{text.context}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedTexts.length === 0 && (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 text-premium-light mx-auto mb-4" />
          <p className="text-premium-light">No sacred texts found</p>
        </div>
      )}

      <div className="mt-6 text-center text-premium-light">
        Showing {sortedTexts.length} of {sacredTexts.length} sacred texts
      </div>
    </div>
  )
}
