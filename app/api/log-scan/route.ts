import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { referralId, timestamp, ip, userAgent } = await request.json()

    // In production, save to database
    console.log("Logging scan:", {
      referralId,
      timestamp,
      ip,
      userAgent,
    })

    return NextResponse.json({
      success: true,
      logged: true,
    })
  } catch (error) {
    console.error("Error logging scan:", error)
    return NextResponse.json({ success: false, error: "Failed to log scan" }, { status: 500 })
  }
}
