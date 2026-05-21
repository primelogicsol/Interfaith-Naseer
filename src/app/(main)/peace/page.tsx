'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Heart } from 'lucide-react'
import Link from 'next/link'
import { getPeaceInitiatives } from '@/actions/database'
import Pagination from '@/components/Pagination'

interface PeaceInitiative {
  id: string
  title: string
  description: string
  impact: string
  status: string | null
  createdAt?: Date | null
}

interface WisdomToActionItem {
  id: string
  title: string
  content: string
}

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function Peace() {
  const [peaceInitiatives, setPeaceInitiatives] = useState<PeaceInitiative[]>([])
  const [loaded, setLoaded] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [wisdomData, setWisdomData] = useState<WisdomToActionItem | null>(null)
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const ITEMS_PER_PAGE = 4

  useEffect(() => {
    fetchInitiatives()
    fetchWisdomToAction()
    fetch('/api/page-content?pageKey=peace')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPageContent(data))
      .catch(() => {})
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Building Peace Together'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Our'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Peace Work'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  async function fetchInitiatives() {
    setFetchError(null)
    try {
      const result = await getPeaceInitiatives()
      if (result.data) {
        setPeaceInitiatives(result.data)
      }
      if (result.error) {
        setFetchError(result.error)
      }
    } catch (err) {
      setFetchError('Failed to load peace initiatives')
    } finally {
      setLoaded(true)
    }
  }

  async function fetchWisdomToAction() {
    try {
      const res = await fetch('/api/wisdom-to-action')
      if (res.ok) {
        const data: WisdomToActionItem[] = await res.json()
        if (data.length > 0) setWisdomData(data[0])
      }
    } catch (err) {
      console.error('Failed to load wisdom to action:', err)
    }
  }

  const totalPages = Math.ceil(peaceInitiatives.length / ITEMS_PER_PAGE)
  const paginatedInitiatives = peaceInitiatives.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
            <span className="text-xs sm:text-sm font-semibold text-[#E07070]">{heroBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight">
            {heroHeading1} <span className="text-[#C8A75E]">{heroHeading2}</span>
          </h1>
          {heroSubtitle && (
            <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl heading-premium text-[#f5f3ee] mb-4">Active Initiatives</h2>
            <div className="divider-premium max-w-xs mx-auto"></div>
          </div>

          {fetchError && (
            <div className="text-center mb-8 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <p className="text-red-400 text-sm">{fetchError}</p>
            </div>
          )}

          {!loaded ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {paginatedInitiatives.length > 0 ? (
                  paginatedInitiatives.map((initiative) => (
                    <InitiativeCard key={initiative.id} initiative={initiative} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <Heart className="w-16 h-16 mx-auto mb-6 text-[#c8a75e]/40" />
                    <p className="text-xl text-premium">No initiatives found</p>
                    <p className="text-premium-light mt-2">Check back soon for upcoming peace initiatives.</p>
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
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12">
            <h2 className="text-xl sm:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 text-center px-4">
              {wisdomData?.title || 'The Path from Wisdom to Action'}
            </h2>
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base text-premium leading-relaxed">
              {wisdomData ? (
                wisdomData.content.split('\n\n').filter(Boolean).map((p, i, arr) => {
                  if (i === arr.length - 1) {
                    return (
                      <div key={i} className="border-t border-[#aab0d6]/20 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
                        <p className="font-semibold text-sm sm:text-base text-[#f5f3ee] text-center">{p}</p>
                      </div>
                    )
                  }
                  return <p key={i}>{p}</p>
                })
              ) : (
                <>
                  <p>
                    Sufi wisdom teaches that spiritual knowledge must be lived, not merely contemplated.
                    True understanding of divine love manifests in service, compassion, and active peacemaking.
                    Our initiatives embody this principle, translating ancient wisdom into modern action.
                  </p>
                  <p>
                    Each initiative is designed to address a specific barrier to interfaith harmony - whether
                    it&apos;s lack of personal connection, educational gaps, or absence of collaborative spaces.
                    By creating opportunities for genuine encounter and shared purpose, we help people move
                    beyond abstract tolerance to authentic friendship.
                  </p>
                  <p>
                    The impact extends far beyond statistics. When a Christian and a Muslim build a community
                    garden together, when a Hindu and a Jew share their family&apos;s migration stories, when a
                    Buddhist and a Sufi meditate side by side - these moments transform hearts and ripple
                    outward to transform communities.
                  </p>
                  <div className="border-t border-[#aab0d6]/20 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
                    <p className="font-semibold text-sm sm:text-base text-[#f5f3ee] text-center">
                      Peace is not merely the absence of conflict - it is the active presence of understanding,
                      compassion, and recognition of our shared humanity.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 section-premium">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-border p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <div className="pulse-glow inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#27AE60] mb-4 sm:mb-6">
              <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 text-[#f5f3ee]" />
            </div>
            <h2 className="text-lg sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4">
              Join Our Peace Movement
            </h2>
            <p className="text-xs sm:text-lg md:text-xl text-premium mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Every act of understanding, every bridge built, every heart opened contributes to a more
              peaceful world. Be part of this transformation.
            </p>
            <Link href="/join" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 inline-flex items-center">
              <span>Get Involved</span>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function InitiativeCard({ initiative }: { initiative: PeaceInitiative }) {
  const statusColors: Record<string, string> = {
    active: 'bg-[#27AE60] text-[#f5f3ee]',
    completed: 'bg-[#C8A75E] text-[#f5f3ee]',
    planned: 'bg-[#D4A07B] text-[#f5f3ee]',
  }

  return (
    <div className="event-card p-6 sm:p-8 md:p-10 group flex flex-col h-full">

      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-5 md:mb-6 gap-3">

        <h3 className="text-xl md:text-3xl heading-premium text-[#f5f3ee] 
        group-hover:text-[#c8a75e] transition-colors 
        min-h-[3.5rem] flex items-start flex-1">
          {initiative.title}
        </h3>

        <span
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-lg 
          ${initiative.status ? statusColors[initiative.status] || 'bg-gray-500 text-[#f5f3ee]' : 'bg-gray-500 text-[#f5f3ee]'} 
          uppercase tracking-wider whitespace-nowrap`}
        >
          {initiative.status || 'Unknown'}
        </span>
      </div>

      <p className="text-premium mb-4 sm:mb-5 md:mb-6 leading-relaxed text-base sm:text-lg 
      min-h-[5rem] line-clamp-3">
        {initiative.description}
      </p>

      <div className="mt-auto">
        <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-gray-100">

          <div className="flex flex-col gap-2">

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#C8A75E] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#f5f3ee]" />
              </div>

              <h4 className="font-bold text-[#f5f3ee] uppercase tracking-wider text-xs sm:text-sm">
                Impact
              </h4>
            </div>

            <p className="text-premium leading-relaxed text-sm sm:text-base min-h-[4rem] line-clamp-3">
              {initiative.impact}
            </p>

          </div>
        </div>
      </div>

    </div>
  )
}
