'use client'

import { useState, useEffect } from 'react'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'

function resolveIcon(name: string | null | undefined, fallback: string = 'Heart'): React.ComponentType<{ className?: string }> {
  if (!name) return LucideIcons[fallback as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>
  const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }> | undefined
  return Icon || (LucideIcons[fallback as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
}

interface SufiContentItem {
  id: string
  sectionKey: string
  title: string
  content: string
}

interface SufiCard {
  id: string
  sectionType: string
  title: string
  subtitle: string | null
  description: string | null
  quote: string | null
  icon: string | null
  color: string | null
  orderIndex: number
}

interface PageContentItem {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function SufiTeachings() {
  const [sections, setSections] = useState<SufiContentItem[]>([])
  const [cards, setCards] = useState<SufiCard[]>([])
  const [pageContent, setPageContent] = useState<PageContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/sufi-content').then(res => res.json()),
      fetch('/api/sufi-cards').then(res => res.json()),
      fetch('/api/page-content?pageKey=sufi-teachings').then(res => res.ok ? res.json() : []),
    ])
      .then(([contentData, cardsData, pageContentData]) => {
        setSections(contentData)
        setCards(cardsData)
        setPageContent(pageContentData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'The Path of Love'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Sufi'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Teachings & Wisdom'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  const getSection = (key: string) => sections.find(s => s.sectionKey === key)

  const whatIsSufism = getSection('what_is_sufism')
  const corePrinciples = getSection('core_principles')
  const sufiPath = getSection('sufi_path')
  const keyPractices = getSection('key_practices')
  const greatMasters = getSection('great_masters')
  const closingQuote = getSection('closing_quote')

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

  function parseMasterContent(paragraph: string): { name: string; period: string; quote: string; contribution: string } {
    const parts = paragraph.split('|').map(s => s.trim())
    return {
      name: parts[0] || '',
      period: parts[1] || '',
      quote: parts[2] || '',
      contribution: parts[3] || '',
    }
  }

  const principleColors = ['#E07070', '#C8A75E', '#D4A07B', '#F59E0B']
  const practiceColors = ['#C8A75E', '#9B59B6', '#D4A07B', '#E07070']

  const getCards = (sectionType: string) => cards.filter(c => c.sectionType === sectionType).sort((a, b) => a.orderIndex - b.orderIndex)

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
      <section className="section-premium pt-28 md:pt-36  pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <LucideIcons.Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
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
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-20">
            <div>
              <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4 sm:px-0">{whatIsSufism?.title || 'What is Sufism?'}</h2>
              <div className="divider-premium max-w-xs mb-6 sm:mb-8 mx-4 sm:mx-0"></div>
              <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base text-premium leading-relaxed px-4 sm:px-0">
                {whatIsSufism?.content.split('\n\n').filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="card-premium p-6 sm:p-8 md:p-10 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-xl bg-[#D4A07B] flex items-center justify-center shadow-lg pulse-glow">
                <LucideIcons.Heart className="w-10 h-10 text-[#f5f3ee]" />
              </div>
              <h3 className="text-lg sm:text-2xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">The Essence</h3>
              <blockquote className="text-base sm:text-lg md:text-xl text-premium italic leading-relaxed">
                "The religion of love is apart from all religions. The lovers of God have no religion
                but God alone."
              </blockquote>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-bold text-[#aab0d6]">— Rumi</p>
            </div>
          </div>

          <div className="text-center mb-10 sm:mb-12 md:mb-14">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">{corePrinciples?.title || 'Core Principles'}</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-10"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8">
            {getCards('principle').length > 0 ? getCards('principle').map((card, i) => {
              const IconComp = resolveIcon(card.icon, 'Heart')
              return (
                <PrincipleCard
                  key={card.id}
                  icon={<IconComp className="w-7 h-7" />}
                  title={card.title}
                  description={card.description || ''}
                  color={principleColors[i] || '#C8A75E'}
                />
              )
            }) : (
              <>
                <PrincipleCard icon={<LucideIcons.Heart className="w-7 h-7" />} title="Ishq (Divine Love)" description="Love is not just an emotion but the very fabric of existence and the ultimate path to the Divine." color="#E07070" />
                <PrincipleCard icon={<LucideIcons.Eye className="w-7 h-7" />} title="Marifah (Gnosis)" description="Direct experiential knowledge of God that transcends intellectual understanding." color="#C8A75E" />
                <PrincipleCard icon={<LucideIcons.Flame className="w-7 h-7" />} title="Fana (Annihilation)" description="The dissolution of the ego and the experience of unity with the Divine Beloved." color="#D4A07B" />
                <PrincipleCard icon={<LucideIcons.Sun className="w-7 h-7" />} title="Baqa (Subsistence)" description="Eternal existence in God after the annihilation of the false self." color="#F59E0B" />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">{sufiPath?.title || 'The Sufi Path'}</h2>
            <div className="divider-premium max-w-xs mx-auto mb-6"></div>
            <p className="text-sm sm:text-base md:text-lg text-premium max-w-3xl mx-auto">
              The journey of the soul from separation to union, traditionally described in stages
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {getCards('stage').length > 0 ? getCards('stage').map((card, i) => {
              const IconComp = resolveIcon(card.icon, 'Moon')
              return (
                <PathStage
                  key={card.id}
                  number={String(card.orderIndex + 1)}
                  title={card.title}
                  description={card.description || ''}
                  icon={<IconComp className="w-8 h-8" />}
                />
              )
            }) : (
              <>
                <PathStage number="1" title="Shariah (The Law)" description="The foundation: living according to divine guidance, establishing ethical conduct and ritual practice." icon={<LucideIcons.Moon className="w-8 h-8" />} />
                <PathStage number="2" title="Tariqah (The Way)" description="The journey: engaging in spiritual practices, purifying the heart, and cultivating divine attributes." icon={<LucideIcons.Wind className="w-8 h-8" />} />
                <PathStage number="3" title="Haqiqah (The Truth)" description="The realization: direct experience of divine reality and the unveiling of ultimate truth." icon={<LucideIcons.Sun className="w-8 h-8" />} />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">{keyPractices?.title || 'Key Practices'}</h2>
            <div className="divider-premium max-w-xs mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {getCards('practice').length > 0 ? getCards('practice').map((card, i) => {
              const IconComp = resolveIcon(card.icon, 'Sparkles')
              return (
                <PracticeCard
                  key={card.id}
                  title={card.title}
                  description={card.description || ''}
                  icon={<IconComp className="w-6 h-6" />}
                  color={card.color || practiceColors[i] || '#C8A75E'}
                />
              )
            }) : (
              <>
                <PracticeCard title="Dhikr (Remembrance)" description="The repetition of divine names and sacred phrases to maintain constant awareness of God's presence. Through rhythmic breathing and vocalization, dhikr purifies the heart and brings the seeker into the present moment." icon={<LucideIcons.Sparkles className="w-6 h-6" />} color="#C8A75E" />
                <PracticeCard title="Muraqaba (Meditation)" description="Contemplative practice involving deep introspection, visualization, and spiritual observation. The seeker watches the movements of the heart while remaining in the presence of the Divine." icon={<LucideIcons.Eye className="w-6 h-6" />} color="#9B59B6" />
                <PracticeCard title="Sama (Sacred Music)" description="Spiritual listening and devotional music that induces ecstatic states and opens the heart to divine love. The whirling dance of the Mevlevi order is perhaps the most famous example." icon={<LucideIcons.Wind className="w-6 h-6" />} color="#D4A07B" />
                <PracticeCard title="Sohbet (Spiritual Discourse)" description="Heart-to-heart conversations with a spiritual teacher or fellow seekers. Through storytelling, poetry, and dialogue, wisdom is transmitted from heart to heart." icon={<LucideIcons.Heart className="w-6 h-6" />} color="#E07070" />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">{greatMasters?.title || 'Great Sufi Masters'}</h2>
            <div className="divider-premium max-w-xs mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {getCards('master').length > 0 ? getCards('master').map((card, i) => {
              return (
                <MasterCard
                  key={card.id}
                  name={card.title}
                  period={card.subtitle || ''}
                  quote={card.quote || ''}
                  contribution={card.description || ''}
                />
              )
            }) : (
              <>
                <MasterCard name="Rumi" period="1207-1273 CE" quote="Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray." contribution="Persian poet and mystic whose works transcend cultural and religious boundaries, inspiring millions worldwide." />
                <MasterCard name="Ibn Arabi" period="1165-1240 CE" quote="My heart has become capable of every form: it is a pasture for gazelles and a convent for Christian monks." contribution="Andalusian philosopher and mystic who articulated the doctrine of the Unity of Being (Wahdat al-Wujud)." />
                <MasterCard name="Rabia al-Adawiyya" period="717-801 CE" quote="O God! If I worship You for fear of Hell, burn me in Hell. If I worship You in hope of Paradise, exclude me from Paradise. But if I worship You for Your Own sake, grudge me not Your everlasting Beauty." contribution="One of the first Sufi saints and the first to articulate the principle of divine love without expectation of reward." />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A] text-[#f5f3ee]">
        <div className="container mx-auto max-w-4xl text-center">
          <LucideIcons.Droplets className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 opacity-80" />
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            {closingQuote?.content
              ? closingQuote.content.split('\n\n').filter(Boolean).map((line, i, arr) => (
                <span key={i}>{i === 0 ? `"${line}"` : line}{i < arr.length - 1 ? <span className="block mt-2"></span> : null}</span>
              ))
              : <>
                  "You are not a drop in the ocean.
                  <span className="block mt-2">You are the entire ocean in a drop."</span>
                </>
            }
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 mb-6 sm:mb-8">— Rumi</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/teachings" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-[#c8a75e] hover:text-[#c8a75e] text-[#0b0f2a] hover:bg-[#c8a75e]/20">
              Explore All Teachings
            </Link>
            <Link href="/join" className="btn-secondary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 border-2 border-[#c8a75e] text-[#f5f3ee] hover:bg-[#c8a75e]">
              Join Our Community
            </Link>
          </div>
        </div>
      </section>
      </>
      )}
    </div>
  )
}

function PrincipleCard({ icon, title, description, color }: any) {
  return (
    <div className="tradition-card p-6 sm:p-7 md:p-8 text-center group">
      <div className={`w-14 h-14 mx-auto mb-6 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee]">{icon}</div>
      </div>
      <h3 className="text-lg heading-premium text-[#f5f3ee] mb-3">{title}</h3>
      <p className="text-premium text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function PathStage({ number, title, description, icon }: any) {
  return (
    <div className="card-premium p-6 sm:p-7 md:p-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#D4A07B] flex items-center justify-center text-[#f5f3ee] font-bold text-2xl">
          {number}
        </div>
        <div className="text-amber-600">{icon}</div>
      </div>
      <h3 className="text-xl heading-premium text-[#f5f3ee] mb-4">{title}</h3>
      <p className="text-premium leading-relaxed">{description}</p>
    </div>
  )
}

function PracticeCard({ title, description, icon, color }: any) {
  return (
    <div className="card-premium p-6 sm:p-7 md:p-8">
      <div className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center shadow-xl`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee]">{icon}</div>
      </div>
      <h3 className="text-xl heading-premium text-[#f5f3ee] mb-4">{title}</h3>
      <p className="text-premium leading-relaxed">{description}</p>
    </div>
  )
}

function MasterCard({ name, period, quote, contribution }: any) {
  return (
    <div className="card-premium p-6 sm:p-7 md:p-8">
      <h3 className="text-xl heading-premium text-[#f5f3ee] mb-2">{name}</h3>
      <p className="text-sm font-semibold text-amber-600 mb-6">{period}</p>
      <blockquote className="text-premium italic leading-relaxed mb-6 border-l-4 border-amber-500 pl-4">
        "{quote}"
      </blockquote>
      <p className="text-sm text-[#aab0d6]/80 leading-relaxed">{contribution}</p>
    </div>
  )
}
