import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Wallet, ClipboardList, TrendingUp, PlusCircle,
  Clock, CheckCircle, XCircle, Loader
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const statusIcon = { pending: <Clock className="w-3.5 h-3.5" />, processing: <Loader className="w-3.5 h-3.5 animate-spin" />, completed: <CheckCircle className="w-3.5 h-3.5" />, canceled: <XCircle className="w-3.5 h-3.5" /> }

const cardVariants = { hidden: { opacity: 0, y: 20 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }) }

export default function DashboardHome() {
  const { user, refreshUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshUser()
    api.get('/orders/my').then(({ data }) => setOrders(data.slice(0, 5))).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Account Balance', value: `$${user?.balance?.toFixed(2) || '0.00'}`, icon: Wallet, color: 'from-violet-500 to-purple-600', link: '/dashboard/add-funds' },
    { label: 'Total Orders', value: orders.length > 0 ? '—' : '0', icon: ClipboardList, color: 'from-cyan-500 to-blue-600', link: '/dashboard/orders' },
    { label: 'New Order', value: 'Place Now', icon: PlusCircle, color: 'from-emerald-500 to-teal-600', link: '/dashboard/new-order' },
    { label: 'Growth', value: 'Analytics', icon: TrendingUp, color: 'from-orange-500 to-rose-500', link: '#' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">
          Welcome back, <span className="gradient-text">{user?.username}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm">Here's what's happening with your account today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="show">
            <Link to={stat.link} className="glass p-5 block hover:border-violet-500/40 hover:-translate-y-0.5 transition-all duration-200 group">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-black mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Balance highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-violet-500/20"
      >
        <div>
          <div className="text-gray-400 text-sm mb-1">Available Balance</div>
          <div className="text-4xl font-black gradient-text">${user?.balance?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/add-funds" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Add Funds
          </Link>
          <Link to="/dashboard/new-order" className="btn-secondary py-2.5 px-5 text-sm flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Order
          </Link>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">View all →</Link>
        </div>

        <div className="glass overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No orders yet</p>
              <Link to="/dashboard/new-order" className="btn-primary inline-flex items-center gap-2 mt-4 py-2 px-5 text-sm">
                <PlusCircle className="w-4 h-4" /> Place First Order
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Service</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Qty</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Charge</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium truncate max-w-[140px]">{order.serviceId?.name || 'Unknown'}</div>
                        <div className="text-gray-500 text-xs capitalize">{order.serviceId?.platform}</div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-gray-300">{order.quantity?.toLocaleString()}</td>
                      <td className="py-3 px-4 hidden md:table-cell text-gray-300">${order.charge}</td>
                      <td className="py-3 px-4">
                        <span className={`badge-${order.status} flex items-center gap-1.5 w-fit`}>
                          {statusIcon[order.status]}{order.status}
                        </span>
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
