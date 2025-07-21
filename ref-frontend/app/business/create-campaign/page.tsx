"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, DollarSign, Target, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productUrl: "",
    rewardAmount: "",
    rewardType: "SOL",
    targetAudience: "",
    campaignDuration: "30",
    requirements: "",
    logo: null as File | null,
  })

  const progress = (step / 4) * 100

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push("/business?created=true")
    } catch (error) {
      console.error("Error creating campaign:", error)
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return formData.title && formData.description && formData.productUrl
      case 2:
        return formData.rewardAmount && formData.targetAudience
      case 3:
        return formData.requirements
      case 4:
        return true
      default:
        return false
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
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-400"
                />
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
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-400"
                />
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
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo" className="text-lg font-semibold">
                  Campaign Logo
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Input id="logo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="logo" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {formData.logo ? "Logo Selected" : "Upload Campaign Logo"}
                    </p>
                    <p className="text-sm text-gray-500">{formData.logo ? formData.logo.name : "PNG, JPG up to 5MB"}</p>
                  </label>
                </div>
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
                      placeholder="50"
                      value={formData.rewardAmount}
                      onChange={(e) => handleInputChange("rewardAmount", e.target.value)}
                      className="flex-1 rounded-xl border-2 border-gray-200 focus:border-blue-400"
                    />
                    <Badge className="px-4 py-2 bg-purple-100 text-purple-800">SOL</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaignDuration" className="text-lg font-semibold">
                    Campaign Duration
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="campaignDuration"
                      type="number"
                      value={formData.campaignDuration}
                      onChange={(e) => handleInputChange("campaignDuration", e.target.value)}
                      className="flex-1 rounded-xl border-2 border-gray-200 focus:border-blue-400"
                    />
                    <Badge className="px-4 py-2 bg-blue-100 text-blue-800">Days</Badge>
                  </div>
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
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-400"
                />
              </div>

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
                    • Estimated cost for 100 conversions:{" "}
                    <strong>{Number.parseFloat(formData.rewardAmount) * 100 || 0} SOL</strong>
                  </p>
                  <p className="text-sm">Platform fee: 5% of reward amount</p>
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
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-400"
                />
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
                    <h4 className="font-semibold text-gray-700 mb-2">Rewards & Targeting</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Reward:</strong> {formData.rewardAmount} SOL
                      </p>
                      <p>
                        <strong>Platform Fee:</strong> {(Number.parseFloat(formData.rewardAmount) * 0.05).toFixed(2)}{" "}
                        SOL
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{formData.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Requirements</h4>
                  <p className="text-sm text-gray-600">{formData.requirements}</p>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Ready to Launch
                </h3>
                <p className="text-green-700 text-sm">
                  Your campaign is ready to go live. Once launched, referrers will be able to discover and promote your
                  product.
                </p>
              </div>
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
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-6"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl px-8"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
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
