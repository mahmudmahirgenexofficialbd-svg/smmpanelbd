import { motion } from 'framer-motion'
import { Code2, Copy, Terminal, BookOpen, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function ApiPage() {
  const { user } = useAuth()
  const apiKey = `smm_${user?.id || 'login_required'}_key`
  const baseUrl = window.location.origin.replace(':5173', ':5000')

  const copy = (text) => { navigator.clipboard.writeText(text); toast.success('Copied!') }

  const endpoints = [
    { method: 'GET',  path: '/api/services',   desc: 'Get all available services' },
    { method: 'POST', path: '/api/orders',      desc: 'Place a new order' },
    { method: 'GET',  path: '/api/orders/my',   desc: 'Get your order history' },
    { method: 'POST', path: '/api/payments',    desc: 'Submit a payment request' },
    { method: 'GET',  path: '/api/payments/my', desc: 'Get your payment history' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">API Access</h1>
        <p className="text-gray-500 text-sm">Integrate SMMBoost BD into your own platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Key */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass p-6">
            <h3 className="font-bold mb-1 flex items-center gap-2"><Zap className="w-4 h-4 text-violet-400" />Your API Key</h3>
            <p className="text-gray-500 text-xs mb-4">Use this key in the Authorization header as Bearer token from your login.</p>
            <div className="bg-black/50 rounded-xl p-4 font-mono text-sm text-violet-300 break-all flex items-start justify-between gap-3">
              <span>{apiKey}</span>
              <button onClick={() => copy(apiKey)} className="text-gray-500 hover:text-white flex-shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Base URL */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass p-6">
            <h3 className="font-bold mb-1 flex items-center gap-2"><Terminal className="w-4 h-4 text-cyan-400" />Base URL</h3>
            <p className="text-gray-500 text-xs mb-4">All API requests should be prefixed with this base URL.</p>
            <div className="bg-black/50 rounded-xl p-4 font-mono text-sm text-cyan-300 flex items-center justify-between gap-3">
              <span>{baseUrl}/api</span>
              <button onClick={() => copy(`${baseUrl}/api`)} className="text-gray-500 hover:text-white flex-shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Endpoints */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
        <div className="glass p-6">
          <h3 className="font-bold mb-5 flex items-center gap-2"><BookOpen className="w-4 h-4 text-emerald-400" />Available Endpoints</h3>
          <div className="space-y-3">
            {endpoints.map((ep) => (
              <div key={ep.path} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                  ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                }`}>{ep.method}</span>
                <span className="font-mono text-sm text-gray-300 flex-1">{ep.path}</span>
                <span className="text-gray-500 text-xs hidden sm:block">{ep.desc}</span>
                <button onClick={() => copy(`${baseUrl}${ep.path}`)} className="text-gray-600 hover:text-gray-400">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Example */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
        <div className="glass p-6">
          <h3 className="font-bold mb-5 flex items-center gap-2"><Code2 className="w-4 h-4 text-orange-400" />Example Request</h3>
          <pre className="bg-black/70 rounded-xl p-4 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">{`// Place an order
const response = await fetch('${baseUrl}/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    serviceId: 'SERVICE_ID_HERE',
    link: 'https://instagram.com/yourprofile',
    quantity: 1000
  })
});
const data = await response.json();
console.log(data); // { _id, status, charge, ... }`}</pre>
        </div>
      </motion.div>
    </div>
  )
}
