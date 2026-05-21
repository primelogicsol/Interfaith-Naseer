'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Heart, Globe2, Users, Pencil, Trash2, Plus, X, Check, ArrowLeft } from 'lucide-react'
import ContentSectionEditor from '@/components/ContentSectionEditor'

interface ImpactGoal {
  id: string
  number: string
  label: string
}

interface FeaturedProgram {
  id: string
  title: string
  description: string
  details: any
  testimonialText: string
  testimonialAuthor: string
}

interface RegionalInitiative {
  id: string
  region: string
  initiatives: any
  orderIndex: number
}

interface GetInvolvedItem {
  id: string
  title: string
  description: string
}

interface CurrentInitiative {
  id: string
  category: string
  title: string
  description: string
  stats: string
  event: string
  iconColor: string
  orderIndex: number
}

export default function PeaceInitiativesPageEditor() {
  const [goals, setGoals] = useState<ImpactGoal[]>([])
  const [programs, setPrograms] = useState<FeaturedProgram[]>([])
  const [regionals, setRegionals] = useState<RegionalInitiative[]>([])
  const [getInvolved, setGetInvolved] = useState<GetInvolvedItem[]>([])
  const [currentInitiatives, setCurrentInitiatives] = useState<CurrentInitiative[]>([])
  const [loading, setLoading] = useState(true)

  const [goalsEditingId, setGoalsEditingId] = useState<string | null>(null)
  const [goalsShowAdd, setGoalsShowAdd] = useState(false)
  const [goalsEditForm, setGoalsEditForm] = useState({ number: '', label: '' })
  const [goalsAddForm, setGoalsAddForm] = useState({ number: '', label: '' })
  const [goalsSaving, setGoalsSaving] = useState(false)

  const [programsEditingId, setProgramsEditingId] = useState<string | null>(null)
  const [programsShowAdd, setProgramsShowAdd] = useState(false)
  const [programsEditForm, setProgramsEditForm] = useState({ title: '', description: '', details: '', testimonialText: '', testimonialAuthor: '' })
  const [programsAddForm, setProgramsAddForm] = useState({ title: '', description: '', details: '', testimonialText: '', testimonialAuthor: '' })
  const [programsSaving, setProgramsSaving] = useState(false)

  const [regionalsEditingId, setRegionalsEditingId] = useState<string | null>(null)
  const [regionalsShowAdd, setRegionalsShowAdd] = useState(false)
  const [regionalsEditForm, setRegionalsEditForm] = useState({ region: '', initiatives: '', orderIndex: 0 })
  const [regionalsAddForm, setRegionalsAddForm] = useState({ region: '', initiatives: '', orderIndex: 0 })
  const [regionalsSaving, setRegionalsSaving] = useState(false)

  const [getInvolvedEditingId, setGetInvolvedEditingId] = useState<string | null>(null)
  const [getInvolvedShowAdd, setGetInvolvedShowAdd] = useState(false)
  const [getInvolvedEditForm, setGetInvolvedEditForm] = useState({ title: '', description: '' })
  const [getInvolvedAddForm, setGetInvolvedAddForm] = useState({ title: '', description: '' })
  const [getInvolvedSaving, setGetInvolvedSaving] = useState(false)

  const [ciEditingId, setCiEditingId] = useState<string | null>(null)
  const [ciShowAdd, setCiShowAdd] = useState(false)
  const [ciEditForm, setCiEditForm] = useState({ category: '', title: '', description: '', stats: '', event: '', iconColor: '' })
  const [ciAddForm, setCiAddForm] = useState({ category: '', title: '', description: '', stats: '', event: '', iconColor: '' })
  const [ciSaving, setCiSaving] = useState(false)

  async function fetchAll() {
    try {
      const [gRes, pRes, rRes, giRes, ciRes] = await Promise.all([
        fetch('/api/impact-goals'),
        fetch('/api/featured-programs'),
        fetch('/api/regional-initiatives'),
        fetch('/api/get-involved'),
        fetch('/api/current-initiatives')
      ])
      if (gRes.ok) setGoals(await gRes.json())
      if (pRes.ok) setPrograms(await pRes.json())
      if (rRes.ok) setRegionals(await rRes.json())
      if (giRes.ok) setGetInvolved(await giRes.json())
      if (ciRes.ok) setCurrentInitiatives(await ciRes.json())
    } catch (err) {
      console.error('Error loading peace initiatives page data:', err)
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true)
      await fetchAll()
      setLoading(false)
    }
    load()
  }, [])

  async function handleGoalsEdit(item: ImpactGoal) {
    setGoalsEditingId(item.id)
    setGoalsEditForm({ number: item.number, label: item.label })
  }

  async function handleGoalsSave(id: string) {
    setGoalsSaving(true)
    try {
      const res = await fetch(`/api/impact-goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalsEditForm)
      })
      if (res.ok) {
        setGoalsEditingId(null)
        await fetchAll()
      }
    } catch (err) {
      console.error('Error saving goal:', err)
    } finally {
      setGoalsSaving(false)
    }
  }

  async function handleGoalsDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this impact goal?')) return
    try {
      const res = await fetch(`/api/impact-goals/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchAll()
    } catch (err) {
      console.error('Error deleting goal:', err)
    }
  }

  async function handleGoalsAdd() {
    if (!goalsAddForm.number.trim() || !goalsAddForm.label.trim()) return
    setGoalsSaving(true)
    try {
      const res = await fetch('/api/impact-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalsAddForm)
      })
      if (res.ok) {
        setGoalsShowAdd(false)
        setGoalsAddForm({ number: '', label: '' })
        await fetchAll()
      }
    } catch (err) {
      console.error('Error adding goal:', err)
    } finally {
      setGoalsSaving(false)
    }
  }

  function handleGoalsCancelEdit() {
    setGoalsEditingId(null)
  }

  function handleGoalsCancelAdd() {
    setGoalsShowAdd(false)
    setGoalsAddForm({ number: '', label: '' })
  }

  async function handleProgramsEdit(item: FeaturedProgram) {
    setProgramsEditingId(item.id)
    const detailsStr = typeof item.details === 'object' ? JSON.stringify(item.details, null, 2) : (item.details || '')
    setProgramsEditForm({
      title: item.title,
      description: item.description || '',
      details: detailsStr,
      testimonialText: item.testimonialText || '',
      testimonialAuthor: item.testimonialAuthor || ''
    })
  }

  async function handleProgramsSave(id: string) {
    setProgramsSaving(true)
    let detailsParsed: any = programsEditForm.details
    try {
      if (programsEditForm.details.trim()) {
        detailsParsed = JSON.parse(programsEditForm.details)
      }
    } catch {
      detailsParsed = programsEditForm.details
    }
    try {
      const res = await fetch(`/api/featured-programs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: programsEditForm.title,
          description: programsEditForm.description,
          details: detailsParsed,
          testimonialText: programsEditForm.testimonialText,
          testimonialAuthor: programsEditForm.testimonialAuthor
        })
      })
      if (res.ok) {
        setProgramsEditingId(null)
        await fetchAll()
      }
    } catch (err) {
      console.error('Error saving program:', err)
    } finally {
      setProgramsSaving(false)
    }
  }

  async function handleProgramsDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this program?')) return
    try {
      const res = await fetch(`/api/featured-programs/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchAll()
    } catch (err) {
      console.error('Error deleting program:', err)
    }
  }

  async function handleProgramsAdd() {
    if (!programsAddForm.title.trim()) return
    setProgramsSaving(true)
    let detailsParsed: any = programsAddForm.details
    try {
      if (programsAddForm.details.trim()) {
        detailsParsed = JSON.parse(programsAddForm.details)
      }
    } catch {
      detailsParsed = programsAddForm.details
    }
    try {
      const res = await fetch('/api/featured-programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: programsAddForm.title,
          description: programsAddForm.description,
          details: detailsParsed,
          testimonialText: programsAddForm.testimonialText,
          testimonialAuthor: programsAddForm.testimonialAuthor
        })
      })
      if (res.ok) {
        setProgramsShowAdd(false)
        setProgramsAddForm({ title: '', description: '', details: '', testimonialText: '', testimonialAuthor: '' })
        await fetchAll()
      }
    } catch (err) {
      console.error('Error adding program:', err)
    } finally {
      setProgramsSaving(false)
    }
  }

  function handleProgramsCancelEdit() {
    setProgramsEditingId(null)
  }

  function handleProgramsCancelAdd() {
    setProgramsShowAdd(false)
    setProgramsAddForm({ title: '', description: '', details: '', testimonialText: '', testimonialAuthor: '' })
  }

  async function handleRegionalsEdit(item: RegionalInitiative) {
    setRegionalsEditingId(item.id)
    const initiativesStr = Array.isArray(item.initiatives) ? JSON.stringify(item.initiatives, null, 2) : (item.initiatives || '')
    setRegionalsEditForm({
      region: item.region,
      initiatives: initiativesStr,
      orderIndex: item.orderIndex ?? 0
    })
  }

  async function handleRegionalsSave(id: string) {
    setRegionalsSaving(true)
    let initiativesParsed: any = regionalsEditForm.initiatives
    try {
      if (regionalsEditForm.initiatives.trim()) {
        initiativesParsed = JSON.parse(regionalsEditForm.initiatives)
      }
    } catch {
      initiativesParsed = regionalsEditForm.initiatives
    }
    try {
      const res = await fetch(`/api/regional-initiatives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: regionalsEditForm.region,
          initiatives: initiativesParsed,
          orderIndex: regionalsEditForm.orderIndex
        })
      })
      if (res.ok) {
        setRegionalsEditingId(null)
        await fetchAll()
      }
    } catch (err) {
      console.error('Error saving regional initiative:', err)
    } finally {
      setRegionalsSaving(false)
    }
  }

  async function handleRegionalsDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this regional initiative?')) return
    try {
      const res = await fetch(`/api/regional-initiatives/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchAll()
    } catch (err) {
      console.error('Error deleting regional initiative:', err)
    }
  }

  async function handleRegionalsAdd() {
    if (!regionalsAddForm.region.trim()) return
    setRegionalsSaving(true)
    let initiativesParsed: any = regionalsAddForm.initiatives
    try {
      if (regionalsAddForm.initiatives.trim()) {
        initiativesParsed = JSON.parse(regionalsAddForm.initiatives)
      }
    } catch {
      initiativesParsed = regionalsAddForm.initiatives
    }
    try {
      const res = await fetch('/api/regional-initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: regionalsAddForm.region,
          initiatives: initiativesParsed,
          orderIndex: regionalsAddForm.orderIndex
        })
      })
      if (res.ok) {
        setRegionalsShowAdd(false)
        setRegionalsAddForm({ region: '', initiatives: '', orderIndex: 0 })
        await fetchAll()
      }
    } catch (err) {
      console.error('Error adding regional initiative:', err)
    } finally {
      setRegionalsSaving(false)
    }
  }

  function handleRegionalsCancelEdit() {
    setRegionalsEditingId(null)
  }

  function handleRegionalsCancelAdd() {
    setRegionalsShowAdd(false)
    setRegionalsAddForm({ region: '', initiatives: '', orderIndex: 0 })
  }

  async function handleGetInvolvedEdit(item: GetInvolvedItem) {
    setGetInvolvedEditingId(item.id)
    setGetInvolvedEditForm({ title: item.title, description: item.description })
  }

  async function handleGetInvolvedSave(id: string) {
    setGetInvolvedSaving(true)
    try {
      const res = await fetch(`/api/get-involved/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getInvolvedEditForm)
      })
      if (res.ok) {
        setGetInvolvedEditingId(null)
        await fetchAll()
      }
    } catch (err) {
      console.error('Error saving get involved entry:', err)
    } finally {
      setGetInvolvedSaving(false)
    }
  }

  async function handleGetInvolvedDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this get involved entry?')) return
    try {
      const res = await fetch(`/api/get-involved/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchAll()
    } catch (err) {
      console.error('Error deleting get involved entry:', err)
    }
  }

  async function handleGetInvolvedAdd() {
    if (!getInvolvedAddForm.title.trim() || !getInvolvedAddForm.description.trim()) return
    setGetInvolvedSaving(true)
    try {
      const res = await fetch('/api/get-involved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getInvolvedAddForm)
      })
      if (res.ok) {
        setGetInvolvedShowAdd(false)
        setGetInvolvedAddForm({ title: '', description: '' })
        await fetchAll()
      }
    } catch (err) {
      console.error('Error adding get involved entry:', err)
    } finally {
      setGetInvolvedSaving(false)
    }
  }

  function handleGetInvolvedCancelEdit() {
    setGetInvolvedEditingId(null)
  }

  function handleGetInvolvedCancelAdd() {
    setGetInvolvedShowAdd(false)
    setGetInvolvedAddForm({ title: '', description: '' })
  }

  // Ã¢â€â‚¬Ã¢â€â‚¬ Current Initiatives CRUD Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  function handleCiEdit(item: CurrentInitiative) {
    setCiEditingId(item.id)
    setCiEditForm({ category: item.category, title: item.title, description: item.description, stats: item.stats, event: item.event, iconColor: item.iconColor })
  }

  async function handleCiSave(id: string) {
    setCiSaving(true)
    try {
      const res = await fetch(`/api/current-initiatives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ciEditForm)
      })
      if (res.ok) { setCiEditingId(null); await fetchAll() }
    } catch (err) {
      console.error('Error saving:', err)
    } finally {
      setCiSaving(false)
    }
  }

  async function handleCiDelete(id: string) {
    if (!window.confirm('Are you sure?')) return
    try {
      const res = await fetch(`/api/current-initiatives/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchAll()
    } catch (err) {
      console.error('Error deleting:', err)
    }
  }

  async function handleCiAdd() {
    if (!ciAddForm.title.trim()) return
    setCiSaving(true)
    try {
      const res = await fetch('/api/current-initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ciAddForm)
      })
      if (res.ok) {
        setCiShowAdd(false)
        setCiAddForm({ category: '', title: '', description: '', stats: '', event: '', iconColor: '' })
        await fetchAll()
      }
    } catch (err) {
      console.error('Error adding:', err)
    } finally {
      setCiSaving(false)
    }
  }

  function handleCiCancelEdit() {
    setCiEditingId(null)
  }

  function handleCiCancelAdd() {
    setCiShowAdd(false)
    setCiAddForm({ category: '', title: '', description: '', stats: '', event: '', iconColor: '' })
  }

  function renderField(label: string, value: string, onChange: (v: string) => void, multiline = false) {
    if (multiline) {
      return (
        <div>
          <label className="block text-xs text-premium-light mb-1">{label}</label>
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] placeholder-premium-light/50 focus:outline-none focus:border-[#c8a75e]/50 resize-y min-h-[80px]"
            rows={3}
          />
        </div>
      )
    }
    return (
      <div>
        <label className="block text-xs text-premium-light mb-1">{label}</label>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] placeholder-premium-light/50 focus:outline-none focus:border-[#c8a75e]/50"
        />
      </div>
    )
  }

  function renderEditActions(onSave: () => void, onCancel: () => void, saving?: boolean) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-colors text-xs font-medium disabled:opacity-50"
        >
          {saving ? (
            <div className="w-3.5 h-3.5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          Save
        </button>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-premium-light rounded-xl transition-colors text-xs font-medium"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    )
  }

  function renderActionButtons(onEdit: () => void, onDelete: () => void) {
    return (
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 sm:p-2 hover:bg-[#c8a75e]/20 rounded-lg sm:rounded-xl transition-colors"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8a75e]" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
        </button>
      </div>
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
          <p className="text-lg text-premium-light">Loading Peace Initiatives Page Editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Peace Initiatives Page Editor</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">
          Manage all content for the Peace Initiatives page
        </p>
      </div>

      <div className="grid gap-6">
        {/* Current Initiatives */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg sm:rounded-xl">
                <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Current Initiatives</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 mt-1">
                  {currentInitiatives.length} item{currentInitiatives.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {currentInitiatives.length > 0 ? currentInitiatives.map(item => (
              ciEditingId === item.id ? (
                <div key={item.id} className="p-3 rounded-xl bg-[#0b0f2a]/20">
                  {renderField('Category', ciEditForm.category, v => setCiEditForm(p => ({ ...p, category: v })))}
                  <div className="mt-2">{renderField('Title', ciEditForm.title, v => setCiEditForm(p => ({ ...p, title: v })))}</div>
                  <div className="mt-2">{renderField('Description', ciEditForm.description, v => setCiEditForm(p => ({ ...p, description: v })), true)}</div>
                  <div className="mt-2">{renderField('Stats', ciEditForm.stats, v => setCiEditForm(p => ({ ...p, stats: v })))}</div>
                  <div className="mt-2">{renderField('Event', ciEditForm.event, v => setCiEditForm(p => ({ ...p, event: v })))}</div>
                  <div className="mt-2">
                    <label className="block text-xs text-premium-light mb-1">Icon Color</label>
                    <div className="grid grid-cols-4 gap-2">
                      <input type="color" value={ciEditForm.iconColor || '#c8a75e'} onChange={e => setCiEditForm(p => ({ ...p, iconColor: e.target.value }))}
                        className="col-span-1 w-full h-9 rounded-lg bg-[#0b0f2a]/40 border border-[#c8a75e]/20 cursor-pointer" />
                      <input type="text" value={ciEditForm.iconColor} onChange={e => setCiEditForm(p => ({ ...p, iconColor: e.target.value }))}
                        className="col-span-3 px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg text-[#f5f3ee] placeholder-premium-light/50 focus:outline-none focus:border-[#c8a75e]/50"
                        placeholder="#hex" />
                    </div>
                  </div>
                  {renderEditActions(() => handleCiSave(item.id), handleCiCancelEdit, ciSaving)}
                </div>
              ) : (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 p-3 rounded-xl bg-[#0b0f2a]/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f5f3ee]">{item.title}</p>
                    <p className="text-xs text-premium-light truncate">{item.category} Ã¢â‚¬â€ {item.description.length > 60 ? item.description.slice(0, 60) + '...' : item.description}</p>
                  </div>
                  {renderActionButtons(() => handleCiEdit(item), () => handleCiDelete(item.id))}
                </div>
              )
            )) : (
              <p className="text-sm text-premium-light italic">No current initiatives found</p>
            )}
          </div>
          {ciShowAdd ? (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <div className="p-3 rounded-xl bg-[#0b0f2a]/20">
                <p className="text-xs font-medium text-[#c8a75e] mb-3">Add New Initiative</p>
                {renderField('Category', ciAddForm.category, v => setCiAddForm(p => ({ ...p, category: v })))}
                <div className="mt-2">{renderField('Title', ciAddForm.title, v => setCiAddForm(p => ({ ...p, title: v })))}</div>
                <div className="mt-2">{renderField('Description', ciAddForm.description, v => setCiAddForm(p => ({ ...p, description: v })), true)}</div>
                <div className="mt-2">{renderField('Stats', ciAddForm.stats, v => setCiAddForm(p => ({ ...p, stats: v })))}</div>
                <div className="mt-2">{renderField('Event', ciAddForm.event, v => setCiAddForm(p => ({ ...p, event: v })))}</div>
                <div className="mt-2">
                  <label className="block text-xs text-premium-light mb-1">Icon Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    <input type="color" value={ciAddForm.iconColor || '#c8a75e'} onChange={e => setCiAddForm(p => ({ ...p, iconColor: e.target.value }))}
                      className="col-span-1 w-full h-9 rounded-lg bg-[#0b0f2a]/40 border border-[#c8a75e]/20 cursor-pointer" />
                    <input type="text" value={ciAddForm.iconColor} onChange={e => setCiAddForm(p => ({ ...p, iconColor: e.target.value }))}
                      className="col-span-3 px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg text-[#f5f3ee] placeholder-premium-light/50 focus:outline-none focus:border-[#c8a75e]/50"
                      placeholder="#hex" />
                  </div>
                </div>
                {renderEditActions(handleCiAdd, handleCiCancelAdd, ciSaving)}
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <button onClick={() => setCiShowAdd(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>
          )}
        </div>

        {/* Impact Goals */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg sm:rounded-xl">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Impact Goals</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400 mt-1">
                  {goals.length} goal{goals.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {goals.length > 0 ? goals.map(g => (
              goalsEditingId === g.id ? (
                <div key={g.id} className="p-3 rounded-xl bg-[#0b0f2a]/20">
                  {renderField('Number', goalsEditForm.number, v => setGoalsEditForm(p => ({ ...p, number: v })))}
                  <div className="mt-2">
                    {renderField('Label', goalsEditForm.label, v => setGoalsEditForm(p => ({ ...p, label: v })))}
                  </div>
                  {renderEditActions(() => handleGoalsSave(g.id), handleGoalsCancelEdit, goalsSaving)}
                </div>
              ) : (
                <div key={g.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 p-3 rounded-xl bg-[#0b0f2a]/20">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-[#c8a75e]">{g.number}</span>
                    <span className="text-sm text-premium-light">{g.label}</span>
                  </div>
                  {renderActionButtons(() => handleGoalsEdit(g), () => handleGoalsDelete(g.id))}
                </div>
              )
            )) : (
              <p className="text-sm text-premium-light italic">No impact goals found</p>
            )}
          </div>
          {goalsShowAdd ? (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <div className="p-3 rounded-xl bg-[#0b0f2a]/20">
                <p className="text-xs font-medium text-[#c8a75e] mb-3">Add New Impact Goal</p>
                {renderField('Number', goalsAddForm.number, v => setGoalsAddForm(p => ({ ...p, number: v })))}
                <div className="mt-2">
                  {renderField('Label', goalsAddForm.label, v => setGoalsAddForm(p => ({ ...p, label: v })))}
                </div>
                {renderEditActions(handleGoalsAdd, handleGoalsCancelAdd, goalsSaving)}
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <button
                onClick={() => setGoalsShowAdd(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          )}
        </div>

        {/* Featured Programs */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg sm:rounded-xl">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Featured Programs</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-500/20 text-pink-400 mt-1">
                  {programs.length} program{programs.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {programs.length > 0 ? programs.map(p => (
              programsEditingId === p.id ? (
                <div key={p.id} className="p-3 rounded-xl bg-[#0b0f2a]/20">
                  {renderField('Title', programsEditForm.title, v => setProgramsEditForm(f => ({ ...f, title: v })))}
                  <div className="mt-2">
                    {renderField('Description', programsEditForm.description, v => setProgramsEditForm(f => ({ ...f, description: v })))}
                  </div>
                  <div className="mt-2">
                    {renderField('Details (JSON)', programsEditForm.details, v => setProgramsEditForm(f => ({ ...f, details: v })), true)}
                  </div>
                  <div className="mt-2">
                    {renderField('Testimonial Text', programsEditForm.testimonialText, v => setProgramsEditForm(f => ({ ...f, testimonialText: v })))}
                  </div>
                  <div className="mt-2">
                    {renderField('Testimonial Author', programsEditForm.testimonialAuthor, v => setProgramsEditForm(f => ({ ...f, testimonialAuthor: v })))}
                  </div>
                  {renderEditActions(() => handleProgramsSave(p.id), handleProgramsCancelEdit, programsSaving)}
                </div>
              ) : (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 p-3 rounded-xl bg-[#0b0f2a]/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f5f3ee]">{p.title}</p>
                    <p className="text-xs text-premium-light truncate">
                      {p.description ? (p.description.length > 80 ? p.description.slice(0, 80) + '...' : p.description) : 'No description'}
                    </p>
                  </div>
                  {renderActionButtons(() => handleProgramsEdit(p), () => handleProgramsDelete(p.id))}
                </div>
              )
            )) : (
              <p className="text-sm text-premium-light italic">No featured programs found</p>
            )}
          </div>
          {programsShowAdd ? (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <div className="p-3 rounded-xl bg-[#0b0f2a]/20">
                <p className="text-xs font-medium text-[#c8a75e] mb-3">Add New Featured Program</p>
                {renderField('Title', programsAddForm.title, v => setProgramsAddForm(f => ({ ...f, title: v })))}
                <div className="mt-2">
                  {renderField('Description', programsAddForm.description, v => setProgramsAddForm(f => ({ ...f, description: v })))}
                </div>
                <div className="mt-2">
                  {renderField('Details (JSON)', programsAddForm.details, v => setProgramsAddForm(f => ({ ...f, details: v })), true)}
                </div>
                <div className="mt-2">
                  {renderField('Testimonial Text', programsAddForm.testimonialText, v => setProgramsAddForm(f => ({ ...f, testimonialText: v })))}
                </div>
                <div className="mt-2">
                  {renderField('Testimonial Author', programsAddForm.testimonialAuthor, v => setProgramsAddForm(f => ({ ...f, testimonialAuthor: v })))}
                </div>
                {renderEditActions(handleProgramsAdd, handleProgramsCancelAdd, programsSaving)}
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <button
                onClick={() => setProgramsShowAdd(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          )}
        </div>

        {/* Regional Initiatives */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg sm:rounded-xl">
                <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Regional Initiatives</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/20 text-teal-400 mt-1">
                  {regionals.length} region{regionals.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {regionals.length > 0 ? regionals.map(r => (
              regionalsEditingId === r.id ? (
                <div key={r.id} className="p-3 rounded-xl bg-[#0b0f2a]/20">
                  {renderField('Region', regionalsEditForm.region, v => setRegionalsEditForm(f => ({ ...f, region: v })))}
                  <div className="mt-2">
                    {renderField('Initiatives (JSON array)', regionalsEditForm.initiatives, v => setRegionalsEditForm(f => ({ ...f, initiatives: v })), true)}
                  </div>
                  <div className="mt-2">
                    <div>
                      <label className="block text-xs text-premium-light mb-1">Order Index</label>
                      <input
                        type="number"
                        value={regionalsEditForm.orderIndex}
                        onChange={e => setRegionalsEditForm(f => ({ ...f, orderIndex: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50"
                      />
                    </div>
                  </div>
                  {renderEditActions(() => handleRegionalsSave(r.id), handleRegionalsCancelEdit, regionalsSaving)}
                </div>
              ) : (
                <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 p-3 rounded-xl bg-[#0b0f2a]/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f5f3ee]">{r.region}</p>
                    <p className="text-xs text-premium-light truncate">
                      {Array.isArray(r.initiatives) ? `${r.initiatives.length} initiative${r.initiatives.length !== 1 ? 's' : ''}` : (r.initiatives ? String(r.initiatives).slice(0, 80) : 'No initiatives')}
                    </p>
                  </div>
                  {renderActionButtons(() => handleRegionalsEdit(r), () => handleRegionalsDelete(r.id))}
                </div>
              )
            )) : (
              <p className="text-sm text-premium-light italic">No regional initiatives found</p>
            )}
          </div>
          {regionalsShowAdd ? (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <div className="p-3 rounded-xl bg-[#0b0f2a]/20">
                <p className="text-xs font-medium text-[#c8a75e] mb-3">Add New Regional Initiative</p>
                {renderField('Region', regionalsAddForm.region, v => setRegionalsAddForm(f => ({ ...f, region: v })))}
                <div className="mt-2">
                  {renderField('Initiatives (JSON array)', regionalsAddForm.initiatives, v => setRegionalsAddForm(f => ({ ...f, initiatives: v })), true)}
                </div>
                <div className="mt-2">
                  <div>
                    <label className="block text-xs text-premium-light mb-1">Order Index</label>
                    <input
                      type="number"
                      value={regionalsAddForm.orderIndex}
                      onChange={e => setRegionalsAddForm(f => ({ ...f, orderIndex: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 text-sm bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50"
                    />
                  </div>
                </div>
                {renderEditActions(handleRegionalsAdd, handleRegionalsCancelAdd, regionalsSaving)}
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <button
                onClick={() => setRegionalsShowAdd(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          )}
        </div>

        {/* Get Involved */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Get Involved</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 mt-1">
                  {getInvolved.length} item{getInvolved.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {getInvolved.length > 0 ? getInvolved.map(item => (
              getInvolvedEditingId === item.id ? (
                <div key={item.id} className="p-3 rounded-xl bg-[#0b0f2a]/20">
                  {renderField('Title', getInvolvedEditForm.title, v => setGetInvolvedEditForm(p => ({ ...p, title: v })))}
                  <div className="mt-2">
                    {renderField('Description', getInvolvedEditForm.description, v => setGetInvolvedEditForm(p => ({ ...p, description: v })), true)}
                  </div>
                  {renderEditActions(() => handleGetInvolvedSave(item.id), handleGetInvolvedCancelEdit, getInvolvedSaving)}
                </div>
              ) : (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 p-3 rounded-xl bg-[#0b0f2a]/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f5f3ee]">{item.title}</p>
                    <p className="text-xs text-premium-light truncate">
                      {item.description.length > 100 ? item.description.slice(0, 100) + '...' : item.description}
                    </p>
                  </div>
                  {renderActionButtons(() => handleGetInvolvedEdit(item), () => handleGetInvolvedDelete(item.id))}
                </div>
              )
            )) : (
              <p className="text-sm text-premium-light italic">No get involved entries found</p>
            )}
          </div>
          {getInvolvedShowAdd ? (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <div className="p-3 rounded-xl bg-[#0b0f2a]/20">
                <p className="text-xs font-medium text-[#c8a75e] mb-3">Add New Get Involved Entry</p>
                {renderField('Title', getInvolvedAddForm.title, v => setGetInvolvedAddForm(p => ({ ...p, title: v })))}
                <div className="mt-2">
                  {renderField('Description', getInvolvedAddForm.description, v => setGetInvolvedAddForm(p => ({ ...p, description: v })), true)}
                </div>
                {renderEditActions(handleGetInvolvedAdd, handleGetInvolvedCancelAdd, getInvolvedSaving)}
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#c8a75e]/10">
              <button
                onClick={() => setGetInvolvedShowAdd(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          )}
        </div>
      </div>

      <ContentSectionEditor pageKey="peace-initiatives" />
    </div>
  )
}
