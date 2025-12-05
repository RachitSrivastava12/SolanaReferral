// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ExternalLink, Clock, CheckCircle, ArrowRight } from "lucide-react"
// import { Progress } from "@/components/ui/progress"

// export default function ReferralPage() {
//   const params = useParams()
//   const referralId = params.referralId as string
//   const [countdown, setCountdown] = useState(5)
//   const [progress, setProgress] = useState(0)
//   const [logged, setLogged] = useState(false)

//   useEffect(() => {
//     // Log the scan
//     logScan()

//     // Start countdown and progress
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         const newCount = prev - 1
//         setProgress((5 - newCount) * 20)

//         if (newCount <= 0) {
//           clearInterval(timer)
//           // Redirect to the task
//           window.location.href = "https://google.com"
//           return 0
//         }
//         return newCount
//       })
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [referralId])

//   const logScan = async () => {
//     try {
//       await fetch("/api/log-scan", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           referralId,
//           timestamp: new Date().toISOString(),
//           ip: "client-side",
//           userAgent: navigator.userAgent,
//         }),
//       })
//       setLogged(true)
//     } catch (error) {
//       console.error("Error logging scan:", error)
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto animate-slide-up">
//       <Card className="glass-effect border-0 shadow-2xl overflow-hidden">
//         <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white relative">
//           <div className="absolute inset-0 bg-black/10"></div>
//           <div className="relative z-10">
//             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
//               <ExternalLink className="w-8 h-8" />
//             </div>
//             <CardTitle className="text-3xl font-bold mb-2">Welcome!</CardTitle>
//             <CardDescription className="text-white/90 text-lg">
//               You've been referred to complete an exciting task
//             </CardDescription>
//           </div>
//         </CardHeader>

//         <CardContent className="p-8 space-y-8">
//           {/* Status indicator */}
//           <div className="flex items-center justify-center space-x-2">
//             {logged ? (
//               <div className="flex items-center space-x-2 text-green-600 animate-scale-in">
//                 <CheckCircle className="w-5 h-5" />
//                 <span className="font-medium">Referral logged successfully</span>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2 text-blue-600">
//                 <div className="spinner"></div>
//                 <span className="font-medium">Logging referral...</span>
//               </div>
//             )}
//           </div>

//           {/* Main message */}
//           <div className="text-center space-y-6">
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8">
//               <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
//                 <ArrowRight className="w-10 h-10 text-white" />
//               </div>

//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Ready for Your Task!</h2>

//               <p className="text-lg text-gray-700 mb-6 leading-relaxed">
//                 You're being redirected to complete your task. Once finished, return here to verify your completion and
//                 claim rewards.
//               </p>

//               {/* Countdown display */}
//               <div className="space-y-4">
//                 <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
//                   {countdown}
//                 </div>

//                 <Progress value={progress} className="w-full h-3 bg-gray-200" />

//                 <p className="text-gray-600 font-medium">
//                   Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
//             <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
//               <Clock className="w-5 h-5 mr-2" />
//               Important Instructions
//             </h3>
//             <ul className="text-yellow-700 space-y-2 text-sm">
//               <li>• Complete the task on the redirected page</li>
//               <li>• Take a screenshot of your completion</li>
//               <li>• Return to verify your task completion</li>
//               <li>• Earn rewards once verified!</li>
//             </ul>
//           </div>

//           {/* Referral info */}
//           <div className="text-center text-sm text-gray-500 space-y-2 bg-gray-50 rounded-xl p-4">
//             <p>
//               <strong>Referral ID:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{referralId}</code>
//             </p>
//             <p className="text-xs">
//               <strong>Verification URL:</strong>
//               <br />
//               <code className="text-xs break-all">
//                 {typeof window !== "undefined" && `${window.location.origin}/verify-task?ref=${referralId}`}
//               </code>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle, ArrowRight, Target, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const BACKEND_API = "https://solanareferral-1.onrender.com"

export default function ReferralPage() {
  const params = useParams()
  const router = useRouter()
  const referralId = params.referralId as string
  const { publicKey, connected } = useWallet()
  
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [walletAttached, setWalletAttached] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    fetchCampaignDetails()
  }, [referralId])

  // Attach wallet when user connects
  useEffect(() => {
    if (connected && publicKey && !walletAttached) {
      attachWallet()
    }
  }, [connected, publicKey])

  const fetchCampaignDetails = async () => {
    try {
      const response = await fetch(`${BACKEND_API}/referrer/referral-details?referralId=${referralId}`)
      if (response.ok) {
        const data = await response.json()
        setCampaign(data.campaign)
      }
    } catch (error) {
      console.error("Error fetching campaign:", error)
    } finally {
      setLoading(false)
    }
  }

  const attachWallet = async () => {
    if (!publicKey) return

    try {
      const response = await fetch(`${BACKEND_API}/referrer/attach-referred`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralId,
          referredWallet: publicKey.toString(),
        }),
      })

      if (response.ok) {
        setWalletAttached(true)
      }
    } catch (error) {
      console.error("Error attaching wallet:", error)
    }
  }

  const completeTask = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first")
      return
    }

    setCompleting(true)
    try {
      const response = await fetch(`${BACKEND_API}/referrer/complete-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralId,
          campaignId: campaign._id,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Failed to complete task: ${errText}`)
      }

      const data = await response.json()
      setCompleted(true)

      alert(
        `Task completed successfully!\n\nYou earned: ${data.amountPerUser} SOL\nReferrer earned: ${data.amountPerUser} SOL\n\nYour TX: ${data.referredTxSignature}\nReferrer TX: ${data.referrerTxSignature}`
      )
    } catch (error: any) {
      console.error("Error completing task:", error)
      alert(error.message || "Failed to complete task. Please try again.")
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border border-border">
          <CardContent className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading campaign details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border border-destructive/50">
          <CardContent className="text-center py-16">
            <h2 className="text-2xl font-bold text-destructive mb-2">Campaign Not Found</h2>
            <p className="text-muted-foreground">This referral link may be invalid or expired.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto animate-scale-in">
        <Card className="border-2 border-green-500/50">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-green-500 mb-4">Task Completed!</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
              Congratulations! You've earned {campaign.rewardperReferral} SOL. The tokens have been sent to your wallet.
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-green-500/80">
                Both you and the referrer have received {campaign.rewardperReferral} SOL each!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wallet Connection */}
      <div className="flex justify-end">
        <WalletMultiButton />
      </div>

      {/* Welcome Card */}
      <Card className="border-2 border-primary/30">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">You've Been Referred!</CardTitle>
              <CardDescription className="text-white/90">
                Complete this campaign and earn rewards
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Campaign Details */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{campaign.title}</CardTitle>
              <CardDescription className="text-base">{campaign.description}</CardDescription>
              <div className="flex items-center space-x-3 mt-4">
                <Badge variant="secondary">{campaign.category || "General"}</Badge>
                <Badge variant="outline">{campaign.difficulty || "Medium"}</Badge>
              </div>
            </div>
            <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-500">{campaign.rewardperReferral}</div>
              <div className="text-xs text-green-500/70">SOL Reward</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-primary" />
              Campaign Requirements
            </h3>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-muted-foreground whitespace-pre-line">{campaign.thingsTodo || campaign.requirements}</p>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">How It Works</h3>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Connect your Solana wallet above</li>
                <li>Complete all the campaign requirements listed</li>
                <li>Click "Complete Task & Claim Reward" button</li>
                <li>Receive {campaign.rewardperReferral} SOL directly to your wallet</li>
                <li>The person who referred you also earns {campaign.rewardperReferral} SOL!</li>
              </ol>
            </div>
          </div>

          {/* Wallet Connection Status */}
          {!connected && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-amber-600 font-medium mb-2">⚠️ Wallet Not Connected</p>
              <p className="text-sm text-amber-600/80">
                Please connect your Solana wallet to proceed with claiming your reward.
              </p>
            </div>
          )}

          {connected && walletAttached && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-600 font-medium mb-1">✓ Wallet Connected</p>
              <p className="text-sm text-green-600/80">
                Your wallet ({publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}) is ready!
              </p>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={completeTask}
            disabled={!connected || !walletAttached || completing}
            size="lg"
            className="w-full"
          >
            {completing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Task & Claim {campaign.rewardperReferral} SOL
              </>
            )}
          </Button>

          {!connected && (
            <p className="text-center text-sm text-muted-foreground">
              Connect your wallet above to enable the claim button
            </p>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Referral ID:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{referralId}</code></p>
            <p className="text-xs">Both you and your referrer will receive rewards when you complete this task.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}