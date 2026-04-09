"use client"

import { useState } from "react"
import { Bell, X, Info, AlertTriangle, CreditCard, TrendingUp, Gift, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useTheme } from "next-themes"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const notifications = [
  {
    id: 1,
    title: "New Feature",
    message: "Check out our new budget tracking tool!",
    date: "2023-07-15",
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: 2,
    title: "Account Alert",
    message: "Unusual activity detected on your account.",
    date: "2023-07-14",
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    id: 3,
    title: "Payment Due",
    message: "Your credit card payment is due in 3 days.",
    date: "2023-07-13",
    icon: CreditCard,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    id: 4,
    title: "Investment Update",
    message: "Your investment portfolio has grown by 5% this month.",
    date: "2023-07-12",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: 5,
    title: "New Offer",
    message: "You're eligible for a new savings account with higher interest!",
    date: "2023-07-11",
    icon: Gift,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: 6,
    title: "Gallery Update",
    message: "New artworks have been added to your favorite gallery.",
    date: "2023-07-10",
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: 7,
    title: "Auction Reminder",
    message: "The auction for 'The Starry Night' starts in 2 hours.",
    date: "2023-07-09",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: 8,
    title: "Collection Alert",
    message: "Your art collection value has increased by 12% this quarter.",
    date: "2023-07-08",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
]

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { theme } = useTheme()

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedFilter === "all") return matchesSearch
    if (selectedFilter === "alerts") return notification.icon === AlertTriangle && matchesSearch
    if (selectedFilter === "updates") return notification.icon === TrendingUp && matchesSearch
    if (selectedFilter === "payments") return notification.icon === CreditCard && matchesSearch
    if (selectedFilter === "features") return notification.icon === Info && matchesSearch
    if (selectedFilter === "offers") return notification.icon === Gift && matchesSearch
    
    return matchesSearch
  })

  const getFilterCount = (filter: string) => {
    if (filter === "all") return notifications.length
    if (filter === "alerts") return notifications.filter(n => n.icon === AlertTriangle).length
    if (filter === "updates") return notifications.filter(n => n.icon === TrendingUp).length
    if (filter === "payments") return notifications.filter(n => n.icon === CreditCard).length
    if (filter === "features") return notifications.filter(n => n.icon === Info).length
    if (filter === "offers") return notifications.filter(n => n.icon === Gift).length
    return 0
  }

  const filters = [
    { key: "all", label: "All", count: getFilterCount("all") },
    { key: "alerts", label: "Alerts", count: getFilterCount("alerts") },
    { key: "updates", label: "Updates", count: getFilterCount("updates") },
    { key: "payments", label: "Payments", count: getFilterCount("payments") },
    { key: "features", label: "Features", count: getFilterCount("features") },
    { key: "offers", label: "Offers", count: getFilterCount("offers") },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Page Header with Search */}
      <div className="border-0 bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col space-y-4">
            {/* Title and Back Button */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                {/* <p className="text-sm text-muted-foreground">Stay updated with your latest activities</p> */}
              </div>
            </div>
            
            {/* Search Box */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-0 bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-0">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedFilter(filter.key)}
                className="relative whitespace-nowrap"
              >
                {filter.label}
                <span className="ml-2 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                  {filter.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No notifications found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${notification.borderColor} rounded-2xl hover:shadow-md transition-shadow cursor-pointer`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className={`${notification.bgColor} ${notification.color} p-3 rounded-full self-start`}>
                      <notification.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <h3 className="text-lg font-semibold text-foreground">{notification.title}</h3>
                        <span className="text-sm text-muted-foreground">{notification.date}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{notification.message}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 justify-start sm:justify-center">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground justify-start sm:justify-center">
                          Mark as Read
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
