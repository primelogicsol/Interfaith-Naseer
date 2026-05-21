'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Check } from 'lucide-react'

interface SacredText {
  id: string
  title: string
  source: string
  tradition?: {
    name: string
  }
}

const GRADIENT_PRESETS = [
  { id: 'gradient-1', colors: ['#2563eb', '#9333ea', '#ec4899'], label: 'Gradient 1' },
  { id: 'gradient-2', colors: ['#14b8a6', '#059669', '#06b6d4'], label: 'Gradient 2' },
  { id: 'gradient-3', colors: ['#f97316', '#dc2626', '#ec4899'], label: 'Gradient 3' },
  { id: 'gradient-4', colors: ['#4f46e5', '#2563eb', '#14b8a6'], label: 'Gradient 4' },
  { id: 'gradient-5', colors: ['#7c3aed', '#c026d3', '#ec4899'], label: 'Gradient 5' },
  { id: 'gradient-6', colors: ['#16a34a', '#14b8a6', '#2563eb'], label: 'Gradient 6' },
]

function isGradientStyle(val: string) { return val.startsWith('gradient-') }

export default function EditShareableQuote({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [sacredTexts, setSacredTexts] = useState<SacredText[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useCustomColor, setUseCustomColor] = useState(false)
  const [customColor, setCustomColor] = useState('#9B59B6')
  const [formData, setFormData] = useState({
    quoteText: '',
    backgroundStyle: 'gradient-1',
    sacredTextId: ''
  })

  const selectedGradient = GRADIENT_PRESETS.find(g => g.id === formData.backgroundStyle)

  useEffect(() => {
    loadData()
  }, [resolvedParams.id])

  async function loadData() {
    try {
      const [quoteRes, sacredTextsRes] = await Promise.all([
        fetch(`/api/shareable-quotes/${resolvedParams.id}`),
        fetch('/api/sacred-texts')
      ])

      if (!quoteRes.ok) throw new Error('Failed to load shareable quote')

      const quoteData = await quoteRes.json()
      const sacredTextsData = await sacredTextsRes.json()

      const bgStyle = quoteData.backgroundStyle || 'gradient-1'
      const isCustom = !isGradientStyle(bgStyle)
      setFormData({
        quoteText: quoteData.quoteText || '',
        backgroundStyle: bgStyle,
        sacredTextId: quoteData.sacredTextId || ''
      })
      if (isCustom) { setUseCustomColor(true); setCustomColor(bgStyle) }

      if (Array.isArray(sacredTextsData)) {
        setSacredTexts(sacredTextsData)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/shareable-quotes/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update shareable quote')
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
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Edit Shareable Quote</h1>
          <p className="text-premium-light mt-1 text-sm">Update shareable quote details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-4 sm:p-6 border border-[#c8a75e]/20 space-y-6">
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
          <label className="block text-sm font-bold text-[#aab0d6] mb-3 uppercase tracking-wider">
            Background Style
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-3">
            {GRADIENT_PRESETS.map((gradient) => (
              <button
                key={gradient.id}
                type="button"
                onClick={() => { setFormData({ ...formData, backgroundStyle: gradient.id }); setUseCustomColor(false) }}
                className={`relative h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  !useCustomColor && formData.backgroundStyle === gradient.id
                    ? 'border-[#c8a75e] ring-2 ring-[#c8a75e]/30 scale-105'
                    : 'border-[#c8a75e]/20 hover:border-[#c8a75e]/40'
                }`}
                title={gradient.label}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.colors[0]}, ${gradient.colors[1]}, ${gradient.colors[2]})`
                  }}
                />
                {!useCustomColor && formData.backgroundStyle === gradient.id && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomColor}
                onChange={(e) => {
                  setUseCustomColor(e.target.checked)
                  if (e.target.checked) setFormData({ ...formData, backgroundStyle: customColor })
                }}
                className="w-4 h-4 rounded border-[#c8a75e]/30 bg-[#0b0f2a] text-[#c8a75e] focus:ring-[#c8a75e]"
              />
              <span className="text-xs sm:text-sm text-[#aab0d6]">Custom Color</span>
            </label>
            {useCustomColor && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value)
                    setFormData({ ...formData, backgroundStyle: e.target.value })
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#c8a75e]/20 bg-transparent"
                />
                <span className="text-xs text-[#aab0d6] font-mono">{customColor}</span>
              </div>
            )}
          </div>
          <div className="mt-2">
            <div
              className="h-8 rounded-lg border border-[#c8a75e]/20"
              style={{
                background: useCustomColor
                  ? customColor
                  : `linear-gradient(135deg, ${selectedGradient?.colors[0] || '#2563eb'}, ${selectedGradient?.colors[1] || '#9333ea'}, ${selectedGradient?.colors[2] || '#ec4899'})`
              }}
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/shareable-quotes"
            className="flex-1 inline-flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] rounded-xl hover:bg-[#0b0f2a]/80 transition-all font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
