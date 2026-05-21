'use client'

import { useState, useEffect } from 'react'
import { Heart, Sparkles, CheckCircle, Target } from 'lucide-react'
import { getAssessmentQuestions, saveAssessmentResult } from '@/actions/database'

interface Question {
  id: string
  questionText: string
  category: string
  orderIndex: number
}

interface Answer {
  questionId: string
  category: string
  value: number
}

interface User {
  id: string
  email: string
  fullName: string
  role: string
}

export default function FaithAssessment() {
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [existingResult, setExistingResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState('')

  // Check if user is logged in — redirect to login if not
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
            // Fetch existing assessment result
            const res = await fetch('/api/assessment/results/mine')
            if (res.ok) {
              const mine = await res.json()
              if (mine.result) {
                setExistingResult(mine.result)
                setShowResults(true)
              }
            }
          } else {
            window.location.href = '/login?redirect=/assessment'
            return
          }
        } else {
          window.location.href = '/login?redirect=/assessment'
          return
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        window.location.href = '/login?redirect=/assessment'
        return
      } finally {
        setLoadingAuth(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const result = await getAssessmentQuestions()
      if (result.error) throw new Error(result.error)
      setQuestions(result.data || [])
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (value: number) => {
    const question = questions[currentQuestion]
    const newAnswers = [...answers, {
      questionId: question.id,
      category: question.category,
      value: value
    }]

    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = async (allAnswers: Answer[]) => {
    let peaceScore = 0
    let toleranceScore = 0
    let compassionScore = 0
    let understandingScore = 0

    allAnswers.forEach(answer => {
      const points = answer.value

      if (answer.category === 'hatred') {
        const invertedPoints = 6 - points
        peaceScore += invertedPoints
        toleranceScore += invertedPoints
        compassionScore += invertedPoints
        understandingScore += invertedPoints
      } else {
        switch (answer.category) {
          case 'peace':
            peaceScore += points
            break
          case 'tolerance':
            toleranceScore += points
            break
          case 'compassion':
            compassionScore += points
            break
          case 'understanding':
            understandingScore += points
            break
        }
      }
    })

    const peaceQuestions = allAnswers.filter(a => a.category === 'peace' || a.category === 'hatred').length
    const toleranceQuestions = allAnswers.filter(a => a.category === 'tolerance' || a.category === 'hatred').length
    const compassionQuestions = allAnswers.filter(a => a.category === 'compassion' || a.category === 'hatred').length
    const understandingQuestions = allAnswers.filter(a => a.category === 'understanding' || a.category === 'hatred').length

    const maxPeaceScore = peaceQuestions * 5
    const maxToleranceScore = toleranceQuestions * 5
    const maxCompassionScore = compassionQuestions * 5
    const maxUnderstandingScore = understandingQuestions * 5

    const totalMaxScore = maxPeaceScore + maxToleranceScore + maxCompassionScore + maxUnderstandingScore
    const overallScore = peaceScore + toleranceScore + compassionScore + understandingScore
    const percentage = (overallScore / totalMaxScore) * 100

    let category = ''
    let title = ''
    let description = ''
    let color = ''

    if (percentage >= 75) {
      category = 'peace_seeker'
      title = 'Peace Seeker & Bridge Builder'
      description = 'You embody the spirit of interfaith harmony! Your heart is open to understanding, compassion flows naturally from you, and you actively seek peace across religious divides. You are a living bridge between communities.'
      color = '#27AE60'
    } else if (percentage >= 50) {
      category = 'bridge_builder'
      title = 'Emerging Bridge Builder'
      description = 'You are on a beautiful journey toward interfaith understanding. While you have genuine compassion and openness, there is room to deepen your practice of tolerance and peace. Continue learning, questioning, and growing.'
      color = '#C8A75E'
    } else {
      category = 'needs_reflection'
      title = 'Opportunity for Reflection'
      description = 'This assessment reveals areas where fear, misunderstanding, or prejudice may be influencing your relationship with other faiths. This is an invitation to honest self-examination and growth. Every journey toward peace begins with awareness.'
      color = '#D4A07B'
    }

    const resultData = {
      peace_score: peaceScore,
      tolerance_score: toleranceScore,
      compassion_score: compassionScore,
      understanding_score: understandingScore,
      overall_score: overallScore,
      percentage: Math.round(percentage),
      result_category: category,
      title,
      description,
      color,
      max_peace_score: maxPeaceScore,
      max_tolerance_score: maxToleranceScore,
      max_compassion_score: maxCompassionScore,
      max_understanding_score: maxUnderstandingScore
    }

    const sessionId = crypto.randomUUID()

    try {
      await fetch('/api/assessment/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          peaceScore,
          toleranceScore,
          compassionScore,
          understandingScore,
          overallScore,
          resultCategory: category,
          answers: allAnswers,
          country: country || undefined,
          userId: user?.id,
        })
      })
    } catch (error) {
      console.error('Error saving results:', error)
    }

    setResults(resultData)
    setShowResults(true)
  }

  // Load existing result for display
  useEffect(() => {
    if (existingResult && !answers.length) {
      const catMap: Record<string, string> = {
        peace_seeker: 'Peace Seeker & Bridge Builder',
        bridge_builder: 'Emerging Bridge Builder',
        needs_reflection: 'Opportunity for Reflection',
      }
      const colorMap: Record<string, string> = {
        peace_seeker: '#27AE60',
        bridge_builder: '#C8A75E',
        needs_reflection: '#D4A07B',
      }
      setResults({
        peace_score: existingResult.peace_score || 0,
        tolerance_score: existingResult.tolerance_score || 0,
        compassion_score: existingResult.compassion_score || 0,
        understanding_score: existingResult.understanding_score || 0,
        overall_score: existingResult.overall_score || 0,
        percentage: existingResult.overall_score ? Math.round((existingResult.overall_score / (20 * 5)) * 100) : 0,
        result_category: existingResult.result_category || '',
        title: catMap[existingResult.result_category as string] || 'Assessment Result',
        color: colorMap[existingResult.result_category as string] || '#C8A75E',
        max_peace_score: 25,
        max_tolerance_score: 25,
        max_compassion_score: 25,
        max_understanding_score: 25,
      })
    }
  }, [existingResult])

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setResults(null)
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#c8a75e] border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-premium">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <span className="text-xs sm:text-sm font-semibold text-[#D4A07B]">
                {existingResult ? 'Your Previous Result' : 'Your Results'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">{results.title}</h1>
          </div>

          {/* Account linking message for authenticated users */}
          {user && (
            <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-premium">
                ✅ Your results have been saved to your account. View your assessment history in your{' '}
                <a href="/profile" className="text-[#c8a75e] font-bold hover:underline">
                  profile
                </a>.
              </p>
            </div>
          )}

          {/* Prompt to create account for guests */}
          {!user && (
            <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-premium">
                💡 Want to save your results?{' '}
                <a href="/register" className="text-[#c8a75e] font-bold hover:underline">
                  Create an account
                </a>{' '}
                to track your progress over time.
              </p>
            </div>
          )}

          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12 mb-6 sm:mb-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-xl flex items-center justify-center shadow-2xl`} style={{ backgroundColor: results.color }}>
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f3ee]">{results.percentage}%</span>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-premium leading-relaxed px-4">{results.description}</p>
            </div>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 mt-8 sm:mt-10 md:mt-12">
              <ScoreDimension
                label="Peace & Harmony"
                score={results.peace_score}
                maxScore={results.max_peace_score}
                color="emerald"
              />
              <ScoreDimension
                label="Tolerance & Acceptance"
                score={results.tolerance_score}
                maxScore={results.max_tolerance_score}
                color="blue"
              />
              <ScoreDimension
                label="Compassion & Love"
                score={results.compassion_score}
                maxScore={results.max_compassion_score}
                color="rose"
              />
              <ScoreDimension
                label="Understanding & Wisdom"
                score={results.understanding_score}
                maxScore={results.max_understanding_score}
                color="violet"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
            {results.result_category === 'peace_seeker' && (
              <>
                <RecommendationCard
                  icon={<Heart className="w-8 h-8" />}
                  title="Share Your Light"
                  description="Your understanding is a gift. Consider joining our community to help others on their journey toward interfaith harmony."
                  color="#E07070"
                />
                <RecommendationCard
                  icon={<Target className="w-8 h-8" />}
                  title="Deepen Your Practice"
                  description="Explore our advanced interfaith dialogue training to become a certified peace facilitator in your community."
                  color="#C8A75E"
                />
              </>
            )}
            {results.result_category === 'bridge_builder' && (
              <>
                <RecommendationCard
                  icon={<Sparkles className="w-8 h-8" />}
                  title="Continue Learning"
                  description="Explore our sacred texts library to deepen your understanding of different faith traditions."
                  color="#C8A75E"
                />
                <RecommendationCard
                  icon={<Heart className="w-8 h-8" />}
                  title="Join Dialogues"
                  description="Participate in our monthly interfaith dialogue circles to practice compassionate listening."
                  color="#27AE60"
                />
              </>
            )}
            {results.result_category === 'needs_reflection' && (
              <>
                <RecommendationCard
                  icon={<Heart className="w-8 h-8" />}
                  title="Start with Compassion"
                  description="Begin by reading stories of people from different faiths. Understanding grows from genuine human connection."
                  color="#D4A07B"
                />
                <RecommendationCard
                  icon={<Sparkles className="w-8 h-8" />}
                  title="Question Your Assumptions"
                  description="Our Truth Library helps you examine common misconceptions about different religions with facts and empathy."
                  color="#9B59B6"
                />
              </>
            )}
          </div>

          {showResults && results && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              {existingResult && (
                <button onClick={resetAssessment} className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                  Retake Assessment
                </button>
              )}
              {!existingResult && (
                <button onClick={resetAssessment} className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                  Retake Assessment
                </button>
              )}
              <a href="/join" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                Join Our Community
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        {currentQuestion === 0 && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
              <span className="text-xs sm:text-sm font-semibold text-[#E07070]">
                Faith Assessment
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
              Heart & Faith
              <span className="block text-[#C8A75E] mt-2">Assessment</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-premium leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              A thoughtful journey of self-reflection to understand your relationship with interfaith
              peace, tolerance, and compassion. Answer honestly for meaningful insights.
            </p>
            <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl max-w-2xl mx-auto">
              <div className="flex items-start space-x-3 sm:space-x-4 text-left">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4b56d] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#f5f3ee] mb-2">How it works:</h3>
                  <ul className="text-xs sm:text-sm text-premium space-y-1 sm:space-y-2">
                    <li>• 20 thoughtfully crafted questions</li>
                    <li>• Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)</li>
                    <li>• Receive personalized insights and recommendations</li>
                    <li>• All responses are anonymous and private</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Country input */}
            <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl max-w-2xl mx-auto mt-6">
              <label className="block text-sm font-medium text-[#f5f3ee] mb-2">Your Country / Region (optional)</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                placeholder="e.g. United States, Pakistan, India..."
                className="w-full p-3 rounded-xl bg-[#0b0f2a]/30 border border-[#c8a75e]/10 text-[#f5f3ee] text-sm focus:outline-none focus:border-[#c8a75e]/40" />
            </div>

            {/* Authentication banners */}
            {user ? (
              <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl max-w-2xl mx-auto mt-6">
                <p className="text-sm sm:text-base text-premium">
                  👋 Welcome, <span className="font-bold text-[#c8a75e]">{user.fullName}</span>!
                  Your results will be saved to your account so you can track your progress over time.
                </p>
              </div>
            ) : (
              <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl max-w-2xl mx-auto mt-6">
                <p className="text-sm sm:text-base text-premium">
                  💡{' '}
                  <a href="/login?redirect=/assessment" className="text-[#c8a75e] font-bold hover:underline">
                    Log in
                  </a>{' '}
                  or{' '}
                  <a href="/register" className="text-[#c8a75e] font-bold hover:underline">
                    create an account
                  </a>{' '}
                  to save your results and track your progress over time.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2 sm:mb-3 px-2">
            <span className="text-xs sm:text-sm font-semibold text-[#aab0d6]/80">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#c8a75e]">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {questions.length > 0 && currentQuestion < questions.length && (
          <div className="card-premium p-6 sm:p-8 md:p-10">
            <h2 className="text-lg sm:text-2xl heading-premium text-[#f5f3ee] mb-6 sm:mb-8 text-center leading-relaxed px-2">
              {questions[currentQuestion].questionText}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {[
                { value: 1, label: 'Strongly Disagree', color: '#EF4444' },
                { value: 2, label: 'Disagree', color: '#D4A07B' },
                { value: 3, label: 'Neutral', color: '#6B7280' },
                { value: 4, label: 'Agree', color: '#C8A75E' },
                { value: 5, label: 'Strongly Agree', color: '#27AE60' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="assessment-option group"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-xl flex items-center justify-center text-[#f5f3ee] font-bold text-lg sm:text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`} style={{ backgroundColor: option.color }}>
                    {option.value}
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-[#f5f3ee] group-hover:text-[#c8a75e] transition-colors">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreDimension({ label, score, maxScore, color }: any) {
  const percentage = (score / maxScore) * 100

  const colorMap: Record<string, string> = {
    emerald: '#10B981',
    blue: '#3B82F6',
    rose: '#E07070',
    violet: '#9B59B6'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm sm:text-base text-[#f5f3ee]">{label}</span>
        <span className="text-xs sm:text-sm text-[#aab0d6]/80">{score} / {maxScore}</span>
      </div>
      <div className="w-full h-2.5 sm:h-3 bg-[#1c1f4a] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%`, backgroundColor: colorMap[color] || '#6B7280' }}
        ></div>
      </div>
    </div>
  )
}

function RecommendationCard({ icon, title, description, color }: any) {
  return (
    <div className="tradition-card p-5 sm:p-6">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-xl flex items-center justify-center shadow-xl`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee] [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-7 sm:[&>svg]:h-7 md:[&>svg]:w-8 md:[&>svg]:h-8">{icon}</div>
      </div>
      <h3 className="text-sm sm:text-lg heading-premium text-[#f5f3ee] mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-premium leading-relaxed">{description}</p>
    </div>
  )
}
