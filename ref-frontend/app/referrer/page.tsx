"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { Download, Copy, Share2, Smartphone, Users, DollarSign, TrendingUp, Search, Filter, Star, CheckCircle, ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function ReferrerDashboard() {
  const { publicKey, connected } = useWallet()
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [referralLink, setReferralLink] = useState<string>("")
  const [referralId, setReferralId] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [copied, setCopied] = useState(false)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [isCompletingTask, setIsCompletingTask] = useState(false)
  const [taskCompleted, setTaskCompleted] = useState(false)
  const [showTaskPage, setShowTaskPage] = useState(false)

  const backendAPI = "http://localhost:5000"

  // Register Referrer
  useEffect(() => {
    if (connected && publicKey) {
      fetch(`${backendAPI}/referrer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      }).catch((err) => console.error("Registration failed:", err))
    }
  }, [connected, publicKey])

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${backendAPI}/referrer/campaigns`)
        const data = await res.json()
        const formatted = data.map((c: any) => ({
          id: c._id,
          title: c.title,
          description: c.description,
          reward: `${c.rewardperReferral} SOL`,
          company: c.businessID?.name || "Unknown Company",
          category: c.category || "General",
          difficulty: c.difficulty || "Medium",
          requirements: c.thingsTodo,
          rating: 4.5,
          activeReferrers: Math.floor(Math.random() * 100) + 20,
          conversionRate: `${(Math.random() * 10 + 5).toFixed(1)}%`,
          logo: "/placeholder.svg",
          rewardperReferral: c.rewardperReferral,
        }))
        setCampaigns(formatted)
      } catch (err) {
        console.error("Failed to fetch campaigns:", err)
      }
    }

    if (connected) fetchCampaigns()
  }, [connected])

  const [myStats] = useState({
    totalEarnings: "1,250 SOL",
    activeCampaigns: 3,
    totalReferrals: 47,
    conversionRate: "11.2%",
  })

  // Generate referral link (NO token transfer yet)
  const generateReferralLink = async (campaign: any) => {
    if (!publicKey) return

    setIsGeneratingLink(true)
    try {
      // Just create a referral entry without token transfer
      const response = await fetch(`${backendAPI}/referrer/create-referral`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: publicKey.toString(),
          campaignId: campaign.id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create referral')
      }

      const data = await response.json()

      // Generate the referral link using the referral ID
      const link = `${window.location.origin}/ref/${data.referralId}`
      setReferralLink(link)
      setReferralId(data.referralId)
      setSelectedCampaign(campaign)
      setShowTaskPage(true)

      console.log("Referral created successfully:", data)

    } catch (error) {
      console.error("Error creating referral:", error)
      alert("Failed to create referral. Please try again.")
    } finally {
      setIsGeneratingLink(false)
    }
  }

  // Complete task and send tokens
  const completeTask = async () => {
    if (!publicKey || !selectedCampaign) return

    setIsCompletingTask(true)
    try {
      const response = await fetch(`${backendAPI}/referrer/complete-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: publicKey.toString(),
          campaignId: selectedCampaign.id,
          referralId: referralId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete task')
      }

      const data = await response.json()
      setTaskCompleted(true)

      console.log("Task completed successfully:", data)
      console.log("Transaction signature:", data.transactionSignature)
      alert(`Task completed! You earned ${selectedCampaign.rewardperReferral} SOL. Transaction: ${data.transactionSignature}`)

    } catch (error) {
      console.error("Error completing task:", error)
      alert("Failed to complete task. Please try again.")
    } finally {
      setIsCompletingTask(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const svg = document.getElementById("qr-code")
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = "referral-qr-code.png"
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const goBack = () => {
    setShowTaskPage(false)
    setSelectedCampaign(null)
    setReferralLink("")
    setReferralId("")
    setTaskCompleted(false)
  }

  const filteredCampaigns = campaigns.filter((campaign) =>
      [campaign.title, campaign.category, campaign.company]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  )

  // Task Details Page
  if (showTaskPage && selectedCampaign) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button onClick={goBack} variant="outline" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Campaign Tasks</h1>
              <p className="text-white/80">{selectedCampaign.title}</p>
            </div>
          </div>

          {/* Campaign Details */}
          <Card className="glass-effect border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
              <div className="flex items-start space-x-4">
                <img
                    src={selectedCampaign.logo}
                    alt={selectedCampaign.company}
                    className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-2xl">{selectedCampaign.title}</CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    by {selectedCampaign.company}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-white/20 text-white">{selectedCampaign.category}</Badge>
                    <Badge className="bg-white/20 text-white">{selectedCampaign.difficulty}</Badge>
                    <span className="text-2xl font-bold">{selectedCampaign.rewardperReferral} SOL</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Campaign Description</h3>
                  <p className="text-gray-600 text-lg">{selectedCampaign.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Tasks to Complete</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <p className="text-gray-700 text-lg whitespace-pre-line">{selectedCampaign.requirements}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Instructions</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Complete all the tasks mentioned above</li>
                      <li>Share your referral link with potential customers</li>
                      <li>Once you've completed the tasks, click "Mark Task as Completed"</li>
                      <li>You'll receive {selectedCampaign.rewardperReferral} SOL as reward</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Link & QR Code */}
          <Card className="glass-effect border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Your Referral Link</CardTitle>
              <CardDescription>Share this link to start referring customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-2">
                <Input
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-white/50 border-2 border-purple-200 focus:border-purple-400 rounded-xl font-mono text-sm"
                />
                <Button
                    onClick={copyToClipboard}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6"
                >
                  {copied ? "Copied!" : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                  )}
                </Button>
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <QRCode id="qr-code" value={referralLink} size={200} level="M" />
                </div>

                <div className="flex-1 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Share Options</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={downloadQR} variant="outline" className="rounded-xl">
                      <Download className="w-4 h-4 mr-2" />
                      Download QR
                    </Button>
                    <Button
                        onClick={() => {
                          if (navigator.share) navigator.share({ title: "Check this out!", url: referralLink })
                        }}
                        variant="outline"
                        className="rounded-xl"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                        onClick={() => window.open(referralLink, '_blank')}
                        variant="outline"
                        className="rounded-xl col-span-2"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview Referral Page
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Completion */}
          <Card className="glass-effect border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              {!taskCompleted ? (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800">Ready to Earn Rewards?</h3>
                    <p className="text-gray-600 text-lg">
                      Complete all the tasks above, then click the button below to receive your {selectedCampaign.rewardperReferral} SOL reward.
                    </p>
                    <Button
                        onClick={completeTask}
                        disabled={isCompletingTask}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl py-4 px-8 text-lg"
                    >
                      {isCompletingTask ? (
                          "Processing..."
                      ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Mark Task as Completed
                          </>
                      )}
                    </Button>
                  </div>
              ) : (
                  <div className="space-y-4">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600">Task Completed!</h3>
                    <p className="text-gray-600 text-lg">
                      Congratulations! You've earned {selectedCampaign.rewardperReferral} SOL for completing this campaign.
                    </p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
    )
  }

  return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Referrer Dashboard</h1>
            <p className="text-xl text-white/80">Discover campaigns, earn rewards, and track your success</p>
          </div>
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600" />
        </div>

        {/* If wallet not connected */}
        {!connected ? (
            <Card className="glass-effect border-0 shadow-2xl animate-scale-in">
              <CardContent className="text-center py-16">
                <Users className="w-24 h-24 text-purple-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Connect Your Referrer Wallet</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Connect your Solana wallet to start browsing campaigns and earning crypto rewards.
                </p>
                <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 !py-4 !px-8 !text-lg" />
              </CardContent>
            </Card>
        ) : (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Earnings", value: myStats.totalEarnings, icon: DollarSign, color: "text-green-600" },
                  { label: "Active Campaigns", value: myStats.activeCampaigns, icon: TrendingUp, color: "text-blue-600" },
                  { label: "Total Referrals", value: myStats.totalReferrals, icon: Users, color: "text-purple-600" },
                  { label: "Conversion Rate", value: myStats.conversionRate, icon: Star, color: "text-yellow-600" },
                ].map((stat, index) => (
                    <Card key={index} className="glass-effect border-0 shadow-lg card-hover animate-scale-in">
                      <CardContent className="p-6 text-center">
                        <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </CardContent>
                    </Card>
                ))}
              </div>

              {/* Search */}
              <Card className="glass-effect border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                          placeholder="Search campaigns by name, category, or company..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-xl border-2 border-gray-200 focus:border-purple-400"
                      />
                    </div>
                    <Button variant="outline" className="rounded-xl px-6 bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Campaigns */}
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Available Campaigns</CardTitle>
                  <CardDescription className="text-lg">
                    Choose campaigns that match your audience and interests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {filteredCampaigns.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No campaigns found matching your search.</p>
                      </div>
                  ) : (
                      filteredCampaigns.map((campaign, index) => (
                          <Card key={campaign.id} className="border-2 border-gray-100 hover:border-purple-300 animate-slide-up">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                                <div className="flex-1">
                                  <div className="flex items-start space-x-4 mb-4">
                                    <img
                                        src={campaign.logo}
                                        alt={campaign.company}
                                        className="w-16 h-16 rounded-xl object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                                        <Badge className="bg-purple-100 text-purple-800">{campaign.category}</Badge>
                                        <Badge
                                            variant="outline"
                                            className={`${
                                                campaign.difficulty === "Easy"
                                                    ? "border-green-300 text-green-700"
                                                    : campaign.difficulty === "Medium"
                                                        ? "border-yellow-300 text-yellow-700"
                                                        : "border-red-300 text-red-700"
                                            }`}
                                        >
                                          {campaign.difficulty}
                                        </Badge>
                                      </div>
                                      <p className="text-gray-600 mb-2">{campaign.description}</p>
                                      <p className="text-sm text-gray-500">by {campaign.company}</p>
                                    </div>
                                  </div>

                                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">Requirements:</h4>
                                    <p className="text-sm text-gray-600">{campaign.requirements}</p>
                                  </div>

                                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-4 h-4 text-yellow-500" />
                                      <span>{campaign.rating}</span>
                                    </div>
                                    <span>{campaign.activeReferrers} active referrers</span>
                                    <span>{campaign.conversionRate} conversion rate</span>
                                  </div>
                                </div>

                                {/* Right Section */}
                                <div className="lg:w-64 space-y-4">
                                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                                    <div className="text-3xl font-bold text-purple-600 mb-1">
                                      {campaign.rewardperReferral} SOL
                                    </div>
                                    <div className="text-sm text-gray-600">per successful referral</div>
                                  </div>
                                  <Button
                                      onClick={() => generateReferralLink(campaign)}
                                      disabled={isGeneratingLink}
                                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl py-3 disabled:opacity-50"
                                  >
                                    {isGeneratingLink ? "Generating..." : "Generate Referral Link"}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      ))
                  )}
                </CardContent>
              </Card>
            </>
        )}
      </div>
  )
}