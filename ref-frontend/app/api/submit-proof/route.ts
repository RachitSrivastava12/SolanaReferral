import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const referralId = formData.get("referralId") as string
    const comment = formData.get("comment") as string
    const deviceInfo = formData.get("deviceInfo") as string
    const screenshot = formData.get("screenshot") as File | null
    const imageLink = formData.get("imageLink") as string

    // In production, save to database and process the file
    console.log("Proof submitted:", {
      referralId,
      comment,
      deviceInfo,
      hasScreenshot: !!screenshot,
      imageLink,
      submittedAt: new Date().toISOString(),
    })

    if (screenshot) {
      console.log("Screenshot details:", {
        name: screenshot.name,
        size: screenshot.size,
        type: screenshot.type,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Proof submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting proof:", error)
    return NextResponse.json({ success: false, error: "Failed to submit proof" }, { status: 500 })
  }
}
