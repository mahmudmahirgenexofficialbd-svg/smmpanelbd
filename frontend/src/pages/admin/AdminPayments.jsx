import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, XCircle, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [processing, setProcessing] = useState(null)
  const [selected, setSelected] = useState(null)

  const fetchPayments = () => {
    api.get('/payments')
      .then(({ data }) => setPayments(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPayments() }, [])

  const handleAction = async (id, status) => {
    setProcessing(id + status)
    try {
      await api.patch(`/payments/${id}/status`, { status })
      toast.success(`Payment ${status}!`)
      setPayments(prev => prev.map(p => p._id === id ? { ...p, status } : p))
      setSelected(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setProcessing(null)
    }
  }

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)
  const pendingCount = payments.filter(p => p.status === 'pending').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Payment Management</h1>
        <p className="text-gray-500 text-sm">Review and approve/reject user fund requests.</p>
      </div>

      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3 text-yellow-300 text-sm"
        >
          <CreditCard className="w-4 h-4 flex-shrink-0" />
          <strong>{pendingCount}</strong> payment{pendingCount > 1 ? 's' : ''} waiting for your review.
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-xs opacity-60">
              {f === 'all' ? payments.length : payments.filter(p => p.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null) }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="glass p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-5">Payment Details</h3>
            <div className="space-y-3 text-sm mb-6">
              {[
                ['User', selected.userId?.username || 'N/A'],
                ['Email', selected.userId?.email || 'N/A'],
                ['Method', selected.method?.toUpperCase()],
                ['Sender Number', selected.senderNumber],
                ['Transaction ID', selected.trxId],
                ['Amount', `৳${selected.amount}`],
                ['Status', selected.status],
                ['Submitted', new Date(selected.createdAt).toLocaleString('en-BD')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-gray-500 flex-shrink-0">{k}</span>
                  <span className={`font-medium text-right ${k === 'Amount' ? 'text-emerald-400' : k === 'Transaction ID' ? 'font-mono text-xs text-violet-300' : ''}`}>{v}</span>
                </div>
              ))}
            </div>
            {selected.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(selected._id, 'approved')}
                  disabled={!!processing}
                  className="btn-success flex-1 flex items-center justify-center gap-2"
                >
                  {processing === selected._id + 'approved'
                    ? <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    : <><CheckCircle className="w-4 h-4" /> Approve</>}
                </button>
                <button
                  onClick={() => handleAction(selected._id, 'rejected')}
                  disabled={!!processing}
                  className="btn-danger flex-1 flex items-center justify-center gap-2"
                >
                  {processing === selected._id + 'rejected'
                    ? <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    : <><XCircle className="w-4 h-4" /> Reject</>}
                </button>
              </div>
            )}
            <button onClick={() => setSelected(null)} className="w-full mt-3 py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-600 text-sm">No payments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['User', 'Method', 'Sender', 'TrxID', 'Amount', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{p.userId?.username || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{p.userId?.email}</div>
                      </td>
                      <td className={`py-3 px-4 capitalize font-bold ${p.method === 'bkash' ? 'text-pink-400' : 'text-orange-400'}`}>{p.method}</td>
                      <td className="py-3 px-4 text-gray-300 hidden sm:table-cell">{p.senderNumber}</td>
                      <td className="py-3 px-4 font-mono text-xs text-violet-300 hidden md:table-cell">{p.trxId}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">৳{p.amount}</td>
                      <td className="py-3 px-4"><span className={`badge-${p.status}`}>{p.status}</span></td>
                      <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString('en-BD')}
                      </td>
                      <td className="py-3 px-4">
                        {p.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(p._id, 'approved')}
                              disabled={!!processing}
                              className="btn-success py-1.5 px-3 text-xs flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" /> OK
                            </button>
                            <button
                              onClick={() => handleAction(p._id, 'rejected')}
                              disabled={!!processing}
                              className="btn-danger py-1.5 px-3 text-xs flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> No
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setSelected(p)} className="text-gray-500 hover:text-gray-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
