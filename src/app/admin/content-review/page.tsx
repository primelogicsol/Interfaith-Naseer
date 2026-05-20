'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Loader2, ChevronDown, ChevronRight, Pencil, X, Save } from 'lucide-react'

interface ContentItem {
  id: string
  type: string
  title?: string
  name?: string
  description?: string
  content?: string
  source?: string
  misconception?: string
  truth?: string
  quoteText?: string
  textContent?: string
  theme?: string
  context?: string
  translation?: string
  impact?: string
  icon?: string
  slug?: string
  coreValues?: string[]
  category?: string
  backgroundStyle?: string
  tradition?: { id: string; name: string } | null
  sacredText?: { id: string; title: string } | null
  status: string
  createdAt: string
  rejectionReason?: string
  creator: {
    id: string
    fullName: string
    email: string
  }
}

interface PendingEditItem {
  id: string
  type: string
  status: string
  createdAt: string
  creator: { id: string; fullName: string; email: string }
  contentType: string
  contentId: string
  changes: Record<string, any>
  originalContent: Record<string, any> | null
}

interface PendingContent {
  traditions: ContentItem[]
  teachings: ContentItem[]
  misconceptions: ContentItem[]
  sacredTexts: ContentItem[]
  peaceInitiatives: ContentItem[]
  similarityThemes: ContentItem[]
  shareableQuotes: ContentItem[]
  corePillars: ContentItem[]
  missionContent: ContentItem[]
  wisdomToAction: ContentItem[]
  impactGoals: ContentItem[]
  featuredPrograms: ContentItem[]
  regionalInitiatives: ContentItem[]
  getInvolved: ContentItem[]
  currentInitiatives: ContentItem[]
  aboutContent: ContentItem[]
  aboutValues: ContentItem[]
  aboutLeaders: ContentItem[]
  teachingSections: ContentItem[]
  truthSections: ContentItem[]
  traditionSections: ContentItem[]
  sufiContent: ContentItem[]
  approachContent: ContentItem[]
  sufiCards: ContentItem[]
  approachCards: ContentItem[]
  pendingEdits: PendingEditItem[]
}

type ContentField = { label: string; value: any }

const CONTENT_FIELD_MAP: Record<string, ContentField[]> = {
  traditions: [
    { label: 'Name', value: 'name' },
    { label: 'Description', value: 'description' },
    { label: 'Core Values', value: 'coreValues' },
  ],
  teachings: [
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
    { label: 'Source', value: 'source' },
    { label: 'Category', value: 'category' },
    { label: 'Tradition', value: (i: ContentItem) => i.tradition?.name ?? 'N/A' },
  ],
  misconceptions: [
    { label: 'Misconception', value: 'misconception' },
    { label: 'Truth', value: 'truth' },
    { label: 'Category', value: 'category' },
    { label: 'Tradition', value: (i: ContentItem) => i.tradition?.name ?? 'N/A' },
  ],
  sacred_texts: [
    { label: 'Title', value: 'title' },
    { label: 'Source', value: 'source' },
    { label: 'Text Content', value: 'textContent' },
    { label: 'Theme', value: 'theme' },
    { label: 'Context', value: 'context' },
    { label: 'Translation', value: 'translation' },
    { label: 'Tradition', value: (i: ContentItem) => i.tradition?.name ?? 'N/A' },
  ],
  peace_initiatives: [
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Impact', value: 'impact' },
  ],
  similarity_themes: [
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Icon', value: 'icon' },
    { label: 'Slug', value: 'slug' },
  ],
  shareable_quotes: [
    { label: 'Quote Text', value: 'quoteText' },
    { label: 'Background Style', value: 'backgroundStyle' },
    { label: 'Sacred Text', value: (i: ContentItem) => i.sacredText?.title ?? 'N/A' },
  ],
  core_pillars: [
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Icon', value: 'icon' },
    { label: 'Color', value: 'color' },
  ],
  mission_content: [
    { label: 'Section Key', value: 'sectionKey' },
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ],
  wisdom_to_action: [
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ],
  impact_goals: [
    { label: 'Number', value: 'number' },
    { label: 'Label', value: 'label' },
  ],
  featured_programs: [
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Details', value: 'details' },
    { label: 'Testimonial', value: 'testimonialText' },
  ],
  regional_initiatives: [
    { label: 'Region', value: 'region' },
    { label: 'Initiatives', value: 'initiatives' },
  ],
  get_involved: [
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
  ],
  current_initiatives: [
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Impact', value: 'impact' },
    { label: 'Region', value: 'region' },
  ],
  about_content: [
    { label: 'Section Key', value: 'sectionKey' },
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ],
  about_values: [
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Icon', value: 'icon' },
    { label: 'Color', value: 'color' },
    { label: 'Order', value: 'orderIndex' },
  ],
  about_leaders: [
    { label: 'Name', value: 'name' },
    { label: 'Role', value: 'role' },
    { label: 'Description', value: 'description' },
    { label: 'Order', value: 'orderIndex' },
  ],
  teaching_sections: [
    { label: 'Section Key', value: 'sectionKey' },
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ],
  truth_sections: [
    { label: 'Section Key', value: 'sectionKey' },
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ],
  tradition_sections: [
    { label: 'Section Key', value: 'sectionKey' },
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ],
  sufi_content: [
    { label: 'Section Key', value: 'sectionKey' },
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
    { label: 'Order', value: 'orderIndex' },
  ],
  approach_content: [
    { label: 'Section Key', value: 'sectionKey' },
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
    { label: 'Order', value: 'orderIndex' },
  ],
  sufi_cards: [
    { label: 'Section Type', value: 'sectionType' },
    { label: 'Title', value: 'title' },
    { label: 'Subtitle', value: 'subtitle' },
    { label: 'Description', value: 'description' },
    { label: 'Quote', value: 'quote' },
    { label: 'Icon', value: 'icon' },
    { label: 'Color', value: 'color' },
    { label: 'Order', value: 'orderIndex' },
  ],
  approach_cards: [
    { label: 'Section Type', value: 'sectionType' },
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Features', value: 'features' },
    { label: 'Icon', value: 'icon' },
    { label: 'Color', value: 'color' },
    { label: 'Order', value: 'orderIndex' },
  ],
}

const ALLOWED_EDIT_FIELDS: Record<string, string[]> = {
  traditions: ['name', 'description', 'coreValues'],
  teachings: ['title', 'content', 'source', 'category', 'traditionId'],
  misconceptions: ['misconception', 'truth', 'category', 'traditionId'],
  sacred_texts: ['title', 'source', 'textContent', 'theme', 'context', 'translation', 'traditionId'],
  peace_initiatives: ['title', 'description', 'impact'],
  similarity_themes: ['title', 'description', 'icon', 'slug', 'orderIndex'],
  shareable_quotes: ['quoteText', 'backgroundStyle', 'sacredTextId'],
  core_pillars: ['title', 'description', 'icon', 'color'],
  mission_content: ['sectionKey', 'title', 'content'],
  wisdom_to_action: ['title', 'content'],
  impact_goals: ['number', 'label'],
  featured_programs: ['title', 'description', 'details', 'testimonialText', 'testimonialAuthor'],
  regional_initiatives: ['region', 'initiatives'],
  get_involved: ['title', 'description'],
  current_initiatives: ['title', 'description', 'impact', 'region'],
  about_content: ['sectionKey', 'title', 'content'],
  about_values: ['title', 'description', 'icon', 'color', 'orderIndex'],
  about_leaders: ['name', 'role', 'description', 'image', 'orderIndex'],
  teaching_sections: ['sectionKey', 'title', 'content'],
  truth_sections: ['sectionKey', 'title', 'content'],
  tradition_sections: ['sectionKey', 'title', 'content'],
  sufi_content: ['sectionKey', 'title', 'content', 'orderIndex'],
  approach_content: ['sectionKey', 'title', 'content', 'orderIndex'],
  sufi_cards: ['sectionType', 'title', 'subtitle', 'description', 'quote', 'icon', 'color', 'orderIndex'],
  approach_cards: ['sectionType', 'title', 'description', 'features', 'icon', 'color', 'orderIndex'],
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Title',
  name: 'Name',
  description: 'Description',
  content: 'Content',
  source: 'Source',
  category: 'Category',
  misconception: 'Misconception',
  truth: 'Truth',
  quoteText: 'Quote Text',
  textContent: 'Text Content',
  theme: 'Theme',
  context: 'Context',
  translation: 'Translation',
  impact: 'Impact',
  icon: 'Icon',
  slug: 'Slug',
  coreValues: 'Core Values',
  backgroundStyle: 'Background Style',
  traditionId: 'Tradition',
  sacredTextId: 'Sacred Text',
  orderIndex: 'Order Index',
  sectionKey: 'Section Key',
  number: 'Number',
  label: 'Label',
  details: 'Details',
  testimonialText: 'Testimonial Text',
  testimonialAuthor: 'Testimonial Author',
  region: 'Region',
  initiatives: 'Initiatives',
  image: 'Image',
  subtitle: 'Subtitle',
  quote: 'Quote',
  color: 'Color',
  features: 'Features',
  sectionType: 'Section Type',
}

export default function ContentReviewPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [pendingContent, setPendingContent] = useState<PendingContent | null>(null)
  const [selectedTab, setSelectedTab] = useState<'pending_moderator' | 'pending_admin'>('pending_moderator')

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      setSelectedTab('pending_admin')
    }
  }, [currentUser])
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectItem, setRejectItem] = useState<{ type: string; id: string } | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Record<string, any>>({})
  const [editSaving, setEditSaving] = useState(false)
  const [traditions, setTraditions] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    validateSession()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadPendingContent()
      loadTraditions()
    }
  }, [currentUser])

  async function validateSession() {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login?redirect=/admin/content-review')
        return
      }

      const data = await response.json()
      if (data.user.role !== 'admin' && data.user.role !== 'moderator') {
        router.push('/')
        return
      }

      setCurrentUser(data.user)
    } catch (error) {
      router.push('/login?redirect=/admin/content-review')
    } finally {
      setAuthLoading(false)
    }
  }

  async function loadPendingContent() {
    try {
      const response = await fetch('/api/admin/content/pending')
      const data = await response.json()

      if (response.ok) {
        setPendingContent(data)
      }
    } catch (error) {
      console.error('Error loading pending content:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadTraditions() {
    try {
      const res = await fetch('/api/traditions')
      const data = await res.json()
      if (Array.isArray(data)) setTraditions(data)
    } catch { /* ignore */ }
  }

  function handleEdit(item: ContentItem | PendingEditItem) {
    setEditingId(item.id)
    if (item.type === 'pending_edit') {
      const edit = item as PendingEditItem
      setEditFormData({ ...edit.changes })
    } else {
      const content = item as ContentItem
      const form: Record<string, any> = {}
      const fields = ALLOWED_EDIT_FIELDS[content.type]
      if (fields) {
        for (const f of fields) {
          if (f === 'traditionId') form[f] = (content as any).traditionId || ''
          else if (f === 'sacredTextId') form[f] = (content as any).sacredTextId || ''
          else form[f] = (content as any)[f] ?? ''
        }
      }
      setEditFormData(form)
    }
  }

  function handleEditCancel() {
    setEditingId(null)
    setEditFormData({})
  }

  async function handleEditSave(type: string, id: string) {
    setEditSaving(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/admin/content/${type}/${id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setEditingId(null)
        setEditFormData({})
        loadPendingContent()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save edits' })
    } finally {
      setEditSaving(false)
    }
  }

  async function handleApprove(type: string, id: string) {
    setProcessingId(id)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/content/${type}/${id}/approve`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        loadPendingContent()
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve content' })
    } finally {
      setProcessingId(null)
    }
  }

  function openRejectModal(type: string, id: string) {
    setRejectItem({ type, id })
    setShowRejectModal(true)
    setRejectionReason('')
  }

  async function handleReject() {
    if (!rejectItem || !rejectionReason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a rejection reason' })
      return
    }

    setProcessingId(rejectItem.id)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/content/${rejectItem.type}/${rejectItem.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setShowRejectModal(false)
        setRejectItem(null)
        setRejectionReason('')
        loadPendingContent()
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reject content' })
    } finally {
      setProcessingId(null)
    }
  }

  function getContentTitle(item: ContentItem): string {
    if (item.title) return item.title
    if (item.name) return item.name
    if (item.misconception) return item.misconception
    if (item.quoteText) return item.quoteText.substring(0, 100) + (item.quoteText.length > 100 ? '...' : '')
    if (item.content) return item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '')
    return 'Untitled'
  }

  function getContentTypeName(type: string, item?: ContentItem | PendingEditItem): string {
    if (type === 'pending_edit' && item) {
      return `Edit: ${(item as PendingEditItem).contentType.replace(/_/g, ' ')}`
    }
    return type.replace(/_/g, ' ')
  }

  function getAllPendingItems(): (ContentItem | PendingEditItem)[] {
    if (!pendingContent) return []

    const allItems: (ContentItem | PendingEditItem)[] = [
      ...pendingContent.traditions,
      ...pendingContent.teachings,
      ...pendingContent.misconceptions,
      ...pendingContent.sacredTexts,
      ...pendingContent.peaceInitiatives,
      ...pendingContent.similarityThemes,
      ...pendingContent.shareableQuotes,
      ...pendingContent.corePillars,
      ...pendingContent.missionContent,
      ...pendingContent.wisdomToAction,
      ...pendingContent.impactGoals,
      ...pendingContent.featuredPrograms,
      ...pendingContent.regionalInitiatives,
      ...pendingContent.getInvolved,
      ...pendingContent.currentInitiatives,
      ...pendingContent.aboutContent,
      ...pendingContent.aboutValues,
      ...pendingContent.aboutLeaders,
      ...pendingContent.teachingSections,
      ...pendingContent.truthSections,
      ...pendingContent.traditionSections,
      ...pendingContent.sufiContent,
      ...pendingContent.approachContent,
      ...pendingContent.sufiCards,
      ...pendingContent.approachCards,
      ...pendingContent.pendingEdits,
    ]

    return allItems
      .filter(item => {
        if (selectedTab === 'pending_moderator') {
          return item.status === 'pending_moderator'
        } else {
          return item.status === 'pending_admin'
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  function toggleExpand(id: string) {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function getFieldValue(item: ContentItem, field: ContentField): any {
    if (typeof field.value === 'function') return field.value(item)
    return (item as any)[field.value]
  }

  function renderContentBody(item: ContentItem) {
    const fields = CONTENT_FIELD_MAP[item.type as keyof typeof CONTENT_FIELD_MAP]
    if (!fields) return null

    const isExpanded = expandedItems.has(item.id)

    return (
      <div className="space-y-3">
        <button
          onClick={() => toggleExpand(item.id)}
          className="flex items-center gap-1 text-xs font-semibold text-[#c8a75e] uppercase tracking-wider hover:text-[#d4b56d] transition-colors"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>

        {isExpanded && (
          <div className="bg-[#0b0f2a]/80 rounded-xl border border-[#c8a75e]/10 divide-y divide-[#c8a75e]/5">
            {fields.map((field) => {
              const val = getFieldValue(item, field)
              if (val === null || val === undefined || val === '') return null
              return (
                <div key={field.label} className="px-4 py-3">
                  <span className="block text-xs font-semibold text-[#c8a75e] uppercase tracking-wider mb-1">
                    {field.label}
                  </span>
                  <div className="text-sm text-[#f5f3ee] whitespace-pre-wrap break-words font-mono">
                    {Array.isArray(val) ? val.join(', ') : String(val)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  function renderDiff(item: PendingEditItem) {
    const isExpanded = expandedItems.has(item.id)
    const changes = item.changes
    const original = item.originalContent
    const changedKeys = Object.keys(changes)
    const allowedFields = ALLOWED_EDIT_FIELDS[item.contentType] || []

    return (
      <div className="space-y-3">
        <button
          onClick={() => toggleExpand(item.id)}
          className="flex items-center gap-1 text-xs font-semibold text-[#c8a75e] uppercase tracking-wider hover:text-[#d4b56d] transition-colors"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          {isExpanded
            ? 'Hide Changes'
            : `Show Changes (${changedKeys.length} field${changedKeys.length > 1 ? 's' : ''})`
          }
        </button>

        {isExpanded && (
          <div className="bg-[#0b0f2a]/80 rounded-xl border border-[#c8a75e]/10 overflow-hidden">
            {changedKeys.map((key) => {
              const oldVal = original ? (original as any)[key] : undefined
              const newVal = changes[key]
              const label = FIELD_LABELS[key] || key

              if (oldVal === undefined && newVal !== undefined && newVal !== '') {
                return (
                  <div key={key} className="border-b border-[#c8a75e]/5 last:border-b-0">
                    <div className="px-4 py-2 bg-[#0b1f0b]/50">
                      <span className="text-xs font-semibold text-[#4ade80] uppercase tracking-wider">{label} (added)</span>
                    </div>
                    <pre className="px-4 py-2 text-sm text-[#4ade80] whitespace-pre-wrap break-words font-mono bg-[#0b1f0b]/20">
+ {renderValue(newVal)}
</pre>
                  </div>
                )
              }

              if (oldVal !== undefined && (newVal === undefined || newVal === '')) {
                return (
                  <div key={key} className="border-b border-[#c8a75e]/5 last:border-b-0">
                    <div className="px-4 py-2 bg-[#1f0b0b]/50">
                      <span className="text-xs font-semibold text-[#f87171] uppercase tracking-wider">{label} (removed)</span>
                    </div>
                    <pre className="px-4 py-2 text-sm text-[#f87171] whitespace-pre-wrap break-words font-mono bg-[#1f0b0b]/20">
- {renderValue(oldVal)}
</pre>
                  </div>
                )
              }

              if (String(oldVal) !== String(newVal)) {
                return (
                  <div key={key} className="border-b border-[#c8a75e]/5 last:border-b-0">
                    <div className="px-4 py-2 bg-[#0b0f2a]/50 border-b border-[#c8a75e]/5">
                      <span className="text-xs font-semibold text-[#c8a75e] uppercase tracking-wider">{label}</span>
                    </div>
                    <pre className="px-4 py-2 text-sm text-[#f87171] whitespace-pre-wrap break-words font-mono bg-[#1f0b0b]/20 border-b border-[#c8a75e]/5">
- {renderValue(oldVal)}
</pre>
                    <pre className="px-4 py-2 text-sm text-[#4ade80] whitespace-pre-wrap break-words font-mono bg-[#0b1f0b]/20">
+ {renderValue(newVal)}
</pre>
                  </div>
                )
              }

              return null
            })}
          </div>
        )}
      </div>
    )
  }

  function renderValue(val: any): string {
    if (val === null || val === undefined) return ''
    if (Array.isArray(val)) return val.join(', ')
    return String(val)
  }

  function getEditFields(type: string): { key: string; label: string; multiline: boolean }[] {
    const map: Record<string, { key: string; label: string; multiline: boolean }[]> = {
      traditions: [
        { key: 'name', label: 'Name', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'coreValues', label: 'Core Values (one per line)', multiline: true },
      ],
      teachings: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
        { key: 'source', label: 'Source', multiline: false },
        { key: 'category', label: 'Category', multiline: false },
      ],
      misconceptions: [
        { key: 'misconception', label: 'Misconception', multiline: true },
        { key: 'truth', label: 'Truth', multiline: true },
        { key: 'category', label: 'Category', multiline: false },
      ],
      sacred_texts: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'source', label: 'Source', multiline: false },
        { key: 'textContent', label: 'Text Content', multiline: true },
        { key: 'theme', label: 'Theme', multiline: false },
        { key: 'context', label: 'Context', multiline: true },
        { key: 'translation', label: 'Translation', multiline: true },
      ],
      peace_initiatives: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'impact', label: 'Impact', multiline: true },
      ],
      similarity_themes: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'icon', label: 'Icon', multiline: false },
        { key: 'slug', label: 'Slug', multiline: false },
      ],
      shareable_quotes: [
        { key: 'quoteText', label: 'Quote Text', multiline: true },
        { key: 'backgroundStyle', label: 'Background Style', multiline: false },
      ],
      core_pillars: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'icon', label: 'Icon', multiline: false },
        { key: 'color', label: 'Color', multiline: false },
      ],
      mission_content: [
        { key: 'sectionKey', label: 'Section Key', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
      ],
      wisdom_to_action: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
      ],
      impact_goals: [
        { key: 'number', label: 'Number', multiline: false },
        { key: 'label', label: 'Label', multiline: false },
      ],
      featured_programs: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'details', label: 'Details', multiline: true },
        { key: 'testimonialText', label: 'Testimonial Text', multiline: true },
        { key: 'testimonialAuthor', label: 'Testimonial Author', multiline: false },
      ],
      regional_initiatives: [
        { key: 'region', label: 'Region', multiline: false },
        { key: 'initiatives', label: 'Initiatives', multiline: true },
      ],
      get_involved: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
      ],
      current_initiatives: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'impact', label: 'Impact', multiline: true },
        { key: 'region', label: 'Region', multiline: false },
      ],
      about_content: [
        { key: 'sectionKey', label: 'Section Key', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
      ],
      about_values: [
        { key: 'title', label: 'Title', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'icon', label: 'Icon', multiline: false },
        { key: 'color', label: 'Color', multiline: false },
        { key: 'orderIndex', label: 'Order Index', multiline: false },
      ],
      about_leaders: [
        { key: 'name', label: 'Name', multiline: false },
        { key: 'role', label: 'Role', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'image', label: 'Image', multiline: false },
        { key: 'orderIndex', label: 'Order Index', multiline: false },
      ],
      teaching_sections: [
        { key: 'sectionKey', label: 'Section Key', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
      ],
      truth_sections: [
        { key: 'sectionKey', label: 'Section Key', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
      ],
      tradition_sections: [
        { key: 'sectionKey', label: 'Section Key', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
      ],
      sufi_content: [
        { key: 'sectionKey', label: 'Section Key', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
        { key: 'orderIndex', label: 'Order Index', multiline: false },
      ],
      approach_content: [
        { key: 'sectionKey', label: 'Section Key', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'content', label: 'Content', multiline: true },
        { key: 'orderIndex', label: 'Order Index', multiline: false },
      ],
      sufi_cards: [
        { key: 'sectionType', label: 'Section Type', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'subtitle', label: 'Subtitle', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'quote', label: 'Quote', multiline: true },
        { key: 'icon', label: 'Icon', multiline: false },
        { key: 'color', label: 'Color', multiline: false },
        { key: 'orderIndex', label: 'Order Index', multiline: false },
      ],
      approach_cards: [
        { key: 'sectionType', label: 'Section Type', multiline: false },
        { key: 'title', label: 'Title', multiline: false },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'features', label: 'Features (one per line)', multiline: true },
        { key: 'icon', label: 'Icon', multiline: false },
        { key: 'color', label: 'Color', multiline: false },
        { key: 'orderIndex', label: 'Order Index', multiline: false },
      ],
    }
    return map[type] || []
  }

  function renderEditForm(item: ContentItem | PendingEditItem) {
    const effectiveType = item.type === 'pending_edit' ? (item as PendingEditItem).contentType : item.type
    const fields = getEditFields(effectiveType)

    function updateField(key: string, value: any) {
      setEditFormData(prev => ({ ...prev, [key]: value }))
    }

    return (
      <div className="bg-[#0b0f2a]/80 rounded-xl border border-[#c8a75e]/20 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#c8a75e] uppercase tracking-wider">Editing</span>
          <span className="text-xs text-premium-light">Changes save as pending</span>
        </div>
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-[#aab0d6] uppercase tracking-wider mb-1.5">{f.label}</label>
            {f.key === 'coreValues' ? (
              <textarea
                value={Array.isArray(editFormData[f.key]) ? (editFormData[f.key] as string[]).join('\n') : String(editFormData[f.key] || '')}
                onChange={e => updateField(f.key, e.target.value.split('\n').filter(Boolean))}
                rows={4}
                className="w-full px-3 py-2 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 rounded-lg text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors font-mono resize-y"
              />
            ) : f.multiline ? (
              <textarea
                value={String(editFormData[f.key] || '')}
                onChange={e => updateField(f.key, e.target.value)}
                rows={5}
                className="w-full px-3 py-2 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 rounded-lg text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors font-mono resize-y"
              />
            ) : (
              <input
                type="text"
                value={String(editFormData[f.key] || '')}
                onChange={e => updateField(f.key, e.target.value)}
                className="w-full px-3 py-2 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 rounded-lg text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors font-mono"
              />
            )}
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleEditSave(item.type, item.id)}
            disabled={editSaving}
            className="flex-1 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
          <button
            onClick={handleEditCancel}
            disabled={editSaving}
            className="px-4 py-2 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 text-premium-light rounded-xl hover:bg-[#0b0f2a]/70 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a75e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-premium">Loading content review...</p>
        </div>
      </div>
    )
  }

  const pendingItems = getAllPendingItems()

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#f5f3ee] mb-1 sm:mb-2">Content Review</h1>
        <p className="text-xs sm:text-base text-premium-light">Review and approve pending content submissions</p>
      </div>

      {message && (
        <div
          className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl text-xs sm:text-base ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setSelectedTab('pending_admin')}
            className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold transition-all ${
              selectedTab === 'pending_admin'
                ? 'bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a]'
                : 'bg-[#0b0f2a]/50 border border-[#c8a75e]/20 text-premium-light hover:bg-[#0b0f2a]/70'
            }`}
          >
            Pending Admin Review
          </button>
        )}
        <button
          onClick={() => setSelectedTab('pending_moderator')}
          className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold transition-all ${
            selectedTab === 'pending_moderator'
              ? 'bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a]'
              : 'bg-[#0b0f2a]/50 border border-[#c8a75e]/20 text-premium-light hover:bg-[#0b0f2a]/70'
          }`}
        >
          Pending Moderator Review
        </button>
      </div>

      {/* Content List */}
      <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-[#c8a75e]/20">
        {pendingItems.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-premium-light mx-auto mb-4" />
            <p className="text-premium-light text-lg">No pending content to review</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl p-3 sm:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 flex-wrap">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#c8a75e]/20 text-[#c8a75e] rounded-full text-[10px] sm:text-xs font-semibold uppercase">
                        {getContentTypeName(item.type, item)}
                      </span>
                      <span className="text-[10px] sm:text-xs text-premium-light">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      {'rejectionReason' in item && item.rejectionReason && (
                        <span className="px-1.5 sm:px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-[10px] sm:text-xs font-medium">
                          Previously Rejected
                        </span>
                      )}
                    </div>
                    {item.type !== 'pending_edit' && (
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#f5f3ee] mb-0.5 sm:mb-1 leading-snug">
                        {getContentTitle(item as ContentItem)}
                      </h3>
                    )}
                    <p className="text-[11px] sm:text-sm text-premium-light">
                      {item.type === 'pending_edit' ? 'Edited by' : 'Created by'}: {item.creator.fullName} ({item.creator.email})
                    </p>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                    {editingId !== item.id && (
                      <button
                        onClick={() => handleEdit(item)}
                        disabled={editingId !== null || processingId === item.id}
                        title="Edit"
                        className="px-2 sm:px-4 py-1.5 sm:py-2 bg-[#c8a75e]/20 hover:bg-[#c8a75e]/30 border border-[#c8a75e]/30 text-[#c8a75e] rounded-lg sm:rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleApprove(item.type, item.id)}
                      disabled={editingId === item.id || processingId === item.id}
                      title="Approve"
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg sm:rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      {processingId === item.id ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                    <button
                      onClick={() => openRejectModal(item.type, item.id)}
                      disabled={editingId === item.id || processingId === item.id}
                      title="Reject"
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg sm:rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Reject</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#c8a75e]/10 pt-3 sm:pt-4">
                  {editingId === item.id
                    ? renderEditForm(item)
                    : item.type === 'pending_edit'
                      ? renderDiff(item as PendingEditItem)
                      : renderContentBody(item as ContentItem)
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#f5f3ee] mb-4">Reject Content</h3>
            <p className="text-premium-light mb-4">
              Please provide a reason for rejecting this content:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors resize-none mb-4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || processingId !== null}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId ? 'Rejecting...' : 'Reject Content'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectItem(null)
                  setRejectionReason('')
                }}
                disabled={processingId !== null}
                className="px-3 py-2 sm:px-4 sm:py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 text-premium-light rounded-lg sm:rounded-xl hover:bg-[#0b0f2a]/70 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
