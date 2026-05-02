import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Globe, ChevronRight, CheckCircle, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function PublicServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('all')

  useEffect(() => {
    api.get('/services')
      .then(({ data }) => setServices(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase())
    const matchesPlatform = platform === 'all' || s.platform === platform
    return matchesSearch && matchesPlatform
  })

  const platforms = ['all', ...new Set(services.map(s => s.platform))]

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">SMMBoost BD</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Login</Link>
            <Link to="/register" className="btn-primary py-2 px-5 text-sm">Join Now</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4">Our <span className="gradient-text">Services</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Browse our high-quality social media growth services. We offer the best prices in Bangladesh with instant delivery.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:border-violet-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-5 py-3 rounded-2xl border transition-all capitalize whitespace-nowrap ${
                  platform === p ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/8'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Globe className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No services found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs">Service</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs">Price/1K</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs">Min/Max</th>
                    <th className="text-right py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-xs">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-black mb-0.5">{s.name}</div>
                        <div className="text-gray-500 text-xs flex items-center gap-2 font-medium">
                          <span className="capitalize">{s.platform}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{s.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-emerald-400 font-black text-lg">${s.pricePer1k}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-600 text-xs font-semibold">Min: {s.minQuantity.toLocaleString()}</div>
                        <div className="text-gray-600 text-xs font-semibold">Max: {s.maxQuantity.toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link to="/register" className="inline-flex items-center gap-1 text-violet-400 font-bold hover:text-violet-300 transition-colors">
                          Order <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Fast Delivery', desc: 'Most services start within minutes of order placement.' },
            { title: 'Best Quality', desc: 'We source only high-quality social media interactions.' },
            { title: 'Safe Payments', desc: 'Easy top-up via bKash and Nagad manual payment.' },
          ].map(f => (
            <div key={f.title} className="p-6 rounded-3xl bg-white/3 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-violet-500" />
                <h3 className="font-bold">{f.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
