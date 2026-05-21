'use client'

import { useEffect, useState, useRef } from 'react'
import { BookOpen, Search, Filter, Globe, Share2, Heart, ChevronDown } from 'lucide-react'
import { getTraditions, getSacredTexts } from '@/actions/database'
import Pagination from '@/components/Pagination'

interface Tradition {
  id: string
  name: string
  color?: string
  symbol?: string
}

interface SacredText {
  id: string
  title: string
  source: string
  textContent: string
  theme: string
  context: string | null
  translation: string | null
  traditionId?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
  tradition?: Tradition | null
}

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function SacredTextsExplorer() {
  const [allTexts, setAllTexts] = useState<SacredText[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [selectedTradition, setSelectedTradition] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [traditions, setTraditions] = useState<Tradition[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageContent, setPageContent] = useState<PageContent[]>([])

  const ITEMS_PER_PAGE = 6

  const themes = [
    { value: 'all', label: 'All Themes', icon: Globe },
    { value: 'love', label: 'Love & Compassion', icon: Heart },
    { value: 'unity', label: 'Unity', icon: Globe },
    { value: 'peace', label: 'Peace', icon: Heart },
    { value: 'wisdom', label: 'Wisdom', icon: BookOpen },
    { value: 'justice', label: 'Justice', icon: Heart },
    { value: 'service', label: 'Service', icon: Heart },
    { value: 'forgiveness', label: 'Forgiveness', icon: Heart },
  ]

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [traditionsRes, textsRes, pageContentData] = await Promise.all([
        getTraditions(),
        getSacredTexts(),
        fetch('/api/page-content?pageKey=sacred-texts-explorer').then(res => res.ok ? res.json() : []),
      ])

      if (traditionsRes.data) setTraditions(traditionsRes.data)
      if (Array.isArray(pageContentData)) setPageContent(pageContentData)
      if (textsRes.data) setAllTexts(textsRes.data)
    } catch (error) {
      console.error('Error loading sacred texts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTheme, selectedTradition, searchQuery, viewMode])

  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Sacred Texts'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Explorer'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  const filteredTexts = allTexts.filter(text => {
    if (selectedTheme !== 'all' && text.theme !== selectedTheme) return false
    if (selectedTradition !== 'all' && text.tradition?.id !== selectedTradition) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return text.title.toLowerCase().includes(query) ||
             text.textContent.toLowerCase().includes(query) ||
             text.source.toLowerCase().includes(query) ||
             text.tradition?.name.toLowerCase().includes(query)
    }
    return true
  })

  const totalPages = Math.ceil(filteredTexts.length / ITEMS_PER_PAGE)
  const paginatedTexts = filteredTexts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading sacred texts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
            <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gradient-primary" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 px-4">
            <span className="text-gradient-primary">{heroHeading1}</span> {heroHeading2}
          </h1>
          {heroSubtitle && (
            <p className="text-sm sm:text-base md:text-lg text-premium-light max-w-3xl mx-auto leading-relaxed px-4">
              {heroSubtitle}
            </p>
          )}
        </div>

        <div className="glass-effect rounded-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12 relative z-[1]">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-premium-light w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search sacred texts, themes, or traditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#0b0f2a]/5 border border-[#c8a75e]/10 rounded-xl text-[#f5f3ee] placeholder-premium-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#C8A75E] text-[#f5f3ee] shadow-premium'
                    : 'bg-[#0b0f2a]/5 text-premium-light hover:bg-[#0b0f2a]/10'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#C8A75E] text-[#f5f3ee] shadow-premium'
                    : 'bg-[#0b0f2a]/5 text-premium-light hover:bg-[#0b0f2a]/10'
                }`}
              >
                Grid View
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-premium-light">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>

            {themes.map(theme => (
              <button
                key={theme.value}
                onClick={() => setSelectedTheme(theme.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedTheme === theme.value
                    ? 'bg-[#C8A75E] text-[#f5f3ee] shadow-md'
                    : 'bg-[#0b0f2a]/5 text-premium-light hover:bg-[#0b0f2a]/10'
                }`}
              >
                {theme.label}
              </button>
            ))}

            <DropdownSelect
              value={selectedTradition}
              onChange={setSelectedTradition}
              options={[
                { value: 'all', label: 'All Traditions' },
                ...traditions.map(t => ({ value: t.id, label: t.name })),
              ]}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-premium-light">
            <span>
              {filteredTexts.length} text{filteredTexts.length !== 1 ? 's' : ''} found
            </span>
            {(selectedTheme !== 'all' || selectedTradition !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTheme('all')
                  setSelectedTradition('all')
                  setSearchQuery('')
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-6">
            {paginatedTexts.map(text => (
              <ListCard key={text.id} text={text} />
            ))}
            {filteredTexts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-premium-light text-lg">No texts found. Try adjusting your filters.</p>
              </div>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTexts.map(text => (
                <TextCard key={text.id} text={text} />
              ))}
              {filteredTexts.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <p className="text-premium-light text-lg">No texts found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  )
}

function ListCard({ text }: { text: SacredText }) {
  return (
    <div className="glass-effect rounded-xl p-6 sm:p-8 border border-[#c8a75e]/10 hover:border-[#c8a75e]/20 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: text.tradition?.color || '#6b7280' }}
            ></div>
            <span className="text-sm font-medium" style={{ color: text.tradition?.color || '#6b7280' }}>
              {text.tradition?.name}
            </span>
            <span className="ml-auto text-xs px-3 py-1 bg-[#0b0f2a]/5 rounded-full text-premium-light capitalize">
              {text.theme}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#f5f3ee] mb-4">{text.title}</h3>

          <blockquote className="text-premium-light leading-relaxed mb-4 italic text-lg">
            &ldquo;{text.textContent}&rdquo;
          </blockquote>

          <div className="space-y-2 text-sm text-premium-light">
            <p className="font-medium text-[#f5f3ee]">{text.source}</p>
            {text.translation && <p className="text-xs">{text.translation}</p>}
            {text.context && <p className="text-xs mt-2 text-premium-light/80">{text.context}</p>}
          </div>
        </div>

        <div className="shrink-0 flex lg:flex-col gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A75E]/10 hover:bg-[#C8A75E]/20 text-[#c8a75e] transition-colors text-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

function TextCard({ text }: { text: SacredText }) {
  return (
    <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/10 hover:border-[#c8a75e]/20 transition-all hover:-translate-y-2 group">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: text.tradition?.color || '#6b7280' }}
        ></div>
        <span className="text-sm font-medium" style={{ color: text.tradition?.color || '#6b7280' }}>
          {text.tradition?.name}
        </span>
        <span className="ml-auto text-xs px-2 py-1 bg-[#0b0f2a]/5 rounded-full text-premium-light capitalize">
          {text.theme}
        </span>
      </div>

      <h3 className="text-lg font-bold text-[#f5f3ee] mb-3">{text.title}</h3>

      <blockquote className="text-premium-light leading-relaxed mb-4 italic">
        &ldquo;{text.textContent}&rdquo;
      </blockquote>

      <div className="space-y-2 text-sm text-premium-light border-t border-[#c8a75e]/10 pt-4">
        <p className="font-medium text-[#f5f3ee]">{text.source}</p>
        {text.translation && <p className="text-xs">{text.translation}</p>}
        {text.context && <p className="text-xs mt-2 text-premium-light/80">{text.context}</p>}
      </div>

      <button className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm group-hover:translate-x-1">
        <Share2 className="w-4 h-4" />
        Share this teaching
      </button>
    </div>
  )
}

function DropdownSelect({ value, onChange, options }: {
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative z-[9999]" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-[#141A3A] border border-[#c8a75e]/20 rounded-xl text-premium-light text-sm hover:border-[#c8a75e]/40 transition-all"
      >
        <span>{selected?.label || 'All Traditions'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] max-h-[300px] overflow-y-auto bg-[#141A3A] border border-[#c8a75e]/20 rounded-xl shadow-xl z-[9999] animate-fadeIn">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === opt.value
                  ? 'bg-[#C8A75E]/20 text-[#C8A75E]'
                  : 'text-premium-light hover:bg-[#C8A75E]/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
