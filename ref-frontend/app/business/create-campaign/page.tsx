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
const SYSTEM_WALLET = new PublicKey("6gM8Rc3EsDjBcKdeLq27G41gVkPZW32jBsfphZLX2AZd")

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
      const response = await fetch("https://solanareferral-1.onrender.com/api/business/create-campaign", {
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
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Create Campaign</h1>
            <p className="text-muted-foreground mt-1">Configure your referral program parameters</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-foreground">Setup Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            <div className="flex justify-between">
              {[
                { num: 1, label: "Details" },
                { num: 2, label: "Rewards" },
                { num: 3, label: "Requirements" },
                { num: 4, label: "Review" }
              ].map((item) => (
                  <div key={item.num} className="flex flex-col items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                            step >= item.num 
                              ? "bg-primary text-primary-foreground border-primary" 
                              : "bg-background text-muted-foreground border-border"
                        }`}
                    >
                      {step > item.num ? <CheckCircle className="w-4 h-4" /> : item.num}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="border border-border animate-scale-in">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl">
              {step === 1 && "Campaign Information"}
              {step === 2 && "Reward Configuration"}
              {step === 3 && "Campaign Requirements"}
              {step === 4 && "Review & Deploy"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Basic campaign details and targeting"}
              {step === 2 && "Define reward structure and funding"}
              {step === 3 && "Specify referrer requirements"}
              {step === 4 && "Verify all details before deployment"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Step 1 */}
            {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title *</Label>
                    <Input
                        id="title"
                        placeholder="Enterprise Subscription Referral Program"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                        id="description"
                        placeholder="Detailed description of your product/service offering..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        className={errors.description ? 'border-destructive' : ''}
                    />
                    {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productUrl">Product URL *</Label>
                    <Input
                        id="productUrl"
                        type="url"
                        placeholder="https://yourcompany.com/product"
                        value={formData.productUrl}
                        onChange={(e) => handleInputChange("productUrl", e.target.value)}
                        className={errors.productUrl ? 'border-destructive' : ''}
                    />
                    {errors.productUrl && <p className="text-destructive text-sm">{errors.productUrl}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Campaign Logo (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-border/60 transition-colors">
                      <Input id="logo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <label htmlFor="logo" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          {formData.logo ? formData.logo.name : "Upload Image"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </label>
                    </div>
                    {errors.logo && <p className="text-destructive text-sm">{errors.logo}</p>}
                  </div>
                </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="rewardAmount">Reward per Referral *</Label>
                      <div className="flex space-x-2">
                        <Input
                            id="rewardAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.1"
                            value={formData.rewardAmount}
                            onChange={(e) => handleInputChange("rewardAmount", e.target.value)}
                            className={`flex-1 ${errors.rewardAmount ? 'border-destructive' : ''}`}
                        />
                        <Badge variant="secondary" className="px-3">SOL</Badge>
                      </div>
                      {errors.rewardAmount && <p className="text-destructive text-sm">{errors.rewardAmount}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campaignDuration">Duration (Days)</Label>
                      <Input
                          id="campaignDuration"
                          type="number"
                          min="1"
                          value={formData.campaignDuration}
                          onChange={(e) => handleInputChange("campaignDuration", e.target.value)}
                          className={errors.campaignDuration ? 'border-destructive' : ''}
                      />
                      {errors.campaignDuration && <p className="text-destructive text-sm">{errors.campaignDuration}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience *</Label>
                    <Textarea
                        id="targetAudience"
                        placeholder="Define your ideal customer profile..."
                        value={formData.targetAudience}
                        onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                        rows={3}
                        className={errors.targetAudience ? 'border-destructive' : ''}
                    />
                    {errors.targetAudience && <p className="text-destructive text-sm">{errors.targetAudience}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundAmount">Total Campaign Fund *</Label>
                    <div className="flex space-x-2">
                      <Input
                          id="fundAmount"
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="10"
                          value={formData.fundAmount}
                          onChange={(e) => handleInputChange("fundAmount", e.target.value)}
                          className={`flex-1 ${errors.fundAmount ? 'border-destructive' : ''}`}
                      />
                      <Badge variant="secondary" className="px-3">SOL</Badge>
                    </div>
                    {errors.fundAmount && <p className="text-destructive text-sm">{errors.fundAmount}</p>}
                    <p className="text-xs text-muted-foreground">
                      Funds will be transferred to secure smart contract escrow
                    </p>
                  </div>

                  <Button
                      onClick={handleFund}
                      disabled={fundingLoading || !formData.fundAmount || !publicKey || !connected || !!formData.transactionSignature}
                      className="w-full"
                      size="lg"
                  >
                    {fundingLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing Transfer...
                        </>
                    ) : formData.transactionSignature ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Funded Successfully
                        </>
                    ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Transfer Funds
                        </>
                    )}
                  </Button>

                  {formData.transactionSignature && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <p className="text-green-500 font-medium text-sm">Transaction Confirmed</p>
                        <p className="text-green-500/70 text-xs break-all mt-1">TX: {formData.transactionSignature}</p>
                      </div>
                  )}

                  <div className="bg-muted/30 border border-border rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Funding Summary
                    </h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Reward per referral: <span className="text-foreground font-medium">{formData.rewardAmount || "0"} SOL</span></p>
                      <p>Maximum referrals: <span className="text-foreground font-medium">{formData.fundAmount && formData.rewardAmount ? Math.floor(Number(formData.fundAmount) / Number(formData.rewardAmount)) : 0}</span></p>
                      <p className="text-xs">Platform fee: 5% per transaction</p>
                    </div>
                  </div>
                </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Referral Requirements *</Label>
                    <Textarea
                        id="requirements"
                        placeholder="Define specific actions referrers must complete..."
                        value={formData.requirements}
                        onChange={(e) => handleInputChange("requirements", e.target.value)}
                        rows={6}
                        className={errors.requirements ? 'border-destructive' : ''}
                    />
                    {errors.requirements && <p className="text-destructive text-sm">{errors.requirements}</p>}
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Best Practices
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Define clear, measurable completion criteria</li>
                      <li>• Specify verification requirements</li>
                      <li>• Include relevant restrictions</li>
                      <li>• Set realistic timeframes</li>
                    </ul>
                  </div>
                </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
                <div className="space-y-5">
                  <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Campaign Overview</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Campaign Title</p>
                          <p className="text-sm text-foreground font-medium">{formData.title}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Product URL</p>
                          <p className="text-sm text-foreground font-medium break-all">{formData.productUrl}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="text-sm text-foreground font-medium">{formData.campaignDuration} days</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Reward Structure</p>
                          <p className="text-sm text-foreground font-medium">{formData.rewardAmount} SOL per referral</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Funding</p>
                          <p className="text-sm text-foreground font-medium">{formData.fundAmount} SOL</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Platform Fee</p>
                          <p className="text-sm text-foreground font-medium">{(Number(formData.rewardAmount) * 0.05).toFixed(4)} SOL per transaction</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Description</p>
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Target Audience</p>
                      <p className="text-sm text-muted-foreground">{formData.targetAudience}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Requirements</p>
                      <p className="text-sm text-muted-foreground">{formData.requirements}</p>
                    </div>
                  </div>

                  {!formData.transactionSignature && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <h4 className="font-medium text-destructive mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Funding Required
                        </h4>
                        <p className="text-destructive/80 text-sm">
                          Return to Step 2 to complete campaign funding before deployment
                        </p>
                      </div>
                  )}

                  {formData.transactionSignature && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="font-medium text-green-500 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Ready for Deployment
                        </h4>
                        <p className="text-green-500/80 text-sm">
                          Campaign funded and verified. Deploy to activate referral program.
                        </p>
                      </div>
                  )}
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
              >
                Previous
              </Button>

              {step < 4 ? (
                  <Button
                      onClick={handleNextStep}
                      disabled={!isStepValid(step)}
                  >
                    Next Step
                  </Button>
              ) : (
                  <Button
                      onClick={handleSubmit}
                      disabled={loading || !formData.transactionSignature}
                      size="lg"
                  >
                    {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Deploying...
                        </div>
                    ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Deploy Campaign
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