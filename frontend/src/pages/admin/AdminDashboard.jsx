import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, ClipboardList, CreditCard, DollarSign, TrendingUp, Clock } from 'lucide-react'
import api from '../../lib/api'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentPayments, setRecentPayments] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/users/admin/stats'),
      api.get('/payments'),
      api.get('/orders'),
    ]).then(([s, p, o]) => {
      setStats(s.data)
      setRecentPayments(p.data.slice(0, 5))
      setRecentOrders(o.data.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'from-violet-500 to-purple-600' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ClipboardList, color: 'from-cyan-500 to-blue-600' },
    { label: 'Pending Payments', value: stats?.pendingPayments ?? '—', icon: Clock, color: 'from-yellow-500 to-orange-500' },
    { label: 'Total Revenue', value: stats ? `৳${stats.totalRevenue.toFixed(2)}` : '—', icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of platform activity and revenue.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div key={card.label} custom={i} variants={cardVariants} initial="hidden" animate="show">
            <div className="glass p-5">
              <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black mb-1">{card.value}</div>
              <div className="text-gray-500 text-xs">{card.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2"><CreditCard className="w-4 h-4 text-violet-400" />Recent Payments</h2>
          </div>
          <div className="glass overflow-hidden">
            {recentPayments.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-sm">No payments yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10">
                  <th className="text-left py-2.5 px-4 text-gray-500 font-medium">User</th>
                  <th className="text-left py-2.5 px-4 text-gray-500 font-medium">Method</th>
                  <th className="text-left py-2.5 px-4 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-2.5 px-4 text-gray-500 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {recentPayments.map(p => (
                    <tr key={p._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-2.5 px-4 text-gray-300 truncate max-w-[80px]">{p.userId?.username || 'N/A'}</td>
                      <td className="py-2.5 px-4 capitalize font-medium text-pink-400">{p.method}</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-semibold">৳{p.amount}</td>
                      <td className="py-2.5 px-4"><span className={`badge-${p.status}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" />Recent Orders</h2>
          </div>
          <div className="glass overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-sm">No orders yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10">
                  <th className="text-left py-2.5 px-4 text-gray-500 font-medium">User</th>
                  <th className="text-left py-2.5 px-4 text-gray-500 font-medium">Service</th>
                  <th className="text-left py-2.5 px-4 text-gray-500 font-medium">Charge</th>
                  <th className="text-left py-2.5 px-4 text-gray-500 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-2.5 px-4 text-gray-300 truncate max-w-[80px]">{o.userId?.username || 'N/A'}</td>
                      <td className="py-2.5 px-4 text-gray-300 truncate max-w-[100px]">{o.serviceId?.name || 'N/A'}</td>
                      <td className="py-2.5 px-4 text-white font-semibold">৳{o.charge}</td>
                      <td className="py-2.5 px-4"><span className={`badge-${o.status}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
