import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Clock, User, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState('all')

  const fetchTickets = () => {
    api.get('/tickets')
      .then(({ data }) => setTickets(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTickets() }, [])

  const handleReply = async (e) => {
    e.preventDefault()
    if (!message) return
    setSending(true)
    try {
      const { data } = await api.patch(`/tickets/${selected._id}/reply`, { message })
      setSelected(data)
      setTickets(prev => prev.map(t => t._id === data._id ? data : t))
      setMessage('')
      toast.success('Reply sent')
    } catch {
      toast.error('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/tickets/${id}/status`, { status })
      if (selected?._id === id) setSelected(data)
      setTickets(prev => prev.map(t => t._id === id ? data : t))
      toast.success(`Ticket ${status}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const statusColors = {
    open: 'bg-yellow-500/10 text-yellow-500',
    answered: 'bg-emerald-500/10 text-emerald-500',
    closed: 'bg-gray-500/10 text-gray-500'
  }

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Ticket Management</h1>
          <p className="text-gray-500 text-sm">Respond to user inquiries and resolve issues.</p>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          {['all', 'open', 'answered', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs capitalize transition-all ${filter === f ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Ticket List */}
        <div className="lg:col-span-1 glass overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="p-10 text-center"><div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-10 text-center text-gray-600 text-sm">No tickets found</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredTickets.map(t => (
                <button
                  key={t._id}
                  onClick={() => setSelected(t)}
                  className={`w-full p-4 text-left hover:bg-white/3 transition-colors ${selected?._id === t._id ? 'bg-white/5 border-l-2 border-violet-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm truncate max-w-[120px]">{t.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${statusColors[t.status]}`}>{t.status}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <User className="w-3 h-3" /> {t.userId?.username}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </div>
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
                <div>
                  <h3 className="font-bold">{selected.subject}</h3>
                  <p className="text-[10px] text-gray-500">User: {selected.userId?.username} ({selected.userId?.email})</p>
                </div>
                <div className="flex gap-2">
                  {selected.status !== 'closed' ? (
                    <button
                      onClick={() => updateStatus(selected._id, 'closed')}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      title="Close Ticket"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(selected._id, 'open')}
                      className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                      title="Reopen Ticket"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {selected.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.sender === 'admin' ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                    }`}>
                      <div className="font-bold text-[10px] opacity-60 mb-1 flex justify-between gap-4">
                        <span>{m.sender === 'admin' ? 'You' : 'User'}</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your reply as support..."
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
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-bold text-gray-400 mb-2">Select a ticket to respond</h3>
              <p className="text-gray-600 text-sm max-w-xs">Resolve user issues and maintain high customer satisfaction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
