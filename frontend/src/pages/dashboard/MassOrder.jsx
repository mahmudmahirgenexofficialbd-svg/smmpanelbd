import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function MassOrder() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return toast.error('Please enter orders')
    
    const lines = content.trim().split('\n')
    const orders = []
    
    for (const line of lines) {
      const [serviceId, link, quantity] = line.split('|').map(s => s?.trim())
      if (!serviceId || !link || !quantity) {
        return toast.error(`Invalid format in line: ${line}`)
      }
      orders.push({ serviceId, link, quantity: parseInt(quantity) })
    }

    setLoading(true)
    setResults(null)
    
    try {
      // We'll process them one by one or add a bulk endpoint. 
      // For simplicity, we'll loop here but in a real app a bulk endpoint is better.
      const outcomes = []
      for (const order of orders) {
        try {
          await api.post('/orders', order)
          outcomes.push({ ...order, status: 'success' })
        } catch (err) {
          outcomes.push({ ...order, status: 'error', message: err.response?.data?.message || 'Failed' })
        }
      }
      setResults(outcomes)
      toast.success('Batch processing complete')
      setContent('')
    } catch {
      toast.error('Batch processing failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Mass Order</h1>
        <p className="text-gray-500 text-sm">Place multiple orders at once using the bulk format.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass p-6">
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block flex justify-between">
                <span>Orders List</span>
                <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-lg">Format: service_id | link | quantity</span>
              </label>
              <textarea
                rows={12}
                placeholder="101 | https://instagram.com/p/abc | 1000&#10;102 | https://facebook.com/page | 500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field font-mono text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Submit Orders <Layers className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <h3 className="font-bold mb-4">Results</h3>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className={`p-3 rounded-xl border flex items-center justify-between text-sm ${
                    r.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}>
                    <div className="truncate max-w-[250px]">{r.link}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-60">Qty: {r.quantity}</span>
                      {r.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" title={r.message} />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-violet-400" /> Instructions</h3>
            <ul className="space-y-4 text-sm text-gray-400 leading-relaxed">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
                One order per line in the correct format.
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
                Format: <code className="text-violet-300">service_id | link | quantity</code>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
                Go to <span className="text-violet-300">Services</span> to find IDs.
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center flex-shrink-0 text-[10px]">4</span>
                Ensure you have enough balance for all orders.
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-amber-500">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
              <AlertCircle className="w-4 h-4" /> Important
            </div>
            <p className="text-xs leading-relaxed opacity-80">
              Orders placed via Mass Order cannot be cancelled once submitted. Double check all links and quantities before clicking submit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
