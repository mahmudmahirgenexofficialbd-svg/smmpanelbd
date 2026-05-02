import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Plus, Pencil, Trash2, X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

const PLATFORMS = ['instagram', 'facebook', 'youtube', 'tiktok', 'twitter', 'other']
const empty = { name: '', platform: 'instagram', category: '', description: '', pricePer1k: '', minQuantity: 100, maxQuantity: 10000, isActive: true }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchServices = () => {
    api.get('/services/all')
      .then(({ data }) => setServices(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchServices() }, [])

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (svc) => { setForm({ ...svc, pricePer1k: svc.pricePer1k }); setModal('edit') }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.pricePer1k) return toast.error('Name and price are required')
    setSaving(true)
    try {
      if (modal === 'add') {
        const { data } = await api.post('/services', { ...form, pricePer1k: parseFloat(form.pricePer1k) })
        setServices(prev => [data, ...prev])
        toast.success('Service created!')
      } else {
        const { data } = await api.put(`/services/${form._id}`, { ...form, pricePer1k: parseFloat(form.pricePer1k) })
        setServices(prev => prev.map(s => s._id === form._id ? data : s))
        toast.success('Service updated!')
      }
      setModal(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    setDeleting(id)
    try {
      await api.delete(`/services/${id}`)
      setServices(prev => prev.filter(s => s._id !== id))
      toast.success('Service deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const platformColor = { instagram: 'text-pink-400', facebook: 'text-blue-400', youtube: 'text-red-400', tiktok: 'text-gray-300', twitter: 'text-sky-400', other: 'text-violet-400' }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Service Management</h1>
          <p className="text-gray-500 text-sm">Add, edit, or remove SMM services.</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="glass p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{modal === 'add' ? 'Add New Service' : 'Edit Service'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Service Name</label>
                <input type="text" placeholder="e.g. Instagram Followers" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Platform</label>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <select value={form.platform}
                      onChange={(e) => setForm({ ...form, platform: e.target.value })}
                      className="input-field appearance-none capitalize">
                      {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Category</label>
                  <input type="text" placeholder="Followers, Likes..." value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Price per 1000 (৳)</label>
                <input type="number" step="0.01" placeholder="e.g. 10.00" value={form.pricePer1k}
                  onChange={(e) => setForm({ ...form, pricePer1k: e.target.value })} className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Min Quantity</label>
                  <input type="number" value={form.minQuantity}
                    onChange={(e) => setForm({ ...form, minQuantity: parseInt(e.target.value) })} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Max Quantity</label>
                  <input type="number" value={form.maxQuantity}
                    onChange={(e) => setForm({ ...form, maxQuantity: parseInt(e.target.value) })} className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Description (optional)</label>
                <textarea rows={2} placeholder="Brief description..." value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none" />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-violet-600 transition-colors" />
                  <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5" />
                </label>
                <span className="text-sm text-gray-400">{form.isActive ? 'Active' : 'Inactive'}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : modal === 'add' ? 'Create Service' : 'Save Changes'
                  }
                </button>
                <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1 py-3">Cancel</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <Settings className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No services yet</p>
              <button onClick={openAdd} className="btn-primary py-2 px-5 text-sm inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add First Service
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Name', 'Platform', 'Price/1K', 'Min', 'Max', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium max-w-[160px] truncate">{s.name}</div>
                        {s.category && <div className="text-gray-500 text-xs">{s.category}</div>}
                      </td>
                      <td className={`py-3 px-4 capitalize font-medium ${platformColor[s.platform] || 'text-gray-300'}`}>
                        {s.platform}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">৳{s.pricePer1k}</td>
                      <td className="py-3 px-4 text-gray-400">{s.minQuantity?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-400">{s.maxQuantity?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={s.isActive ? 'badge-approved' : 'badge-canceled'}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            disabled={deleting === s._id}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            {deleting === s._id
                              ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />
                            }
                          </button>
                        </div>
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
