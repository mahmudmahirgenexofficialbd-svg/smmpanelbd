import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, Send, Clock, CheckCircle2, ChevronRight, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function Support() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const [newSubject, setNewSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const fetchTickets = () => {
    api.get('/tickets/my')
      .then(({ data }) => setTickets(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTickets() }, [])

  const handleOpenTicket = async (e) => {
    e.preventDefault()
    if (!newSubject || !newMessage) return toast.error('All fields required')
    setSending(true)
    try {
      const { data } = await api.post('/tickets', { subject: newSubject, message: newMessage })
      setTickets([data, ...tickets])
      setShowModal(false)
      setNewSubject('')
      setNewMessage('')
      toast.success('Ticket opened!')
    } catch {
      toast.error('Failed to open ticket')
    } finally {
      setSending(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!message) return
    setSending(true)
    try {
      const { data } = await api.patch(`/tickets/${selected._id}/reply`, { message })
      setSelected(data)
      setTickets(prev => prev.map(t => t._id === data._id ? data : t))
      setMessage('')
    } catch {
      toast.error('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const statusColors = {
    open: 'bg-yellow-500/10 text-yellow-500',
    answered: 'bg-emerald-500/10 text-emerald-500',
    closed: 'bg-gray-500/10 text-gray-500'
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Support Tickets</h1>
          <p className="text-gray-500 text-sm">Need help? Open a ticket and our team will assist you.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 py-2.5 px-6"
        >
          <Plus className="w-4 h-4" /> Open New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Ticket List */}
        <div className="lg:col-span-1 glass overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="p-10 text-center"><div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : tickets.length === 0 ? (
            <div className="p-10 text-center text-gray-600 text-sm">No tickets found</div>
          ) : (
            <div className="divide-y divide-white/5">
              {tickets.map(t => (
                <button
                  key={t._id}
                  onClick={() => setSelected(t)}
                  className={`w-full p-4 text-left hover:bg-white/3 transition-colors ${selected?._id === t._id ? 'bg-white/5 border-l-2 border-violet-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm truncate max-w-[120px]">{t.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${statusColors[t.status]}`}>{t.status}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(t.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 flex flex-col glass overflow-hidden">
          {selected ? (
            <>
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/3">
                <h3 className="font-bold">{selected.subject}</h3>
                <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColors[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {selected.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.sender === 'user' ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                    }`}>
                      <div className="font-bold text-[10px] opacity-60 mb-1 flex justify-between gap-4">
                        <span>{m.sender === 'admin' ? 'Support Agent' : 'You'}</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selected.status !== 'closed' && (
                <form onSubmit={handleReply} className="p-4 border-t border-white/5 bg-black/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-violet-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={sending || !message}
                      className="p-2 bg-violet-600 rounded-xl hover:bg-violet-500 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-bold text-gray-400 mb-2">Select a ticket to view conversation</h3>
              <p className="text-gray-600 text-sm max-w-xs">Our support team is available 24/7 to help you with any issues.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Open New Ticket</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleOpenTicket} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Order #1234 Delay"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="input-field resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                  >
                    {sending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Ticket'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
