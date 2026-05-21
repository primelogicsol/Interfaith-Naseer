'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface FounderSection {
  id: string
  slug: string
  pageTitle: string
  pageSubtitle: string
  cardTitle: string
  cardSubtitle: string
  cardDescription: string[]
  imagePath: string
  badgeLabel: string
  order: number
}

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function FounderPage() {
  const [sections, setSections] = useState<FounderSection[]>([])
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [sectionsRes, contentRes] = await Promise.all([
          fetch('/api/founder'),
          fetch('/api/page-content?pageKey=founder'),
        ])
        if (sectionsRes.ok) setSections(await sectionsRes.json())
        if (contentRes.ok) setPageContent(await contentRes.json())
      } catch (err) {
        console.error('Error loading founder data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Our Founders'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || ''
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || ''
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#0B0F2A]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          {/* <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-[#c8a75e]/10 border border-[#c8a75e]/20 rounded-full text-[10px] sm:text-xs font-medium text-[#c8a75e] uppercase tracking-wider mb-4 sm:mb-6">
            {heroBadge}
          </span> */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ee] mb-2">
            {heroHeading1}
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#c8a75e] mb-4 sm:mb-6">
            {heroHeading2}
          </h2>
          {heroSubtitle && (
            <p className="text-sm sm:text-base text-premium-light max-w-2xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
          {sections.map((section) => (
            <FounderCard key={section.id} section={section} />
          ))}
        </div>
      </section>
    </div>
  )
}

function FounderCard({ section }: { section: FounderSection }) {
  return (
    <section className="w-full">
      <div className="mb-8 sm:mb-10 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ee] tracking-wide mb-3">
          {section.pageTitle}
        </h1>
        {section.pageSubtitle && (
          <p className="text-sm sm:text-base text-premium-light leading-relaxed">
            {section.pageSubtitle}
          </p>
        )}
      </div>

      <div className="bg-[#0B0F2A] border border-[#c8a75e]/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start relative overflow-hidden shadow-2xl">
        <div className="absolute top-10 right-10 opacity-5 pointer-events-none hidden md:block">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#c8a75e" strokeWidth="1">
            <circle cx="12" cy="8" r="7" />
            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
          </svg>
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-[#c8a75e]/10 bg-[#0b0f2a] shadow-md group">
            <Image
              src={section.imagePath || '/placeholder.svg'}
              alt={section.cardSubtitle}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 33vw"
              priority
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#f5f3ee] tracking-tight">
              {section.cardSubtitle}
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-[#c8a75e] uppercase tracking-widest mt-1 block">
              {section.badgeLabel}
            </span>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#f5f3ee] leading-snug tracking-wide">
            {section.cardTitle}
          </h2>
          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-premium-light leading-relaxed">
            {section.cardDescription.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
