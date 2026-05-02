import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Clock, Loader, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import api from '../../lib/api'

const statusConfig = {
  pending:    { label: 'Pending',    icon: Clock,      class: 'badge-pending' },
  processing: { label: 'Processing', icon: Loader,     class: 'badge-processing' },
  completed:  { label: 'Completed',  icon: CheckCircle,class: 'badge-completed' },
  canceled:   { label: 'Canceled',   icon: XCircle,    class: 'badge-canceled' },
}

const platformColor = {
  instagram: 'text-pink-400', facebook: 'text-blue-400',
  youtube: 'text-red-400', tiktok: 'text-gray-300',
  twitter: 'text-sky-400', other: 'text-violet-400',
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Order History</h1>
        <p className="text-gray-500 text-sm">Track all your past and current orders.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', 'pending', 'processing', 'completed', 'canceled'].map(f => (
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
            <span className="ml-2 text-xs opacity-60">
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
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">#</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Service</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Link</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Qty</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Charge</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => {
                    const cfg = statusConfig[order.status] || statusConfig.pending
                    const Icon = cfg.icon
                    return (
                      <tr key={order._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="py-3 px-4 text-gray-600 font-mono text-xs">{i + 1}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white truncate max-w-[120px]">{order.serviceId?.name || 'Unknown'}</div>
                          <div className={`text-xs capitalize ${platformColor[order.serviceId?.platform] || 'text-gray-500'}`}>
                            {order.serviceId?.platform}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <a href={order.link} target="_blank" rel="noopener noreferrer"
                            className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-xs max-w-[140px] truncate">
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{order.link}</span>
                          </a>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-300">{order.quantity?.toLocaleString()}</td>
                        <td className="py-3 px-4 font-semibold text-white">${order.charge}</td>
                        <td className="py-3 px-4">
                          <span className={`${cfg.class} flex items-center gap-1.5 w-fit`}>
                            <Icon className={`w-3 h-3 ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-gray-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString('en-BD')}
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
