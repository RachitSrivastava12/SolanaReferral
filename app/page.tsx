"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { Download, Smartphone, Copy, Share2, Sparkles, Zap, Users, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const { publicKey, connected } = useWallet()
  const [referralLink, setReferralLink] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (connected && publicKey) {
      setStep(2)
      createReferralLink()
    } else {
      setStep(1)
      setReferralLink("")
    }
  }, [connected, publicKey])

  const createReferralLink = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const response = await fetch("/api/create-referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
        }),
      })

      const data = await response.json()
      const link = `${window.location.origin}/ref/${data.referralId}`
      setReferralLink(link)
      setStep(3)
    } catch (error) {
      console.error("Error creating referral link:", error)
    } finally {
      setLoading(false)
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 animate-slide-up">
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Powered by Solana</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Solana Referral
          <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"> Hub</span>
        </h1>

        <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Create powerful referral campaigns, track performance, and earn rewards in the decentralized ecosystem
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: Zap, title: "Instant Setup", desc: "Connect wallet & go live" },
            { icon: Users, title: "Track Referrals", desc: "Real-time analytics" },
            { icon: Gift, title: "Earn Rewards", desc: "Automated payouts" },
          ].map((feature, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl p-4 text-center animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step >= num
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-12 h-1 mx-2 rounded transition-all duration-300 ${
                    step > num ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Wallet Connection */}
      <Card className="glass-effect border-0 shadow-2xl card-hover animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Badge variant={connected ? "default" : "secondary"} className="px-3 py-1">
              Step 1
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Connect Your Wallet
          </CardTitle>
          <CardDescription className="text-lg">
            Connect your Phantom wallet to start creating referral campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className={connected ? "animate-pulse-glow rounded-xl" : ""}>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !text-white !font-semibold !py-4 !px-8 !rounded-xl !transition-all !duration-300 !transform hover:!scale-105 !shadow-lg hover:!shadow-xl btn-hover-effect" />
            </div>
          </div>

          {connected && publicKey && (
            <div className="text-center space-y-2 animate-slide-up">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Wallet Connected</span>
              </div>
              <p className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block">
                {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2 & 3: Referral Link Generation and Display */}
      {connected && (
        <Card className="glass-effect border-0 shadow-2xl card-hover animate-slide-up">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Badge variant="default" className="px-3 py-1">
                {loading ? "Step 2" : "Step 3"}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {loading ? "Generating Your Link" : "Your Referral Campaign"}
            </CardTitle>
            <CardDescription className="text-lg">
              {loading ? "Creating your unique referral link..." : "Share this link to start earning rewards"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600 animate-pulse">Setting up your referral campaign...</p>
              </div>
            ) : referralLink ? (
              <div className="space-y-6">
                {/* Referral Link Section */}
                <div className="space-y-3">
                  <Label htmlFor="referral-link" className="text-lg font-semibold">
                    Your Referral Link
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="referral-link"
                      value={referralLink}
                      readOnly
                      className="flex-1 bg-white/50 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-sm font-mono"
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl px-6 btn-hover-effect"
                    >
                      {copied ? (
                        <>
                          <span className="text-green-300">✓</span>
                          <span className="ml-1">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center space-y-6">
                  <div className="qr-container animate-scale-in">
                    <div className="bg-white p-4 rounded-xl">
                      <QRCode id="qr-code" value={referralLink} size={200} level="M" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      onClick={downloadQR}
                      variant="outline"
                      className="bg-white/80 hover:bg-white border-2 border-purple-200 hover:border-purple-400 rounded-xl px-6 py-3 btn-hover-effect"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR
                    </Button>

                    <Button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: "Join via my referral link",
                            url: referralLink,
                          })
                        }
                      }}
                      variant="outline"
                      className="bg-white/80 hover:bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl px-6 py-3 btn-hover-effect"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>

                    <Button
                      variant="outline"
                      disabled
                      className="bg-white/50 border-2 border-gray-200 rounded-xl px-6 py-3 opacity-50"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Write to NFC
                    </Button>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { label: "Scans", value: "0", color: "text-blue-600" },
                    { label: "Conversions", value: "0", color: "text-green-600" },
                    { label: "Rewards", value: "0 SOL", color: "text-purple-600" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-white/50 rounded-xl">
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
