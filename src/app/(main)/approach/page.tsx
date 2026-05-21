'use client'

import { useState, useEffect } from 'react'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'

function resolveIcon(name: string | null | undefined, fallback: string = 'BookOpen'): React.ComponentType<{ className?: string }> {
  if (!name) return LucideIcons[fallback as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>
  const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }> | undefined
  return Icon || (LucideIcons[fallback as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
}

interface ApproachContentItem {
  id: string
  sectionKey: string
  title: string
  content: string
}

interface ApproachCard {
  id: string
  sectionType: string
  title: string
  description: string | null
  features: string[] | null
  icon: string | null
  color: string | null
  orderIndex: number
}

interface PageContentItem {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function OurApproach() {
  const [sections, setSections] = useState<ApproachContentItem[]>([])
  const [cards, setCards] = useState<ApproachCard[]>([])
  const [pageContent, setPageContent] = useState<PageContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionPages, setSectionPages] = useState<Record<string, number>>({})

  useEffect(() => {
    Promise.all([
      fetch('/api/approach-content').then(res => res.json()),
      fetch('/api/approach-cards').then(res => res.json()),
      fetch('/api/page-content?pageKey=approach').then(res => res.ok ? res.json() : []),
    ])
      .then(([contentData, cardsData, pageContentData]) => {
        setSections(contentData)
        setCards(cardsData)
        setPageContent(pageContentData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Our Methodology'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Our'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Approach to Unity'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  const getSection = (key: string) => sections.find(s => s.sectionKey === key)

  const fourPillars = getSection('four_pillars')
  const philosophy = getSection('philosophy')
  const methodology = getSection('methodology')
  const corePrinciples = getSection('core_principles')
  const whatMakesUsDifferent = getSection('what_makes_us_different')
  const successMetrics = getSection('success_metrics')

  function parseCardContent(paragraph: string): { title: string; description: string } {
    const colonIndex = paragraph.indexOf(': ')
    if (colonIndex > 0) {
      return {
        title: paragraph.slice(0, colonIndex),
        description: paragraph.slice(colonIndex + 2)
      }
    }
    return { title: paragraph, description: '' }
  }

  function parsePillarContent(paragraph: string): { title: string; description: string; features: string[] } {
    const lines = paragraph.split('\n').map(l => l.trim()).filter(Boolean)
    const firstLine = lines[0] || ''
    const colonIndex = firstLine.indexOf(': ')
    const title = colonIndex > 0 ? firstLine.slice(0, colonIndex) : firstLine
    const description = colonIndex > 0 ? firstLine.slice(colonIndex + 2) : ''
    const features = lines.slice(1)
      .filter(l => l.startsWith('- ') || l.startsWith('• ') || l.startsWith('✓ '))
      .map(l => l.replace(/^[- •✓]+/, '').trim())
    return { title, description, features: features.length > 0 ? features : lines.slice(1) }
  }

  const pillarIcons = [<LucideIcons.BookOpen className="w-8 h-8" />, <LucideIcons.MessageCircle className="w-8 h-8" />, <LucideIcons.HandHeart className="w-8 h-8" />, <LucideIcons.Heart className="w-8 h-8" />]
  const pillarColors = ['#C8A75E', '#9B59B6', '#E07070', '#D4A07B']

  const ITEMS_PER_PAGE: Record<string, number> = { pillar: 4, step: 5, principle: 6, differentiator: 4 }
  const getCards = (sectionType: string) => cards.filter(c => c.sectionType === sectionType).sort((a, b) => a.orderIndex - b.orderIndex)
  const getPage = (sectionType: string) => sectionPages[sectionType] || 1
  const setPage = (sectionType: string, page: number) => setSectionPages(p => ({ ...p, [sectionType]: page }))
  const getPaginatedCards = (sectionType: string) => {
    const all = getCards(sectionType)
    const perPage = ITEMS_PER_PAGE[sectionType] || 4
    const page = getPage(sectionType)
    const total = Math.max(1, Math.ceil(all.length / perPage))
    const safe = Math.min(page, total)
    return {
      cards: all.slice((safe - 1) * perPage, safe * perPage),
      total,
      safe,
    }
  }

  return (
    <div>
      {loading ? (
        <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 flex items-center justify-center min-h-[60vh]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
        </section>
      ) : (
        <>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <LucideIcons.Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4b56d]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">
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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-14">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">{fourPillars?.title || 'Four Pillars of Our Work'}</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-10"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 mb-6 sm:mb-6 md:mb-6">
            {cards.filter(c => c.sectionType === 'pillar').length > 0 ? (() => {
              const { cards: pcards, total, safe } = getPaginatedCards('pillar')
              return pcards.map((card, i) => {
                const IconComp = resolveIcon(card.icon, 'BookOpen')
                return (
                  <PillarCard
                    key={card.id}
                    icon={<IconComp className="w-8 h-8" />}
                    title={card.title}
                    description={card.description || ''}
                    features={card.features || []}
                    color={card.color || pillarColors[i] || '#C8A75E'}
                  />
                )
              })
            })() : (
              <>
                <PillarCard icon={<LucideIcons.BookOpen className="w-8 h-8" />} title="Education & Learning" description="We believe understanding comes before unity. Our educational programs demystify religious traditions, correct misconceptions, and highlight shared values across faiths." features={['Interfaith study circles', 'Sacred text exploration workshops', 'Online courses on world religions', 'Scholar-led seminars and webinars']} color="#C8A75E" />
                <PillarCard icon={<LucideIcons.MessageCircle className="w-8 h-8" />} title="Dialogue & Exchange" description="Creating safe, sacred spaces where people of different faiths can speak from the heart, listen deeply, and discover our common humanity." features={['Facilitated interfaith dialogues', 'Community conversation circles', 'Virtual global gatherings', 'One-on-one faith pairing programs']} color="#9B59B6" />
                <PillarCard icon={<LucideIcons.HandHeart className="w-8 h-8" />} title="Service & Action" description="Faith without action is incomplete. We unite diverse communities through collaborative service projects that address real needs." features={['Interfaith volunteer initiatives', 'Community development projects', 'Disaster relief partnerships', 'Social justice advocacy']} color="#E07070" />
                <PillarCard icon={<LucideIcons.Heart className="w-8 h-8" />} title="Spiritual Practice" description="Shared contemplative practices create heart connections that transcend intellectual understanding and theological differences." features={['Interfaith meditation gatherings', 'Peace prayer ceremonies', 'Sufi-inspired spiritual retreats', 'Contemplative practice workshops']} color="#D4A07B" />
              </>
            )}
          </div>
          {getPaginatedCards('pillar').total > 1 && (() => {
            const { total, safe } = getPaginatedCards('pillar')
            return (
              <div className="flex items-center justify-center gap-3 mb-12 sm:mb-16 md:mb-20">
                <button onClick={() => setPage('pillar', safe - 1)} disabled={safe === 1}
                  className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <span className="text-sm text-premium-light">Page {safe} of {total}</span>
                <button onClick={() => setPage('pillar', safe + 1)} disabled={safe === total}
                  className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            )
          })()}

          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <LucideIcons.Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 text-[#d4b56d]" />
            <h3 className="text-lg sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6">{philosophy?.title || 'Our Philosophy'}</h3>
            {philosophy ? (
              philosophy.content.split('\n\n').filter(Boolean).map((p, i) => (
                <p key={i} className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto">{p}</p>
              ))
            ) : (
              <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto">
                We don't seek to create a new religion or minimize differences. Instead, we honor
                the unique beauty of each tradition while recognizing that all authentic spiritual
                paths lead to the same Source. Unity in diversity, not uniformity.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">{methodology?.title || 'Our Methodology in Action'}</h2>
            <div className="divider-premium max-w-xs mx-auto mb-6"></div>
            <p className="text-sm sm:text-base md:text-lg text-premium max-w-3xl mx-auto">
              A step-by-step process for building genuine interfaith understanding
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {cards.filter(c => c.sectionType === 'step').length > 0 ? (() => {
              const { cards: scards } = getPaginatedCards('step')
              const stepColors = ['#C8A75E', '#9B59B6', '#14B8A6', '#D4A07B', '#E07070']
              return scards.map((card) => (
                <StepCard
                  key={card.id}
                  number={String(card.orderIndex + 1)}
                  title={card.title}
                  description={card.description || ''}
                  color={card.color || stepColors[card.orderIndex] || '#C8A75E'}
                />
              ))
            })() : (
              <>
                <StepCard number="1" title="Connect" description="Bring people together in welcoming, inclusive spaces" color="#C8A75E" />
                <StepCard number="2" title="Learn" description="Share knowledge about different faith traditions authentically" color="#9B59B6" />
                <StepCard number="3" title="Relate" description="Find common ground through shared values and experiences" color="#14B8A6" />
                <StepCard number="4" title="Serve" description="Work together on meaningful projects that benefit communities" color="#D4A07B" />
                <StepCard number="5" title="Transform" description="Become ambassadors of peace in your own circles" color="#E07070" />
              </>
            )}
          </div>
          {getPaginatedCards('step').total > 1 && (() => {
            const { total, safe } = getPaginatedCards('step')
            return (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage('step', safe - 1)} disabled={safe === 1}
                  className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <span className="text-sm text-premium-light">Page {safe} of {total}</span>
                <button onClick={() => setPage('step', safe + 1)} disabled={safe === total}
                  className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            )
          })()}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">{corePrinciples?.title || 'Core Principles'}</h2>
            <div className="divider-premium max-w-xs mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cards.filter(c => c.sectionType === 'principle').length > 0 ? (() => {
              const { cards: pcards } = getPaginatedCards('principle')
              return pcards.map((card) => {
                const IconComp = resolveIcon(card.icon, 'Users')
                return (
                  <PrincipleCard
                    key={card.id}
                    title={card.title}
                    description={card.description || ''}
                    icon={<IconComp className="w-10 h-10 text-[#c8a75e]" />}
                  />
                )
              })
            })() : (
              <>
                <PrincipleCard title="Mutual Respect" description="We honor each tradition's integrity, authenticity, and sacred teachings. No faith is superior or inferior; each is a valid path to the Divine." icon={<LucideIcons.Users className="w-10 h-10 text-[#c8a75e]" />} />
                <PrincipleCard title="Deep Listening" description="We create spaces for genuine dialogue where people feel truly heard. Understanding precedes agreement, and connection transcends conversion." icon={<LucideIcons.MessageCircle className="w-10 h-10 text-[#d4b56d]" />} />
                <PrincipleCard title="Heart-Centered Approach" description="We engage from the heart, not just the head. Spiritual connection and lived experience complement intellectual understanding." icon={<LucideIcons.Heart className="w-10 h-10 text-rose-600" />} />
                <PrincipleCard title="Collaborative Spirit" description="We work with, not for, communities. Local leaders and participants co-create programs that reflect their unique contexts and needs." icon={<LucideIcons.HandHeart className="w-10 h-10 text-amber-600" />} />
                <PrincipleCard title="Action-Oriented" description="Dialogue without action is incomplete. We translate understanding into concrete initiatives that create positive change." icon={<LucideIcons.Target className="w-10 h-10 text-violet-600" />} />
                <PrincipleCard title="Global-Local Balance" description="We maintain a global vision while honoring local contexts, cultures, and specific interfaith dynamics in each community." icon={<LucideIcons.Globe2 className="w-10 h-10 text-emerald-600" />} />
              </>
            )}
          </div>
          {getPaginatedCards('principle').total > 1 && (() => {
            const { total, safe } = getPaginatedCards('principle')
            return (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage('principle', safe - 1)} disabled={safe === 1}
                  className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <span className="text-sm text-premium-light">Page {safe} of {total}</span>
                <button onClick={() => setPage('principle', safe + 1)} disabled={safe === total}
                  className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            )
          })()}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6">{whatMakesUsDifferent?.title || 'What Makes Us Different?'}</h2>
              <div className="divider-premium max-w-xs mb-8"></div>
              <div className="space-y-6">
                {cards.filter(c => c.sectionType === 'differentiator').length > 0 ? (() => {
                  const { cards: dcards } = getPaginatedCards('differentiator')
                  return dcards.map((card) => (
                    <DifferentiatorItem
                      key={card.id}
                      title={card.title}
                      description={card.description || ''}
                    />
                  ))
                })() : (
                  <>
                    <DifferentiatorItem title="Rooted in Tradition, Open to All" description="While grounded in Sufi wisdom, we welcome people of all faiths and none. Our Sufi foundation provides spiritual depth without exclusivity." />
                    <DifferentiatorItem title="Experience Over Theory" description="We emphasize lived experience and personal transformation, not just academic knowledge or theological debate." />
                    <DifferentiatorItem title="Sustainable Relationships" description="We're not interested in one-time events. We build long-term relationships and communities that continue growing together." />
                    <DifferentiatorItem title="Grassroots Empowerment" description="We train local leaders to facilitate interfaith work in their own communities, creating a multiplier effect." />
                  </>
                )}
              </div>
              {getPaginatedCards('differentiator').total > 1 && (() => {
                const { total, safe } = getPaginatedCards('differentiator')
                return (
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <button onClick={() => setPage('differentiator', safe - 1)} disabled={safe === 1}
                      className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      Previous
                    </button>
                    <span className="text-sm text-premium-light">Page {safe} of {total}</span>
                    <button onClick={() => setPage('differentiator', safe + 1)} disabled={safe === total}
                      className="px-4 py-2 text-sm font-semibold text-[#f5f3ee] bg-[#0b0f2a]/60 rounded-xl hover:bg-[#c8a75e]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      Next
                    </button>
                  </div>
                )
              })()}
            </div>
            <div className="space-y-6">
              <div className="card-premium p-6 sm:p-7 md:p-8">
                <h3 className="text-xl heading-premium text-[#f5f3ee] mb-4">{successMetrics?.title || 'Success Metrics'}</h3>
                {successMetrics ? (
                  successMetrics.content.split('\n\n').filter(Boolean).map((para, i) => {
                    if (para.startsWith('✓') || para.startsWith('- ')) {
                      return null
                    }
                    const lines = para.split('\n')
                    return (
                      <div key={i}>
                        <p className="text-premium mb-6">{lines[0]}</p>
                        <ul className="space-y-3 text-premium">
                          {lines.slice(1).filter(l => l.trim()).map((line, j) => (
                            <li key={j} className="flex items-start">
                              <span className="text-[#d4b56d] mr-2 mt-1">✓</span>
                              <span>{line.replace(/^[✓\s-]+/, '')}</span>
                            </li>
                          ))}
                          {lines.length === 1 && para.startsWith('✓') && (
                            <li key={0} className="flex items-start">
                              <span className="text-[#d4b56d] mr-2 mt-1">✓</span>
                              <span>{para.replace(/^[✓\s-]+/, '')}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    )
                  })
                ) : (
                  <>
                    <p className="text-premium mb-6">We measure our impact through:</p>
                    <ul className="space-y-3 text-premium">
                      <li className="flex items-start"><span className="text-[#d4b56d] mr-2 mt-1">✓</span><span>Number of lasting friendships formed across faith lines</span></li>
                      <li className="flex items-start"><span className="text-[#d4b56d] mr-2 mt-1">✓</span><span>Community projects completed collaboratively</span></li>
                      <li className="flex items-start"><span className="text-[#d4b56d] mr-2 mt-1">✓</span><span>Participants reporting reduced prejudice and increased understanding</span></li>
                      <li className="flex items-start"><span className="text-[#d4b56d] mr-2 mt-1">✓</span><span>New interfaith initiatives launched by trained leaders</span></li>
                      <li className="flex items-start"><span className="text-[#d4b56d] mr-2 mt-1">✓</span><span>Stories of personal transformation and spiritual growth</span></li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A] text-[#f5f3ee]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to Experience Our Approach?
          </h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90 leading-relaxed mb-6 sm:mb-8">
            Join us in building a world where religious diversity enriches rather than divides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-[#c8a75e] text-[#0b0f2a] hover:text-[#c8a75e] hover:bg-[#c8a75e]/20">
              Join the Movement
            </Link>
            <Link href="/peace" className="btn-secondary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 border-2 border-[#c8a75e] text-[#f5f3ee] hover:bg-[#c8a75e]">
              View Our Initiatives
            </Link>
          </div>
        </div>
      </section>
      </>
      )}
    </div>
  )
}

function PillarCard({ icon, title, description, features, color }: any) {
  return (
    <div className="card-premium p-6 sm:p-7 md:p-8">
      <div className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center shadow-xl`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee]">{icon}</div>
      </div>
      <h3 className="text-xl heading-premium text-[#f5f3ee] mb-4">{title}</h3>
      <p className="text-premium leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start text-sm text-premium">
            <span className="text-[#d4b56d] mr-2 mt-1">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({ number, title, description, color }: any) {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center text-[#f5f3ee] font-bold text-2xl shadow-xl`} style={{ backgroundColor: color }}>
        {number}
      </div>
      <h3 className="text-base heading-premium text-[#f5f3ee] mb-2">{title}</h3>
      <p className="text-premium text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function PrincipleCard({ title, description, icon }: any) {
  return (
    <div className="tradition-card p-6 sm:p-7 md:p-8">
      <h3 className="text-lg heading-premium text-[#f5f3ee] mb-3">{title}</h3>
      <p className="text-premium leading-relaxed">{description}</p>
    </div>
  )
}

function DifferentiatorItem({ title, description }: any) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-2 h-2 bg-[#141a3a]0 rounded-full mt-2 flex-shrink-0"></div>
      <div>
        <h4 className="font-bold text-[#f5f3ee] mb-2">{title}</h4>
        <p className="text-premium leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
