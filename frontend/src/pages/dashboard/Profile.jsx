import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' })

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Profile update coming soon!')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Profile</h1>
        <p className="text-gray-500 text-sm">Manage your account information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-4">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
            <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              user?.role === 'admin'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {user?.role === 'admin' ? '👑 Admin' : '🙂 User'}
            </span>

            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <div className="text-gray-400 text-xs mb-1">Account Balance</div>
              <div className="text-2xl font-black gradient-text">৳{user?.balance?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2">
          <div className="glass p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" /> Account Details
            </h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-11" />
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300 text-xs">Password change and advanced settings will be available in a future update.</p>
              </div>

              <button type="submit" className="btn-primary flex items-center gap-2 py-3 px-6">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
