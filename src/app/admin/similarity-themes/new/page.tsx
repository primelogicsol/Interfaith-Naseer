'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { IconPicker } from '@/components/admin/IconPicker'

export default function NewSimilarityTheme() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Heart',
    color: '#C8A75E',
    slug: '',
    orderIndex: 0,
  })

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/similarity-themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create similarity theme')
      }

      router.push('/admin/similarity-themes')
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/similarity-themes" className="p-2 hover:bg-[#c8a75e]/10 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#f5f3ee]" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Add Similarity Theme</h1>
          <p className="text-premium-light mt-1 text-sm">Create a new similarity theme</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20 space-y-6">
        {error && (
          <div className="p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
            <p className="text-[#e74c3c] text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="e.g., The Golden Rule"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="Describe this similarity theme..."
          />
        </div>

        <IconPicker value={formData.icon} onChange={(icon) => setFormData({ ...formData, icon })} label="Icon" />

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-12 h-12 rounded-xl border border-[#c8a75e]/20 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="flex-1 px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all font-mono"
              placeholder="#C8A75E"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Slug *</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all font-mono"
            placeholder="golden-rule"
          />
          <p className="text-xs text-premium-light mt-1">URL slug. Auto-generated from title.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">Order Index</label>
          <input
            type="number"
            value={formData.orderIndex}
            onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="0"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Creating...' : 'Create Theme'}
          </button>
          <Link
            href="/admin/similarity-themes"
            className="px-6 py-3 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] rounded-xl hover:bg-[#0b0f2a]/80 transition-all font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
