// // frontend/business/page.tsx
// "use client"

// import { useWallet } from "@solana/wallet-adapter-react"
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Plus, BarChart3, Users, DollarSign, TrendingUp, Eye, Building2, Target, Settings } from "lucide-react"
// import Link from "next/link"

// export default function BusinessDashboard() {
//   const { publicKey, connected } = useWallet()
//   const [campaigns, setCampaigns] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (connected && publicKey) {
//       fetchCampaigns()
//     }
//   }, [connected, publicKey])

//   const fetchCampaigns = async () => {
//     setIsLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(`https://solanareferral-1.onrender.com/api/business/campaigns?businessID=${publicKey?.toString()}`)
//       if (!response.ok) {
//         throw new Error('Failed to fetch campaigns')
//       }
//       const data = await response.json()
//       setCampaigns(data)
//     } catch (err) {
//       console.error("Error fetching campaigns:", err)
//       setError("Failed to load campaigns. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const totalStats = {
//     totalCampaigns: campaigns.length,
//     totalReferrals: campaigns.reduce((sum, c) => sum + c.referrals, 0),
//     totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
//     totalRewardsPaid: campaigns.reduce((sum, c) => sum + c.fundBalance, 0) + " SOL",
//   }

//   return (
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 animate-slide-up">
//           <div>
//             <h1 className="text-4xl font-bold text-white mb-2">Business Dashboard</h1>
//             <p className="text-xl text-white/80">Manage your referral campaigns and track performance</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600" />
//             {connected && (
//                 <Link href="/business/create-campaign">
//                   <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl px-6 py-3">
//                     <Plus className="w-5 h-5 mr-2" />
//                     New Campaign
//                   </Button>
//                 </Link>
//             )}
//           </div>
//         </div>

//         {!connected ? (
//             <Card className="glass-effect border-0 shadow-2xl animate-scale-in">
//               <CardContent className="text-center py-16">
//                 <Building2 className="w-24 h-24 text-blue-600 mx-auto mb-6" />
//                 <h2 className="text-3xl font-bold text-gray-800 mb-4">Connect Your Business Wallet</h2>
//                 <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
//                   Connect your Solana wallet to start creating referral campaigns and managing your business growth.
//                 </p>
//                 <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !py-4 !px-8 !text-lg" />
//               </CardContent>
//             </Card>
//         ) : (
//             <div className="space-y-8">
//               {/* Stats Overview */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {[
//                   { label: "Active Campaigns", value: totalStats.totalCampaigns, icon: Target, color: "text-blue-600" },
//                   { label: "Total Referrals", value: totalStats.totalReferrals, icon: Users, color: "text-green-600" },
//                   { label: "Conversions", value: totalStats.totalConversions, icon: TrendingUp, color: "text-purple-600" },
//                   { label: "Rewards Paid", value: totalStats.totalRewardsPaid, icon: DollarSign, color: "text-yellow-600" },
//                 ].map((stat, index) => (
//                     <Card
//                         key={index}
//                         className="glass-effect border-0 shadow-lg card-hover animate-scale-in"
//                         style={{ animationDelay: `${index * 0.1}s` }}
//                     >
//                       <CardContent className="p-6 text-center">
//                         <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
//                         <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
//                         <div className="text-sm text-gray-600">{stat.label}</div>
//                       </CardContent>
//                     </Card>
//                 ))}
//               </div>

//               {/* Quick Actions */}
//               <div className="grid md:grid-cols-3 gap-6">
//                 <Link href="/business/create-campaign">
//                   <Card className="glass-effect border-0 shadow-lg card-hover cursor-pointer">
//                     <CardContent className="p-6 text-center">
//                       <Plus className="w-12 h-12 text-green-600 mx-auto mb-4" />
//                       <h3 className="text-lg font-bold text-gray-800 mb-2">Create Campaign</h3>
//                       <p className="text-gray-600 text-sm">Launch a new referral campaign</p>
//                     </CardContent>
//                   </Card>
//                 </Link>

//                 <Card className="glass-effect border-0 shadow-lg card-hover cursor-pointer">
//                   <CardContent className="p-6 text-center">
//                     <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
//                     <h3 className="text-lg font-bold text-gray-800 mb-2">Analytics</h3>
//                     <p className="text-gray-600 text-sm">View detailed performance metrics</p>
//                   </CardContent>
//                 </Card>

//                 <Card className="glass-effect border-0 shadow-lg card-hover cursor-pointer">
//                   <CardContent className="p-6 text-center">
//                     <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
//                     <h3 className="text-lg font-bold text-gray-800 mb-2">Settings</h3>
//                     <p className="text-gray-600 text-sm">Manage account and preferences</p>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Active Campaigns */}
//               <Card className="glass-effect border-0 shadow-2xl">
//                 <CardHeader>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <CardTitle className="text-2xl font-bold text-gray-800">Active Campaigns</CardTitle>
//                       <CardDescription className="text-lg">Monitor and manage your referral campaigns</CardDescription>
//                     </div>
//                     <Badge className="bg-green-100 text-green-800">{campaigns.length} Active</Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {isLoading ? (
//                       <div className="text-center py-12">
//                         <div className="spinner mx-auto"></div>
//                         <p className="text-gray-500 mt-4">Loading campaigns...</p>
//                       </div>
//                   ) : error ? (
//                       <div className="text-center py-12 text-red-500">
//                         {error}
//                       </div>
//                   ) : campaigns.map((campaign, index) => (
//                       <Card
//                           key={campaign.id}
//                           className="border-2 border-gray-100 hover:border-blue-300 transition-colors animate-slide-up"
//                           style={{ animationDelay: `${index * 0.1}s` }}
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
//                             <div className="flex-1">
//                               <div className="flex items-center space-x-3 mb-2">
//                                 <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
//                                 <Badge className="bg-green-100 text-green-800">{campaign.status}</Badge>
//                               </div>
//                               <p className="text-gray-600 mb-3">{campaign.description}</p>
//                               <div className="flex items-center space-x-6 text-sm text-gray-500">
//                                 <span>Created: {campaign.created}</span>
//                                 <span>Reward: {campaign.reward}</span>
//                               </div>
//                             </div>

//                             <div className="flex items-center space-x-8">
//                               <div className="text-center">
//                                 <div className="text-2xl font-bold text-blue-600">{campaign.referrals}</div>
//                                 <div className="text-xs text-gray-500">Referrals</div>
//                               </div>
//                               <div className="text-center">
//                                 <div className="text-2xl font-bold text-green-600">{campaign.conversions}</div>
//                                 <div className="text-xs text-gray-500">Conversions</div>
//                               </div>
//                               <div className="text-center">
//                                 <div className="text-2xl font-bold text-purple-600">
//                                   {((campaign.conversions / campaign.referrals) * 100).toFixed(1)}%
//                                 </div>
//                                 <div className="text-xs text-gray-500">Rate</div>
//                               </div>
//                             </div>

//                             <div className="flex space-x-2">
//                               <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
//                                 <Eye className="w-4 h-4 mr-1" />
//                                 View
//                               </Button>
//                               <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
//                                 <Settings className="w-4 h-4 mr-1" />
//                                 Edit
//                               </Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                   ))}

//                   {campaigns.length === 0 && (
//                       <div className="text-center py-12">
//                         <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-xl font-bold text-gray-600 mb-2">No campaigns yet</h3>
//                         <p className="text-gray-500 mb-6">Create your first referral campaign to get started</p>
//                         <Link href="/business/create-campaign">
//                           <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl">
//                             <Plus className="w-5 h-5 mr-2" />
//                             Create Your First Campaign
//                           </Button>
//                         </Link>
//                       </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//         )}
//       </div>
//   )
// // }
// "use client"

// import { useWallet } from "@solana/wallet-adapter-react"
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Users, DollarSign, TrendingUp, Eye, Building2, Target, Settings, Clock } from "lucide-react"
// import Link from "next/link"

// export default function BusinessDashboard() {
//   const { publicKey, connected } = useWallet()
//   const [campaigns, setCampaigns] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [mounted, setMounted] = useState(false)

//   // Ensure SSR and first client render match
//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   useEffect(() => {
//     if (mounted && connected && publicKey) {
//       fetchCampaigns()
//     }
//   }, [mounted, connected, publicKey])

//   const fetchCampaigns = async () => {
//     setIsLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(
//         `https://solanareferral-1.onrender.com/api/business/campaigns?businessID=${publicKey?.toString()}`,
//       )
//       if (!response.ok) {
//         throw new Error("Failed to fetch campaigns")
//       }
//       const data = await response.json()
//       setCampaigns(data)
//     } catch (err) {
//       console.error("Error fetching campaigns:", err)
//       setError("Failed to load campaigns. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const totalStats = {
//     totalCampaigns: campaigns.length,
//     totalReferrals: campaigns.reduce((sum, c) => sum + (c.referrals || 0), 0),
//     totalConversions: campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0),
//     totalRewardsPaid:
//       campaigns.reduce((sum, c) => sum + (Number(c.fundBalance) || 0), 0).toString() + " SOL",
//   }

//   // While not mounted, render a stable placeholder so SSR === first client render
//   if (!mounted) {
//     return (
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="flex justify-between items-center">
//           <h1 className="text-4xl font-bold text-foreground">Business Dashboard</h1>
//         </div>
//         <Card className="card-premium border-primary/30">
//           <CardContent className="text-center py-16">
//             <p className="text-muted-foreground">Loading dashboard...</p>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 animate-fade-in">
//         <div>
//           <h1 className="text-4xl font-bold text-foreground">Business Dashboard</h1>
//           <p className="text-muted-foreground mt-1">Create and manage your referral campaigns</p>
//         </div>
//         <div className="flex items-center space-x-3 w-full md:w-auto">
//           <WalletMultiButton />
//           {connected && (
//             <Link href="/business/create-campaign">
//               <Button className="btn-primary">
//                 <Plus className="w-4 h-4 mr-2" />
//                 New Campaign
//               </Button>
//             </Link>
//           )}
//         </div>
//       </div>

//       {!connected ? (
//         <Card className="card-premium border-primary/30">
//           <CardContent className="text-center py-16">
//             <div className="p-3 bg-blue-900/50 rounded-lg w-fit mx-auto mb-4">
//               <Building2 className="w-12 h-12 text-primary" />
//             </div>
//             <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
//             <p className="text-muted-foreground mb-6">Connect your Solana wallet to manage campaigns</p>
//             <WalletMultiButton />
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-8">
//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: "Active Campaigns", value: totalStats.totalCampaigns, icon: Target, color: "text-blue-400" },
//               { label: "Total Referrals", value: totalStats.totalReferrals, icon: Users, color: "text-green-400" },
//               { label: "Conversions", value: totalStats.totalConversions, icon: TrendingUp, color: "text-purple-400" },
//               { label: "Rewards Paid", value: totalStats.totalRewardsPaid, icon: DollarSign, color: "text-amber-400" },
//             ].map((stat, index) => (
//               <Card key={index} className="stat-card">
//                 <CardContent className="p-4">
//                   <div className="flex items-center space-x-3">
//                     <div className={`p-2 bg-secondary rounded ${stat.color}`}>
//                       <stat.icon className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <div className="text-lg font-bold text-foreground">{stat.value}</div>
//                       <div className="text-xs text-muted-foreground">{stat.label}</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Campaigns List */}
//           <Card className="card-premium">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle className="text-2xl text-foreground">Your Campaigns</CardTitle>
//                   <CardDescription>Monitor and manage all active campaigns</CardDescription>
//                 </div>
//                 <Badge variant="secondary">{campaigns.length} Active</Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {isLoading ? (
//                 <div className="text-center py-12">
//                   <div className="inline-block animate-spin">
//                     <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full"></div>
//                   </div>
//                   <p className="text-muted-foreground mt-3">Loading campaigns...</p>
//                 </div>
//               ) : error ? (
//                 <div className="text-center py-12 text-destructive">{error}</div>
//               ) : campaigns.length === 0 ? (
//                 <div className="text-center py-12 space-y-4">
//                   <Target className="w-12 h-12 text-muted mx-auto" />
//                   <h3 className="text-lg font-semibold text-foreground">No campaigns yet</h3>
//                   <p className="text-muted-foreground">Create your first campaign to get started</p>
//                   <Link href="/business/create-campaign">
//                     <Button className="btn-primary">
//                       <Plus className="w-4 h-4 mr-2" />
//                       Create Campaign
//                     </Button>
//                   </Link>
//                 </div>
//               ) : (
//                 campaigns.map((campaign) => {
//                   const referrals = campaign.referrals || 0
//                   const conversions = campaign.conversions || 0
//                   const rate = referrals > 0 ? ((conversions / referrals) * 100).toFixed(0) : "0"

//                   return (
//                     <Card
//                       key={campaign.id}
//                       className="glass-card border-muted/50 hover:border-primary/50 transition-colors"
//                     >
//                       <CardContent className="p-4">
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                           <div className="md:col-span-2">
//                             <h3 className="font-semibold text-foreground">{campaign.title}</h3>
//                             <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
//                             <div className="flex items-center space-x-2 mt-2">
//                               <Badge variant="secondary" className="text-xs">
//                                 {campaign.status}
//                               </Badge>
//                               <span className="text-xs text-muted-foreground flex items-center space-x-1">
//                                 <Clock className="w-3 h-3" />
//                                 <span>Created: {campaign.created}</span>
//                               </span>
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-3 gap-2">
//                             <div className="text-center p-2 bg-secondary rounded">
//                               <div className="text-lg font-bold text-blue-400">{referrals}</div>
//                               <div className="text-xs text-muted-foreground">Referrals</div>
//                             </div>
//                             <div className="text-center p-2 bg-secondary rounded">
//                               <div className="text-lg font-bold text-green-400">{conversions}</div>
//                               <div className="text-xs text-muted-foreground">Conversions</div>
//                             </div>
//                             <div className="text-center p-2 bg-secondary rounded">
//                               <div className="text-lg font-bold text-purple-400">{rate}%</div>
//                               <div className="text-xs text-muted-foreground">Rate</div>
//                             </div>
//                           </div>

//                           <div className="flex items-center space-x-2">
//                             <Button variant="ghost" size="sm" className="h-8 px-2">
//                               <Eye className="w-4 h-4" />
//                             </Button>
//                             <Button variant="ghost" size="sm" className="h-8 px-2">
//                               <Settings className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )
//                 })
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useWallet } from "@solana/wallet-adapter-react"
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Users, DollarSign, TrendingUp, Eye, Building2, Target, Settings, Clock } from "lucide-react"
// import Link from "next/link"

// export default function BusinessDashboard() {
//   const { publicKey, connected } = useWallet()
//   const [campaigns, setCampaigns] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [mounted, setMounted] = useState(false)
//   const [totalStats, setTotalStats] = useState({
//     totalCampaigns: 0,
//     totalReferrals: 0,
//     totalConversions: 0,
//     totalRewardsPaid: "0 SOL",
//   })

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   useEffect(() => {
//     if (mounted && connected && publicKey) {
//       fetchCampaigns()
//     }
//   }, [mounted, connected, publicKey])

//   const fetchCampaigns = async () => {
//     setIsLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(
//         `https://solanareferral-1.onrender.com/api/business/campaigns?businessID=${publicKey?.toString()}`,
//       )
//       if (!response.ok) {
//         throw new Error("Failed to fetch campaigns")
//       }
//       const data = await response.json()
      
//       // Fetch referral counts for each campaign
//       const campaignsWithStats = await Promise.all(
//         data.map(async (campaign: any) => {
//           try {
//             const statsRes = await fetch(
//               `https://solanareferral-1.onrender.com/api/business/campaign-stats?campaignId=${campaign._id}`
//             )
//             if (statsRes.ok) {
//               const stats = await statsRes.json()
//               return {
//                 ...campaign,
//                 referrals: stats.totalReferrals || 0,
//                 conversions: stats.completedReferrals || 0,
//                 rewardsPaid: stats.totalRewardsPaid || 0,
//                 created: new Date(campaign.createdAt).toLocaleDateString()
//               }
//             }
//           } catch (err) {
//             console.error(`Failed to fetch stats for campaign ${campaign._id}:`, err)
//           }
//           return {
//             ...campaign,
//             referrals: 0,
//             conversions: 0,
//             rewardsPaid: 0,
//             created: new Date(campaign.createdAt).toLocaleDateString()
//           }
//         })
//       )

//       setCampaigns(campaignsWithStats)

//       // Calculate totals
//       const stats = {
//         totalCampaigns: campaignsWithStats.length,
//         totalReferrals: campaignsWithStats.reduce((sum, c) => sum + (c.referrals || 0), 0),
//         totalConversions: campaignsWithStats.reduce((sum, c) => sum + (c.conversions || 0), 0),
//         totalRewardsPaid: campaignsWithStats.reduce((sum, c) => sum + (c.rewardsPaid || 0), 0).toFixed(2) + " SOL",
//       }
//       setTotalStats(stats)
//     } catch (err) {
//       console.error("Error fetching campaigns:", err)
//       setError("Failed to load campaigns. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!mounted) {
//     return (
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="flex justify-between items-center">
//           <h1 className="text-4xl font-bold text-foreground">Business Dashboard</h1>
//         </div>
//         <Card className="card-premium border-primary/30">
//           <CardContent className="text-center py-16">
//             <p className="text-muted-foreground">Loading dashboard...</p>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 animate-fade-in">
//         <div>
//           <h1 className="text-4xl font-bold text-foreground">Business Dashboard</h1>
//           <p className="text-muted-foreground mt-1">Create and manage your referral campaigns</p>
//         </div>
//         <div className="flex items-center space-x-3 w-full md:w-auto">
//           <WalletMultiButton />
//           {connected && (
//             <Link href="/business/create-campaign">
//               <Button className="btn-primary">
//                 <Plus className="w-4 h-4 mr-2" />
//                 New Campaign
//               </Button>
//             </Link>
//           )}
//         </div>
//       </div>

//       {!connected ? (
//         <Card className="card-premium border-primary/30">
//           <CardContent className="text-center py-16">
//             <div className="p-3 bg-blue-900/50 rounded-lg w-fit mx-auto mb-4">
//               <Building2 className="w-12 h-12 text-primary" />
//             </div>
//             <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
//             <p className="text-muted-foreground mb-6">Connect your Solana wallet to manage campaigns</p>
//             <WalletMultiButton />
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-8">
//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: "Active Campaigns", value: totalStats.totalCampaigns, icon: Target, color: "text-blue-400" },
//               { label: "Total Referrals", value: totalStats.totalReferrals, icon: Users, color: "text-green-400" },
//               { label: "Conversions", value: totalStats.totalConversions, icon: TrendingUp, color: "text-purple-400" },
//               { label: "Rewards Paid", value: totalStats.totalRewardsPaid, icon: DollarSign, color: "text-amber-400" },
//             ].map((stat, index) => (
//               <Card key={index} className="stat-card">
//                 <CardContent className="p-4">
//                   <div className="flex items-center space-x-3">
//                     <div className={`p-2 bg-secondary rounded ${stat.color}`}>
//                       <stat.icon className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <div className="text-lg font-bold text-foreground">{stat.value}</div>
//                       <div className="text-xs text-muted-foreground">{stat.label}</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Campaigns List */}
//           <Card className="card-premium">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle className="text-2xl text-foreground">Your Campaigns</CardTitle>
//                   <CardDescription>Monitor and manage all active campaigns</CardDescription>
//                 </div>
//                 <Badge variant="secondary">{campaigns.length} Active</Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {isLoading ? (
//                 <div className="text-center py-12">
//                   <div className="inline-block animate-spin">
//                     <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full"></div>
//                   </div>
//                   <p className="text-muted-foreground mt-3">Loading campaigns...</p>
//                 </div>
//               ) : error ? (
//                 <div className="text-center py-12 text-destructive">{error}</div>
//               ) : campaigns.length === 0 ? (
//                 <div className="text-center py-12 space-y-4">
//                   <Target className="w-12 h-12 text-muted mx-auto" />
//                   <h3 className="text-lg font-semibold text-foreground">No campaigns yet</h3>
//                   <p className="text-muted-foreground">Create your first campaign to get started</p>
//                   <Link href="/business/create-campaign">
//                     <Button className="btn-primary">
//                       <Plus className="w-4 h-4 mr-2" />
//                       Create Campaign
//                     </Button>
//                   </Link>
//                 </div>
//               ) : (
//                 campaigns.map((campaign) => {
//                   const referrals = campaign.referrals || 0
//                   const conversions = campaign.conversions || 0
//                   const rate = referrals > 0 ? ((conversions / referrals) * 100).toFixed(0) : "0"

//                   return (
//                     <Card
//                       key={campaign._id}
//                       className="glass-card border-muted/50 hover:border-primary/50 transition-colors"
//                     >
//                       <CardContent className="p-4">
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                           <div className="md:col-span-2">
//                             <h3 className="font-semibold text-foreground">{campaign.title}</h3>
//                             <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
//                             <div className="flex items-center space-x-2 mt-2">
//                               <Badge variant="secondary" className="text-xs">
//                                 Active
//                               </Badge>
//                               <span className="text-xs text-muted-foreground flex items-center space-x-1">
//                                 <Clock className="w-3 h-3" />
//                                 <span>Created: {campaign.created}</span>
//                               </span>
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-3 gap-2">
//                             <div className="text-center p-2 bg-secondary rounded">
//                               <div className="text-lg font-bold text-blue-400">{referrals}</div>
//                               <div className="text-xs text-muted-foreground">Referrals</div>
//                             </div>
//                             <div className="text-center p-2 bg-secondary rounded">
//                               <div className="text-lg font-bold text-green-400">{conversions}</div>
//                               <div className="text-xs text-muted-foreground">Conversions</div>
//                             </div>
//                             <div className="text-center p-2 bg-secondary rounded">
//                               <div className="text-lg font-bold text-purple-400">{rate}%</div>
//                               <div className="text-xs text-muted-foreground">Rate</div>
//                             </div>
//                           </div>

//                           <div className="flex items-center space-x-2">
//                             <Button variant="ghost" size="sm" className="h-8 px-2">
//                               <Eye className="w-4 h-4" />
//                             </Button>
//                             <Button variant="ghost" size="sm" className="h-8 px-2">
//                               <Settings className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )
//                 })
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, DollarSign, TrendingUp, Eye, Building2, Target, Settings, Clock } from "lucide-react"
import Link from "next/link"

export default function BusinessDashboard() {
  const { publicKey, connected } = useWallet()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [totalStats, setTotalStats] = useState({
    totalCampaigns: 0,
    totalReferrals: 0,
    totalConversions: 0,
    totalRewardsPaid: "0 SOL",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && connected && publicKey) {
      fetchCampaigns()
    }
  }, [mounted, connected, publicKey])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://solanareferral-1.onrender.com/api/business/campaigns?businessID=${publicKey?.toString()}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns")
      }
      const data = await response.json()
      
      // Ensure data is an array
      const campaignsArray = Array.isArray(data) ? data : []
      
      // Fetch referral counts for each campaign
      const campaignsWithStats = await Promise.all(
        campaignsArray.map(async (campaign: any) => {
          try {
            const statsRes = await fetch(
              `https://solanareferral-1.onrender.com/api/business/campaign-stats?campaignId=${campaign._id}`
            )
            if (statsRes.ok) {
              const stats = await statsRes.json()
              return {
                ...campaign,
                referrals: stats.totalReferrals || 0,
                conversions: stats.completedReferrals || 0,
                rewardsPaid: parseFloat(stats.totalRewardsPaid) || 0,
                created: new Date(campaign.createdAt).toLocaleDateString()
              }
            }
          } catch (err) {
            console.error(`Failed to fetch stats for campaign ${campaign._id}:`, err)
          }
          return {
            ...campaign,
            referrals: 0,
            conversions: 0,
            rewardsPaid: 0,
            created: new Date(campaign.createdAt).toLocaleDateString()
          }
        })
      )

      setCampaigns(campaignsWithStats)

      // Calculate totals safely
      const stats = {
        totalCampaigns: campaignsWithStats.length,
        totalReferrals: campaignsWithStats.reduce((sum, c) => sum + (Number(c.referrals) || 0), 0),
        totalConversions: campaignsWithStats.reduce((sum, c) => sum + (Number(c.conversions) || 0), 0),
        totalRewardsPaid: campaignsWithStats.reduce((sum, c) => sum + (Number(c.rewardsPaid) || 0), 0).toFixed(2) + " SOL",
      }
      setTotalStats(stats)
    } catch (err) {
      console.error("Error fetching campaigns:", err)
      setError("Failed to load campaigns. Please try again.")
      setCampaigns([])
      setTotalStats({
        totalCampaigns: 0,
        totalReferrals: 0,
        totalConversions: 0,
        totalRewardsPaid: "0 SOL",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">Business Dashboard</h1>
        </div>
        <Card className="card-premium border-primary/30">
          <CardContent className="text-center py-16">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Business Dashboard</h1>
          <p className="text-muted-foreground mt-1">Create and manage your referral campaigns</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <WalletMultiButton />
          {connected && (
            <Link href="/business/create-campaign">
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </Link>
          )}
        </div>
      </div>

      {!connected ? (
        <Card className="card-premium border-primary/30">
          <CardContent className="text-center py-16">
            <div className="p-3 bg-blue-900/50 rounded-lg w-fit mx-auto mb-4">
              <Building2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">Connect your Solana wallet to manage campaigns</p>
            <WalletMultiButton />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Campaigns", value: totalStats.totalCampaigns, icon: Target, color: "text-blue-400" },
              { label: "Total Referrals", value: totalStats.totalReferrals, icon: Users, color: "text-green-400" },
              { label: "Conversions", value: totalStats.totalConversions, icon: TrendingUp, color: "text-purple-400" },
              { label: "Rewards Paid", value: totalStats.totalRewardsPaid, icon: DollarSign, color: "text-amber-400" },
            ].map((stat, index) => (
              <Card key={index} className="stat-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-secondary rounded ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Campaigns List */}
          <Card className="card-premium">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl text-foreground">Your Campaigns</CardTitle>
                  <CardDescription>Monitor and manage all active campaigns</CardDescription>
                </div>
                <Badge variant="secondary">{campaigns.length} Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin">
                    <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full"></div>
                  </div>
                  <p className="text-muted-foreground mt-3">Loading campaigns...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-destructive">{error}</div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Target className="w-12 h-12 text-muted mx-auto" />
                  <h3 className="text-lg font-semibold text-foreground">No campaigns yet</h3>
                  <p className="text-muted-foreground">Create your first campaign to get started</p>
                  <Link href="/business/create-campaign">
                    <Button className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              ) : (
                campaigns.map((campaign) => {
                  const referrals = campaign.referrals || 0
                  const conversions = campaign.conversions || 0
                  const rate = referrals > 0 ? ((conversions / referrals) * 100).toFixed(0) : "0"

                  return (
                    <Card
                      key={campaign._id}
                      className="glass-card border-muted/50 hover:border-primary/50 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <h3 className="font-semibold text-foreground">{campaign.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                Active
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Created: {campaign.created}</span>
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-secondary rounded">
                              <div className="text-lg font-bold text-blue-400">{referrals}</div>
                              <div className="text-xs text-muted-foreground">Referrals</div>
                            </div>
                            <div className="text-center p-2 bg-secondary rounded">
                              <div className="text-lg font-bold text-green-400">{conversions}</div>
                              <div className="text-xs text-muted-foreground">Conversions</div>
                            </div>
                            <div className="text-center p-2 bg-secondary rounded">
                              <div className="text-lg font-bold text-purple-400">{rate}%</div>
                              <div className="text-xs text-muted-foreground">Rate</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}