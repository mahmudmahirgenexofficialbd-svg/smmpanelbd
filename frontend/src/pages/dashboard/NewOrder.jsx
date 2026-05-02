import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Link as LinkIcon, Hash, DollarSign, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const platformColors = {
  instagram: 'from-pink-500 to-rose-500',
  facebook: 'from-blue-500 to-blue-600',
  youtube: 'from-red-500 to-red-600',
  tiktok: 'from-slate-600 to-gray-700',
  twitter: 'from-sky-400 to-blue-500',
  other: 'from-violet-500 to-purple-600',
}

export default function NewOrder() {
  const { user, refreshUser } = useAuth()
  const [services, setServices] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ serviceId: '', link: '', quantity: '' })
  const [loading, setLoading] = useState(false)
  const [fetchingServices, setFetchingServices] = useState(true)

  useEffect(() => {
    api.get('/services')
      .then(({ data }) => setServices(data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setFetchingServices(false))
  }, [])

  const handleServiceChange = (e) => {
    const svc = services.find(s => s._id === e.target.value)
    setSelected(svc || null)
    setForm({ ...form, serviceId: e.target.value, quantity: svc ? String(svc.minQuantity) : '' })
  }

  const totalCharge = selected && form.quantity
    ? ((parseFloat(form.quantity) / 1000) * selected.pricePer1k).toFixed(2)
    : '0.00'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.serviceId || !form.link || !form.quantity) return toast.error('Please fill all fields')
    if (parseFloat(totalCharge) > (user?.balance || 0)) return toast.error('Insufficient balance. Please add funds.')

    setLoading(true)
    try {
      await api.post('/orders', { ...form, quantity: parseInt(form.quantity) })
      toast.success('Order placed successfully!')
      setForm({ serviceId: '', link: '', quantity: '' })
      setSelected(null)
      refreshUser()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  // Group services by platform
  const grouped = services.reduce((acc, svc) => {
    if (!acc[svc.platform]) acc[svc.platform] = []
    acc[svc.platform].push(svc)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">New Order</h1>
        <p className="text-gray-500 text-sm">Select a service and place your order below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="glass p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service selector */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Select Service</label>
                <div className="relative">
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  {fetchingServices ? (
                    <div className="input-field flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      Loading services...
                    </div>
                  ) : (
                    <select
                      value={form.serviceId}
                      onChange={handleServiceChange}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="">-- Choose a service --</option>
                      {Object.entries(grouped).map(([platform, svcs]) => (
                        <optgroup key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                          {svcs.map(svc => (
                            <option key={svc._id} value={svc._id}>
                              {svc.name} — ${svc.pricePer1k}/1K
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Profile / Post Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="url"
                    placeholder="https://instagram.com/yourprofile"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">
                  Quantity
                  {selected && (
                    <span className="text-gray-600 ml-2">
                      (Min: {selected.minQuantity.toLocaleString()} — Max: {selected.maxQuantity.toLocaleString()})
                    </span>
                  )}
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={form.quantity}
                    min={selected?.minQuantity}
                    max={selected?.maxQuantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><ShoppingCart className="w-4 h-4" /><span>Place Order — ${totalCharge}</span></>
                }
              </button>
            </form>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white rounded-3xl p-6 sticky top-4 border border-gray-100 shadow-2xl">
            <h3 className="font-bold mb-5 flex items-center gap-2 text-black">
              <DollarSign className="w-4 h-4 text-violet-600" /> Order Summary
            </h3>

            {selected ? (
              <div className="space-y-4">
                <div className={`w-full h-1.5 bg-gradient-to-r ${platformColors[selected.platform] || 'from-violet-500 to-purple-500'} rounded-full mb-4`} />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Service</span>
                  <span className="font-bold text-black text-right max-w-[140px] truncate">{selected.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Platform</span>
                  <span className="capitalize font-bold text-black">{selected.platform}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Rate</span>
                  <span className="font-bold text-black">${selected.pricePer1k} / 1000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Quantity</span>
                  <span className="font-bold text-black">{parseInt(form.quantity || 0).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="font-bold text-gray-500">Total</span>
                  <span className="text-xl font-black text-violet-600">${totalCharge}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Your Balance</span>
                  <span className={`font-medium ${parseFloat(totalCharge) > (user?.balance || 0) ? 'text-red-400' : 'text-emerald-400'}`}>
                    ${user?.balance?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {parseFloat(totalCharge) > (user?.balance || 0) && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs">
                    ⚠️ Insufficient balance. Please add funds first.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Select a service to see the summary</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
