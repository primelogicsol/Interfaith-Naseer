'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

interface SacredText {
  id: string
  title: string
  source: string
  tradition?: {
    name: string
  }
}

export default function NewShareableQuote() {
  const router = useRouter()
  const [sacredTexts, setSacredTexts] = useState<SacredText[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    quoteText: '',
    backgroundStyle: 'gradient-1',
    sacredTextId: ''
  })

  useEffect(() => {
    loadSacredTexts()
  }, [])

  async function loadSacredTexts() {
    try {
      const response = await fetch('/api/sacred-texts')
      const data = await response.json()
      if (Array.isArray(data)) {
        setSacredTexts(data)
      }
    } catch (err) {
      console.error('Error loading sacred texts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/shareable-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create shareable quote')
      }

      router.push('/admin/shareable-quotes')
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
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
          <p className="text-lg text-premium-light">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/shareable-quotes"
          className="p-2 hover:bg-[#c8a75e]/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#f5f3ee]" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Add Shareable Quote</h1>
          <p className="text-premium-light mt-1 text-sm">Create a new shareable quote card</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20 space-y-6">
        {error && (
          <div className="p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
            <p className="text-[#e74c3c] text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Sacred Text *
          </label>
          <select
            required
            value={formData.sacredTextId}
            onChange={(e) => setFormData({ ...formData, sacredTextId: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
          >
            <option value="">Select a sacred text</option>
            {sacredTexts.map((text) => (
              <option key={text.id} value={text.id}>
                {text.title} - {text.source} {text.tradition ? `(${text.tradition.name})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Quote Text *
          </label>
          <textarea
            required
            value={formData.quoteText}
            onChange={(e) => setFormData({ ...formData, quoteText: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="Enter the quote text for the shareable card..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Background Style
          </label>
          <select
            value={formData.backgroundStyle}
            onChange={(e) => setFormData({ ...formData, backgroundStyle: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
          >
            <option value="gradient-1">Gradient 1</option>
            <option value="gradient-2">Gradient 2</option>
            <option value="gradient-3">Gradient 3</option>
            <option value="solid-dark">Solid Dark</option>
            <option value="solid-light">Solid Light</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {saving ? 'Creating...' : 'Create Quote'}
          </button>
          <Link
            href="/admin/shareable-quotes"
            className="px-3 py-2 sm:px-4 sm:py-2.5 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] rounded-xl hover:bg-[#0b0f2a]/80 transition-all font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
