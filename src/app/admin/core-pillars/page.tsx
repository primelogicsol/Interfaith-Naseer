'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, Database } from 'lucide-react'
import ContentSort, { applySort, loadSortSetting, type SortConfig } from '@/components/admin/ContentSort'

interface CorePillar {
  id: string
  title: string
  description: string
  icon: string
  color: string
  created_at: string
}

export default function CorePillarsManagement() {
  const [pillars, setPillars] = useState<CorePillar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', order: 'desc' })

  useEffect(() => {
    loadSortSetting('sort_core_pillars').then(setSortConfig)
  }, [])

  useEffect(() => {
    loadPillars()
  }, [])

  async function loadPillars() {
    try {
      const response = await fetch('/api/core-pillars')
      const data = await response.json()
      if (Array.isArray(data)) {
        setPillars(data)
      } else {
        setPillars([])
      }
    } catch (error) {
      console.error('Error loading pillars:', error)
      setPillars([])
    } finally {
      setLoading(false)
    }
  }

  async function deletePillar(id: string) {
    if (!confirm('Are you sure you want to delete this core pillar?')) return

    try {
      const response = await fetch(`/api/core-pillars/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPillars(pillars.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting pillar:', error)
      alert('Failed to delete pillar')
    }
  }

  const filteredPillars = pillars.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedPillars = applySort(filteredPillars, sortConfig, 'title', 'created_at')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading core pillars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Core Pillars</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage mission core pillar cards</p>
        </div>
        <Link
          href="/admin/core-pillars/new"
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          Add Pillar
        </Link>
      </div>

      {/* Search & Sort */}
      <div className="glass-effect rounded-xl p-4 border border-[#c8a75e]/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-premium-light" />
              <input
                type="text"
                placeholder="Search core pillars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0b0f2a]/20 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] placeholder-premium-light focus:outline-none focus:border-[#c8a75e] transition-colors"
              />
            </div>
            <ContentSort sortConfig={sortConfig} onSortChange={setSortConfig} settingKey="sort_core_pillars" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
          {sortedPillars.map((pillar) => (
            <div key={pillar.id} className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  
                  <div className="flex-1">
                    <div className="text-4xl">{pillar.icon}</div>
                    <h3 className="text-xl font-semibold text-[#f5f3ee] mb-3 truncate">{pillar.title}</h3>
                    <p className="text-premium-light leading-relaxed line-clamp-2">{pillar.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/core-pillars/${pillar.id}`}
                    className="p-2 hover:bg-[#c8a75e]/20 rounded-xl transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[#c8a75e]" />
                  </Link>
                  <button
                    onClick={() => deletePillar(pillar.id)}
                    className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedPillars.length === 0 && (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <Database className="w-16 h-16 text-premium-light mx-auto mb-4" />
            <p className="text-premium-light">No core pillars found</p>
          </div>
        )}

        <div className="mt-6 text-center text-premium-light">
          Showing {sortedPillars.length} of {pillars.length} core pillars
        </div>
    </div>
  )
}
