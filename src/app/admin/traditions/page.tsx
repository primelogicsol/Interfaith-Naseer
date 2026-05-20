'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import ContentSort, { applySort, loadSortSetting, type SortConfig } from '@/components/admin/ContentSort'
import BulkUpload from '@/components/admin/BulkUpload'

interface Tradition {
  id: string
  name: string
  description: string
  symbol: string
  color: string
  core_values: string[]
  created_at: string
}

export default function TraditionsManagement() {
  const [traditions, setTraditions] = useState<Tradition[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', order: 'desc' })

  useEffect(() => {
    loadSortSetting('sort_traditions').then(setSortConfig)
  }, [])

  useEffect(() => {
    loadTraditions()
  }, [])

  async function loadTraditions() {
    try {
      const response = await fetch('/api/traditions')
      const data = await response.json()
      if (Array.isArray(data)) {
        setTraditions(data)
      } else {
        setTraditions([])
      }
    } catch (error) {
      console.error('Error loading traditions:', error)
      setTraditions([])
    } finally {
      setLoading(false)
    }
  }

  async function deleteTradition(id: string) {
    if (!confirm('Are you sure you want to delete this tradition?')) return

    try {
      const response = await fetch(`/api/traditions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTraditions(traditions.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting tradition:', error)
      alert('Failed to delete tradition')
    }
  }

  const filteredTraditions = traditions.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedTraditions = applySort(filteredTraditions, sortConfig, 'name', 'created_at')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading traditions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Traditions</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage faith traditions and religions</p>
        </div>
        <Link
          href="/admin/traditions/new"
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          Add Tradition
        </Link>
        <BulkUpload type="traditions" onComplete={loadTraditions} />
      </div>

      {/* Search & Sort */}
      <div className="glass-effect rounded-xl p-4 border border-[#c8a75e]/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-premium-light" />
            <input
              type="text"
              placeholder="Search traditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] placeholder-premium-light focus:outline-none focus:border-[#c8a75e] transition-colors"
            />
          </div>
          <ContentSort sortConfig={sortConfig} onSortChange={setSortConfig} settingKey="sort_traditions" />
        </div>
      </div>

      {/* Table */}
      <div className="glass-effect rounded-xl overflow-hidden border border-[#c8a75e]/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[#0b0f2a]/50 border-b border-[#c8a75e]/20">
              <tr>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Symbol</th> */}
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Description</th>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Core Values</th> */}
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#f5f3ee]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8a75e]/10">
              {sortedTraditions.map((tradition) => (
                <tr key={tradition.id} className="hover:bg-[#c8a75e]/5 transition-colors">
                  {/* <td className="px-6 py-4">
                    <span className="text-3xl">{tradition.symbol}</span>
                  </td> */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#f5f3ee] truncate max-w-xs" style={{ color: tradition.color }}>
                      {tradition.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-premium-light text-sm line-clamp-2 max-w-md">
                      {tradition.description}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {tradition.core_values?.slice(0, 3).map((value, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#c8a75e]/10 border border-[#c8a75e]/20 rounded text-xs text-premium-light"
                        >
                          {value}
                        </span>
                      ))}
                      {tradition.core_values?.length > 3 && (
                        <span className="px-2 py-1 text-xs text-premium-light">
                          +{tradition.core_values.length - 3}
                        </span>
                      )}
                    </div>
                  </td> */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/traditions/${tradition.id}`}
                        className="p-2 hover:bg-[#c8a75e]/20 rounded-xl transition-colors"
                      >
                        <Edit className="w-4 h-4 text-[#c8a75e]" />
                      </Link>
                      <button
                        onClick={() => deleteTradition(tradition.id)}
                        className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedTraditions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-premium-light">No traditions found</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="text-center text-premium-light text-sm">
        Showing {sortedTraditions.length} of {traditions.length} traditions
      </div>
    </div>
  )
}
