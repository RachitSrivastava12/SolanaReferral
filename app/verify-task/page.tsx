"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CheckCircle, AlertCircle, ImageIcon, Link, Smartphone, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function VerifyTaskPage() {
  const searchParams = useSearchParams()
  const referralId = searchParams.get("ref")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState("")
  const [comment, setComment] = useState("")
  const [deviceInfo, setDeviceInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("file")
  const [formProgress, setFormProgress] = useState(0)

  useEffect(() => {
    setDeviceInfo(navigator.userAgent)
  }, [])

  useEffect(() => {
    // Calculate form completion progress
    let progress = 0
    if (referralId) progress += 25
    if (screenshot || imageLink) progress += 25
    if (comment.trim()) progress += 25
    if (deviceInfo) progress += 25
    setFormProgress(progress)
  }, [referralId, screenshot, imageLink, comment, deviceInfo])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScreenshot(file)
      setImageLink("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!referralId) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("referralId", referralId)
      formData.append("comment", comment)
      formData.append("deviceInfo", deviceInfo)

      if (screenshot) {
        formData.append("screenshot", screenshot)
      } else if (imageLink) {
        formData.append("imageLink", imageLink)
      }

      const response = await fetch("/api/submit-proof", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting proof:", error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto animate-scale-in">
        <Card className="glass-effect border-0 shadow-2xl overflow-hidden">
          <CardContent className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-success-bounce">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Proof Submitted Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Your task completion has been recorded. The referrer will be notified and rewards will be processed
              automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { icon: CheckCircle, label: "Verified", color: "text-green-600" },
                { icon: Award, label: "Rewards Pending", color: "text-yellow-600" },
                { icon: Smartphone, label: "Notified", color: "text-blue-600" },
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-white/50 rounded-xl">
                  <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <Card className="glass-effect border-0 shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Task Completion</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Submit proof that you've completed the required task
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Form Progress</span>
              <span className="text-sm text-gray-500">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Referral ID Display */}
            {referralId && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 animate-scale-in">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-600">Referral ID</Badge>
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded">{referralId}</code>
                </div>
              </div>
            )}

            {/* Upload Method Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Proof of Completion</Label>

              <div className="flex space-x-4 mb-4">
                <Button
                  type="button"
                  variant={uploadMethod === "file" ? "default" : "outline"}
                  onClick={() => setUploadMethod("file")}
                  className="flex-1 rounded-xl"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                <Button
                  type="button"
                  variant={uploadMethod === "link" ? "default" : "outline"}
                  onClick={() => setUploadMethod("link")}
                  className="flex-1 rounded-xl"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Image Link
                </Button>
              </div>

              {uploadMethod === "file" ? (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label htmlFor="screenshot-upload" className="cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        {screenshot ? "File Selected" : "Click to upload screenshot"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {screenshot ? screenshot.name : "PNG, JPG, GIF up to 10MB"}
                      </p>
                    </label>
                  </div>
                  {screenshot && (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">File ready for upload: {screenshot.name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="url"
                    placeholder="https://example.com/screenshot.png"
                    value={imageLink}
                    onChange={(e) => {
                      setImageLink(e.target.value)
                      if (e.target.value) setScreenshot(null)
                    }}
                    className="rounded-xl border-2 border-purple-200 focus:border-purple-400"
                  />
                  {imageLink && (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Image link added</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment Section */}
            <div className="space-y-3">
              <Label htmlFor="comment" className="text-lg font-semibold">
                Task Description
              </Label>
              <Textarea
                id="comment"
                placeholder="Describe how you completed the task, what you accomplished, and any relevant details..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="rounded-xl border-2 border-purple-200 focus:border-purple-400 resize-none"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{comment.length} characters</span>
                <span>Minimum 10 characters required</span>
              </div>
            </div>

            {/* Device Info */}
            <div className="space-y-3">
              <Label htmlFor="deviceInfo" className="text-lg font-semibold">
                Device Information
              </Label>
              <Textarea
                id="deviceInfo"
                value={deviceInfo}
                readOnly
                className="bg-gray-50 text-sm rounded-xl border-2 border-gray-200 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                This information is automatically detected for verification purposes.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl btn-hover-effect"
              disabled={loading || (!screenshot && !imageLink) || comment.trim().length < 10}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-3"></div>
                  Processing Submission...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Submit Proof & Claim Rewards
                </div>
              )}
            </Button>

            {/* Validation Messages */}
            {!screenshot && !imageLink && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Please provide proof by uploading a file or adding an image link</span>
              </div>
            )}

            {comment.trim().length < 10 && comment.length > 0 && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Please provide a more detailed description (minimum 10 characters)</span>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
