import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, ExternalLink } from 'lucide-react'
import api from '../../lib/api'

const statusOptions = ['pending', 'processing', 'completed', 'canceled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id, status) => {
    setUpdating(id)
    try {
      await api.patch(`/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
    } catch {
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const platformColor = { instagram: 'text-pink-400', facebook: 'text-blue-400', youtube: 'text-red-400', tiktok: 'text-gray-300', twitter: 'text-sky-400', other: 'text-violet-400' }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Order Management</h1>
        <p className="text-gray-500 text-sm">View and update the status of all orders.</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {['all', ...statusOptions].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-xs opacity-60">
              {f === 'all' ? orders.length : orders.filter(o => o.status === f).length}
            </span>
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
              <ClipboardList className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['#', 'User', 'Service', 'Link', 'Qty', 'Charge', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => (
                    <tr key={o._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs">{i + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{o.userId?.username || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{o.userId?.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium max-w-[120px] truncate">{o.serviceId?.name || 'N/A'}</div>
                        <div className={`text-xs capitalize ${platformColor[o.serviceId?.platform] || 'text-gray-500'}`}>{o.serviceId?.platform}</div>
                      </td>
                      <td className="py-3 px-4">
                        <a href={o.link} target="_blank" rel="noopener noreferrer"
                          className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-xs max-w-[100px] truncate">
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{o.link}</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{o.quantity?.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold text-white">${o.charge}</td>
                      <td className="py-3 px-4">
                        {updating === o._id ? (
                          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className="bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                          >
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('en-BD')}
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
