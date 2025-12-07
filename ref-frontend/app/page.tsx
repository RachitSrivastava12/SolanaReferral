
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
//       <div className="max-w-7xl mx-auto space-y-24">
//         {/* Hero Section */}
//         <div className="space-y-8 pt-8">
//           <div className="space-y-6">
//             <Badge variant="outline" className="border-primary/30 text-primary font-medium">
//               <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
//               Powered by Solana Network
//             </Badge>

//             <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
//               Enterprise Referral
//               <br />
//               <span className="text-primary">Infrastructure</span>
//             </h1>

//             <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
//               Blockchain-based referral platform connecting businesses with verified promoters. 
//               Automated rewards, transparent tracking, zero intermediaries.
//             </p>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
//             {[
//               { label: "Active Campaigns", value: "1,200+", change: "+12%" },
//               { label: "Verified Referrers", value: "15,000+", change: "+23%" },
//               { label: "Distributed", value: "$2.5M", change: "+45%" },
//             ].map((stat, index) => (
//               <div key={index} className="bg-card border border-border rounded-lg p-6">
//                 <div className="flex items-baseline justify-between mb-2">
//                   <div className="text-3xl font-bold text-foreground">{stat.value}</div>
//                   <span className="text-sm text-green-500 font-medium">{stat.change}</span>
//                 </div>
//                 <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* CTA Section */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Business CTA */}
//           <Card
//             className={`border-2 transition-all duration-300 ${
//               hoveredCard === "business" 
//                 ? "border-primary shadow-lg shadow-primary/10" 
//                 : "border-border hover:border-border/60"
//             }`}
//             onMouseEnter={() => setHoveredCard("business")}
//             onMouseLeave={() => setHoveredCard(null)}
//           >
//             <CardHeader className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-3 bg-primary/10 rounded-lg">
//                   <Building2 className="w-6 h-6 text-primary" />
//                 </div>
//                 <Badge variant="outline" className="border-primary/30 text-primary">
//                   For Businesses
//                 </Badge>
//               </div>
//               <div>
//                 <CardTitle className="text-2xl mb-2">Launch Campaigns</CardTitle>
//                 <CardDescription className="text-base">
//                   Deploy referral programs with automated reward distribution
//                 </CardDescription>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-3">
//                 {[
//                   "Smart contract-based reward system",
//                   "Real-time analytics dashboard",
//                   "Fraud detection & verification",
//                   "Multi-tier campaign structures",
//                 ].map((feature, idx) => (
//                   <div key={idx} className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
//                     <span className="text-sm text-muted-foreground">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//               <Link href="/business" className="block">
//                 <Button className="w-full group" size="lg">
//                   Access Platform
//                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>

//           {/* Referrer CTA */}
//           <Card
//             className={`border-2 transition-all duration-300 ${
//               hoveredCard === "referrer" 
//                 ? "border-accent shadow-lg shadow-accent/10" 
//                 : "border-border hover:border-border/60"
//             }`}
//             onMouseEnter={() => setHoveredCard("referrer")}
//             onMouseLeave={() => setHoveredCard(null)}
//           >
//             <CardHeader className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-3 bg-accent/10 rounded-lg">
//                   <Users className="w-6 h-6 text-accent" />
//                 </div>
//                 <Badge variant="outline" className="border-accent/30 text-accent">
//                   For Referrers
//                 </Badge>
//               </div>
//               <div>
//                 <CardTitle className="text-2xl mb-2">Earn Rewards</CardTitle>
//                 <CardDescription className="text-base">
//                   Monetize your network with verified referral opportunities
//                 </CardDescription>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-3">
//                 {[
//                   "Curated campaign marketplace",
//                   "Instant on-chain payouts",
//                   "Performance tracking tools",
//                   "Transparent reward terms",
//                 ].map((feature, idx) => (
//                   <div key={idx} className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
//                     <span className="text-sm text-muted-foreground">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//               <Link href="/referrer" className="block">
//                 <Button variant="outline" className="w-full group border-accent/30 hover:bg-accent/5" size="lg">
//                   Browse Campaigns
//                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Features Section */}
//         <div className="space-y-12">
//           <div className="space-y-4 text-center max-w-3xl mx-auto">
//             <h2 className="text-4xl font-bold text-foreground">Platform Capabilities</h2>
//             <p className="text-lg text-muted-foreground">
//               Enterprise-grade infrastructure built for scale, security, and transparency
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               { 
//                 icon: Shield, 
//                 title: "Smart Contract Security", 
//                 desc: "Audited contracts with multi-sig verification" 
//               },
//               { 
//                 icon: Globe, 
//                 title: "Decentralized Network", 
//                 desc: "Solana-powered with sub-second finality" 
//               },
//               { 
//                 icon: Zap, 
//                 title: "Instant Settlement", 
//                 desc: "Automated payouts upon verification" 
//               },
//               { 
//                 icon: BarChart3, 
//                 title: "Advanced Analytics", 
//                 desc: "Comprehensive performance metrics" 
//               },
//               { 
//                 icon: Lock, 
//                 title: "Fraud Prevention", 
//                 desc: "AI-powered detection systems" 
//               },
//               { 
//                 icon: TrendingUp, 
//                 title: "Scalable Infrastructure", 
//                 desc: "Built for enterprise volume" 
//               },
//             ].map((feature, idx) => (
//               <Card key={idx} className="border border-border hover:border-border/60 transition-all">
//                 <CardContent className="p-6 space-y-4">
//                   <div className="p-3 w-fit bg-secondary rounded-lg">
//                     <feature.icon className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
//                     <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
//                   </div>
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
  Sparkles,
  Target,
  Wallet,
  Github,
  Twitter,
  Send,
  Mail,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto space-y-32 pb-0">
          {/* Hero Section */}
          <div className="space-y-12 pt-20">
            <div className="space-y-8 text-center">
              <Badge 
                variant="outline" 
                className="border-primary/30 bg-primary/5 text-primary font-medium px-4 py-1.5 mx-auto backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Powered by Solana Network
              </Badge>

              <h1 className="text-6xl md:text-8xl font-bold text-foreground leading-[1.1] tracking-tight">
                Enterprise Referral
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Infrastructure
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Blockchain-based referral platform connecting businesses with verified promoters.
                <br className="hidden md:block" />
                <span className="font-semibold text-foreground">Automated rewards</span>, 
                <span className="font-semibold text-foreground"> transparent tracking</span>, 
                <span className="font-semibold text-foreground"> zero intermediaries</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link href="/business">
                  <Button size="lg" className="text-base px-8 py-6 group shadow-lg shadow-primary/20">
                    Launch Campaign
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/referrer">
                  <Button size="lg" variant="outline" className="text-base px-8 py-6 group">
                    Start Earning
                    <Wallet className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              {[
                { label: "Active Campaigns", value: "1,200+", change: "+12%", icon: Target },
                { label: "Verified Referrers", value: "15,000+", change: "+23%", icon: Users },
                { label: "Rewards Distributed", value: "$2.5M", change: "+45%", icon: Wallet },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="relative bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-8 hover:border-primary/30 transition-all group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-sm text-green-500 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Business CTA */}
            <Card
              className={`relative border-2 transition-all duration-500 overflow-hidden group ${
                hoveredCard === "business" 
                  ? "border-primary shadow-2xl shadow-primary/20 scale-[1.02]" 
                  : "border-border"
              }`}
              onMouseEnter={() => setHoveredCard("business")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent transition-opacity duration-500 ${
                hoveredCard === "business" ? "opacity-100" : "opacity-0"
              }`} />
              
              <CardHeader className="space-y-6 relative z-10 pb-6">
                <div className="flex items-center justify-between">
                  <div className="p-4 bg-primary/10 rounded-xl ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 font-semibold">
                    For Businesses
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-3xl mb-3 font-bold">Launch Campaigns</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Deploy referral programs with automated reward distribution and real-time analytics
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8 relative z-10">
                <div className="space-y-4">
                  {[
                    "Smart contract-based reward system",
                    "Real-time analytics dashboard",
                    "Fraud detection & verification",
                    "Multi-tier campaign structures",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3 group/item">
                      <div className="mt-0.5 p-1 bg-primary/10 rounded-full group-hover/item:bg-primary/20 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Link href="/business" className="block">
                  <Button className="w-full group/btn shadow-lg shadow-primary/20" size="lg">
                    Access Platform
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Referrer CTA */}
            <Card
              className={`relative border-2 transition-all duration-500 overflow-hidden group ${
                hoveredCard === "referrer" 
                  ? "border-purple-500 shadow-2xl shadow-purple-500/20 scale-[1.02]" 
                  : "border-border"
              }`}
              onMouseEnter={() => setHoveredCard("referrer")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/5 via-purple-500/3 to-transparent transition-opacity duration-500 ${
                hoveredCard === "referrer" ? "opacity-100" : "opacity-0"
              }`} />
              
              <CardHeader className="space-y-6 relative z-10 pb-6">
                <div className="flex items-center justify-between">
                  <div className="p-4 bg-purple-500/10 rounded-xl ring-4 ring-purple-500/5 group-hover:ring-purple-500/10 transition-all">
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-500 border-0 px-4 py-1.5 font-semibold">
                    For Referrers
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-3xl mb-3 font-bold">Earn Rewards</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Monetize your network with verified referral opportunities and instant payouts
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8 relative z-10">
                <div className="space-y-4">
                  {[
                    "Curated campaign marketplace",
                    "Instant on-chain payouts",
                    "Performance tracking tools",
                    "Transparent reward terms",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3 group/item">
                      <div className="mt-0.5 p-1 bg-purple-500/10 rounded-full group-hover/item:bg-purple-500/20 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-purple-500" />
                      </div>
                      <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Link href="/referrer" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full group/btn border-purple-500/30 hover:bg-purple-500/5 shadow-lg shadow-purple-500/10" 
                    size="lg"
                  >
                    Browse Campaigns
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="space-y-16">
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Platform Capabilities</h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Enterprise-grade infrastructure built for scale, security, and transparency
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: Shield, 
                  title: "Smart Contract Security", 
                  desc: "Audited contracts with multi-sig verification",
                  color: "text-blue-500"
                },
                { 
                  icon: Globe, 
                  title: "Decentralized Network", 
                  desc: "Solana-powered with sub-second finality",
                  color: "text-green-500"
                },
                { 
                  icon: Zap, 
                  title: "Instant Settlement", 
                  desc: "Automated payouts upon verification",
                  color: "text-yellow-500"
                },
                { 
                  icon: BarChart3, 
                  title: "Advanced Analytics", 
                  desc: "Comprehensive performance metrics",
                  color: "text-purple-500"
                },
                { 
                  icon: Lock, 
                  title: "Fraud Prevention", 
                  desc: "AI-powered detection systems",
                  color: "text-red-500"
                },
                { 
                  icon: TrendingUp, 
                  title: "Scalable Infrastructure", 
                  desc: "Built for enterprise volume",
                  color: "text-pink-500"
                },
              ].map((feature, idx) => (
                <Card key={idx} className="border border-border hover:border-border/60 transition-all group hover:shadow-lg">
                  <CardContent className="p-8 space-y-5">
                    <div className={`p-4 w-fit bg-secondary rounded-xl group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-foreground">Solana Referral</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enterprise referral infrastructure powered by Solana blockchain. Connecting businesses with verified promoters.
                </p>
              </div>

              {/* Product */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Product</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/business" className="hover:text-primary transition-colors">For Businesses</Link></li>
                  <li><Link href="/referrer" className="hover:text-primary transition-colors">For Referrers</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Company</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Legal</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                © 2024 Solana Referral. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Send className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Analytics />
    </>
  )
}