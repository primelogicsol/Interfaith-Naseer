'use client'

import { useEffect, useState, useRef } from 'react'
import { Share2, Download, Heart, Copy, Check, Sparkles, MessageCircle } from 'lucide-react'

interface ShareableQuote {
  id: string
  quoteText: string
  backgroundStyle: string
  shareCount: number
  sacredText?: {
    title: string
    source: string
    tradition?: {
      name: string
      color?: string
    }
  }
}

const GRADIENT_PRESETS: Record<string, string> = {
  'gradient-1': '#9B59B6',
  'gradient-2': '#14B8A6',
  'gradient-3': '#E07070',
  'gradient-4': '#3B82F6',
  'gradient-5': '#C026D3',
  'gradient-6': '#27AE60',
}

function resolveBackgroundColor(style: string): string {
  if (GRADIENT_PRESETS[style]) return GRADIENT_PRESETS[style]
  return style || '#9B59B6'
}

export default function ShareQuotes() {
  const [quotes, setQuotes] = useState<ShareableQuote[]>([])
  const [selectedQuote, setSelectedQuote] = useState<ShareableQuote | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    loadQuotes()
  }, [sortBy])

  async function loadQuotes() {
    setLoading(true)
    try {
      const response = await fetch(`/api/shareable-quotes?sortBy=${sortBy}`)
      if (!response.ok) throw new Error('Failed to load quotes')

      const data = await response.json()
      setQuotes(data)
      if (!selectedQuote && data.length > 0) {
        setSelectedQuote(data[0])
      }
    } catch (error) {
      console.error('Error loading quotes:', error)
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }

  async function incrementShareCount(quoteId: string) {
    try {
      const quote = quotes.find(q => q.id === quoteId)
      if (!quote) return

      await fetch('/api/shareable-quotes/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId })
      })

      setQuotes(quotes.map(q =>
        q.id === quoteId ? { ...q, shareCount: q.shareCount + 1 } : q
      ))
    } catch (error) {
      console.error('Error updating share count:', error)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadQuoteImage(quote: ShareableQuote) {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!quote.sacredText || !quote.sacredText.tradition) return

    canvas.width = 1200
    canvas.height = 630

    const gradientColors: Record<string, string[]> = {
      'gradient-1': ['#2563eb', '#9333ea', '#ec4899'],
      'gradient-2': ['#14b8a6', '#059669', '#06b6d4'],
      'gradient-3': ['#f97316', '#dc2626', '#ec4899'],
      'gradient-4': ['#4f46e5', '#2563eb', '#14b8a6'],
      'gradient-5': ['#7c3aed', '#c026d3', '#ec4899'],
      'gradient-6': ['#16a34a', '#14b8a6', '#2563eb'],
    }

    const bgColors = gradientColors[quote.backgroundStyle]
    if (bgColors) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, bgColors[0])
      gradient.addColorStop(0.5, bgColors[1])
      gradient.addColorStop(1, bgColors[2])
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = quote.backgroundStyle || '#9B59B6'
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(60, 60, canvas.width - 120, canvas.height - 120)

    ctx.fillStyle = 'white'
    ctx.font = 'bold 56px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const maxWidth = canvas.width - 160
    const lineHeight = 70
    const words = quote.quoteText.split(' ')
    let line = ''
    let y = canvas.height / 2 - 60

    words.forEach((word, index) => {
      const testLine = line + word + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && index > 0) {
        ctx.fillText(line, canvas.width / 2, y)
        line = word + ' '
        y += lineHeight
      } else {
        line = testLine
      }
    })
    ctx.fillText(line, canvas.width / 2, y)

    ctx.font = '24px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillText(
      `${quote.sacredText.source} - ${quote.sacredText.tradition.name}`,
      canvas.width / 2,
      canvas.height - 100
    )

    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText('Interfaith Peace Bridge', canvas.width / 2, canvas.height - 50)

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quote-${quote.id}.png`
      a.click()
      URL.revokeObjectURL(url)
      incrementShareCount(quote.id)
    })
  }

  function shareToSocial(quote: ShareableQuote, platform: 'twitter' | 'facebook' | 'whatsapp') {
    if (!quote.sacredText || !quote.sacredText.tradition) return

    const text = `"${quote.quoteText}" - ${quote.sacredText.source} (${quote.sacredText.tradition.name})`
    const url = window.location.origin

    let shareUrl = ''
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    } else if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
    incrementShareCount(quote.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-base sm:text-lg text-premium-light">Loading quotes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 pt-28 md:pt-36 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
            <Share2 className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gradient-primary animate-float" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 px-4">
            <span className="text-gradient-primary">Share</span> Sacred Wisdom
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-premium-light max-w-3xl mx-auto leading-relaxed px-4">
            Beautiful, shareable quote cards from world religions. Download or share directly to social media and spread interfaith understanding.
          </p>
        </div>

        <div className="glass-effect rounded-xl p-4 sm:p-5 md:p-6 mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-premium-light" />
              <span className="text-sm sm:text-base text-premium-light">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    sortBy === 'popular'
                      ? 'bg-[#C8A75E] text-[#f5f3ee]'
                      : 'bg-[#0b0f2a]/5 text-premium-light hover:bg-[#0b0f2a]/10'
                  }`}
                >
                  Most Shared
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    sortBy === 'recent'
                      ? 'bg-[#C8A75E] text-[#f5f3ee]'
                      : 'bg-[#0b0f2a]/5 text-premium-light hover:bg-[#0b0f2a]/10'
                  }`}
                >
                  Recently Added
                </button>
              </div>
            </div>
            <div className="text-premium-light text-xs sm:text-sm">
              {quotes.length} quotes available
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 space-y-3 sm:space-y-4 max-h-[600px] sm:max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {quotes.map(quote => (
              <button
                key={quote.id}
                onClick={() => setSelectedQuote(quote)}
                className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all ${
                  selectedQuote?.id === quote.id
                    ? 'bg-[#C8A75E]/20 border-2 border-[#c8a75e]'
                    : 'glass-effect border border-[#c8a75e]/10 hover:border-[#c8a75e]/20'
                }`}
              >
                <p className="text-sm sm:text-base text-[#f5f3ee] font-medium mb-2 line-clamp-2">"{quote.quoteText}"</p>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-premium-light">{quote.sacredText?.source}</span>
                  <div className="flex items-center gap-1 text-premium-light">
                    <Share2 className="w-3 h-3" />
                    <span>{quote.shareCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedQuote && selectedQuote.sacredText && selectedQuote.sacredText.tradition && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div
                    className={`relative rounded-xl p-8 sm:p-10 md:p-12 min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center text-center shadow-premium-lg overflow-hidden`}
                    style={{ backgroundColor: resolveBackgroundColor(selectedQuote.backgroundStyle) }}
                  >
                  <div className="absolute inset-0 bg-[#0b0f2a]/10 backdrop-blur-sm"></div>

                  <div className="relative z-10">
                    <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#f5f3ee] leading-tight mb-6 sm:mb-8">
                      "{selectedQuote.quoteText}"
                    </blockquote>
                    <p className="text-base sm:text-lg md:text-xl text-[#f5f3ee]/90 mb-2">
                      {selectedQuote.sacredText.source}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-[#f5f3ee]/80">
                      {selectedQuote.sacredText.tradition.name}
                    </p>
                    <div className="mt-6 sm:mt-8 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0b0f2a]/20 backdrop-blur-md rounded-xl">
                      <span className="text-[#f5f3ee] font-medium text-xs sm:text-sm">Interfaith Peace Bridge</span>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-xl p-4 sm:p-5 md:p-6">
                  <h3 className="text-sm sm:text-lg font-semibold text-[#f5f3ee] mb-3 sm:mb-4">Share this quote</h3>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                    <button
                      onClick={() => downloadQuoteImage(selectedQuote)}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#C8A75E] text-[#f5f3ee] rounded-xl hover:shadow-premium transition-all hover:scale-105"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Download</span>
                    </button>

                    <button
                      onClick={() => shareToSocial(selectedQuote, 'whatsapp')}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#25D366] text-[#f5f3ee] rounded-xl hover:shadow-premium transition-all hover:scale-105"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">WhatsApp</span>
                    </button>

                    <button
                      onClick={() => shareToSocial(selectedQuote, 'twitter')}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1DA1F2] text-[#f5f3ee] rounded-xl hover:shadow-premium transition-all hover:scale-105"
                    >
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Twitter</span>
                    </button>

                    <button
                      onClick={() => shareToSocial(selectedQuote, 'facebook')}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#4267B2] text-[#f5f3ee] rounded-xl hover:shadow-premium transition-all hover:scale-105"
                    >
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Facebook</span>
                    </button>

                    <button
                      onClick={() => {
                        if (selectedQuote.sacredText?.source && selectedQuote.sacredText?.tradition?.name) {
                          copyToClipboard(`"${selectedQuote.quoteText}" - ${selectedQuote.sacredText.source} (${selectedQuote.sacredText.tradition.name})`)
                        }
                      }}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0b0f2a]/10 text-[#f5f3ee] rounded-xl hover:bg-[#0b0f2a]/20 transition-all hover:scale-105"
                    >
                      {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                      <span className="text-xs sm:text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#0b0f2a]/5 rounded-xl">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div className="flex-1">
                      <p className="text-sm sm:text-base text-[#f5f3ee] font-medium">This quote has been shared {selectedQuote.shareCount} times</p>
                      <p className="text-premium-light text-xs sm:text-sm">Help spread interfaith understanding by sharing it!</p>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-xl p-4 sm:p-5 md:p-6">
                  <h3 className="text-sm sm:text-lg font-semibold text-[#f5f3ee] mb-2 sm:mb-3">About this teaching</h3>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-premium-light">
                    <p><span className="text-[#f5f3ee] font-medium">Title:</span> {selectedQuote.sacredText.title}</p>
                    <p><span className="text-[#f5f3ee] font-medium">Source:</span> {selectedQuote.sacredText.source}</p>
                    <p>
                      <span className="text-[#f5f3ee] font-medium">Tradition:</span>{' '}
                      <span style={{ color: selectedQuote.sacredText.tradition.color }}>
                        {selectedQuote.sacredText.tradition.name}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
