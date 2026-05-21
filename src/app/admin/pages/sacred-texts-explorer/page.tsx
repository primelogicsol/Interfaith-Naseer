'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, ExternalLink, ArrowLeft } from 'lucide-react'
import ContentSectionEditor from '@/components/ContentSectionEditor'

interface SacredText {
  id: string
  title: string
  theme: string
}

export default function SacredTextsExplorerEditor() {
  const [sacredTexts, setSacredTexts] = useState<SacredText[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const stRes = await fetch('/api/sacred-texts')
        if (stRes.ok) setSacredTexts(await stRes.json())
      } catch (err) {
        console.error('Error loading sacred texts page data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading Sacred Texts Explorer Editor...</p>
        </div>
      </div>
    )
  }

  const themeCounts = sacredTexts.reduce<Record<string, number>>((acc, t) => {
    acc[t.theme] = (acc[t.theme] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Sacred Texts Explorer Editor</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">
          Manage all content for the Sacred Texts Explorer page
        </p>
      </div>

      <div className="grid gap-6">

           <ContentSectionEditor pageKey="sacred-texts-explorer" />
           
        {/* Sacred Texts */}
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#f5f3ee]">Sacred Texts</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 mt-1">
                  {sacredTexts.length} text{sacredTexts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          {Object.keys(themeCounts).length > 0 && (
            <div className="space-y-2 mb-4">
              {Object.entries(themeCounts).map(([theme, count]) => (
                <p key={theme} className="text-sm text-premium-light">
                  Ã¢â‚¬Â¢ <span className="text-[#f5f3ee] capitalize">{theme}</span>: {count} text{count !== 1 ? 's' : ''}
                </p>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-[#c8a75e]/10">
            <Link
              href="/admin/sacred-texts"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a75e]/10 hover:bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Manage Sacred Texts
            </Link>
          </div>
        </div>
      </div>

   
    </div>
  )
}
