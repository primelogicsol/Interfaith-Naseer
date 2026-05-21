'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Database,
  BookOpen,
  Users,
  Mail,
  Heart,
  MessageSquare,
  FileText,
  Share2,
  TrendingUp,
  BarChart3,
  Plus,
  ChevronDown,
  ChevronUp,
  Activity,
  Clock,
  Globe2,
  Lightbulb
} from 'lucide-react'

interface DashboardStats {
  traditions: number
  teachings: number
  misconceptions: number
  sacredTexts: number
  peaceInitiatives: number
  movementMembers: number
  newsletterSubscribers: number
  assessmentResults: number
  shareableQuotes: number
  similarityThemes: number
  roleRequests: number
  users: number
  corePillars: number
  aboutContent: number
  aboutValues: number
  aboutLeaders: number
  missionContent: number
  wisdomToAction: number
  impactGoals: number
  featuredPrograms: number
  regionalInitiatives: number
  getInvolved: number
  currentInitiatives: number
  teachingSections: number
  truthSections: number
  traditionSections: number
  sufiContent: number
  approachContent: number
  sufiCards: number
  approachCards: number
  pageContent: number
  founderSections: number
  similarityTeachings: number
}

interface StatCard {
  title: string
  count: number
  icon: any
  color: string
  href: string
  description: string
  adminOnly?: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  // Validate session and check admin role
  useEffect(() => {
    async function validateSession() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          // Not authenticated - redirect to login
          router.push('/login?redirect=/admin')
          return
        }

        const data = await response.json()

        // Check if user has admin role
        if (data.user.role !== 'admin') {
          // Not an admin - redirect to home
          alert('Access denied. Admin privileges required.')
          router.push('/')
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error('Session validation error:', error)
        router.push('/login?redirect=/admin')
      } finally {
        setAuthLoading(false)
      }
    }
    validateSession()
  }, [router])

  useEffect(() => {
    if (!user) return
    loadStats()
  }, [user])

  async function loadStats() {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards: StatCard[] = [
    {
      title: 'Traditions',
      count: stats?.traditions || 0,
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/traditions',
      description: 'Faith traditions and religions'
    },
    {
      title: 'Teachings',
      count: stats?.teachings || 0,
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/teachings',
      description: 'Sacred teachings and wisdom'
    },
    {
      title: 'Users',
      count: stats?.users || 0,
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      href: '/admin/users',
      description: 'Registered user accounts'
    },
    {
      title: 'Role Requests',
      count: stats?.roleRequests || 0,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      href: '/admin/role-requests',
      description: 'Pending role upgrade requests'
    },
    {
      title: 'Misconceptions',
      count: stats?.misconceptions || 0,
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/misconceptions',
      description: 'Common misconceptions addressed'
    },
    {
      title: 'Sacred Texts',
      count: stats?.sacredTexts || 0,
      icon: FileText,
      color: 'from-green-500 to-green-600',
      href: '/admin/sacred-texts',
      description: 'Sacred text passages'
    },
    {
      title: 'Peace Initiatives',
      count: stats?.peaceInitiatives || 0,
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      href: '/admin/peace-initiatives',
      description: 'Peace-building initiatives'
    },
    {
      title: 'Movement Members',
      count: stats?.movementMembers || 0,
      icon: Activity,
      color: 'from-indigo-500 to-indigo-600',
      href: '/admin/movement-members',
      description: 'Registered movement members'
    },
    {
      title: 'Newsletter Subscribers',
      count: stats?.newsletterSubscribers || 0,
      icon: Mail,
      color: 'from-teal-500 to-teal-600',
      href: '/admin/newsletter-subscribers',
      description: 'Active newsletter subscribers'
    },
    {
      title: 'Shareable Quotes',
      count: stats?.shareableQuotes || 0,
      icon: Share2,
      color: 'from-yellow-500 to-yellow-600',
      href: '/admin/shareable-quotes',
      description: 'Social media quote cards'
    },
    {
      title: 'Similarity Themes',
      count: stats?.similarityThemes || 0,
      icon: TrendingUp,
      color: 'from-red-500 to-red-600',
      href: '/admin/similarity-themes',
      description: 'Interfaith similarity themes'
    },
    {
      title: 'Assessment Results',
      count: stats?.assessmentResults || 0,
      icon: BarChart3,
      color: 'from-cyan-500 to-cyan-600',
      href: '/admin/assessment-results',
      description: 'Completed faith assessments'
    },
    {
      title: 'Core Pillars',
      count: stats?.corePillars || 0,
      icon: Database,
      color: 'from-amber-500 to-amber-600',
      href: '/admin/core-pillars',
      description: 'Mission core pillar cards'
    },
    {
      title: 'About Content',
      count: stats?.aboutContent || 0,
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      href: '/admin/pages/about',
      description: 'About page content sections',
    },
    {
      title: 'About Values',
      count: stats?.aboutValues || 0,
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      href: '/admin/pages/about',
      description: 'Core value cards on about page',
    },
    {
      title: 'About Leaders',
      count: stats?.aboutLeaders || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/pages/about',
      description: 'Leadership team profiles',
    },
    {
      title: 'Mission Content',
      count: stats?.missionContent || 0,
      icon: FileText,
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/pages/mission',
      description: 'Mission page sections',
    },
    {
      title: 'Wisdom to Action',
      count: stats?.wisdomToAction || 0,
      icon: Lightbulb,
      color: 'from-amber-500 to-amber-600',
      href: '/admin/peace',
      description: 'Mission to action entries',
    },
    {
      title: 'Impact Goals',
      count: stats?.impactGoals || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      href: '/admin/peace',
      description: 'Impact goal statistics',
    },
    {
      title: 'Featured Programs',
      count: stats?.featuredPrograms || 0,
      icon: Lightbulb,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/peace',
      description: 'Featured program cards',
    },
    {
      title: 'Regional Initiatives',
      count: stats?.regionalInitiatives || 0,
      icon: Globe2,
      color: 'from-cyan-500 to-cyan-600',
      href: '/admin/peace',
      description: 'Regional initiative entries',
    },
    {
      title: 'Get Involved',
      count: stats?.getInvolved || 0,
      icon: Activity,
      color: 'from-teal-500 to-teal-600',
      href: '/admin/peace',
      description: 'Get involved call-to-action cards',
    },
    {
      title: 'Current Initiatives',
      count: stats?.currentInitiatives || 0,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/peace',
      description: 'Active initiative cards',
    },
    {
      title: 'Teaching Sections',
      count: stats?.teachingSections || 0,
      icon: BookOpen,
      color: 'from-violet-500 to-violet-600',
      href: '/admin/pages/teachings',
      description: 'Teachings page content sections',
    },
    {
      title: 'Truth Sections',
      count: stats?.truthSections || 0,
      icon: MessageSquare,
      color: 'from-rose-500 to-rose-600',
      href: '/admin/pages/truth',
      description: 'Truth page content sections',
    },
    {
      title: 'Tradition Sections',
      count: stats?.traditionSections || 0,
      icon: Database,
      color: 'from-sky-500 to-sky-600',
      href: '/admin/pages/traditions',
      description: 'Traditions page content sections',
    },
    {
      title: 'Sufi Content',
      count: stats?.sufiContent || 0,
      icon: BookOpen,
      color: 'from-fuchsia-500 to-fuchsia-600',
      href: '/admin/pages/teachings',
      description: 'Sufi teachings page sections',
    },
    {
      title: 'Approach Content',
      count: stats?.approachContent || 0,
      icon: FileText,
      color: 'from-lime-500 to-lime-600',
      href: '/admin/pages/traditions',
      description: 'Approach page content sections',
    },
    {
      title: 'Sufi Cards',
      count: stats?.sufiCards || 0,
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/sufi-cards',
      description: 'Sufi teachings card entries',
    },
    {
      title: 'Approach Cards',
      count: stats?.approachCards || 0,
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      href: '/admin/approach-cards',
      description: 'Approach page card entries',
    },
    {
      title: 'Page Content',
      count: stats?.pageContent || 0,
      icon: FileText,
      color: 'from-teal-500 to-teal-600',
      href: '/admin/page-content',
      description: 'Page headings and section text',
    },
    {
      title: 'Founder Sections',
      count: stats?.founderSections || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/founder',
      description: 'Founder page profiles',
    },
  ]

  const totalContent = (stats?.traditions || 0) + (stats?.teachings || 0) + (stats?.sacredTexts || 0) + (stats?.corePillars || 0) + (stats?.aboutContent || 0)
  const totalUsers = (stats?.movementMembers || 0) + (stats?.newsletterSubscribers || 0)

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a75e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-premium">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Don't render if user is not authenticated (will be redirected)
  if (!user) {
    return null
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-right md:text-center text-2xl md:text-3xl lg:text-4xl font-bold text-[#f5f3ee] mb-2">Dashboard Overview</h1>
        <p className="text-premium-light text-center mt-3 md:mt-0 text-xs md:text-sm lg:text-base">Welcome back! Here's what's happening with your interfaith platform.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-[#c8a75e] to-[#d4b56d] rounded-xl">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#0b0f2a]" />
            </div>
            <span className="text-xs text-premium-light">Total Content</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#f5f3ee] mb-1">{totalContent}</div>
          <p className="text-sm text-premium-light">Traditions, Teachings & Texts</p>
        </div>

        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xs text-premium-light">Community</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#f5f3ee] mb-1">{totalUsers}</div>
          <p className="text-sm text-premium-light">Members & Subscribers</p>
        </div>

        <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#c8a75e]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xs text-premium-light">Last Updated</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#f5f3ee] mb-1">Today</div>
          <p className="text-sm text-premium-light">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statCards.filter(card => !card.adminOnly || user?.role === 'admin').map((card) => {
          const Icon = card.icon
          const isExpanded = expandedCard === card.title

          return (
            <div
              key={card.title}
              className="glass-effect rounded-xl sm:rounded-2xl overflow-hidden border border-[#c8a75e]/10 hover:border-[#c8a75e]/30 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : card.title)}
                    className="p-2 hover:bg-[#c8a75e]/10 rounded-xl transition-colors"
                  >

                  </button>
                </div>

                <div className="mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-[#f5f3ee] mb-1">{card.count}</div>
                  <h3 className="text-lg font-semibold text-[#f5f3ee]">{card.title}</h3>
                  <p className="text-sm text-premium-light mt-1">{card.description}</p>
                </div>

                  <div className="flex flex-col sm:flex-row w-full justify-between items-stretch sm:items-center gap-2 pt-4 border-t border-[#c8a75e]/10 animate-fadeIn">
                   <Link
                  href={card.href}
                  className="block px-4 py-2 sm:px-6 sm:py-3 bg-[#0b0f2a]/20 hover:bg-[#c8a75e]/10 transition-colors text-center rounded-lg"
                >
                  <span className="text-sm text-[#c8a75e] font-medium">Manage →</span>
                </Link>
                    <Link
                      href={`${card.href}/new`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#f5f3ee] rounded-lg sm:rounded-xl hover:shadow-premium transition-all text-xs sm:text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Add New</span>
                    </Link>
                  </div>
              </div>

            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass-effect rounded-xl sm:rounded-2xl p-4 lg:p-6 border border-[#c8a75e]/20">
        <h2 className="text-xl lg:text-2xl font-bold text-[#f5f3ee] mb-4 lg:mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <Link
            href="/admin/traditions/new"
            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl hover:shadow-premium transition-all group"
          >
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-[#f5f3ee] font-medium group-hover:text-blue-400 transition-colors">Add Tradition</div>
              <div className="text-xs text-premium-light">Create new faith tradition</div>
            </div>
          </Link>

          <Link
            href="/admin/teachings/new"
            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl hover:shadow-premium transition-all group"
          >
            <BookOpen className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-[#f5f3ee] font-medium group-hover:text-purple-400 transition-colors">Add Teaching</div>
              <div className="text-xs text-premium-light">Create sacred teaching</div>
            </div>
          </Link>

          <Link
            href="/admin/sacred-texts/new"
            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl hover:shadow-premium transition-all group"
          >
            <FileText className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-[#f5f3ee] font-medium group-hover:text-green-400 transition-colors">Add Sacred Text</div>
              <div className="text-xs text-premium-light">Create text passage</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
