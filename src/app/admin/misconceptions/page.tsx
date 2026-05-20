'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, AlertCircle } from 'lucide-react'
import ContentSort, { applySort, loadSortSetting, type SortConfig } from '@/components/admin/ContentSort'

interface Misconception {
  id: string
  misconception: string
  truth: string
  explanation: string
  tradition_id: string
  created_at: string
  traditions: {
    name: string
    color: string
    symbol: string
  }
}

export default function MisconceptionsManagement() {
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', order: 'desc' })

  useEffect(() => {
    loadSortSetting('sort_misconceptions').then(setSortConfig)
  }, [])

  useEffect(() => {
    loadMisconceptions()
  }, [])

  async function loadMisconceptions() {
    try {
      const response = await fetch('/api/misconceptions')
      const data = await response.json()
      if (Array.isArray(data)) {
        setMisconceptions(data)
      } else {
        setMisconceptions([])
      }
    } catch (error) {
      console.error('Error loading misconceptions:', error)
      setMisconceptions([])
    } finally {
      setLoading(false)
    }
  }

  async function deleteMisconception(id: string) {
    if (!confirm('Are you sure you want to delete this misconception?')) return

    try {
      const response = await fetch(`/api/misconceptions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMisconceptions(misconceptions.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error('Error deleting misconception:', error)
      alert('Failed to delete misconception')
    }
  }

  const filteredMisconceptions = misconceptions.filter(m =>
    m.misconception.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.truth.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.traditions?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedMisconceptions = applySort(filteredMisconceptions, sortConfig, 'misconception', 'created_at')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading misconceptions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Misconceptions</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage common misconceptions and truths</p>
        </div>
        <Link
          href="/admin/misconceptions/new"
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          Add Misconception
        </Link>
      </div>

      {/* Search & Sort */}
      <div className="glass-effect rounded-xl p-4 border border-[#c8a75e]/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-premium-light" />
            <input
              type="text"
              placeholder="Search misconceptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] placeholder-premium-light focus:outline-none focus:border-[#c8a75e] transition-colors"
            />
          </div>
          <ContentSort sortConfig={sortConfig} onSortChange={setSortConfig} settingKey="sort_misconceptions" />
        </div>
      </div>

      {/* Misconceptions Grid */}
      <div className="grid gap-4">
        {sortedMisconceptions.map((misconception) => (
          <div key={misconception.id} className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* <div className="text-4xl">{misconception.traditions?.symbol || '🌍'}</div> */}
                <div className="flex-1">
                  {/* <div> */}
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <span
                      className="px-3 py-1 rounded-xl text-sm font-medium border"
                      style={{
                        backgroundColor: misconception.traditions ? `${misconception.traditions.color}20` : '#c8a75e20',
                        color: misconception.traditions?.color || '#c8a75e',
                        borderColor: misconception.traditions ? `${misconception.traditions.color}40` : '#c8a75e40'
                      }}
                    >
                      {misconception.traditions?.name || 'Universal'}
                    </span>

                      {/* Delete And Edit Buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/misconceptions/${misconception.id}`}
                        className="p-2 hover:bg-[#c8a75e]/20 rounded-xl transition-colors"
                      >
                        <Edit className="w-4 h-4 text-[#c8a75e]" />
                      </Link>
                      <button
                        onClick={() => deleteMisconception(misconception.id)}
                        className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>


                  </div>

                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-400 font-medium mb-1">Misconception:</p>
                        <p className="text-[#f5f3ee] line-clamp-2">{misconception.misconception}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-sm text-green-400 font-medium mb-1">Truth:</p>
                    <p className="text-[#f5f3ee] line-clamp-2">{misconception.truth}</p>
                  </div>

                  <div className="p-4 bg-[#0b0f2a]/30 rounded-xl">
                    <p className="text-sm text-premium-light font-medium mb-1">Explanation:</p>
                    <p className="text-[#f5f3ee] line-clamp-3">{misconception.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedMisconceptions.length === 0 && (
        <div className="glass-effect rounded-xl p-12 text-center border border-[#c8a75e]/20">
          <AlertCircle className="w-16 h-16 text-premium-light mx-auto mb-4" />
          <p className="text-premium-light">No misconceptions found</p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="text-center text-premium-light text-sm">
        Showing {sortedMisconceptions.length} of {misconceptions.length} misconceptions
      </div>
    </div>
  )
}
