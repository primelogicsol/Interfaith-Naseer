'use client'

import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { getCorePillars, getMissionContent } from '@/actions/database'
import Pagination from '@/components/Pagination'

function resolveIcon(name: string | null | undefined, size = 'w-8 h-8') {
  if (!name) return <Flame className={size} />
  const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }> | undefined
  return Icon ? <Icon className={size} /> : <Flame className={size} />
}

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function Mission() {
  const [currentPage, setCurrentPage] = useState(1)
  const [corePillars, setCorePillars] = useState<{ id: string; title: string; description: string; icon: string; color: string }[]>([])
  const [headerContent, setHeaderContent] = useState<{ title: string; content: string } | null>(null)
  const [sufiContent, setSufiContent] = useState<{ title: string; content: string } | null>(null)
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    fetchData()
    fetch('/api/page-content?pageKey=mission')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPageContent(data))
      .catch(() => {})
  }, [])

  async function fetchData() {
    const [pillars, header, sufi] = await Promise.all([
      getCorePillars(),
      getMissionContent('header'),
      getMissionContent('sufi_path'),
    ])
    if (pillars.data) setCorePillars(pillars.data.map((p: any) => ({ id: p.id, title: p.title, description: p.description, icon: p.icon, color: p.color })))
    if (header.data && !Array.isArray(header.data)) setHeaderContent(header.data)
    if (sufi.data && !Array.isArray(sufi.data)) setSufiContent(sufi.data)
  }

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Our Sacred Purpose'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Our Mission for'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Interfaith Harmony'

  const totalPages = Math.ceil(corePillars.length / ITEMS_PER_PAGE)
  const paginatedCards = corePillars.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a07b]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">
              {heroBadge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            {heroHeading1}
            <span className="block text-[#C8A75E] mt-2">{heroHeading2}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
            {headerContent?.content || 'Rooted in the timeless wisdom of Sufism, we dedicate ourselves to building bridges of understanding, eliminating hatred, and revealing the divine unity that connects all hearts.'}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
              Core Pillars of Our Work
            </h2>
            <div className="divider-premium max-w-xs mx-auto"></div>
          </div>

          <div className="feature-grid">
            {paginatedCards.map((card, index) => (
              <MissionCard
                key={card.id || index}
                icon={resolveIcon(card.icon)}
                title={card.title}
                description={card.description}
                color={card.color}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12">
            <h2 className="text-xl sm:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 text-center px-4">
              {sufiContent?.title || 'The Sufi Path to Interfaith Harmony'}
            </h2>
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base text-premium leading-relaxed">
              {sufiContent
                ? sufiContent.content.split('\n\n').filter(Boolean).map((p, i, arr) => (
                    <p key={i} className={i === arr.length - 1 ? 'font-semibold text-sm sm:text-base md:text-lg text-[#c8a75e]' : ''}>
                      {p}
                    </p>
                  ))
                : (
                  <>
                    <p>Sufism teaches that the Divine is infinite and cannot be contained by any single form or expression. Just as the sun&apos;s light illuminates countless windows, each with its own unique color and character, the Divine Light manifests through diverse spiritual traditions, each offering a unique window into the infinite.</p>
                    <p>At the heart of Sufism is the principle of Divine Love - a love that sees beyond superficial differences to recognize the sacred essence in every being. This love does not tolerate hatred, because when one truly sees with the eye of the heart, one recognizes that harming another is harming oneself.</p>
                    <p>We carry forward this Sufi wisdom as a torch to light the path toward interfaith understanding. By purifying our hearts of prejudice, seeking knowledge over ignorance, and choosing compassion over judgment, we become living bridges between communities that might otherwise remain divided.</p>
                    <p className="font-semibold text-sm sm:text-base md:text-lg text-[#c8a75e]">Our mission is not to erase the beautiful diversity of spiritual traditions, but to reveal the unity that already exists beneath the surface - the unity of hearts seeking truth, peace, and divine connection.</p>
                  </>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function MissionCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div className="tradition-card p-6 sm:p-7 md:p-8">
      <div className='flex flex-row md:flex-col justify-start items-center gap-3 md:gap-0'>
      <div className={`icon-circle mb-4 sm:mb-5 md:mb-6`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee] [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-7 sm:[&>svg]:h-7 md:[&>svg]:w-10 md:[&>svg]:h-10">{icon}</div>
      </div>
      <h3 className="text-lg sm:text-2xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">{title}</h3>
      </div>
      <p className="text-sm sm:text-base text-premium leading-relaxed">{description}</p>
    </div>
  )
}
