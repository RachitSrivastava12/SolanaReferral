"use client"
import { Analytics } from "@vercel/analytics/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Sparkles,
  Target,
  DollarSign,
  BarChart3,
  UserPlus,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
      <>
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8 animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Powered by Solana Blockchain</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Decentralized
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Referral{" "}
            </span>
              Ecosystem
            </h1>

            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Connect businesses with passionate promoters. Create campaigns, earn rewards, and grow together in the Web3 economy.
            </p>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
              {[
                { label: "Active Campaigns", value: "1,200+", icon: Target },
                { label: "Total Referrers", value: "15K+", icon: Users },
                { label: "Rewards Paid", value: "$2.5M", icon: DollarSign },
                { label: "Success Rate", value: "94%", icon: TrendingUp },
              ].map((stat, index) => (
                  <div
                      key={index}
                      className="glass-effect rounded-2xl p-6 text-center animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
              ))}
            </div>
          </div>

          {/* Choose Your Path */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Choose Your Path</h2>
              <p className="text-xl text-white/80">
                Whether you're a business looking to grow or someone wanting to earn, we've got you covered
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Business Path */}
              <Card
                  className={`glass-effect border-0 shadow-2xl cursor-pointer transition-all duration-500 ${
                      hoveredCard === "business" ? "transform scale-105 shadow-3xl" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard("business")}
                  onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="text-center pb-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-t-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                      <Building2 className="w-10 h-10" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">For Businesses</Badge>
                    <CardTitle className="text-3xl font-bold mb-2">Launch Campaigns</CardTitle>
                    <CardDescription className="text-white/90 text-lg">
                      Get your products and services promoted by our network of referrers
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    {[
                      { icon: Target, title: "Create Campaigns", desc: "Set up referral programs for your products" },
                      { icon: BarChart3, title: "Track Performance", desc: "Monitor referrals and conversions in real-time" },
                      { icon: DollarSign, title: "Automated Payouts", desc: "Rewards distributed automatically via smart contracts" },
                      { icon: Shield, title: "Fraud Protection", desc: "Built-in verification and anti-fraud measures" },
                    ].map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                            <p className="text-sm text-gray-600">{feature.desc}</p>
                          </div>
                        </div>
                    ))}
                  </div>

                  <Link href="/business" className="block">
                    <Button className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl btn-hover-effect">
                      Start as Business
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-gray-500">Perfect for: E-commerce, SaaS, Apps, Services</div>
                </CardContent>
              </Card>

              {/* Referrer Path */}
              <Card
                  className={`glass-effect border-0 shadow-2xl cursor-pointer transition-all duration-500 ${
                      hoveredCard === "referrer" ? "transform scale-105 shadow-3xl" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard("referrer")}
                  onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="text-center pb-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-t-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div
                        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                        style={{ animationDelay: "1s" }}
                    >
                      <UserPlus className="w-10 h-10" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">For Referrers</Badge>
                    <CardTitle className="text-3xl font-bold mb-2">Earn Rewards</CardTitle>
                    <CardDescription className="text-white/90 text-lg">
                      Promote amazing products and earn crypto rewards for successful referrals
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    {[
                      { icon: Globe, title: "Browse Campaigns", desc: "Discover products you love to promote" },
                      { icon: Zap, title: "Easy Sharing", desc: "Get custom links and QR codes instantly" },
                      { icon: TrendingUp, title: "Track Earnings", desc: "Monitor your referrals and pending rewards" },
                      { icon: DollarSign, title: "Instant Payouts", desc: "Receive SOL rewards directly to your wallet" },
                    ].map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                            <p className="text-sm text-gray-600">{feature.desc}</p>
                          </div>
                        </div>
                    ))}
                  </div>

                  <Link href="/referrer" className="block">
                    <Button className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl btn-hover-effect">
                      Start as Referrer
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-gray-500">
                    Perfect for: Influencers, Content Creators, Marketers
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          {/* ... rest of your sections stay the same ... */}
        </div>

        {/* Vercel Analytics */}
        <Analytics />
      </>
  )
}
