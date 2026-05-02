import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Hash, DollarSign, AlertTriangle, CheckCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

const BKASH_NUMBER = '01620177883'
const NAGAD_NUMBER = '01620177883'

const BkashIcon = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
    <rect width="48" height="48" rx="12" fill="#E2136E"/>
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">bKash</text>
  </svg>
)

const NagadIcon = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
    <rect width="48" height="48" rx="12" fill="#F05A28"/>
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Nagad</text>
  </svg>
)

const methods = [
  {
    id: 'bkash',
    label: 'bKash',
    number: BKASH_NUMBER,
    color: 'border-pink-500/60 bg-pink-500/10',
    activeColor: 'border-pink-500 bg-pink-500/20',
    textColor: 'text-pink-400',
    icon: <BkashIcon />,
    steps: [
      'Open your bKash app',
      'Select "Send Money"',
      `Enter number: ${BKASH_NUMBER}`,
      'Enter the exact amount',
      'Complete payment',
      'Copy the Transaction ID (TrxID)',
    ],
  },
  {
    id: 'nagad',
    label: 'Nagad',
    number: NAGAD_NUMBER,
    color: 'border-orange-500/60 bg-orange-500/10',
    activeColor: 'border-orange-500 bg-orange-500/20',
    textColor: 'text-orange-400',
    icon: <NagadIcon />,
    steps: [
      'Open your Nagad app',
      'Select "Send Money"',
      `Enter number: ${NAGAD_NUMBER}`,
      'Enter the exact amount',
      'Complete payment',
      'Copy the Transaction ID',
    ],
  },
]

export default function AddFunds() {
  const [activeMethod, setActiveMethod] = useState('bkash')
  const [form, setForm] = useState({ senderNumber: '', trxId: '', amount: '' })
  const [loading, setLoading] = useState(false)

  const method = methods.find(m => m.id === activeMethod)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.senderNumber || !form.trxId || !form.amount) return toast.error('Please fill all fields')
    if (parseFloat(form.amount) < 10) return toast.error('Minimum amount is ৳10')

    setLoading(true)
    try {
      await api.post('/payments', {
        method: activeMethod,
        senderNumber: form.senderNumber,
        trxId: form.trxId,
        amount: parseFloat(form.amount),
      })
      toast.success('Payment request submitted! Balance will be updated after verification.')
      setForm({ senderNumber: '', trxId: '', amount: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Add Funds</h1>
        <p className="text-gray-500 text-sm">Top up your balance using bKash or Nagad.</p>
      </div>

      {/* Important notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 flex gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-sm">
          <p className="text-yellow-300 font-semibold">Important Notice</p>
          <ul className="text-yellow-200/70 space-y-1">
            <li>• Please send the <strong>exact amount</strong> — no more, no less</li>
            <li>• Do <strong>not</strong> add any reference text during payment</li>
            <li>• Your balance will be updated after <strong>manual verification</strong></li>
          </ul>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Method + Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Method selector */}
          <div className="glass p-4">
            <p className="text-sm text-gray-400 mb-3 font-medium">Select Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMethod(m.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                    activeMethod === m.id ? m.activeColor : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {m.icon}
                  <span className={`font-bold text-sm ${activeMethod === m.id ? m.textColor : 'text-gray-400'}`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMethod}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="glass p-5"
            >
              <h3 className={`font-bold mb-1 ${method.textColor}`}>{method.label} Instructions</h3>
              <div className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${method.color} ${method.textColor} mb-4 font-mono font-bold`}>
                <Smartphone className="w-3.5 h-3.5" />
                {method.number}
                <button
                  onClick={() => { navigator.clipboard.writeText(method.number); toast.success('Number copied!') }}
                  className="ml-1 opacity-60 hover:opacity-100 text-[10px] underline"
                >copy</button>
              </div>

              <ol className="space-y-3">
                {method.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${method.textColor} ${method.color.split(' ')[1]}`}>
                      {i + 1}
                    </span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="glass p-6 h-full">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Send className="w-4 h-4 text-violet-400" />
              Submit Payment Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Your Sender Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="e.g. 01712345678"
                    value={form.senderNumber}
                    onChange={(e) => setForm({ ...form, senderNumber: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1.5">The number you sent money FROM</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Transaction ID (TrxID)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="e.g. ABC123XYZ"
                    value={form.trxId}
                    onChange={(e) => setForm({ ...form, trxId: e.target.value })}
                    className="input-field pl-11 font-mono"
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1.5">Found in your {activeMethod === 'bkash' ? 'bKash' : 'Nagad'} transaction history</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Amount (BDT)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    min="10"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1.5">Minimum ৳10</p>
              </div>

              {/* Summary box */}
              {form.amount && parseFloat(form.amount) >= 10 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Amount to add</span>
                    <span className="text-2xl font-black gradient-text">৳{parseFloat(form.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Will be added after admin verification
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" /><span>Submit Payment Request</span></>
                }
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
