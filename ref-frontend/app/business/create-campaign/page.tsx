// frontend/business/create-campaign/page.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, DollarSign, Target, CheckCircle, AlertCircle, Send } from "lucide-react"
import Link from "next/link"
import { Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"

const connection = new Connection("https://api.devnet.solana.com", "confirmed")
const SYSTEM_WALLET = new PublicKey("6gM8Rc3EsDjBcKdeLq27G41gVkPZW32jBsfphZLX2AZd") // Your system's wallet

export default function CreateCampaignPage() {
  const router = useRouter()
  const { publicKey, signTransaction, connected } = useWallet()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fundingLoading, setFundingLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productUrl: "",
    rewardAmount: "",
    fundAmount: "",
    targetAudience: "",
    campaignDuration: "30",
    requirements: "",
    logo: null as File | null,
    transactionSignature: ""
  })

  const progress = (step / 4) * 100

  // //const validateUrl = (url: string): boolean => {
  //   try {
  //     new URL(url)
  //     return true
  //   } catch {
  //     return false
  //   }
  // }

  // const validateForm = (stepNum: number): boolean => {
  //   const newErrors: Record<string, string> = {}
  //
  //   switch (stepNum) {
  //     case 1:
  //       if (!formData.title.trim()) newErrors.title = "Title is required"
  //       if (!formData.description.trim()) newErrors.description = "Description is required"
  //       if (!formData.productUrl.trim()) {
  //         newErrors.productUrl = "Product URL is required"
  //       }
  //       break
  //     case 2:
  //       if (!formData.rewardAmount || Number(formData.rewardAmount) <= 0) {
  //         newErrors.rewardAmount = "Reward amount must be greater than 0"
  //       }
  //       if (!formData.fundAmount || Number(formData.fundAmount) <= 0) {
  //         newErrors.fundAmount = "Fund amount must be greater than 0"
  //       }
  //       if (!formData.targetAudience.trim()) {
  //         newErrors.targetAudience = "Target audience is required"
  //       }
  //       if (Number(formData.campaignDuration) < 1) {
  //         newErrors.campaignDuration = "Campaign duration must be at least 1 day"
  //       }
  //       break
  //     case 3:
  //       if (!formData.requirements.trim()) {
  //         newErrors.requirements = "Requirements are required"
  //       }
  //       break
  //     case 4:
  //       if (!formData.transactionSignature) {
  //         newErrors.funding = "Please complete funding before launching"
  //       }
  //       break
  //   }
  //
  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: "File size must be less than 5MB" }))
        return
      }
      setFormData((prev) => ({ ...prev, logo: file }))
      setErrors(prev => ({ ...prev, logo: "" }))
    }
  }

  const handleFund = async () => {
    if (!publicKey || !signTransaction || !formData.fundAmount) {
      alert("Please connect wallet and enter fund amount")
      return
    }

    if (!connected) {
      alert("Please connect your wallet first")
      return
    }

    setFundingLoading(true)
    try {
      const amountInLamports = Math.floor(Number(formData.fundAmount) * LAMPORTS_PER_SOL)

      // Check wallet balance
      const balance = await connection.getBalance(publicKey)
      if (balance < amountInLamports) {
        throw new Error("Insufficient balance")
      }

      const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: SYSTEM_WALLET,
            lamports: amountInLamports,
          })
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signedTransaction = await signTransaction(transaction)
      const txSig = await connection.sendRawTransaction(signedTransaction.serialize())
      await connection.confirmTransaction(txSig, "confirmed")

      setFormData((prev) => ({ ...prev, transactionSignature: txSig }))
      alert(`Funding successful! Transaction: ${txSig}`)
    } catch (error) {
      console.error("Funding error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      alert(`Failed to fund campaign: ${errorMessage}`)
    } finally {
      setFundingLoading(false)
    }
  }

  const handleSubmit = async () => {


    setLoading(true)
    try {
      const response = await fetch("https://solanareferral.onrender.com/api/business/create-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          productUrl: formData.productUrl,
          rewardperReferral: formData.rewardAmount,
          targetAudience: formData.targetAudience,
          campaignDuration: formData.campaignDuration,
          requirements: formData.requirements,
          businessID: publicKey?.toString(),
          fundAmount: formData.fundAmount,
          transactionSignature: formData.transactionSignature
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create campaign")
      }

      router.push("/business?created=true")
    } catch (error) {
      console.error("Error creating campaign:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      alert(`Failed to create campaign: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return formData.title && formData.description && formData.productUrl
      case 2:
        return formData.rewardAmount && Number(formData.rewardAmount) > 0 &&
            formData.fundAmount && Number(formData.fundAmount) > 0 &&
            formData.targetAudience && Number(formData.campaignDuration) >= 1
      case 3:
        return formData.requirements.trim().length > 0
      case 4:
        return formData.transactionSignature.length > 0
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (step) {
      setStep(step + 1)
    }
  }

  return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4 animate-slide-up">
          <Link href="/business">
            <Button variant="outline" className="rounded-xl bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Create New Campaign</h1>
            <p className="text-xl text-white/80">Set up your referral campaign in 4 easy steps</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Campaign Setup Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="flex justify-between">
              {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            step >= num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {step > num ? <CheckCircle className="w-4 h-4" /> : num}
                    </div>
                    {num < 4 && <div className="w-12 h-1 mx-2 bg-gray-200"></div>}
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="glass-effect border-0 shadow-2xl animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
            <CardTitle className="text-2xl">
              {step === 1 && "Campaign Details"}
              {step === 2 && "Rewards & Targeting"}
              {step === 3 && "Requirements & Guidelines"}
              {step === 4 && "Review & Launch"}
            </CardTitle>
            <CardDescription className="text-white/90">
              {step === 1 && "Tell us about your product or service"}
              {step === 2 && "Set rewards and define your target audience"}
              {step === 3 && "Specify what referrers need to do"}
              {step === 4 && "Review everything before launching"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Step 1: Campaign Details */}
            {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-lg font-semibold">
                      Campaign Title *
                    </Label>
                    <Input
                        id="title"
                        placeholder="e.g., Premium SaaS Tool Referral Program"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className={`rounded-xl border-2 ${errors.title ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-lg font-semibold">
                      Description *
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your product/service and what makes it special..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        className={`rounded-xl border-2 ${errors.description ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productUrl" className="text-lg font-semibold">
                      Product/Service URL *
                    </Label>
                    <Input
                        id="productUrl"
                        type="url"
                        placeholder="https://yourproduct.com"
                        value={formData.productUrl}
                        onChange={(e) => handleInputChange("productUrl", e.target.value)}
                        className={`rounded-xl border-2 ${errors.productUrl ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                    />
                    {errors.productUrl && <p className="text-red-500 text-sm">{errors.productUrl}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-lg font-semibold">
                      Campaign Logo
                    </Label>
                    <div className={`border-2 border-dashed ${errors.logo ? 'border-red-300' : 'border-gray-300'} rounded-xl p-8 text-center`}>
                      <Input id="logo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <label htmlFor="logo" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          {formData.logo ? "Logo Selected" : "Upload Campaign Logo"}
                        </p>
                        <p className="text-sm text-gray-500">{formData.logo ? formData.logo.name : "PNG, JPG up to 5MB"}</p>
                      </label>
                    </div>
                    {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
                  </div>
                </div>
            )}

            {/* Step 2: Rewards & Targeting */}
            {step === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rewardAmount" className="text-lg font-semibold">
                        Reward Amount *
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                            id="rewardAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.1"
                            value={formData.rewardAmount}
                            onChange={(e) => handleInputChange("rewardAmount", e.target.value)}
                            className={`flex-1 rounded-xl border-2 ${errors.rewardAmount ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                        />
                        <Badge className="px-4 py-2 bg-purple-100 text-purple-800">SOL</Badge>
                      </div>
                      {errors.rewardAmount && <p className="text-red-500 text-sm">{errors.rewardAmount}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campaignDuration" className="text-lg font-semibold">
                        Campaign Duration
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                            id="campaignDuration"
                            type="number"
                            min="1"
                            value={formData.campaignDuration}
                            onChange={(e) => handleInputChange("campaignDuration", e.target.value)}
                            className={`flex-1 rounded-xl border-2 ${errors.campaignDuration ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                        />
                        <Badge className="px-4 py-2 bg-blue-100 text-blue-800">Days</Badge>
                      </div>
                      {errors.campaignDuration && <p className="text-red-500 text-sm">{errors.campaignDuration}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience" className="text-lg font-semibold">
                      Target Audience *
                    </Label>
                    <Textarea
                        id="targetAudience"
                        placeholder="Describe your ideal customers (e.g., small business owners, developers, content creators...)"
                        value={formData.targetAudience}
                        onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                        rows={3}
                        className={`rounded-xl border-2 ${errors.targetAudience ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                    />
                    {errors.targetAudience && <p className="text-red-500 text-sm">{errors.targetAudience}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundAmount" className="text-lg font-semibold">
                      Total Funding Amount *
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                          id="fundAmount"
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="10"
                          value={formData.fundAmount}
                          onChange={(e) => handleInputChange("fundAmount", e.target.value)}
                          className={`flex-1 rounded-xl border-2 ${errors.fundAmount ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                      />
                      <Badge className="px-4 py-2 bg-purple-100 text-purple-800">SOL</Badge>
                    </div>
                    {errors.fundAmount && <p className="text-red-500 text-sm">{errors.fundAmount}</p>}
                    <p className="text-sm text-gray-600">
                      This amount will be transferred to fund referrer rewards from your connected wallet.
                    </p>
                  </div>

                  <Button
                      onClick={handleFund}
                      disabled={fundingLoading || !formData.fundAmount || !publicKey || !connected || !!formData.transactionSignature}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl px-6"
                  >
                    {fundingLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                    ) : formData.transactionSignature ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Funded Successfully
                        </>
                    ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Transfer Funding
                        </>
                    )}
                  </Button>

                  {formData.transactionSignature && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-green-800 font-medium">✅ Funding Transaction Completed</p>
                        <p className="text-green-600 text-sm break-all">TX: {formData.transactionSignature}</p>
                      </div>
                  )}

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Reward Calculation
                    </h3>
                    <div className="text-blue-700 space-y-1">
                      <p>
                        • Reward per successful referral: <strong>{formData.rewardAmount || "0"} SOL</strong>
                      </p>
                      <p>
                        • Maximum possible referrals: <strong>{formData.fundAmount && formData.rewardAmount ? Math.floor(Number(formData.fundAmount) / Number(formData.rewardAmount)) : 0}</strong>
                      </p>
                      <p className="text-sm">Platform fee: 5% of reward amount per transaction</p>
                    </div>
                  </div>
                </div>
            )}

            {/* Step 3: Requirements */}
            {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-lg font-semibold">
                      Referral Requirements *
                    </Label>
                    <Textarea
                        id="requirements"
                        placeholder="What do referrers need to do? (e.g., Sign up for free trial, Make a purchase, Complete onboarding...)"
                        value={formData.requirements}
                        onChange={(e) => handleInputChange("requirements", e.target.value)}
                        rows={5}
                        className={`rounded-xl border-2 ${errors.requirements ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400`}
                    />
                    {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements}</p>}
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                    <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Best Practices
                    </h3>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                      <li>• Be specific about what constitutes a successful referral</li>
                      <li>• Include any verification steps required</li>
                      <li>• Mention any restrictions or limitations</li>
                      <li>• Specify the timeframe for completion</li>
                    </ul>
                  </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Campaign Summary</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Campaign Details</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Title:</strong> {formData.title}
                          </p>
                          <p>
                            <strong>URL:</strong> {formData.productUrl}
                          </p>
                          <p>
                            <strong>Duration:</strong> {formData.campaignDuration} days
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Rewards & Funding</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Reward per Referral:</strong> {formData.rewardAmount} SOL
                          </p>
                          <p>
                            <strong>Total Fund Amount:</strong> {formData.fundAmount} SOL
                          </p>
                          <p>
                            <strong>Platform Fee per Transaction:</strong> {(Number(formData.rewardAmount) * 0.05).toFixed(4)} SOL
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{formData.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Target Audience</h4>
                      <p className="text-sm text-gray-600">{formData.targetAudience}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Requirements</h4>
                      <p className="text-sm text-gray-600">{formData.requirements}</p>
                    </div>
                  </div>

                  {!formData.transactionSignature && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                        <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          Funding Required
                        </h3>
                        <p className="text-red-700 text-sm">
                          Please go back to Step 2 and complete the funding process before launching your campaign.
                        </p>
                      </div>
                  )}

                  {formData.transactionSignature && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                        <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Ready to Launch
                        </h3>
                        <p className="text-green-700 text-sm">
                          Your campaign is funded and ready to go live. Once launched, referrers will be able to discover and promote your product.
                        </p>
                      </div>
                  )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="rounded-xl px-6"
              >
                Previous
              </Button>

              {step < 4 ? (
                  <Button
                      onClick={handleNextStep}
                      disabled={!isStepValid(step)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-6"
                  >
                    Next Step
                  </Button>
              ) : (
                  <Button
                      onClick={handleSubmit}
                      disabled={loading || !formData.transactionSignature}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl px-8"
                  >
                    {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Launching...
                        </div>
                    ) : (
                        <>
                          <Target className="w-5 h-5 mr-2" />
                          Launch Campaign
                        </>
                    )}
                  </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}