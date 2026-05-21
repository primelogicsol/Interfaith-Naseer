'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Reply, X, Check, Trash2, ArrowLeft } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  adminReply: string | null
  repliedAt: string | null
  isRead: boolean
  createdAt: string
  user: { id: string; fullName: string; email: string } | null
  replier: { id: string; fullName: string } | null
}

export default function ContactMessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [replyId, setReplyId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/contact-us')
      if (res.ok) setMessages(await res.json())
    } catch (err) {
      console.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }

  async function markRead(id: string) {
    try {
      await fetch(`/api/contact-us/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  async function handleReply(id: string) {
    if (!replyText.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/contact-us/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: replyText }),
      })
      if (res.ok) {
        setReplyId(null)
        setReplyText('')
        load()
      }
    } catch (err) {
      console.error('Error sending reply:', err)
    } finally {
      setSending(false)
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return
    try {
      const res = await fetch(`/api/contact-us/${id}`, { method: 'DELETE' })
      if (res.ok) setMessages(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Error deleting:', err)
    }
  }

  const unread = messages.filter(m => !m.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Contact Messages</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">
          {unread > 0 ? `${unread} unread message${unread > 1 ? 's' : ''}` : 'All messages read'}
        </p>
      </div>

      <div className="grid gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`glass-effect rounded-xl p-4 sm:p-6 border transition-all ${
              !msg.isRead ? 'border-[#c8a75e]/40 bg-[#c8a75e]/5' : 'border-[#c8a75e]/20'
            }`}
            onClick={() => { if (!msg.isRead) markRead(msg.id) }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm sm:text-base font-semibold text-[#f5f3ee] truncate">{msg.subject}</h3>
                  {!msg.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#c8a75e] flex-shrink-0" />
                  )}
                  {msg.adminReply && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/20 text-green-400">
                      <Check className="w-2.5 h-2.5" /> Replied
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-premium-light">
                  From: {msg.name} &lt;{msg.email}&gt; {msg.user && `(User: ${msg.user.fullName})`}
                </p>
                <p className="text-[10px] sm:text-xs text-premium-light">
                  {new Date(msg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs sm:text-sm text-[#f5f3ee] mt-2 whitespace-pre-wrap line-clamp-3">{msg.message}</p>

                {msg.adminReply && (
                  <div className="mt-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                    <p className="text-[10px] sm:text-xs font-medium text-green-400 mb-1">Admin Reply:</p>
                    <p className="text-xs sm:text-sm text-[#f5f3ee] whitespace-pre-wrap">{msg.adminReply}</p>
                    {msg.replier && (
                      <p className="text-[10px] text-premium-light mt-1">— {msg.replier.fullName}</p>
                    )}
                  </div>
                )}

                {replyId === msg.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full px-3 py-2 bg-[#0b0f2a]/40 border border-[#c8a75e]/20 rounded-lg text-sm text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e]/50 resize-y"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(msg.id)}
                        disabled={sending || !replyText.trim()}
                        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" /> {sending ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        onClick={() => { setReplyId(null); setReplyText('') }}
                        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 self-end sm:self-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); setReplyId(msg.id); setReplyText('') }}
                  className="p-1.5 sm:p-2 hover:bg-[#c8a75e]/20 rounded-lg sm:rounded-xl transition-colors"
                  title="Reply"
                >
                  <Reply className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8a75e]" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id) }}
                  className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="glass-effect rounded-xl p-12 text-center border border-[#c8a75e]/20">
          <Mail className="w-16 h-16 text-premium-light mx-auto mb-4" />
          <p className="text-premium-light">No messages yet</p>
        </div>
      )}

      <div className="text-center text-premium-light text-sm">
        {messages.length} message{messages.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
