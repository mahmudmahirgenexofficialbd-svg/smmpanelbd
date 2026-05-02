import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Instagram, Youtube, Star, ChevronRight, Shield,
  Clock, BarChart2, Users, CheckCircle, Menu, X,
  Facebook, TrendingUp, Globe, MessageCircle, Award, ArrowRight
} from 'lucide-react'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.72a8.19 8.19 0 004.79 1.52V6.79a4.85 4.85 0 01-1.02-.1z"/>
  </svg>
)

const services = [
  { icon: <Instagram className="w-8 h-8" />, name: 'Instagram', color: 'from-pink-500 to-rose-500', items: ['Followers', 'Likes', 'Views', 'Story Views'] },
  { icon: <Facebook className="w-8 h-8" />, name: 'Facebook', color: 'from-blue-500 to-blue-600', items: ['Page Likes', 'Post Likes', 'Followers', 'Views'] },
  { icon: <Youtube className="w-8 h-8" />, name: 'YouTube', color: 'from-red-500 to-red-600', items: ['Subscribers', 'Views', 'Likes', 'Watch Time'] },
  { icon: <TikTokIcon />, name: 'TikTok', color: 'from-slate-700 to-gray-800', items: ['Followers', 'Likes', 'Views', 'Comments'] },
]

const steps = [
  { icon: <Users className="w-6 h-6" />, step: '01', title: 'Create Account', desc: 'Register in seconds with your email and password.' },
  { icon: <Zap className="w-6 h-6" />, step: '02', title: 'Add Funds', desc: 'Top up your balance using bKash or Nagad instantly.' },
  { icon: <BarChart2 className="w-6 h-6" />, step: '03', title: 'Place Order', desc: 'Choose a service, paste your link, and confirm.' },
  { icon: <TrendingUp className="w-6 h-6" />, step: '04', title: 'Watch Growth', desc: 'See your social media presence grow rapidly.' },
]

const features = [
  { icon: <Shield className="w-6 h-6" />, title: 'Safe & Secure', desc: 'All services are 100% safe and compliant with platform guidelines.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Fast Delivery', desc: 'Orders start processing within minutes of placement.' },
  { icon: <Globe className="w-6 h-6" />, title: '24/7 Support', desc: 'Our team is always available to help you succeed.' },
  { icon: <Award className="w-6 h-6" />, title: 'Best Prices', desc: 'Lowest prices in Bangladesh with premium quality service.' },
  { icon: <CheckCircle className="w-6 h-6" />, title: 'bKash & Nagad', desc: 'Pay easily with Bangladesh\'s most popular payment methods.' },
  { icon: <MessageCircle className="w-6 h-6" />, title: 'API Access', desc: 'Integrate with our API to automate your SMM business.' },
]

const testimonials = [
  { name: 'Rakib Hasan', role: 'Digital Marketer, Dhaka', text: 'SMMBoost BD helped me grow my client\'s Instagram from 500 to 50K followers in just 3 months. Incredible service!', rating: 5 },
  { name: 'Fatema Akter', role: 'Content Creator, Chittagong', text: 'Best SMM panel in Bangladesh! The bKash payment is super convenient and orders are delivered so fast.', rating: 5 },
  { name: 'Tanvir Ahmed', role: 'SMM Reseller, Sylhet', text: 'I run my entire reselling business through this panel. The API works flawlessly and prices are unbeatable.', rating: 5 },
]

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-800/8 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">SMMBoost BD</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Services</Link>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How it Works</a>
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Login</Link>
            <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-400 hover:text-white">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex flex-col gap-4"
          >
            <a href="#services" className="text-gray-300 py-2" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#how-it-works" className="text-gray-300 py-2" onClick={() => setMenuOpen(false)}>How it Works</a>
            <a href="#features" className="text-gray-300 py-2" onClick={() => setMenuOpen(false)}>Features</a>
            <Link to="/login" className="text-gray-300 py-2" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="btn-primary text-center py-3" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-8 text-sm text-violet-300"
          >
            <Zap className="w-4 h-4" />
            <span>Bangladesh's #1 SMM Panel</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6"
          >
            Boost Your{' '}
            <span className="gradient-text">Social Presence</span>
            <br />Instantly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Get real followers, likes, and views for Instagram, Facebook, YouTube & TikTok.
            Pay easily with <span className="text-pink-400 font-medium">bKash</span> & <span className="text-orange-400 font-medium">Nagad</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg py-4 px-8">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="btn-secondary flex items-center justify-center gap-2 text-lg py-4 px-8">
              How it Works <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '50K+', label: 'Orders Completed' },
              { value: '10K+', label: 'Happy Customers' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4">All Major Platforms <span className="gradient-text">Covered</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Grow on every platform with our premium SMM services at the lowest prices in Bangladesh.</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((s) => (
              <motion.div key={s.name} variants={fadeUp}
                className="bg-white p-6 rounded-2xl hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer border border-gray-100 shadow-xl"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">{s.name}</h3>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4">Get Started in <span className="gradient-text">4 Simple Steps</span></h2>
            <p className="text-gray-400 text-lg">From registration to growing your social presence in minutes.</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div key={step.step} variants={fadeUp} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-violet-500/50 to-transparent z-0" />
                )}
                <div className="glass p-6 relative z-10">
                  <div className="text-violet-400/30 text-6xl font-black absolute top-4 right-4 leading-none">{step.step}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4">Why Choose <span className="gradient-text">SMMBoost BD?</span></h2>
            <p className="text-gray-400 text-lg">Built for Bangladesh with features that matter most to you.</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}
                className="glass p-6 hover:border-violet-500/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-violet-500/15 rounded-xl flex items-center justify-center mb-4 text-violet-400 group-hover:bg-violet-500/25 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4">Trusted by <span className="gradient-text">Thousands</span></h2>
            <p className="text-gray-400">What our customers across Bangladesh say about us.</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="glass p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="glass p-12 neon-border"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to <span className="gradient-text">Go Viral?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join over 10,000 satisfied customers. Start growing your social presence today with bKash & Nagad.
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-10">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl gradient-text">SMMBoost BD</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Bangladesh's most trusted SMM panel for growing your social media presence affordably.</p>
            </div>
            {[
              { title: 'Services', links: ['Instagram', 'Facebook', 'YouTube', 'TikTok'] },
              { title: 'Account', links: ['Login', 'Register', 'Dashboard', 'Add Funds'] },
              { title: 'Support', links: ['FAQ', 'Contact Us', 'Terms of Service', 'Privacy Policy'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2026 SMMBoost BD. All rights reserved.</p>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span>Payment: </span>
              <span className="text-pink-400 font-medium">bKash</span>
              <span className="text-orange-400 font-medium">Nagad</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
