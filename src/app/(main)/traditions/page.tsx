'use client'

import { useState, useEffect } from 'react'
import { Globe as Globe2 } from 'lucide-react'
import { getTraditions, getTraditionSection } from '@/actions/database'
import Pagination from '@/components/Pagination'

interface Tradition {
  id: string
  name: string
  description: string
  coreValues: string[]
}

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function Traditions() {
  const [traditions, setTraditions] = useState<Tradition[]>([])
  const [unitySection, setUnitySection] = useState<{ title: string; content: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    fetchTraditions()
    fetchUnitySection()
    fetch('/api/page-content?pageKey=traditions')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPageContent(data))
      .catch(() => {})
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Celebrating Diversity'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Honoring All Paths'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'to the Divine'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''

  async function fetchUnitySection() {
    const result = await getTraditionSection('unity_in_diversity')
    if (result.data && !Array.isArray(result.data)) setUnitySection(result.data)
  }

  async function fetchTraditions() {
    const result = await getTraditions()
    if (result.data) setTraditions(result.data)
  }

  const totalPages = Math.ceil(traditions.length / ITEMS_PER_PAGE)
  const paginatedTraditions = traditions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8a75e]" />
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

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
              Faith Traditions We Honor
            </h2>
            <div className="divider-premium max-w-xs mx-auto mb-4 sm:mb-6"></div>
            <p className="text-sm sm:text-base md:text-lg text-premium max-w-3xl mx-auto px-4">
              From ancient wisdom to contemporary expressions of faith, we recognize the sacred
              in every authentic spiritual tradition.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-stretch">
            {paginatedTraditions.map((tradition) => (
              <TraditionCard key={tradition.id} tradition={tradition} />
            ))}
          </div>

          {traditions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm sm:text-base text-[#aab0d6]/70">Loading faith traditions...</p>
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
            <h2 className="text-lg sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 text-center px-4">
              {unitySection?.title || 'Unity in Diversity'}
            </h2>
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base text-premium leading-relaxed">
              {unitySection
                ? unitySection.content.split('\n\n').filter(Boolean).map((p, i, arr) => (
                    i === arr.length - 1 ? (
                      <div key={i} className="border-t border-[#aab0d6]/20 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
                        <p className="font-semibold text-sm sm:text-base md:text-lg text-[#f5f3ee] text-center italic">{p}</p>
                      </div>
                    ) : (
                      <p key={i}>{p}</p>
                    )
                  ))
                : (
                  <>
                    <p>The Sufi masters teach us a profound truth: the Divine is infinite and manifests in countless forms. Just as white light passing through a prism creates a rainbow of colors, the One Truth expresses itself through the beautiful diversity of world religions.</p>
                    <p>This diversity is not a problem to solve but a gift to celebrate. Each tradition offers unique insights, practices, and perspectives that enrich our collective understanding of the sacred. When we honor these differences with respect and curiosity, we discover that beneath surface variations lies a deep unity.</p>
                    <p>All authentic spiritual paths share core values: compassion, justice, truth, love, and service to others. They may express these values through different languages, rituals, and stories, but the essence remains the same - the call to transcend ego, serve others, and connect with the Divine.</p>
                    <div className="border-t border-[#aab0d6]/20 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
                      <p className="font-semibold text-sm sm:text-base md:text-lg text-[#f5f3ee] text-center italic">&quot;The lamps are different, but the Light is the same.&quot; - Rumi</p>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-lg sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
              Shared Values Across Traditions
            </h2>
            <div className="divider-premium max-w-xs mx-auto"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {['Compassion', 'Justice', 'Love', 'Peace', 'Truth', 'Service', 'Wisdom', 'Unity', 'Mercy'].map((value, idx) => (
              <div
                key={value}
                className="card-premium p-6 sm:p-7 md:p-8 text-center group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-xl bg-[#C8A75E] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-xl sm:text-2xl font-bold text-[#0B0F2A]">{value.charAt(0)}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-[#f5f3ee] group-hover:text-[#c8a75e] transition-colors">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// function TraditionCard({ tradition }: { tradition: Tradition }) {
//   return (
//     <div className="tradition-card p-6 sm:p-7 md:p-8 group">
//       <div className="mb-4 sm:mb-5 md:mb-6">
//         <h3 className="text-2xl sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 group-hover:text-[#c8a75e] transition-colors">{tradition.name}</h3>
//         <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed">{tradition.description}</p>
//       </div>
//       <div className="pt-4 sm:pt-5 md:pt-6 border-t border-gray-100">
//         <p className="text-xs font-bold text-[#aab0d6]/70 uppercase tracking-wider mb-2 sm:mb-3">Core Values</p>
//         <div className="flex flex-wrap gap-2">
//           {tradition.coreValues.map((value, idx) => (
//             <span
//               key={idx}
//               className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#141A3A] text-[#C8A75E] rounded-xl text-xs sm:text-sm font-semibold border border-[#C8A75E]/30 hover:border-[#C8A75E] hover:shadow-md transition-all"
//             >
//               {value}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
function TraditionCard({ tradition }: { tradition: Tradition }) {
  const hasCoreValues = tradition.coreValues?.length > 0

  return (
    <div
      className="
        tradition-card
        p-4 sm:p-5 md:p-6
        group
        flex flex-col
        h-full
      "
    >
      {/* TOP CONTENT */}
      <div>
        {/* TITLE */}
        <h3
          className="
            text-xl sm:text-2xl md:text-3xl
            heading-premium
            text-[#f5f3ee]
            mb-4
            group-hover:text-[#c8a75e]
            transition-colors
            break-words
            min-h-[72px]
          "
        >
          {tradition.name}
        </h3>

        {/* DESCRIPTION */}
        <p
          className="
            text-sm sm:text-base md:text-lg
            text-premium
            leading-relaxed
            break-words
            whitespace-pre-line
            min-h-[140px]
          "
        >
          {tradition.description}
        </p>
      </div>

      {/* FIXED CORE VALUES POSITION */}
      <div className="mt-8">
        {hasCoreValues && (
          <>
            {/* Divider always same position */}
            <div className="border-t border-gray-100 pt-4 sm:pt-5 md:pt-6">
              <p
                className="
                  text-xs
                  font-bold
                  text-[#aab0d6]/70
                  uppercase
                  tracking-wider
                  mb-3
                "
              >
                Core Values
              </p>

              {/* Core values start from first line */}
              <div className="flex flex-wrap items-start gap-2 content-start">
                {tradition.coreValues.map((value, idx) => (
                  <span
                    key={idx}
                    className="
                      px-3 py-1.5
                      bg-[#141A3A]
                      text-[#C8A75E]
                      rounded-xl
                      text-[10px] sm:text-xs
                      font-semibold
                      border border-[#C8A75E]/30
                      hover:border-[#C8A75E]
                      hover:shadow-md
                      transition-all
                      whitespace-nowrap
                    "
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}