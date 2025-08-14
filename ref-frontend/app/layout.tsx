import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { WalletProvider } from "@/components/wallet-provider"
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Solana Referral Hub",
  description: "Next-generation decentralized referral rewards system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen gradient-bg relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
              <div
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
                style={{ animationDelay: "4s" }}
              ></div>
            </div>

            <main className="relative z-10 container mx-auto px-4 py-8">{children}</main>
          </div>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
