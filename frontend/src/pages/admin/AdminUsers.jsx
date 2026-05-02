import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Shield, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // { id, balance }
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false))
  }, [])

  const handleBalanceUpdate = async (id) => {
    if (editing?.balance === '' || isNaN(parseFloat(editing?.balance))) {
      return toast.error('Enter a valid balance amount')
    }
    setSaving(true)
    try {
      const { data } = await api.patch(`/users/${id}/balance`, { balance: parseFloat(editing.balance) })
      setUsers(prev => prev.map(u => u._id === id ? { ...u, balance: data.balance } : u))
      setEditing(null)
      toast.success('Balance updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update balance')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">User Management</h1>
        <p className="text-gray-500 text-sm">View all users and manually adjust balances.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['#', 'User', 'Role', 'Balance', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs">{i + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {u.username?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{u.username}</div>
                            <div className="text-gray-500 text-xs">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={u.role === 'admin'
                          ? 'badge-approved flex items-center gap-1 w-fit'
                          : 'badge-processing flex items-center gap-1 w-fit'}>
                          {u.role === 'admin' ? <Shield className="w-3 h-3" /> : null}
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {editing?.id === u._id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">৳</span>
                            <input
                              type="number"
                              value={editing.balance}
                              onChange={(e) => setEditing({ ...editing, balance: e.target.value })}
                              className="w-24 bg-white/10 border border-violet-500/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <span className="font-semibold text-emerald-400">৳{u.balance?.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-BD')}
                      </td>
                      <td className="py-3 px-4">
                        {editing?.id === u._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBalanceUpdate(u._id)}
                              disabled={saving}
                              className="btn-success py-1.5 px-3 text-xs"
                            >
                              {saving ? '...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="bg-white/10 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditing({ id: u._id, balance: u.balance })}
                            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            <Wallet className="w-3.5 h-3.5" /> Edit Balance
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
