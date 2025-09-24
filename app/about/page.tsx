'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Layout/Header'
import { 
  Shield, 
  Users, 
  Globe, 
  Award, 
  Heart,
  Zap,
  Lock,
  FileText,
  Scale,
  Eye
} from 'lucide-react'

export default function AboutPage() {
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState('')
  const [activeSection, setActiveSection] = useState('about')
  const router = useRouter()

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

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Ultra-fast streaming with minimal buffering and instant content loading."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Safe",
      description: "Advanced security measures to protect your data and viewing experience."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Content",
      description: "Access to international movies, series, and live TV from around the world."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description: "4K, HD, and multiple quality options for the best viewing experience."
    }
  ]

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "10,000+", label: "Movies & Series" },
    { number: "500+", label: "Live Channels" },
    { number: "99.9%", label: "Uptime" }
  ]

  const sections = [
    { id: 'about', label: 'About Us', icon: <Heart className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Eye className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'legal', label: 'Legal Notices', icon: <Scale className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header credits={credits} userEmail={userEmail} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">About SMART SAT TV</h1>
          <p className="text-blue-200">Learn more about our platform and legal information</p>
        </div>

        {/* Navigation Tabs */}
        <div className="glass rounded-2xl border border-white/20 overflow-hidden mb-8">
          <div className="flex border-b border-white/10 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-white/10 text-white border-b-2 border-blue-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* About Us Section */}
            {activeSection === 'about' && (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    The Future of Streaming Entertainment
                  </h2>
                  <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
                    SMART SAT TV is a cutting-edge streaming platform that brings you the best in movies, 
                    series, live television, and gaming content. We're committed to providing an exceptional 
                    viewing experience with the latest technology and premium content from around the world.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-white/60">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Why Choose SMART SAT TV?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                      <div key={index} className="glass rounded-xl p-6 border border-white/20">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                            <p className="text-white/70">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mission */}
                <div className="glass rounded-xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    At SMART SAT TV, our mission is to revolutionize the way people consume entertainment. 
                    We believe that everyone deserves access to high-quality content, delivered seamlessly 
                    across all devices. Our platform combines the latest streaming technology with a vast 
                    library of premium content to create an unparalleled viewing experience.
                  </p>
                  <p className="text-white/80 leading-relaxed">
                    We're constantly innovating and expanding our offerings to ensure our users have access 
                    to the content they love, when they want it, and how they want it. From blockbuster movies 
                    to binge-worthy series, live sports to breaking news, and everything in between – 
                    SMART SAT TV is your gateway to unlimited entertainment.
                  </p>
                </div>
              </div>
            )}

            {/* Privacy Policy Section */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
                
                <div className="space-y-6 text-white/80">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Information We Collect</h3>
                    <p className="leading-relaxed mb-3">
                      We collect information you provide directly to us, such as when you create an account, 
                      make a purchase, or contact us for support. This may include:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Name and email address</li>
                      <li>Payment information</li>
                      <li>Viewing preferences and history</li>
                      <li>Device information and usage data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h3>
                    <p className="leading-relaxed mb-3">
                      We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Provide and improve our streaming services</li>
                      <li>Process payments and manage your account</li>
                      <li>Personalize your content recommendations</li>
                      <li>Communicate with you about our services</li>
                      <li>Ensure platform security and prevent fraud</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Data Security</h3>
                    <p className="leading-relaxed">
                      We implement appropriate technical and organizational measures to protect your personal 
                      information against unauthorized access, alteration, disclosure, or destruction. We use 
                      industry-standard encryption and security protocols to safeguard your data.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Your Rights</h3>
                    <p className="leading-relaxed">
                      You have the right to access, update, or delete your personal information. You can 
                      manage your account settings and privacy preferences through your user profile. 
                      If you have any questions about our privacy practices, please contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms of Service Section */}
            {activeSection === 'terms' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
                
                <div className="space-y-6 text-white/80">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Acceptance of Terms</h3>
                    <p className="leading-relaxed">
                      By accessing and using SMART SAT TV, you accept and agree to be bound by the terms 
                      and provision of this agreement. If you do not agree to abide by the above, please 
                      do not use this service.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Use License</h3>
                    <p className="leading-relaxed mb-3">
                      Permission is granted to temporarily stream content from SMART SAT TV for personal, 
                      non-commercial transitory viewing only. This is the grant of a license, not a transfer 
                      of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for commercial purposes or public display</li>
                      <li>Attempt to reverse engineer any software</li>
                      <li>Remove any copyright or proprietary notations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Account Responsibilities</h3>
                    <p className="leading-relaxed">
                      You are responsible for maintaining the confidentiality of your account credentials 
                      and for all activities that occur under your account. You agree to notify us immediately 
                      of any unauthorized use of your account.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Content and Conduct</h3>
                    <p className="leading-relaxed">
                      You agree not to use the service to upload, post, or transmit any content that is 
                      unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable. 
                      We reserve the right to remove any content and terminate accounts that violate these terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h3>
                    <p className="leading-relaxed">
                      SMART SAT TV shall not be liable for any damages arising from the use or inability to 
                      use the service, including but not limited to direct, indirect, incidental, punitive, 
                      and consequential damages.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Legal Notices Section */}
            {activeSection === 'legal' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Legal Notices</h2>
                
                <div className="space-y-6 text-white/80">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Copyright Notice</h3>
                    <p className="leading-relaxed">
                      © 2024 SMART SAT TV. All rights reserved. All content, trademarks, and other 
                      intellectual property on this platform are owned by SMART SAT TV or our content 
                      partners and are protected by copyright and other intellectual property laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">DMCA Compliance</h3>
                    <p className="leading-relaxed">
                      SMART SAT TV respects the intellectual property rights of others and expects our 
                      users to do the same. We respond to notices of alleged copyright infringement that 
                      comply with the Digital Millennium Copyright Act (DMCA).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Governing Law</h3>
                    <p className="leading-relaxed">
                      These terms and conditions are governed by and construed in accordance with the laws 
                      of the jurisdiction in which SMART SAT TV operates, and you irrevocably submit to the 
                      exclusive jurisdiction of the courts in that state or location.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Contact Information</h3>
                    <p className="leading-relaxed mb-3">
                      If you have any questions about these legal notices or need to report copyright 
                      infringement, please contact us:
                    </p>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="mb-2"><strong>Email:</strong> legal@smartsattv.com</p>
                      <p className="mb-2"><strong>Address:</strong> SMART SAT TV Legal Department</p>
                      <p><strong>Phone:</strong> +1 (234) 567-8900</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Updates to Legal Notices</h3>
                    <p className="leading-relaxed">
                      We may update these legal notices from time to time. We will notify users of any 
                      material changes by posting the new legal notices on this page and updating the 
                      "Last Updated" date at the top of this document.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}