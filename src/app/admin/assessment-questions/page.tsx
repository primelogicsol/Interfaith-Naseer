'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, BookOpen, Save, X } from 'lucide-react'

interface Question {
  id: string
  questionText: string
  category: string
  orderIndex: number
}

const CATEGORIES = [
  { value: 'peace', label: 'Peace & Harmony', color: 'emerald' },
  { value: 'tolerance', label: 'Tolerance & Acceptance', color: 'blue' },
  { value: 'compassion', label: 'Compassion & Love', color: 'rose' },
  { value: 'understanding', label: 'Understanding & Wisdom', color: 'violet' },
  { value: 'hatred', label: 'Inverted (Hatred)', color: 'red' },
]

export default function AssessmentQuestionsManagement() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ questionText: '', category: '', orderIndex: 0 })
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ questionText: '', category: 'peace', orderIndex: 0 })

  useEffect(() => { loadQuestions() }, [])

  async function loadQuestions() {
    try {
      const res = await fetch('/api/assessment/questions')
      const data = await res.json()
      setQuestions(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error loading questions:', e)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit(id: string) {
    const q = questions.find(x => x.id === id)
    if (!q) return
    setEditingId(id)
    setEditForm({ questionText: q.questionText, category: q.category, orderIndex: q.orderIndex })
  }

  function cancelEdit() { setEditingId(null) }

  async function handleSave(id: string) {
    try {
      const res = await fetch(`/api/assessment/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (!res.ok) throw new Error('Failed to update')
      setEditingId(null)
      await loadQuestions()
    } catch (e) {
      console.error('Error saving:', e)
      alert('Failed to save question')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this question?')) return
    try {
      const res = await fetch(`/api/assessment/questions/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setQuestions(questions.filter(q => q.id !== id))
    } catch (e) {
      console.error('Error deleting:', e)
      alert('Failed to delete question')
    }
  }

  async function handleAdd() {
    if (!addForm.questionText.trim() || !addForm.category) return
    try {
      const res = await fetch('/api/assessment/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      })
      if (!res.ok) throw new Error('Failed to create')
      setShowAdd(false)
      setAddForm({ questionText: '', category: 'peace', orderIndex: 0 })
      await loadQuestions()
    } catch (e) {
      console.error('Error creating:', e)
      alert('Failed to create question')
    }
  }

  function cancelAdd() { setShowAdd(false); setAddForm({ questionText: '', category: 'peace', orderIndex: 0 }) }

  function getCategoryBadge(cat: string) {
    const c = CATEGORIES.find(x => x.value === cat)
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-500/20 text-emerald-400',
      blue: 'bg-blue-500/20 text-blue-400',
      rose: 'bg-rose-500/20 text-rose-400',
      violet: 'bg-violet-500/20 text-violet-400',
      red: 'bg-red-500/20 text-red-400',
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[c?.color || 'blue'] || 'bg-blue-500/20 text-blue-400'}`}>
        {c?.label || cat}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Assessment Questions</h1>
          <p className="text-premium-light mt-1 text-sm">Manage faith assessment questions</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm whitespace-nowrap">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      {showAdd && (
        <div className="glass-effect rounded-2xl p-6 border border-[#c8a75e]/20">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#c8a75e]" />
            <span className="text-sm font-medium text-[#f5f3ee]">New Question</span>
          </div>
          <textarea value={addForm.questionText} onChange={e => setAddForm(p => ({ ...p, questionText: e.target.value }))}
            placeholder="Enter question text..."
            className="w-full p-3 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm min-h-[80px] resize-none focus:outline-none focus:border-[#c8a75e]/40" />
          <div className="flex gap-4 mt-3">
            <select value={addForm.category} onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))}
              className="p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <input type="number" value={addForm.orderIndex} onChange={e => setAddForm(p => ({ ...p, orderIndex: parseInt(e.target.value) || 0 }))}
              placeholder="Order"
              className="w-20 p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c8a75e] text-[#0b0f2a] rounded-xl text-sm font-medium hover:bg-[#d4b56d] transition-colors">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={cancelAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b0f2a]/30 text-premium-light rounded-xl text-sm hover:bg-[#0b0f2a]/50 transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="glass-effect rounded-2xl p-5 border border-[#c8a75e]/10">
            {editingId === q.id ? (
              <div>
                <textarea value={editForm.questionText} onChange={e => setEditForm(p => ({ ...p, questionText: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm min-h-[80px] resize-none focus:outline-none focus:border-[#c8a75e]/40" />
                <div className="flex gap-4 mt-3">
                  <select value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                    className="p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <input type="number" value={editForm.orderIndex} onChange={e => setEditForm(p => ({ ...p, orderIndex: parseInt(e.target.value) || 0 }))}
                    placeholder="Order"
                    className="w-20 p-2.5 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleSave(q.id)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c8a75e] text-[#0b0f2a] rounded-xl text-sm font-medium hover:bg-[#d4b56d] transition-colors">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b0f2a]/30 text-premium-light rounded-xl text-sm hover:bg-[#0b0f2a]/50 transition-colors">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-premium-light font-mono">#{q.orderIndex}</span>
                    {getCategoryBadge(q.category)}
                  </div>
                  <p className="text-sm text-[#f5f3ee] line-clamp-2">{q.questionText}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(q.id)} className="p-2 hover:bg-[#c8a75e]/20 rounded-xl transition-colors">
                    <Edit className="w-4 h-4 text-[#c8a75e]" />
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="p-2 hover:bg-red-500/20 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-premium-light mx-auto mb-4" />
          <p className="text-premium-light">No questions yet</p>
        </div>
      )}
    </div>
  )
}
