'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Share2, Plus, Edit, Trash2, TrendingUp } from 'lucide-react'
import ContentSort, { applySort, loadSortSetting, type SortConfig } from '@/components/admin/ContentSort'

interface ShareableQuote {
  id: string
  quoteText: string
  backgroundStyle: string
  shareCount: number
  sacredText: {
    title: string
    source: string
    tradition?: {
      name: string
      symbol: string
    }
  }
}

export default function ShareableQuotesManagement() {
  const [quotes, setQuotes] = useState<ShareableQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', order: 'desc' })

  useEffect(() => {
    loadSortSetting('sort_shareable_quotes').then(setSortConfig)
  }, [])

  useEffect(() => {
    loadQuotes()
  }, [])

  async function loadQuotes() {
    try {
      const response = await fetch('/api/shareable-quotes?sortBy=popular')
      const data = await response.json()
      if (Array.isArray(data)) {
        setQuotes(data)
      } else {
        setQuotes([])
      }
    } catch (error) {
      console.error('Error loading quotes:', error)
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }

  async function deleteQuote(id: string) {
    if (!confirm('Are you sure you want to delete this shareable quote?')) return

    try {
      const response = await fetch(`/api/shareable-quotes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setQuotes(quotes.filter(q => q.id !== id))
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
      alert('Failed to delete quote')
    }
  }

  const totalShares = quotes.reduce((sum, q) => sum + q.shareCount, 0)

  const sortedQuotes = applySort(quotes, sortConfig, 'quoteText', 'created_at')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading shareable quotes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Shareable Quotes</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage social media quote cards</p>
        </div>
        <Link
          href="/admin/shareable-quotes/new"
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          Add Quote
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
        <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-[#f5f3ee] mb-2">{quotes.length}</div>
            <div className="text-premium-light">Total Quotes</div>
          </div>
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <div className="text-3xl font-bold text-green-400">{totalShares}</div>
            </div>
            <div className="text-premium-light">Total Shares</div>
          </div>
        </div>

        <div className="flex justify-end">
          <ContentSort sortConfig={sortConfig} onSortChange={setSortConfig} settingKey="sort_shareable_quotes" />
        </div>

        <div className="grid gap-6">
          {sortedQuotes.map((quote) => (
            <div key={quote.id} className="glass-effect rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl">{quote.sacredText.tradition?.symbol || '🌍'}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl text-sm">
                        {quote.sacredText.tradition?.name || 'Universal'}
                      </span>
                      <span className="text-premium-light text-sm">{quote.sacredText.source}</span>
                      <div className="flex items-center gap-1 text-premium-light text-sm ml-auto">
                        <Share2 className="w-4 h-4" />
                        <span className="font-semibold">{quote.shareCount}</span>
                        <span>shares</span>
                      </div>
                    </div>
                    <div className="p-4 bg-[#0b0f2a]/30 rounded-xl mb-3">
                      <p className="text-[#f5f3ee] text-lg italic line-clamp-3">"{quote.quoteText}"</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-premium-light text-sm">Background:</span>
                      <span className="px-2 py-1 bg-[#0b0f2a]/20 rounded text-xs text-[#f5f3ee]">
                        {quote.backgroundStyle}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/shareable-quotes/${quote.id}`}
                    className="p-2 hover:bg-[#c8a75e]/20 rounded-xl transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[#c8a75e]" />
                  </Link>
                  <button
                    onClick={() => deleteQuote(quote.id)}
                    className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedQuotes.length === 0 && (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <Share2 className="w-16 h-16 text-premium-light mx-auto mb-4" />
            <p className="text-premium-light">No shareable quotes found</p>
          </div>
        )}
    </div>
  )
}
