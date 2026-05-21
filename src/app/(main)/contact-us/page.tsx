'use client'

import { useState, useEffect } from 'react'
import { Mail, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface PageContent {
  sectionKey: string
  title: string | null
  content: string | null
}

export default function ContactUsPage() {
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/page-content?pageKey=contact-us')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setPageContent(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Get in Touch'
  const heroHeading = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Contact Us'
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
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-[#c8a75e]/10 border border-[#c8a75e]/20 rounded-full text-[10px] sm:text-xs font-medium text-[#c8a75e] uppercase tracking-wider mb-4 sm:mb-6">
            {heroBadge}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ee] mb-3 sm:mb-4">
            {heroHeading}
          </h1>
          {heroSubtitle && (
            <p className="text-sm sm:text-base text-premium-light max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div className="glass-effect rounded-xl p-5 sm:p-6 border border-[#c8a75e]/20">
              <Mail className="w-5 h-5 text-[#c8a75e] mb-3" />
              <h3 className="text-sm font-semibold text-[#f5f3ee] mb-1">Email</h3>
              <p className="text-xs sm:text-sm text-premium-light break-all">
                {typeof window !== 'undefined' ? 'contact@interfaithpeacebridge.org' : 'contact@interfaithpeacebridge.org'}
              </p>
            </div>
            <div className="glass-effect rounded-xl p-5 sm:p-6 border border-[#c8a75e]/20">
              <Globe className="w-5 h-5 text-[#c8a75e] mb-3" />
              <h3 className="text-sm font-semibold text-[#f5f3ee] mb-1">Follow Us</h3>
              <p className="text-xs sm:text-sm text-premium-light">
                Stay connected through our newsletter and social channels.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  </div>
  )
}

function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setLoggedIn(true)
          setName(data.user.fullName)
          setEmail(data.user.email)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }
      setSent(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="glass-effect rounded-xl p-8 sm:p-12 text-center border border-[#c8a75e]/20">
        <CheckCircle className="w-16 h-16 text-[#c8a75e] mx-auto mb-4" />
        <h3 className="text-xl sm:text-2xl font-bold text-[#f5f3ee] mb-2">Thank You!</h3>
        <p className="text-sm sm:text-base text-premium-light mb-6">Your message has been sent. We will get back to you soon.</p>
        <button onClick={() => setSent(false)} className="text-[#c8a75e] hover:text-[#d4b56d] text-sm underline transition-colors">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-5 sm:p-8 border border-[#c8a75e]/20 space-y-5 sm:space-y-6">
      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
        <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#f5f3ee] mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={loggedIn}
              required
              placeholder="Enter your name"
              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0b0f2a] border border-[#c8a75e]/30 rounded-lg sm:rounded-xl text-[#f5f3ee] text-sm placeholder:text-[#aab0d6]/50 focus:outline-none focus:border-[#c8a75e] focus:ring-1 focus:ring-[#c8a75e]/30 transition-all ${loggedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#f5f3ee] mb-2">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={loggedIn}
              required
              placeholder="Enter your email"
              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0b0f2a] border border-[#c8a75e]/30 rounded-lg sm:rounded-xl text-[#f5f3ee] text-sm placeholder:text-[#aab0d6]/50 focus:outline-none focus:border-[#c8a75e] focus:ring-1 focus:ring-[#c8a75e]/30 transition-all ${loggedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
          </div>
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#f5f3ee] mb-2">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder="What is this about?"
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0b0f2a] border border-[#c8a75e]/30 rounded-lg sm:rounded-xl text-[#f5f3ee] text-sm placeholder:text-[#aab0d6]/50 focus:outline-none focus:border-[#c8a75e] focus:ring-1 focus:ring-[#c8a75e]/30 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#f5f3ee] mb-2">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Write your message here..."
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0b0f2a] border border-[#c8a75e]/30 rounded-lg sm:rounded-xl text-[#f5f3ee] text-sm placeholder:text-[#aab0d6]/50 focus:outline-none focus:border-[#c8a75e] focus:ring-1 focus:ring-[#c8a75e]/30 transition-all resize-none"
        />
      </div>
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={sending}
        className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-lg sm:rounded-xl font-semibold hover:shadow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {sending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}