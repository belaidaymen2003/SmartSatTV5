'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Layout/Header'
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle, 
  Send,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react'

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

interface SupportTicket {
  id: number
  subject: string
  status: 'open' | 'pending' | 'resolved'
  createdAt: string
  lastUpdate: string
}

export default function SupportPage() {
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState('contact')
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const router = useRouter()

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I purchase credits?",
      answer: "You can purchase credits through our secure payment system. Go to your profile and click on 'Add Credits'. We accept various payment methods including credit cards and digital wallets.",
      category: "Billing"
    },
    {
      id: 2,
      question: "What video qualities are available?",
      answer: "We offer multiple quality options: SD (480p), HD (720p), Full HD (1080p), and 4K (2160p). The available quality depends on your internet connection and the content itself.",
      category: "Streaming"
    },
    {
      id: 3,
      question: "Can I watch content offline?",
      answer: "Yes! You can download select content for offline viewing. Look for the download icon on supported movies and series. Downloaded content is available for 30 days.",
      category: "Features"
    },
    {
      id: 4,
      question: "How many devices can I use?",
      answer: "Your account can be used on up to 5 devices simultaneously. You can manage your devices in the account settings.",
      category: "Account"
    },
    {
      id: 5,
      question: "What should I do if streaming is slow?",
      answer: "Try these steps: 1) Check your internet connection, 2) Lower the video quality, 3) Close other applications, 4) Restart your device, 5) Contact support if issues persist.",
      category: "Technical"
    }
  ]

  const supportTickets: SupportTicket[] = [
    {
      id: 1,
      subject: "Video playback issues",
      status: "pending",
      createdAt: "2024-01-20",
      lastUpdate: "2024-01-21"
    },
    {
      id: 2,
      subject: "Credit refund request",
      status: "resolved",
      createdAt: "2024-01-18",
      lastUpdate: "2024-01-19"
    }
  ]

  useEffect(() => {
    const storedCredits = localStorage.getItem('userCredits')
    const storedEmail = localStorage.getItem('userEmail')
    
    if (!storedEmail) {
      router.push('/')
      return
    }
    
    if (storedCredits) setCredits(parseInt(storedCredits))
    if (storedEmail) setUserEmail(storedEmail)
  }, [router])

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send to API
    alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.')
    setContactForm({ subject: '', message: '', priority: 'medium' })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-blue-400 bg-blue-500/20'
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20'
      case 'resolved':
        return 'text-green-400 bg-green-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const tabs = [
    { id: 'contact', label: 'Contact Support', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'tickets', label: 'My Tickets', icon: <MessageSquare className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header credits={credits} userEmail={userEmail} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-blue-200">Get help with your SMART SAT TV experience</p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a
            href="mailto:support@smartsattv.com"
            className="glass rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Email Support</h3>
                <p className="text-white/60 text-sm">support@smartsattv.com</p>
                <p className="text-blue-400 text-sm">Response within 24h</p>
              </div>
            </div>
          </a>

          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                <p className="text-white/60 text-sm">+1 (234) 567-8900</p>
                <p className="text-green-400 text-sm flex items-center gap-1">
                  Live Chat <ExternalLink className="w-3 h-3" />
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://t.me/smartsattv"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <Send className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Telegram</h3>
                <p className="text-white/60 text-sm">@smartsattv</p>
                <p className="text-purple-400 text-sm flex items-center gap-1">
                  Join Channel <ExternalLink className="w-3 h-3" />
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[{name:'API', status:'Operational', color:'text-green-400 bg-green-500/20'},{name:'CDN', status:'Degraded', color:'text-yellow-400 bg-yellow-500/20'},{name:'Video Player', status:'Operational', color:'text-green-400 bg-green-500/20'}].map((s,i)=> (
            <div key={i} className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{s.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs ${s.color}`}>{s.status}</span>
              </div>
              <p className="text-white/60 text-sm mt-2">Last check: {new Date().toLocaleTimeString()}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl border border-white/20 overflow-hidden">
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border-b-2 border-blue-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-white mb-6">Submit a Support Ticket</h3>
                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Priority</label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="low" className="bg-slate-800">Low</option>
                      <option value="medium" className="bg-slate-800">Medium</option>
                      <option value="high" className="bg-slate-800">High</option>
                      <option value="urgent" className="bg-slate-800">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      placeholder="Please describe your issue in detail..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Ticket
                  </button>
                </form>
              </div>
            )}
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
                {faqs.map((faq) => (
                  <div key={faq.id} className="glass rounded-xl border border-white/20 overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <h4 className="text-white font-medium mb-1">{faq.question}</h4>
                        <span className="text-blue-400 text-sm">{faq.category}</span>
                      </div>
                      <HelpCircle className={`w-5 h-5 text-white/60 transition-transform ${
                        expandedFAQ === faq.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 border-t border-white/10">
                        <p className="text-white/80 leading-relaxed pt-4">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* My Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-6">Your Support Tickets</h3>
                {supportTickets.length > 0 ? (
                  <div className="space-y-4">
                    {supportTickets.map((ticket) => (
                      <div key={ticket.id} className="glass rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">{ticket.subject}</h4>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            <span className="capitalize">{ticket.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-white/60 text-sm">
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">No support tickets</h4>
                    <p className="text-white/60">You haven't submitted any support tickets yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
