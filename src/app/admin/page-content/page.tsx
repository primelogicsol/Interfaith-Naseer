'use client'

import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'

const PAGES: { label: string; href: string; pageKey: string }[] = [
  { label: 'Mission', href: '/admin/pages/mission', pageKey: 'mission' },
  { label: 'Teachings', href: '/admin/pages/teachings', pageKey: 'teachings' },
  { label: 'Sacred Texts Explorer', href: '/admin/pages/sacred-texts-explorer', pageKey: 'sacred-texts-explorer' },
  { label: 'Truth', href: '/admin/pages/truth', pageKey: 'truth' },
  { label: 'Traditions', href: '/admin/pages/traditions', pageKey: 'traditions' },
  { label: 'About', href: '/admin/pages/about', pageKey: 'about' },
  { label: 'Peace', href: '/admin/peace', pageKey: 'peace' },
  { label: 'Peace Initiatives', href: '/admin/pages/peace-initiatives', pageKey: 'peace-initiatives' },
  { label: 'Contact Us', href: '/admin/pages/contact-us', pageKey: 'contact-us' },
]

export default function PageContentOverview() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Page Content</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">
          Edit page headings, subtitles, and section text from each page&apos;s editor
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((page) => (
          <Link
            key={page.pageKey}
            href={page.href}
            className="glass-effect rounded-xl p-5 border border-[#c8a75e]/20 hover:border-[#c8a75e]/40 transition-all group"
          >
            <Globe className="w-8 h-8 text-[#c8a75e] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-semibold text-[#f5f3ee]">{page.label}</h3>
            <p className="text-xs text-premium-light mt-1">Edit content sections</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
