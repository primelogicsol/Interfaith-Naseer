'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { IconPicker } from '@/components/admin/IconPicker'

export default function EditCorePillar({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    color: '',
    status: 'active'
  })

  useEffect(() => {
    loadPillar()
  }, [resolvedParams.id])

  async function loadPillar() {
    try {
      const response = await fetch(`/api/core-pillars/${resolvedParams.id}`)
      if (!response.ok) throw new Error('Failed to load core pillar')

      const data = await response.json()
      setFormData({
        title: data.title || '',
        description: data.description || '',
        icon: data.icon || '',
        color: data.color || '',
        status: data.status || 'active'
      })
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
      const response = await fetch(`/api/core-pillars/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update core pillar')
      }

      router.push('/admin/core-pillars')
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
          <p className="text-lg text-premium-light">Loading core pillar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/core-pillars"
          className="p-2 hover:bg-[#c8a75e]/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#f5f3ee]" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Edit Core Pillar</h1>
          <p className="text-premium-light mt-1 text-sm">Update core pillar details</p>
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
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="e.g., Interfaith Dialogue"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="Describe the core pillar..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IconPicker value={formData.icon} onChange={(v) => setFormData({ ...formData, icon: v })} />

          <div>
            <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color || '#c8a75e'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-14 h-11 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                placeholder="e.g., #c8a75e"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
            href="/admin/core-pillars"
            className="px-6 py-3 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] rounded-xl hover:bg-[#0b0f2a]/80 transition-all font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
