"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ReferralPage() {
  const params = useParams()
  const referralId = params.referralId as string
  const [countdown, setCountdown] = useState(5)
  const [progress, setProgress] = useState(0)
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    // Log the scan
    logScan()

    // Start countdown and progress
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const newCount = prev - 1
        setProgress((5 - newCount) * 20)

        if (newCount <= 0) {
          clearInterval(timer)
          // Redirect to the task
          window.location.href = "https://google.com"
          return 0
        }
        return newCount
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [referralId])

  const logScan = async () => {
    try {
      await fetch("/api/log-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralId,
          timestamp: new Date().toISOString(),
          ip: "client-side",
          userAgent: navigator.userAgent,
        }),
      })
      setLogged(true)
    } catch (error) {
      console.error("Error logging scan:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <Card className="glass-effect border-0 shadow-2xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <ExternalLink className="w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-bold mb-2">Welcome!</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              You've been referred to complete an exciting task
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Status indicator */}
          <div className="flex items-center justify-center space-x-2">
            {logged ? (
              <div className="flex items-center space-x-2 text-green-600 animate-scale-in">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Referral logged successfully</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="spinner"></div>
                <span className="font-medium">Logging referral...</span>
              </div>
            )}
          </div>

          {/* Main message */}
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <ArrowRight className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Ready for Your Task!</h2>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                You're being redirected to complete your task. Once finished, return here to verify your completion and
                claim rewards.
              </p>

              {/* Countdown display */}
              <div className="space-y-4">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  {countdown}
                </div>

                <Progress value={progress} className="w-full h-3 bg-gray-200" />

                <p className="text-gray-600 font-medium">
                  Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Important Instructions
            </h3>
            <ul className="text-yellow-700 space-y-2 text-sm">
              <li>• Complete the task on the redirected page</li>
              <li>• Take a screenshot of your completion</li>
              <li>• Return to verify your task completion</li>
              <li>• Earn rewards once verified!</li>
            </ul>
          </div>

          {/* Referral info */}
          <div className="text-center text-sm text-gray-500 space-y-2 bg-gray-50 rounded-xl p-4">
            <p>
              <strong>Referral ID:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{referralId}</code>
            </p>
            <p className="text-xs">
              <strong>Verification URL:</strong>
              <br />
              <code className="text-xs break-all">
                {typeof window !== "undefined" && `${window.location.origin}/verify-task?ref=${referralId}`}
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
