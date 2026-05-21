'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Star, Scroll, Feather, Globe as Globe2, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { getSacredTexts } from '@/actions/database'
import Pagination from '@/components/Pagination'

interface SacredText {
  id: string
  title: string
  source: string
  textContent: string
  theme: string
  context?: string | null
  translation?: string | null
  tradition?: { id: string; name: string } | null
}

const themeColors: Record<string, string> = {
  love: '#E07070',
  unity: '#C8A75E',
  compassion: '#27AE60',
  peace: '#9B59B6',
  justice: '#5B7FDB',
  wisdom: '#D4A07B',
  service: '#10B981',
  mercy: '#F59E0B',
}

const themeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  love: Heart,
  unity: Star,
  compassion: Heart,
  peace: Feather,
  justice: Scroll,
  wisdom: BookOpen,
  service: Globe2,
  mercy: Sparkles,
}

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function SacredTexts() {
  const [texts, setTexts] = useState<SacredText[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    fetchTexts()
    fetch('/api/page-content?pageKey=sacred-texts')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPageContent(data))
      .catch(() => {})
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Universal Wisdom'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Sacred Texts'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || '& Scriptures'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTheme])

  async function fetchTexts() {
    const result = await getSacredTexts()
    if (result.data) setTexts(result.data)
  }

  const themes = ['all', ...new Set(texts.map((t) => t.theme))]

  const filteredTexts = selectedTheme === 'all'
    ? texts
    : texts.filter((t) => t.theme === selectedTheme)

  const totalPages = Math.ceil(filteredTexts.length / ITEMS_PER_PAGE)
  const paginatedTexts = filteredTexts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36  pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8a75e]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">
              {heroBadge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            {heroHeading1}
            <span className="block text-[#C8A75E] mt-2">{heroHeading2}</span>
          </h1>

          {heroSubtitle && (
            <p className="text-base sm:text-lg md:text-xl text-premium leading-relaxed max-w-3xl mx-auto px-4">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12 mb-12 sm:mb-16 md:mb-20 text-center">
            <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 text-amber-500" />
            <h2 className="text-xl sm:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4">One Truth, Many Languages</h2>
            <p className="text-base sm:text-lg md:text-xl text-premium leading-relaxed max-w-3xl mx-auto px-4">
              While each sacred text speaks in its own cultural and historical context, they all
              point to the same eternal truths: love, compassion, justice, humility, and the
              recognition of the Divine in all creation.
            </p>
          </div>

          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">Sacred Texts from World Traditions</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-12"></div>
          </div>

          {texts.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-xl font-medium transition-all capitalize ${
                    selectedTheme === theme
                      ? 'bg-[#C8A75E] text-[#0B0F2A] shadow-lg'
                      : 'bg-[#141A3A] text-[#aab0d6] hover:bg-[#1a1f4a] border border-[#C8A75E]/20'
                  }`}
                >
                  {theme === 'all' ? 'All Themes' : theme}
                </button>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {paginatedTexts.map((text) => (
              <SacredTextCard key={text.id} text={text} />
            ))}
          </div>

          {texts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm sm:text-base text-[#aab0d6]/70">Loading sacred texts...</p>
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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">Shared Themes Across Traditions</h2>
            <div className="divider-premium max-w-xs mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-premium max-w-3xl mx-auto px-4">
              Despite differences in language, culture, and historical context, sacred texts
              worldwide speak with one voice on essential spiritual truths
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <ThemeCard
              title="The Golden Rule"
              examples={[
                '"Do unto others as you would have them do unto you." - Christianity',
                '"None of you has faith until he loves for his brother what he loves for himself." - Islam',
                '"What is hateful to you, do not do to your neighbor." - Judaism',
              ]}
            />
            <ThemeCard
              title="Compassion & Love"
              examples={[
                '"Love is patient, love is kind." - Christianity',
                '"God is Beautiful and loves beauty." - Islam',
                '"Hatred does not cease by hatred, but by love alone." - Buddhism',
              ]}
            />
            <ThemeCard
              title="Divine Unity"
              examples={[
                '"Hear O Israel, the Lord is One." - Judaism',
                '"There is no god but God." - Islam',
                '"The Self is one, though it appears to be many." - Hinduism',
              ]}
            />
            <ThemeCard
              title="Service & Justice"
              examples={[
                '"Let justice roll down like waters." - Judaism',
                '"Feed the hungry, give water to the thirsty." - Christianity',
                '"The highest form of worship is service to humanity." - Sikhism',
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">Sufi Perspective on Sacred Texts</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-12"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div>
              <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base text-premium leading-relaxed px-4 sm:px-0">
                <p>
                  Sufis approach sacred texts with a unique lens that honors both the outer (zahir)
                  and inner (batin) meanings. While respecting the literal interpretation, Sufis
                  seek the deeper spiritual realities behind the words.
                </p>
                <p>
                  The great Sufi master Rumi said, &quot;The Quran is like a bride: though you pull aside
                  her veil, she does not show herself to you. Your attempt to unveil her will only
                  increase her concealment.&quot;
                </p>
                <p>
                  This mystical approach leads Sufis to find profound connections between their own
                  scripture and the sacred texts of other traditions, seeing them all as reflections
                  of the same divine light.
                </p>
              </div>
            </div>
            <div className="card-premium p-6 sm:p-8 md:p-10">
              <h3 className="text-lg sm:text-2xl heading-premium text-[#f5f3ee] mb-4 sm:mb-5 md:mb-6 text-center">Levels of Understanding</h3>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <LevelItem
                  level="Shariah"
                  description="The literal, legal interpretation guiding daily practice"
                />
                <LevelItem
                  level="Tariqah"
                  description="The mystical path revealing deeper spiritual meanings"
                />
                <LevelItem
                  level="Haqiqah"
                  description="The ultimate truth transcending words and forms"
                />
                <LevelItem
                  level="Marifah"
                  description="Direct experiential knowledge of divine reality"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">Study Resources</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-12"></div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <ResourceCard
              title="Comparative Scripture Studies"
              description="Explore thematic connections across sacred texts through our guided study programs."
              features={['Monthly study circles', 'Expert-led webinars', 'Discussion forums', 'Reading guides']}
            />
            <ResourceCard
              title="Translation Library"
              description="Access high-quality translations and commentaries from respected scholars across traditions."
              features={['Multi-language access', 'Scholarly commentary', 'Audio recitations', 'Search functionality']}
            />
            <ResourceCard
              title="Interfaith Dialogue Toolkit"
              description="Learn how to facilitate respectful conversations about sacred texts across faith lines."
              features={['Facilitation guides', 'Sample questions', 'Best practices', 'Video tutorials']}
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A] text-[#f5f3ee]">
        <div className="container mx-auto max-w-4xl text-center">
          <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 opacity-80" />
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-4">
            &quot;All the sacred books are branches
            <span className="block mt-2">of the one tree of life.&quot;</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 mb-6 sm:mb-8 px-4">— Hazrat Inayat Khan</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/teachings" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-[#0b0f2a] text-[#0b0f2a] hover:bg-[#c8a75e]/10">
              Explore Teachings
            </Link>
            <Link href="/traditions" className="btn-secondary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 border-2 border-[#c8a75e] text-[#f5f3ee] hover:bg-[#0b0f2a]/10">
              View All Traditions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function SacredTextCard({ text }: { text: SacredText }) {
  const color = themeColors[text.theme] || '#6B7280'
  const IconComponent = themeIcons[text.theme] || BookOpen

  return (
    <div className="card-premium p-6 sm:p-7 md:p-8">
      <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mb-4 sm:mb-5 md:mb-6 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl" style={{ backgroundColor: color }}>
        <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-[#f5f3ee]" />
      </div>
      <h3 className="text-lg sm:text-2xl heading-premium text-[#f5f3ee] mb-2">{text.title}</h3>
      {text.tradition && (
        <p className="text-xs sm:text-sm font-semibold text-[#c8a75e] mb-3 sm:mb-4">{text.tradition.name}</p>
      )}
      <p className="text-sm sm:text-base text-premium leading-relaxed mb-4 sm:mb-5 md:mb-6">{text.source}</p>
      <div className="border-t border-[#aab0d6]/20 pt-4">
        <p className="text-xs sm:text-sm text-premium italic leading-relaxed line-clamp-3">
          &quot;{text.textContent}&quot;
        </p>
      </div>
    </div>
  )
}

function ThemeCard({ title, examples }: any) {
  return (
    <div className="tradition-card p-5 sm:p-6">
      <h3 className="text-base sm:text-xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 text-center">{title}</h3>
      <div className="space-y-3 sm:space-y-4">
        {examples.map((example: string, index: number) => (
          <p key={index} className="text-xs sm:text-sm text-premium italic leading-relaxed border-l-2 border-[#c8a75e] pl-3 sm:pl-4">
            {example}
          </p>
        ))}
      </div>
    </div>
  )
}

function LevelItem({ level, description }: any) {
  return (
    <div className="flex items-start space-x-3 sm:space-x-4">
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#C8A75E] rounded-full mt-1.5 flex-shrink-0"></div>
      <div>
        <h4 className="font-bold text-sm sm:text-base text-[#f5f3ee] mb-1">{level}</h4>
        <p className="text-xs sm:text-sm text-premium">{description}</p>
      </div>
    </div>
  )
}

function ResourceCard({ title, description, features }: any) {
  return (
    <div className="card-premium p-6 sm:p-7 md:p-8">
      <h3 className="text-base sm:text-xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">{title}</h3>
      <p className="text-sm sm:text-base text-premium mb-4 sm:mb-5 md:mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start text-xs sm:text-sm text-premium">
            <span className="text-[#d4b56d] mr-2 mt-1">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
