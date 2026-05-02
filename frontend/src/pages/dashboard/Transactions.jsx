import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, CheckCircle, XCircle, Clock } from 'lucide-react'
import api from '../../lib/api'

const statusConfig = {
  pending:  { label: 'Pending',  class: 'badge-pending',  icon: Clock },
  approved: { label: 'Approved', class: 'badge-approved', icon: CheckCircle },
  rejected: { label: 'Rejected', class: 'badge-rejected', icon: XCircle },
}

const methodColors = { bkash: 'text-pink-400', nagad: 'text-orange-400' }

export default function Transactions() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/payments/my')
      .then(({ data }) => setPayments(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Transactions</h1>
        <p className="text-gray-500 text-sm">All your fund addition requests and their status.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ArrowLeftRight className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Method</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">TrxID</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Sender</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const cfg = statusConfig[p.status] || statusConfig.pending
                    const Icon = cfg.icon
                    return (
                      <tr key={p._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="py-3 px-4">
                          <span className={`font-bold capitalize ${methodColors[p.method] || 'text-white'}`}>
                            {p.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell font-mono text-xs text-gray-300">{p.trxId}</td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-300">{p.senderNumber}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">৳{p.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`${cfg.class} flex items-center gap-1.5 w-fit`}>
                            <Icon className="w-3 h-3" />{cfg.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-gray-500 text-xs">
                          {new Date(p.createdAt).toLocaleDateString('en-BD')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
