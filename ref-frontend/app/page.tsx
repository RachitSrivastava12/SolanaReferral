
// "use client"
// import { Analytics } from "@vercel/analytics/react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   Building2,
//   Users,
//   TrendingUp,
//   Zap,
//   Shield,
//   Globe,
//   ArrowRight,
//   BarChart3,
//   Lock,
//   CheckCircle2,
// } from "lucide-react"
// import Link from "next/link"

// export default function LandingPage() {
//   const [hoveredCard, setHoveredCard] = useState<string | null>(null)

//   return (
//     <>
//       <div className="max-w-7xl mx-auto space-y-20">
//         {/* Hero Section */}
//         <div className="space-y-8 animate-fade-in">
//           <div className="space-y-4">
//             <div className="inline-flex items-center space-x-2 bg-secondary border border-muted/50 rounded-full px-4 py-2">
//               <div className="w-2 h-2 bg-accent rounded-full"></div>
//               <span className="text-sm font-medium text-muted-foreground">Solana Network</span>
//             </div>

//             <h1 className="text-5xl md:text-6xl font-bold text-foreground">Decentralized Referral Platform</h1>

//             <p className="text-lg text-muted-foreground max-w-2xl">
//               Connect businesses with promoters. Create campaigns, earn rewards, and scale your growth through
//               blockchain-powered referrals.
//             </p>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {[
//               { label: "Active Campaigns", value: "1,200+" },
//               { label: "Total Referrers", value: "15,000+" },
//               { label: "Rewards Distributed", value: "$2.5M" },
//             ].map((stat, index) => (
//               <div key={index} className="stat-card">
//                 <div className="text-2xl font-bold text-accent">{stat.value}</div>
//                 <div className="text-sm text-muted-foreground">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* CTA Section */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Business CTA */}
//           <Card
//             className={`card-premium cursor-pointer transition-all ${
//               hoveredCard === "business" ? "border-primary shadow-lg" : ""
//             }`}
//             onMouseEnter={() => setHoveredCard("business")}
//             onMouseLeave={() => setHoveredCard(null)}
//           >
//             <CardHeader>
//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="p-2 bg-blue-900/50 rounded">
//                   <Building2 className="w-6 h-6 text-primary" />
//                 </div>
//                 <Badge variant="outline" className="border-primary/50">
//                   For Businesses
//                 </Badge>
//               </div>
//               <CardTitle className="text-2xl">Grow Your Business</CardTitle>
//               <CardDescription className="text-base">Launch referral campaigns and reach new customers</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-3">
//                 {[
//                   "Create targeted referral campaigns",
//                   "Track performance in real-time",
//                   "Automated reward distribution",
//                   "Fraud protection & verification",
//                 ].map((feature, idx) => (
//                   <div key={idx} className="flex items-center space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
//                     <span className="text-sm text-foreground">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//               <Link href="/business" className="block">
//                 <Button className="w-full btn-primary group">
//                   Start Building
//                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>

//           {/* Referrer CTA */}
//           <Card
//             className={`card-premium cursor-pointer transition-all ${
//               hoveredCard === "referrer" ? "border-accent shadow-lg" : ""
//             }`}
//             onMouseEnter={() => setHoveredCard("referrer")}
//             onMouseLeave={() => setHoveredCard(null)}
//           >
//             <CardHeader>
//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="p-2 bg-amber-900/50 rounded">
//                   <Users className="w-6 h-6 text-accent" />
//                 </div>
//                 <Badge variant="outline" className="border-accent/50">
//                   For Referrers
//                 </Badge>
//               </div>
//               <CardTitle className="text-2xl">Earn Rewards</CardTitle>
//               <CardDescription className="text-base">Promote products and earn crypto</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-3">
//                 {[
//                   "Browse available campaigns",
//                   "Generate referral links instantly",
//                   "Track earnings in real-time",
//                   "Instant wallet payouts",
//                 ].map((feature, idx) => (
//                   <div key={idx} className="flex items-center space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
//                     <span className="text-sm text-foreground">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//               <Link href="/referrer" className="block">
//                 <Button variant="outline" className="w-full btn-secondary group bg-transparent">
//                   Start Earning
//                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Features Section */}
//         <div className="space-y-8">
//           <div className="space-y-2">
//             <h2 className="text-3xl font-bold text-foreground">Why Choose Us</h2>
//             <p className="text-muted-foreground">Enterprise-grade features built for scale</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               { icon: Shield, title: "Secure & Verified", desc: "Smart contracts ensure trust" },
//               { icon: Globe, title: "Decentralized", desc: "Powered by Solana blockchain" },
//               { icon: Zap, title: "Instant Payouts", desc: "No delays, no intermediaries" },
//               { icon: BarChart3, title: "Analytics", desc: "Real-time performance metrics" },
//               { icon: Lock, title: "Anti-Fraud", desc: "Advanced verification system" },
//               { icon: TrendingUp, title: "Scale Ready", desc: "Built for high volume" },
//             ].map((feature, idx) => (
//               <Card key={idx} className="card-premium">
//                 <CardContent className="p-6 space-y-3">
//                   <div className="p-2 w-fit bg-secondary rounded">
//                     <feature.icon className="w-5 h-5 text-primary" />
//                   </div>
//                   <h3 className="font-semibold text-foreground">{feature.title}</h3>
//                   <p className="text-sm text-muted-foreground">{feature.desc}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Analytics />
//     </>
//   )
// }

"use client"
import { Analytics } from "@vercel/analytics/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  BarChart3,
  Lock,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Hero Section */}
        <div className="space-y-8 pt-8">
          <div className="space-y-6">
            <Badge variant="outline" className="border-primary/30 text-primary font-medium">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Powered by Solana Network
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
              Enterprise Referral
              <br />
              <span className="text-primary">Infrastructure</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Blockchain-based referral platform connecting businesses with verified promoters. 
              Automated rewards, transparent tracking, zero intermediaries.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {[
              { label: "Active Campaigns", value: "1,200+", change: "+12%" },
              { label: "Verified Referrers", value: "15,000+", change: "+23%" },
              { label: "Distributed", value: "$2.5M", change: "+45%" },
            ].map((stat, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Business CTA */}
          <Card
            className={`border-2 transition-all duration-300 ${
              hoveredCard === "business" 
                ? "border-primary shadow-lg shadow-primary/10" 
                : "border-border hover:border-border/60"
            }`}
            onMouseEnter={() => setHoveredCard("business")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  For Businesses
                </Badge>
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">Launch Campaigns</CardTitle>
                <CardDescription className="text-base">
                  Deploy referral programs with automated reward distribution
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  "Smart contract-based reward system",
                  "Real-time analytics dashboard",
                  "Fraud detection & verification",
                  "Multi-tier campaign structures",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/business" className="block">
                <Button className="w-full group" size="lg">
                  Access Platform
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Referrer CTA */}
          <Card
            className={`border-2 transition-all duration-300 ${
              hoveredCard === "referrer" 
                ? "border-accent shadow-lg shadow-accent/10" 
                : "border-border hover:border-border/60"
            }`}
            onMouseEnter={() => setHoveredCard("referrer")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <Badge variant="outline" className="border-accent/30 text-accent">
                  For Referrers
                </Badge>
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">Earn Rewards</CardTitle>
                <CardDescription className="text-base">
                  Monetize your network with verified referral opportunities
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  "Curated campaign marketplace",
                  "Instant on-chain payouts",
                  "Performance tracking tools",
                  "Transparent reward terms",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/referrer" className="block">
                <Button variant="outline" className="w-full group border-accent/30 hover:bg-accent/5" size="lg">
                  Browse Campaigns
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="space-y-12">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground">Platform Capabilities</h2>
            <p className="text-lg text-muted-foreground">
              Enterprise-grade infrastructure built for scale, security, and transparency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Shield, 
                title: "Smart Contract Security", 
                desc: "Audited contracts with multi-sig verification" 
              },
              { 
                icon: Globe, 
                title: "Decentralized Network", 
                desc: "Solana-powered with sub-second finality" 
              },
              { 
                icon: Zap, 
                title: "Instant Settlement", 
                desc: "Automated payouts upon verification" 
              },
              { 
                icon: BarChart3, 
                title: "Advanced Analytics", 
                desc: "Comprehensive performance metrics" 
              },
              { 
                icon: Lock, 
                title: "Fraud Prevention", 
                desc: "AI-powered detection systems" 
              },
              { 
                icon: TrendingUp, 
                title: "Scalable Infrastructure", 
                desc: "Built for enterprise volume" 
              },
            ].map((feature, idx) => (
              <Card key={idx} className="border border-border hover:border-border/60 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 w-fit bg-secondary rounded-lg">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Analytics />
    </>
  )
}