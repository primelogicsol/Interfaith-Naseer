'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, X } from 'lucide-react'

export default function NewFounderSection() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    slug: '',
    pageTitle: '',
    pageSubtitle: '',
    cardTitle: '',
    cardSubtitle: '',
    cardDescription: [''],
    imagePath: '',
    badgeLabel: '',
    order: 0,
  })

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only JPG/PNG files allowed')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const data = await res.json()
        setForm({ ...form, imagePath: data.url })
        setImagePreview(data.url)
      } else {
        alert('Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/founder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/admin/founder')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create')
      }
    } catch (err) {
      console.error('Error creating:', err)
    } finally {
      setSaving(false)
    }
  }

  function addParagraph() {
    setForm({ ...form, cardDescription: [...form.cardDescription, ''] })
  }

  function removeParagraph(index: number) {
    if (form.cardDescription.length <= 1) return
    setForm({ ...form, cardDescription: form.cardDescription.filter((_, i) => i !== index) })
  }

  function updateParagraph(index: number, value: string) {
    const updated = [...form.cardDescription]
    updated[index] = value
    setForm({ ...form, cardDescription: updated })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 lg:space-y-6">
      <div>
        <Link href="/admin/founder" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Founder Sections
        </Link>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f5f3ee]">New Founder Section</h1>
      </div>

      <form onSubmit={handleSave} className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-premium-light mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" required placeholder="the-originator" />
          </div>
          <div>
            <label className="block text-xs font-medium text-premium-light mb-1">Badge Label</label>
            <input type="text" value={form.badgeLabel} onChange={e => setForm({...form, badgeLabel: e.target.value})} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" placeholder="FOUNDER — BANI" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-premium-light mb-1">Page Title</label>
          <input type="text" value={form.pageTitle} onChange={e => setForm({...form, pageTitle: e.target.value})} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" required />
        </div>

        <div>
          <label className="block text-xs font-medium text-premium-light mb-1">Page Subtitle</label>
          <textarea rows={2} value={form.pageSubtitle} onChange={e => setForm({...form, pageSubtitle: e.target.value})} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-premium-light mb-1">Card Title</label>
            <input type="text" value={form.cardTitle} onChange={e => setForm({...form, cardTitle: e.target.value})} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" />
          </div>
          <div>
            <label className="block text-xs font-medium text-premium-light mb-1">Card Subtitle</label>
            <input type="text" value={form.cardSubtitle} onChange={e => setForm({...form, cardSubtitle: e.target.value})} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-premium-light mb-1">Image (JPG/PNG)</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm text-[#f5f3ee] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#c8a75e]/20 file:text-[#c8a75e] file:text-sm file:font-medium hover:file:bg-[#c8a75e]/30 transition-all"
          />
          {uploading && <p className="text-xs text-[#c8a75e] mt-1">Uploading...</p>}
          {imagePreview && (
            <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-[#c8a75e]/20">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          {form.imagePath && !imagePreview && (
            <p className="text-xs text-premium-light mt-1">Current: {form.imagePath}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-premium-light">Description Paragraphs</label>
            <button type="button" onClick={addParagraph} className="text-xs text-[#c8a75e] hover:text-[#d4b56d] transition-colors">+ Add Paragraph</button>
          </div>
          <div className="space-y-3">
            {form.cardDescription.map((paragraph, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <span className="text-[10px] text-premium-light font-mono block mb-1">Paragraph {index + 1}</span>
                  <textarea
                    rows={3}
                    value={paragraph}
                    onChange={e => updateParagraph(index, e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y"
                  />
                </div>
                {form.cardDescription.length > 1 && (
                  <button type="button" onClick={() => removeParagraph(index)} className="p-1.5 mt-5 hover:bg-red-500/20 rounded-lg transition-colors">
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-premium-light mb-1">Order</label>
          <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 max-w-[100px]" />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium">
            <Save className="w-3 h-3 sm:w-4 sm:h-4" /> {saving ? 'Creating...' : 'Create'}
          </button>
          <Link href="/admin/founder" className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium">
            <X className="w-3 h-3 sm:w-4 sm:h-4" /> Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
