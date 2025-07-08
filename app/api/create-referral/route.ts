import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    // Generate a unique referral ID (in production, use a proper UUID library)
    const referralId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // In production, save to database
    console.log("Creating referral for wallet:", walletAddress, "with ID:", referralId)

    return NextResponse.json({
      success: true,
      referralId,
      walletAddress,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error creating referral:", error)
    return NextResponse.json({ success: false, error: "Failed to create referral" }, { status: 500 })
  }
}
