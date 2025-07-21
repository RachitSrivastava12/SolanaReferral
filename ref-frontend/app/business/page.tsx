"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, BarChart3, Users, DollarSign, TrendingUp, Eye, Building2, Target, Settings } from "lucide-react"
import Link from "next/link"

export default function BusinessDashboard() {
  const { publicKey, connected } = useWallet()
  const [campaigns, setCampaigns] = useState([
    {
      id: "1",
      title: "Premium SaaS Tool",
      description: "Project management software for teams",
      reward: "50 SOL",
      referrals: 24,
      conversions: 8,
      status: "active",
      created: "2024-01-15",
    },
    {
      id: "2",
      title: "E-commerce Store",
      description: "Fashion accessories and jewelry",
      reward: "25 SOL",
      referrals: 156,
      conversions: 43,
      status: "active",
      created: "2024-01-10",
    },
  ])

  const totalStats = {
    totalCampaigns: campaigns.length,
    totalReferrals: campaigns.reduce((sum, c) => sum + c.referrals, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
    totalRewardsPaid: "1,250 SOL",
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 animate-slide-up">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Business Dashboard</h1>
          <p className="text-xl text-white/80">Manage your referral campaigns and track performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600" />
          {connected && (
            <Link href="/business/create-campaign">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl px-6 py-3">
                <Plus className="w-5 h-5 mr-2" />
                New Campaign
              </Button>
            </Link>
          )}
        </div>
      </div>

      {!connected ? (
        <Card className="glass-effect border-0 shadow-2xl animate-scale-in">
          <CardContent className="text-center py-16">
            <Building2 className="w-24 h-24 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Connect Your Business Wallet</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Connect your Solana wallet to start creating referral campaigns and managing your business growth.
            </p>
            <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !py-4 !px-8 !text-lg" />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Campaigns", value: totalStats.totalCampaigns, icon: Target, color: "text-blue-600" },
              { label: "Total Referrals", value: totalStats.totalReferrals, icon: Users, color: "text-green-600" },
              { label: "Conversions", value: totalStats.totalConversions, icon: TrendingUp, color: "text-purple-600" },
              { label: "Rewards Paid", value: totalStats.totalRewardsPaid, icon: DollarSign, color: "text-yellow-600" },
            ].map((stat, index) => (
              <Card
                key={index}
                className="glass-effect border-0 shadow-lg card-hover animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/business/create-campaign">
              <Card className="glass-effect border-0 shadow-lg card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Plus className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Create Campaign</h3>
                  <p className="text-gray-600 text-sm">Launch a new referral campaign</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="glass-effect border-0 shadow-lg card-hover cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Analytics</h3>
                <p className="text-gray-600 text-sm">View detailed performance metrics</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-lg card-hover cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Settings</h3>
                <p className="text-gray-600 text-sm">Manage account and preferences</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns */}
          <Card className="glass-effect border-0 shadow-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">Active Campaigns</CardTitle>
                  <CardDescription className="text-lg">Monitor and manage your referral campaigns</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">{campaigns.length} Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.map((campaign, index) => (
                <Card
                  key={campaign.id}
                  className="border-2 border-gray-100 hover:border-blue-300 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                          <Badge className="bg-green-100 text-green-800">{campaign.status}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{campaign.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Created: {campaign.created}</span>
                          <span>Reward: {campaign.reward}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{campaign.referrals}</div>
                          <div className="text-xs text-gray-500">Referrals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{campaign.conversions}</div>
                          <div className="text-xs text-gray-500">Conversions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {((campaign.conversions / campaign.referrals) * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">Rate</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                          <Settings className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {campaigns.length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No campaigns yet</h3>
                  <p className="text-gray-500 mb-6">Create your first referral campaign to get started</p>
                  <Link href="/business/create-campaign">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
