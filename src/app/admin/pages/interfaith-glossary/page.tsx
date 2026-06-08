'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ContentSectionEditor from '@/components/ContentSectionEditor'

export default function InterfaithGlossaryEditor() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Interfaith Glossary Editor</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">
          Manage headings, descriptions, and text content for the Interfaith Glossary page
        </p>
      </div>

      <ContentSectionEditor pageKey="interfaith-glossary" />
    </div>
  )
}
