'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Globe as Globe2, BookOpen, HandHeart, Sparkles, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import Pagination from '@/components/Pagination'
import {
  getImpactGoals,
  getFeaturedPrograms,
  getRegionalInitiatives,
  getGetInvolved,
} from '@/actions/database'

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function PeaceInitiatives() {
  const [impactGoals, setImpactGoals] = useState<any[]>([])
  const [featuredPrograms, setFeaturedPrograms] = useState<any[]>([])
  const [regionalInitiatives, setRegionalInitiatives] = useState<any[]>([])
  const [getInvolvedItems, setGetInvolvedItems] = useState<any[]>([])
  const [currentInitiatives, setCurrentInitiatives] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const ITEMS_PER_PAGE = 4

  useEffect(() => {
    fetchAll()
    fetch('/api/page-content?pageKey=peace-initiatives')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPageContent(data))
      .catch(() => {})
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Building Peace Together'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Peace'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Initiatives'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  async function fetchAll() {
    const [impact, programs, regional, involved] = await Promise.all([
      getImpactGoals(),
      getFeaturedPrograms(),
      getRegionalInitiatives(),
      getGetInvolved(),
    ])
    if (impact.data) setImpactGoals(impact.data)
    if (programs.data) setFeaturedPrograms(programs.data)
    if (regional.data) setRegionalInitiatives(regional.data)
    if (involved.data) setGetInvolvedItems(involved.data)
    try {
      const ciRes = await fetch('/api/current-initiatives')
      if (ciRes.ok) setCurrentInitiatives(await ciRes.json())
    } catch {}
  }

  const totalPages = Math.ceil(currentInitiatives.length / ITEMS_PER_PAGE)
  const paginatedInitiatives = currentInitiatives.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            <span className="text-sm font-semibold text-[#E07070]">
              {heroBadge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight">
            {heroHeading1}
            <span className="block text-[#C8A75E] mt-2">{heroHeading2}</span>
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
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">Our Current Initiatives</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-12"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {paginatedInitiatives.length > 0 ? paginatedInitiatives.map((item, index) => {
              const icons = [<Globe2 key="g" className="w-6 h-6 sm:w-8 sm:h-8" />, <Users key="u" className="w-6 h-6 sm:w-8 sm:h-8" />, <Sparkles key="s" className="w-6 h-6 sm:w-8 sm:h-8" />, <HandHeart key="h" className="w-6 h-6 sm:w-8 sm:h-8" />]
              const colors = ['#C8A75E', '#27AE60', '#9B59B6', '#D4A07B']
              const colorMap: Record<string, string> = { gold: '#C8A75E', green: '#27AE60', purple: '#9B59B6', orange: '#D4A07B' }
              return (
                <InitiativeCard
                  key={item.id || index}
                  title={item.title}
                  category={item.category}
                  description={item.description}
                  impact={item.stats}
                  nextEvent={item.event}
                  color={colorMap[item.iconColor] || colors[index % colors.length]}
                  icon={icons[index % icons.length]}
                />
              )
            }) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-premium text-lg">Loading current initiatives...</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mb-16">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}

          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <h3 className="text-lg sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6">2026 Impact Goals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {impactGoals.length > 0
                ? impactGoals.map((goal) => (
                    <ImpactGoal key={goal.id} number={goal.number} label={goal.label} />
                  ))
                : (
                  <>
                    <ImpactGoal number="100K" label="Active Participants" />
                    <ImpactGoal number="100" label="Countries Reached" />
                    <ImpactGoal number="1,000" label="Peace Circles" />
                    <ImpactGoal number="500" label="Community Projects" />
                  </>
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">Featured Programs</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-12"></div>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {featuredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                title={program.title}
                description={program.description}
                details={program.details}
                testimonial={{
                  text: program.testimonialText,
                  author: program.testimonialAuthor,
                }}
              />
            ))}
            {featuredPrograms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-premium text-lg">Loading featured programs...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">Regional Initiatives</h2>
            <div className="divider-premium max-w-xs mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {regionalInitiatives.map((item) => (
              <RegionCard
                key={item.id}
                region={item.region}
                initiatives={item.initiatives}
                icon={<MapPin className="w-6 h-6 sm:w-8 sm:h-8" />}
              />
            ))}
            {regionalInitiatives.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <p className="text-premium text-lg">Loading regional initiatives...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6">Get Involved</h2>
              <div className="divider-premium max-w-xs mb-8"></div>
              <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed mb-6 sm:mb-8">
                Every initiative needs dedicated people like you. Whether you have 2 hours a month
                or want to launch a program in your community, there&apos;s a place for you.
              </p>
              <div className="space-y-4 sm:space-y-6">
                {getInvolvedItems.length > 0
                  ? getInvolvedItems.map((item) => (
                      <WayToHelp
                        key={item.id}
                        title={item.title}
                        description={item.description}
                      />
                    ))
                  : (
                    <>
                      <WayToHelp title="Start a Peace Circle" description="Gather 6-10 people from different traditions in your neighborhood. We provide training and materials." />
                      <WayToHelp title="Volunteer at Events" description="Help organize dialogue sessions, service days, or cultural celebrations in your area." />
                      <WayToHelp title="Share Your Story" description="Your interfaith journey can inspire others. Contribute to our blog or speak at events." />
                      <WayToHelp title="Become a Facilitator" description="Complete our training to lead interfaith dialogues professionally." />
                    </>
                  )}
              </div>
            </div>
            <div className="card-premium p-6 md:p-8 lg:p-10">
              <div className="text-center mb-8">
                <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-[#c8a75e]" />
                <h3 className="text-base sm:text-lg md:text-xl heading-premium text-[#f5f3ee] mb-2">Upcoming Events</h3>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <EventItem date="May 15" title="Global Dialogue: Climate Justice" format="Virtual - Global" />
                <EventItem date="Jun 1-3" title="Youth Leadership Retreat" format="Barcelona, Spain" />
                <EventItem date="Jun 21" title="Summer Solstice Service Day" format="Worldwide - 150+ cities" />
                <EventItem date="Jul 10" title="Facilitator Training Program Starts" format="Online - 12 weeks" />
              </div>
              <div className="flex mt-8">
                <Link href="/peace" className="btn-primary w-full justify-center text-center">
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function InitiativeCard({ title, category, description, impact, nextEvent, color, icon }: any) {
  return (
    <div className="card-premium p-5 sm:p-6 md:p-7">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-5 md:mb-6 rounded-xl flex items-center justify-center shadow-xl`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee]">{icon}</div>
      </div>
      <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-xl mb-4">
        {category}
      </div>
      <h3 className="text-xl heading-premium text-[#f5f3ee] mb-4">{title}</h3>
      <p className="text-premium leading-relaxed mb-6">{description}</p>
      <div className="space-y-3 pt-6 border-t border-[#aab0d6]/20">
        {impact && (
          <div className="flex items-start text-sm">
            <Users className="w-4 h-4 text-[#c8a75e] mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-premium">{impact}</span>
          </div>
        )}
        {nextEvent && (
          <div className="flex items-start text-sm">
            <Calendar className="w-4 h-4 text-[#d4b56d] mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-premium">{nextEvent}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ImpactGoal({ number, label }: any) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C8A75E] mb-2">{number}</div>
      <div className="text-[10px] md:text-sm text-[#aab0d6]/80 font-semibold uppercase tracking-wider">{label}</div>
    </div>
  )
}

function ProgramCard({ title, description, details, testimonial }: any) {
  const features = Array.isArray(details?.features) ? details.features : []
  return (
      <div className="tradition-card p-5 md:p-6 lg:p-8">
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        <div className="md:col-span-2">
          <h3 className="text-base sm:text-lg md:text-2xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">{title}</h3>
          <p className="md:text-premium leading-relaxed mb-4 sm:mb-6 text-sm">{description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((detail: string, index: number) => (
              <div key={index} className="flex items-start text-sm text-premium">
                <span className="text-[#d4b56d] mr-2 mt-1">•</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-effect p-6 rounded-xl">
          <BookOpen className="w-5 h-5 md:w-8 md:h-8 text-[#c8a75e] mb-4" />
          <p className="text-sm text-premium italic leading-relaxed mb-4">"{testimonial?.text}"</p>
          <p className="text-xs font-bold text-[#aab0d6]">— {testimonial?.author}</p>
        </div>
      </div>
    </div>
  )
}

function RegionCard({ region, initiatives, icon }: any) {
  const items = Array.isArray(initiatives) ? initiatives : []
  return (
    <div className="card-premium p-3 sm:p-5 md:p-6">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <div className="text-[#c8a75e]">{icon}</div>
        <h3 className="text-lg heading-premium text-[#f5f3ee]">{region}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item: any, index: number) => {
          const label = typeof item === 'string' ? item : (item.name || '')
          return (
            <li key={index} className="flex items-start text-sm text-premium">
              <span className="text-[#d4b56d] mr-2 mt-1">•</span>
              <span>{label}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function WayToHelp({ title, description }: any) {
  return (
    <div className="flex items-start space-x-3 sm:space-x-4">
      <div className="w-2 h-2 bg-[#c8a75e] rounded-full mt-2 flex-shrink-0"></div>
      <div>
        <h5 className="font-bold text-[#f5f3ee] mb-1 sm:mb-2">{title}</h5>
        <p className="text-sm sm:text-base text-premium leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function EventItem({ date, title, format }: any) {
  return (
    <div className="flex items-start space-x-3 sm:space-x-4 pb-3 sm:pb-4 border-b border-[#aab0d6]/20 last:border-0 last:pb-0">
      <div className="text-center flex-shrink-0">
        <div className="text-base sm:text-lg md:text-xl font-bold text-[#c8a75e]">{date}</div>
      </div>
      <div>
        <h4 className="font-bold text-sm sm:text-base md:text-lg text-[#f5f3ee] mb-1">{title}</h4>
        <p className="text-xs sm:text-sm text-premium">{format}</p>
      </div>
    </div>
  )
}
