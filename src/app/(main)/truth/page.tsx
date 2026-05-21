'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Lightbulb, Filter, Search, X, ChevronDown } from 'lucide-react'
import { getTraditions, getMisconceptions, getTruthSection } from '@/actions/database'
import Pagination from '@/components/Pagination'

interface Misconception {
  id: string
  misconception: string
  truth: string
  category?: string | null
  tradition?: { name: string }
}

interface Tradition {
  id: string
  name: string
}

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function Truth() {
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([])
  const [traditions, setTraditions] = useState<Tradition[]>([])
  const [dispellingSection, setDispellingSection] = useState<{ title: string; content: string } | null>(null)
  const [selectedTradition, setSelectedTradition] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const ITEMS_PER_PAGE = 4

  useEffect(() => {
    fetchTraditions()
    fetchMisconceptions()
    fetchDispellingSection()
    fetch('/api/page-content?pageKey=truth')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPageContent(data))
      .catch(() => {})
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Illuminating Truth'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Revealing Truth,'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Dispelling Darkness'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  async function fetchDispellingSection() {
    const result = await getTruthSection('dispelling_misconceptions')
    if (result.data && !Array.isArray(result.data)) setDispellingSection(result.data)
  }

  async function fetchTraditions() {
    const result = await getTraditions()
    if (result.data) setTraditions(result.data)
  }

  async function fetchMisconceptions() {
    const result = await getMisconceptions()
    if (result.data) setMisconceptions(result.data)
  }

  const filteredMisconceptions = misconceptions.filter(item => {
    const matchesTradition = selectedTradition === 'all' ||
      item.tradition?.name === selectedTradition

    const matchesCategory = selectedCategory === 'all' ||
      item.category === selectedCategory

    const matchesSearch = searchQuery === '' ||
      item.misconception.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.truth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tradition?.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTradition && matchesCategory && matchesSearch
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTradition, selectedCategory, searchQuery])

  const totalPages = Math.ceil(filteredMisconceptions.length / ITEMS_PER_PAGE)
  const paginatedMisconceptions = filteredMisconceptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const clearFilters = () => {
    setSelectedTradition('all')
    setSelectedCategory('all')
    setSearchQuery('')
  }

  const hasActiveFilters = selectedTradition !== 'all' ||
    selectedCategory !== 'all' ||
    searchQuery !== ''

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'beliefs', label: 'Beliefs' },
    { id: 'practices', label: 'Practices' },
    { id: 'violence', label: 'Peace' },
    { id: 'women', label: 'Gender' },
    { id: 'culture', label: 'Culture' },
    { id: 'history', label: 'History' },
    { id: 'general', label: 'General' }
  ]

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36  pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="text-xs sm:text-sm font-semibold text-[#D4A07B]">
              {heroBadge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            {heroHeading1}
            <span className="block text-[#C8A75E] mt-2">{heroHeading2}</span>
          </h1>

          {heroSubtitle && (
            <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
              Common Misconceptions & Their Truths
            </h2>
            <div className="divider-premium max-w-xs mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base md:text-lg text-premium max-w-3xl mx-auto px-4">
              Knowledge is the first step toward understanding. When we replace falsehoods with truth,
              prejudice gives way to appreciation.
            </p>
          </div>

          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#aab0d6]/60 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search misconceptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-xl border-2 border-[#aab0d6]/20 focus:border-blue-400 focus:outline-none text-[#aab0d6] bg-[#0b0f2a] shadow-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[#aab0d6]/60 hover:text-[#aab0d6]/80"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base bg-[#0b0f2a] rounded-xl border-2 border-[#aab0d6]/20 hover:border-blue-400 transition-all shadow-sm flex-shrink-0"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold hidden sm:inline">
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </span>
                {hasActiveFilters && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs rounded-full">
                    {(selectedTradition !== 'all' ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="card-premium p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6 overflow-visible z-[1]">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#aab0d6] mb-2 sm:mb-3">
                      Filter by Tradition
                    </label>
                    <SelectDropdown
                      value={selectedTradition}
                      onChange={setSelectedTradition}
                      options={[
                        { value: 'all', label: 'All Traditions' },
                        ...traditions.map(t => ({ value: t.name, label: t.name })),
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#aab0d6] mb-2 sm:mb-3">
                      Filter by Category
                    </label>
                    <SelectDropdown
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      options={categories.map(c => ({ value: c.id, label: c.label }))}
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="text-center">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 text-sm sm:text-base bg-[#1c1f4a] hover:bg-[#1c1f4a] rounded-xl text-[#aab0d6] font-medium transition-colors"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Clear All Filters</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="text-center">
              <p className="text-xs sm:text-sm text-[#aab0d6]/80">
                Showing <span className="font-semibold text-[#f5f3ee]">{filteredMisconceptions.length}</span> of <span className="font-semibold text-[#f5f3ee]">{misconceptions.length}</span> misconceptions
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {paginatedMisconceptions.map((item) => (
              <MisconceptionCard key={item.id} item={item} />
            ))}
          </div>

          {filteredMisconceptions.length === 0 && misconceptions.length > 0 && (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <p className="text-[#aab0d6]/70 text-base sm:text-lg">No misconceptions match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-3 sm:mt-4 text-sm sm:text-base text-[#c8a75e] hover:text-blue-700 font-semibold"
              >
                Clear filters
              </button>
            </div>
          )}

          {misconceptions.length === 0 && (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <p className="text-sm sm:text-base text-[#aab0d6]/70">Loading truth revelations...</p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12">
            <h2 className="text-xl sm:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 text-center px-4">
              {dispellingSection?.title || 'Why Dispelling Misconceptions Matters'}
            </h2>
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base text-premium leading-relaxed">
              {dispellingSection
                ? dispellingSection.content.split('\n\n').filter(Boolean).map((p, i, arr) => (
                    i === arr.length - 1 ? (
                      <div key={i} className="border-t border-[#aab0d6]/20 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
                        <p className="font-semibold text-sm sm:text-base text-[#f5f3ee] text-center">{p}</p>
                      </div>
                    ) : (
                      <p key={i}>{p}</p>
                    )
                  ))
                : (
                  <>
                    <p>Misconceptions are seeds of division. When we believe false narratives about other faiths, we create barriers that prevent genuine connection and understanding. These falsehoods often stem from ignorance, fear, or deliberate distortion rather than authentic knowledge.</p>
                    <p>The Sufi path teaches us to seek knowledge with humility and an open heart. When we approach other traditions with curiosity rather than judgment, we discover profound beauty, wisdom, and shared values that unite rather than divide.</p>
                    <p>By illuminating truth, we don&apos;t just correct errors - we create space for authentic dialogue, mutual respect, and the recognition of our common humanity. This is how we transform hatred into understanding and fear into love.</p>
                    <div className="border-t border-[#aab0d6]/20 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
                      <p className="font-semibold text-sm sm:text-base text-[#f5f3ee] text-center">&quot;The truth will set you free&quot; - not just as a religious ideal, but as a practical path toward peace and interfaith harmony.</p>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function MisconceptionCard({ item }: { item: Misconception }) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      beliefs: 'bg-purple-100 text-purple-700',
      practices: 'bg-blue-100 text-blue-700',
      violence: 'bg-red-100 text-red-700',
      women: 'bg-pink-100 text-pink-700',
      culture: 'bg-green-100 text-green-700',
      history: 'bg-amber-100 text-amber-700',
      general: 'bg-[#1c1f4a] text-[#aab0d6]'
    }
    return colors[category] || colors.general
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      beliefs: 'Beliefs',
      practices: 'Practices',
      violence: 'Peace',
      women: 'Gender',
      culture: 'Culture',
      history: 'History',
      general: 'General'
    }
    return labels[category] || 'General'
  }

  return (
    <div className="gradient-border p-6 sm:p-7 md:p-8 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <span className="text-xs font-semibold px-2 sm:px-3 py-1 rounded-xl bg-[#0b0f2a] text-blue-700 border border-blue-200">
          {item.tradition?.name}
        </span>
        <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-xl ${getCategoryColor(item.category || 'general')}`}>
          {getCategoryLabel(item.category || 'general')}
        </span>
      </div>

      <div className="flex items-start space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-red-100 flex items-center justify-center mt-0.5">
          <span className="text-red-600 text-sm sm:text-base font-bold">✕</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#f5f3ee] mb-2 text-xs sm:text-sm uppercase tracking-wide">Misconception</h4>
          <p className="text-sm sm:text-base text-premium font-medium leading-relaxed">{item.misconception}</p>
        </div>
      </div>

      <div className="divider-premium my-4 sm:my-5"></div>

      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-emerald-100 flex items-center justify-center mt-0.5">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#f5f3ee] mb-2 text-xs sm:text-sm uppercase tracking-wide">Truth</h4>
          <p className="text-sm sm:text-base text-premium leading-relaxed">{item.truth}</p>
        </div>
      </div>
    </div>
  )
}

function SelectDropdown({ value, onChange, options }: {
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
        className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-[#aab0d6]/20 hover:border-blue-400 transition-all bg-[#0b0f2a] text-[#aab0d6] text-left"
      >
        <span>{selected?.label || 'Select...'}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full max-h-[240px] overflow-y-auto bg-[#0b0f2a] border-2 border-[#aab0d6]/20 rounded-xl shadow-xl z-[9999] animate-fadeIn custom-scrollbar">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 sm:px-4 py-2.5 text-sm sm:text-base transition-colors ${
                value === opt.value
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-[#aab0d6] hover:bg-[#aab0d6]/10'
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
