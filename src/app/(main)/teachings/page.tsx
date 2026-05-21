'use client'

import { useState, useEffect } from 'react'
import * as LucideIcons from 'lucide-react'
import { getTeachings, getSimilarityThemes, getTeachingSection } from '@/actions/database'
import Link from 'next/link'
import Pagination from '@/components/Pagination'

function resolveIcon(name: string | null | undefined, fallback: string = 'BookOpen'): React.ComponentType<{ className?: string }> {
  if (!name) return LucideIcons[fallback as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>
  const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }> | undefined
  return Icon || (LucideIcons[fallback as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
}

interface Teaching {
  id: string
  title: string
  content: string
  source: string
  category: string
}

interface SimilarityTheme {
  id: string
  title: string
  description: string
  icon: string
  slug: string
}

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function Teachings() {
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [similarityThemes, setSimilarityThemes] = useState<SimilarityTheme[]>([])
  const [universalMessage, setUniversalMessage] = useState<{ title: string; content: string } | null>(null)
  const [teachingsPage, setTeachingsPage] = useState(1)
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const TEACHINGS_PER_PAGE = 6

  useEffect(() => {
    fetchTeachings()
    fetchSimilarityThemes()
    fetchUniversalMessage()
    fetch('/api/page-content?pageKey=teachings')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPageContent(data))
      .catch(() => {})
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Sacred Wisdom'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Timeless Teachings of'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Love & Unity'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  async function fetchUniversalMessage() {
    const result = await getTeachingSection('universal_message')
    if (result.data && !Array.isArray(result.data)) setUniversalMessage(result.data)
  }

  useEffect(() => {
    setTeachingsPage(1)
  }, [selectedCategory])

  async function fetchTeachings() {
    const result = await getTeachings()
    if (result.data) setTeachings(result.data)
  }

  async function fetchSimilarityThemes() {
    const result = await getSimilarityThemes()
    if (result.data) setSimilarityThemes(result.data)
  }

  const categories = ['all', 'unity', 'love', 'compassion', 'peace']
  const filteredTeachings = selectedCategory === 'all'
    ? teachings
    : teachings.filter(t => t.category === selectedCategory)
  const totalTeachingPages = Math.ceil(filteredTeachings.length / TEACHINGS_PER_PAGE)
  const paginatedTeachings = filteredTeachings.slice(
    (teachingsPage - 1) * TEACHINGS_PER_PAGE,
    teachingsPage * TEACHINGS_PER_PAGE
  )

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <LucideIcons.Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a07b]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">
              {heroBadge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            {heroHeading1}
            <span className="block gradient-text mt-2">{heroHeading2}</span>
          </h1>

          {heroSubtitle && (
            <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-xl font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#C8A75E] text-[#0B0F2A] shadow-lg'
                    : 'bg-[#141A3A] text-[#aab0d6] hover:bg-[#1a1f4a] border border-[#C8A75E]/20'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {paginatedTeachings.map((teaching) => (
              <TeachingCard key={teaching.id} teaching={teaching} />
            ))}
          </div>

          {filteredTeachings.length === 0 && (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <p className="text-sm sm:text-base text-[#aab0d6]/70">No teachings found in this category.</p>
            </div>
          )}

          <Pagination
            currentPage={teachingsPage}
            totalPages={totalTeachingPages}
            onPageChange={setTeachingsPage}
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
              <LucideIcons.Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
              <span className="text-xs sm:text-sm font-semibold text-[#E07070]">
                Universal Wisdom
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
              Similarities Among Faiths
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-premium max-w-3xl mx-auto px-4">
              Discover the profound common ground shared across world religions—
              universal values that unite humanity in our shared spiritual journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            {similarityThemes.map((theme) => (
              <SimilarityThemeCard key={theme.id} theme={theme} />
            ))}
          </div>

          {similarityThemes.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-[#aab0d6]/70">Loading similarities...</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <h2 className="text-lg sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4">
              {universalMessage?.title || 'The Universal Message'}
            </h2>
            <div className="text-sm sm:text-base text-premium leading-relaxed space-y-3 sm:space-y-4 text-left">
              {universalMessage
                ? universalMessage.content.split('\n\n').filter(Boolean).map((p, i, arr) => (
                    <p key={i} className={i === arr.length - 1 ? 'font-semibold text-sm sm:text-base text-[#f5f3ee]' : ''}>
                      {p}
                    </p>
                  ))
                : (
                  <>
                    <p>Throughout history, enlightened teachers from every tradition have shared a common message: that love conquers hatred, compassion heals division, and unity underlies all apparent diversity.</p>
                    <p>These teachings remind us that the path to peace begins within our own hearts. When we cultivate love, understanding, and compassion internally, we naturally extend these qualities to others, regardless of their faith, culture, or background.</p>
                    <p className="font-semibold text-sm sm:text-base text-[#f5f3ee]">May these sacred teachings inspire your journey toward a heart filled with divine love and a life dedicated to peace.</p>
                  </>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function TeachingCard({ teaching }: { teaching: Teaching }) {
  const categoryColors: Record<string, string> = {
    unity: '#C8A75E',
    love: '#E07070',
    compassion: '#27AE60',
    peace: '#9B59B6',
  }

  return (
    <div className="card-premium p-6 sm:p-7 md:p-8 h-full flex flex-col group">
      <div className={`inline-flex self-start px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[#0B0F2A] text-xs font-bold mb-4 sm:mb-5 md:mb-6 shadow-md uppercase tracking-wider`} style={{ backgroundColor: categoryColors[teaching.category] || '#6B7280' }}>
        {teaching.category}
      </div>
      <h3 className="text-lg sm:text-2xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 group-hover:text-[#c8a75e] transition-colors">{teaching.title}</h3>
      <p className="text-sm sm:text-base md:text-lg text-premium mb-4 sm:mb-5 md:mb-6 flex-grow italic leading-relaxed">
        "{teaching.content}"
      </p>
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-[#aab0d6]/80">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#C8A75E] flex items-center justify-center">
          <LucideIcons.BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B0F2A]" />
        </div>
        <span className="font-semibold">{teaching.source}</span>
      </div>
    </div>
  )
}

function SimilarityThemeCard({ theme }: { theme: SimilarityTheme }) {
  const Icon = resolveIcon(theme.icon, 'BookOpen')

  const colors: Record<string, string> = {
    'golden-rule': '#D4A07B',
    'compassion-mercy': '#E07070',
    'prayer-meditation': '#9B59B6',
    'charity-service': '#27AE60',
    'love-unity': '#C8A75E',
    'justice-righteousness': '#5B7FDB',
    'humility-wisdom': '#D4A07B',
    'sacred-hospitality': '#10B981',
  }

  const color = colors[theme.slug] || '#6B7280'

  return (
    <Link
      href={`/teachings/similarities/${theme.slug}`}
      className="card-premium p-6 sm:p-7 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group block"
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg" style={{ backgroundColor: color }}>
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#f5f3ee]" />
      </div>
      <h3 className="text-base sm:text-xl heading-premium text-[#f5f3ee] mb-2 sm:mb-3 group-hover:text-[#c8a75e] transition-colors">{theme.title}</h3>
      <p className="text-premium text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6 leading-relaxed line-clamp-2">{theme.description}</p>
      <div className="flex items-center text-xs sm:text-sm font-bold text-[#C8A75E] group-hover:translate-x-2 transition-transform duration-300">
        Explore teachings
        <LucideIcons.ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-[#C8A75E] group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}
