// app/gallery-analytics/page.js
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsStatsCard } from "@/components/analytics-stats-card";
import { EngagementOverview } from "@/components/engagement-overview";
import { QRScanBreakdown } from "@/components/qr-scan-breakdown";
import { QRScanMetricCard } from "@/components/qr-scan-metric-card";
import { QRScanTrendsChart } from "@/components/qr-scan-trends-chart";
import { QRScanInsights } from "@/components/qr-scan-insights";
import { ArtworkViewsMetricCard } from "@/components/artwork-views-metric-card";
import { ArtworkViewsChart } from "@/components/artwork-views-chart";
import { MostViewedArtworksChart } from "@/components/most-viewed-artworks-chart";
import { TopPerformingArtworks } from "@/components/top-performing-artworks";
import { DigitalFloorMetricCard } from "@/components/digital-floor-metric-card";
import { DigitalFloorTrafficChart } from "@/components/digital-floor-traffic-chart";
import { AverageTimeSpentChart } from "@/components/average-time-spent-chart";
import { SalesMetricCard } from "@/components/sales-metric-card";
import { RevenueOverTimeChart } from "@/components/revenue-over-time-chart";
import { TopSellingArtworksChart } from "@/components/top-selling-artworks-chart";
import { SalesDistributionChart } from "@/components/sales-distribution-chart";
import { TopPerformingArtworksTable } from "@/components/top-performing-artworks-table";
import { TopPerformingArtistsTable } from "@/components/top-performing-artists-table";
import { MostViewedArtworksBarChart } from "@/components/most-viewed-artworks-bar-chart";
import { TopArtistsRevenueChart } from "@/components/top-artists-revenue-chart";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import AnalyticsService from "@/lib/analytics-service";
import { 
  analyticsStats, 
  qrScanBreakdown, 
  engagementData,
  tabCategories 
} from "@/data/analyticsData";
import {
  qrScanMetrics,
  qrScanMetricsMobile,
  qrScanTrendsData,
  qrScanInsights,
  qrScanInsightsMobile
} from "@/data/qrScansData";
import {
  artworkViewsMetrics,
  artworkViewsMetricsMobile,
  artworkViewsOverTimeData,
  mostViewedArtworks,
  mostViewedArtworksMobile,
  topPerformingArtworks
} from "@/data/artworkViewsData";
import {
  digitalFloorMetrics,
  digitalFloorMetricsMobile,
  digitalFloorTrafficData,
  digitalFloorTrafficDataMobile,
  averageTimeSpentData,
  averageTimeSpentDataMobile
} from "@/data/digitalFloorData";
import {
  salesMetrics,
  salesMetricsMobile,
  revenueOverTimeData,
  revenueOverTimeDataMobile,
  topSellingArtworks,
  topSellingArtworksMobile,
  salesDistribution,
  salesDistributionMobile
} from "@/data/salesData";
import {
  topPerformingArtworksData,
  topPerformingArtistsData,
  mostViewedArtworksData,
  mostViewedArtworksDataMobile,
  topArtistsByRevenueData,
  topArtistsByRevenueDataMobile
} from "@/data/topPerformersData";

export default function GalleryAnalytics() {
  const { user, userData } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 6, 1), // July 1, 2025
    to: new Date(2025, 6, 31), // July 31, 2025
  });
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedQuickRange, setSelectedQuickRange] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false since we're using demo data
  const [error, setError] = useState(null);
  const [useRealData, setUseRealData] = useState(false); // Toggle between demo and real data
  const [selectedTab1, setSelectedTab1] = useState('all');
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load analytics data only when useRealData is true
  useEffect(() => {
    if (!useRealData) {
      setAnalyticsData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const loadAnalyticsData = async () => {
      // Get gallery ID from user data
      let galleryId = null;
      
      // Check if user is a gallery owner
      const isGalleryOwner = userData?.userType && Array.isArray(userData.userType) && userData.userType.includes('gallery');
      
      if (isGalleryOwner && userData?.gallery) {
        // If user has multiple galleries, use the first one
        const galleries = Object.values(userData.gallery);
        if (galleries.length > 0) {
          galleryId = galleries[0].galleryId;
        }
      }
      
      // Fallback: if no gallery ID found, try using user UID
      if (!galleryId && user?.uid) {
        galleryId = user.uid;
      }
      
      if (!galleryId) {
        setError('No gallery ID found. Please ensure you are logged in as a gallery owner.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const analyticsService = AnalyticsService.getInstance();
        
        const data = await analyticsService.getGalleryAnalytics(
          galleryId,
          {
            start: dateRange.from,
            end: dateRange.to
          }
        );
        
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [useRealData, userData?.gallery, dateRange.from, dateRange.to]);

  const handleQuickDateSelect = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ from: start, to: end });
    setSelectedQuickRange(days);
  };

  // Process analytics data (demo or real)
  const processAnalyticsData = () => {
    if (useRealData) {
      if (!analyticsData) return {};
      const { overview, qrScans, artworkViews, digitalFloor, sales, topPerformers } = analyticsData;

      // Process QR Scan Metrics
      const qrScanMetrics = [
        {
          title: "Total QR Scans",
          value: (qrScans?.totalScans || 0).toString(),
          change: "+12%",
          trend: "up"
        },
        {
          title: "Unique Scanners",
          value: (qrScans?.totalScans || 0).toString(), // This would need to be calculated from unique sessionIds
          change: "+8%",
          trend: "up"
        },
        {
          title: "Scan Rate",
          value: "85%",
          change: "+5%",
          trend: "up"
        },
        {
          title: "Peak Scan Time",
          value: "2:30 PM",
          change: "-2%",
          trend: "down"
        }
      ];

      // Process Artwork Views Metrics
      const artworkViewsMetrics = [
        {
          title: "Total Views",
          value: (artworkViews?.totalViews || 0).toString(),
          change: "+15%",
          trend: "up"
        },
        {
          title: "Average Time Spent",
          value: `${overview?.averageTimeSpent || 0} min`,
          change: "+3%",
          trend: "up"
        },
        {
          title: "Bounce Rate",
          value: "23%",
          change: "-5%",
          trend: "down"
        }
      ];

      // Process Digital Floor Metrics
      const digitalFloorMetrics = [
        {
          title: "Digital Floor Views",
          value: (digitalFloor?.totalViews || 0).toString(),
          change: "+18%",
          trend: "up"
        },
        {
          title: "Unique Visitors",
          value: (digitalFloor?.uniqueVisitors || 0).toString(),
          change: "+12%",
          trend: "up"
        },
        {
          title: "Engagement Rate",
          value: "67%",
          change: "+7%",
          trend: "up"
        },
        {
          title: "Session Duration",
          value: "4.2 min",
          change: "+2%",
          trend: "up"
        }
      ];

      // Process Sales Metrics
      const salesMetrics = [
        {
          title: "Total Revenue",
          value: `$${(overview?.totalRevenue || 0).toLocaleString()}`,
          change: "+22%",
          trend: "up"
        },
        {
          title: "Total Inquiries",
          value: (overview?.totalInquiries || 0).toString(),
          change: "+15%",
          trend: "up"
        },
        {
          title: "Conversion Rate",
          value: `${(overview?.conversionRate || 0).toFixed(1)}%`,
          change: "+3%",
          trend: "up"
        },
        {
          title: "Average Order Value",
          value: `$${((overview?.totalRevenue || 0) / (overview?.totalInquiries || 1)).toFixed(0)}`,
          change: "+8%",
          trend: "up"
        }
      ];

      return {
        qrScanMetrics: isMobile ? qrScanMetrics.slice(0, 2) : qrScanMetrics,
        artworkViewsMetrics: isMobile ? artworkViewsMetrics.slice(0, 2) : artworkViewsMetrics,
        digitalFloorMetrics: isMobile ? digitalFloorMetrics.slice(0, 2) : digitalFloorMetrics,
        salesMetrics: isMobile ? salesMetrics.slice(0, 2) : salesMetrics,
        qrScans,
        artworkViews,
        digitalFloor,
        sales,
        topPerformers,
        overview
      };
    } else {
      // Return demo data from imported files with proper structure for charts
      return {
        qrScanMetrics: isMobile ? qrScanMetrics.slice(0, 2) : qrScanMetrics,
        artworkViewsMetrics: isMobile ? artworkViewsMetrics.slice(0, 2) : artworkViewsMetrics,
        digitalFloorMetrics: isMobile ? digitalFloorMetrics.slice(0, 2) : digitalFloorMetrics,
        salesMetrics: isMobile ? salesMetrics.slice(0, 2) : salesMetrics,
        qrScans: {
          totalScans: 977,
          dailyScans: qrScanTrendsData.labels.map((date, index) => ({
            date,
            count: qrScanTrendsData.data[index]
          })),
          topScannedArtworks: [
            { artworkId: "1", artworkTitle: "Guernica", artistName: "Pablo Picasso", scans: 156 },
            { artworkId: "2", artworkTitle: "The Starry Night", artistName: "Vincent van Gogh", scans: 142 },
            { artworkId: "3", artworkTitle: "Campbell's Soup Cans", artistName: "Andy Warhol", scans: 128 }
          ]
        },
        artworkViews: {
          totalViews: 11244,
          dailyViews: artworkViewsOverTimeData.labels.map((date, index) => ({
            date,
            count: artworkViewsOverTimeData.data[index]
          })),
          mostViewedArtworks: [
            { artworkId: "1", artworkTitle: "Guernica", artistName: "Pablo Picasso", views: 2600 },
            { artworkId: "2", artworkTitle: "The Starry Night", artistName: "Vincent van Gogh", views: 2350 },
            { artworkId: "3", artworkTitle: "Campbell's Soup Cans", artistName: "Andy Warhol", views: 2100 }
          ]
        },
        digitalFloor: {
          totalViews: 4572,
          dailyViews: digitalFloorTrafficData.labels.map((date, index) => ({
            date,
            count: digitalFloorTrafficData.views[index]
          })),
          uniqueVisitors: 2293,
          // Add the format expected by DigitalFloorTrafficChart
          labels: digitalFloorTrafficData.labels,
          views: digitalFloorTrafficData.views,
          uniqueVisitorsArray: digitalFloorTrafficData.uniqueVisitors
        },
        sales: {
          totalRevenue: 1146253,
          totalInquiries: 33,
          dailyRevenue: revenueOverTimeData.labels.map((date, index) => ({
            date,
            revenue: revenueOverTimeData.data[index]
          })),
          topSellingArtworks: [
            { artworkId: "1", artworkTitle: "Guernica", artistName: "Pablo Picasso", revenue: 450000, inquiries: 8 },
            { artworkId: "2", artworkTitle: "The Starry Night", artistName: "Vincent van Gogh", revenue: 380000, inquiries: 6 },
            { artworkId: "3", artworkTitle: "Campbell's Soup Cans", artistName: "Andy Warhol", revenue: 320000, inquiries: 5 }
          ]
        },
        topPerformers: {
          topPerformingArtworks: [
            { artworkId: "1", artworkTitle: "Guernica", artistName: "Pablo Picasso", views: 2600 },
            { artworkId: "2", artworkTitle: "The Starry Night", artistName: "Vincent van Gogh", views: 2350 },
            { artworkId: "3", artworkTitle: "Campbell's Soup Cans", artistName: "Andy Warhol", views: 2100 }
          ],
          topPerformingArtists: [
            { artistId: "1", artistName: "Pablo Picasso", views: 2600, artworkCount: 3 },
            { artistId: "2", artistName: "Vincent van Gogh", views: 2350, artworkCount: 2 },
            { artistId: "3", artistName: "Andy Warhol", views: 2100, artworkCount: 4 }
          ]
        },
        overview: {
          totalQRScans: 977,
          totalArtworkViews: 11244,
          totalDigitalFloorViews: 4572,
          totalRevenue: 1146253,
          totalInquiries: 33,
          uniqueVisitors: 3421,
          averageTimeSpent: 4.2,
          conversionRate: 0.3
        }
      };
    }
  };

  const processedData = processAnalyticsData();

  return (
    <div className="min-h-screen bg-background">
      <div className=" -mt-5 space-y-6">
        {/* Header */}

        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-blue-500">Gallery Analytics</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            View performance metrics and insights for your gallery.
          </p>
        </div>


          {/* Tabs */}
      <Tabs value={selectedTab1} onValueChange={setSelectedTab1} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Analytics</TabsTrigger>
          <TabsTrigger value="physical">Physical Analytics</TabsTrigger>
          <TabsTrigger value="digital">Digital Analytics</TabsTrigger>

        </TabsList>
      </Tabs>

      

        {/* Date Range Selector */}
        <Card className="p-4 bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-800">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-blue-700">Date Range</h3>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal bg-white dark:bg-blue-950/20 dark:border-blue-800",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <span className="flex items-center justify-center text-sm text-muted-foreground">
                  to
                </span>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal bg-white dark:bg-blue-950/20 dark:border-blue-800",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={selectedQuickRange === 7 ? "default" : "outline"}
                  onClick={() => handleQuickDateSelect(7)}
                  className="text-xs"
                >
                  Last 7 Days
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedQuickRange === 30 ? "default" : "outline"}
                  onClick={() => handleQuickDateSelect(30)}
                  className="text-xs"
                >
                  Last 30 Days
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedQuickRange === 90 ? "default" : "outline"}
                  onClick={() => handleQuickDateSelect(90)}
                  className="text-xs"
                >
                  Last 90 Days
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
            {tabCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs lg:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {loading ? (
              <div className="space-y-6">
                {/* Stats Grid Skeleton */}
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Charts Section Skeleton */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <div className="grid gap-4 grid-cols-2">
                        {[...Array(4)].map((_, index) => (
                          <div key={index} className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-12" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-40" />
                      <div className="space-y-3">
                        {[...Array(4)].map((_, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-destructive mb-2">Error loading analytics</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
                  {processedData.overview && [
                    {
                      id: 1,
                      title: "QR Scans",
                      value: processedData.overview.totalQRScans.toString(),
                      subtitle: "Monthly scans",
                      icon: "scan",
                      color: "blue",
                      progress: 82
                    },
                    {
                      id: 2,
                      title: "Artwork Views",
                      value: processedData.overview.totalArtworkViews.toString(),
                      subtitle: "Total views",
                      icon: "eye",
                      color: "cyan",
                      progress: 65
                    },
                    {
                      id: 3,
                      title: "Digital Floor Views",
                      value: processedData.overview.totalDigitalFloorViews.toString(),
                      subtitle: "Total views",
                      icon: "globe",
                      color: "purple",
                      progress: 45
                    },
                    {
                      id: 4,
                      title: "Sales Revenue",
                      value: `$${processedData.overview.totalRevenue.toLocaleString()}`,
                      subtitle: `${processedData.overview.totalInquiries} inquiries`,
                      icon: "dollar",
                      color: "green",
                      progress: 90
                    }
                  ].map((stat) => (
                    <AnalyticsStatsCard key={stat.id} stat={stat} />
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <EngagementOverview data={engagementData} />
                  <QRScanBreakdown data={qrScanBreakdown} />
                </div>
              </>
            )}
          </TabsContent>

          {/* QR Scans Tab Content */}
          <TabsContent value="qr-scans" className="space-y-6 mt-6">
            {loading ? (
              <div className="space-y-6">
                {/* QR Scan Metrics Grid Skeleton */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* QR Scan Charts Skeleton */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-36" />
                      <div className="space-y-3">
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-destructive mb-2">Error loading QR scan data</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* QR Scan Metrics Grid */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {processedData.qrScanMetrics?.map((metric, index) => (
                    <QRScanMetricCard key={index} metric={metric} />
                  ))}
                </div>

                {/* QR Scan Trends Chart */}
                <QRScanTrendsChart data={{
                  labels: processedData.qrScans?.dailyScans?.map(item => item.date) || [],
                  data: processedData.qrScans?.dailyScans?.map(item => item.count) || []
                }} />

                {/* QR Scan Insights */}
                <QRScanInsights insights={{
                  averageDailyScans: {
                    value: processedData.qrScans?.totalScans ? Math.round(processedData.qrScans.totalScans / 7) : 0,
                    description: "scans per day"
                  },
                  peakDay: {
                    value: processedData.qrScans?.dailyScans?.length > 0 ? Math.max(...processedData.qrScans.dailyScans.map(item => item.count)) : 0,
                    description: "Most active day",
                    date: processedData.qrScans?.dailyScans?.length > 0 ? processedData.qrScans.dailyScans.find(item => item.count === Math.max(...processedData.qrScans.dailyScans.map(item => item.count)))?.date : "N/A"
                  },
                  growthRate: {
                    value: "+12%",
                    description: "vs last week"
                  }
                }} />
              </>
            )}
          </TabsContent>

          {/* Other tabs */}
          {/* Artwork Views Tab Content */}
          <TabsContent value="artwork-views" className="space-y-6 mt-6">
            {loading ? (
              <div className="space-y-6">
                {/* Artwork Views Metrics Grid Skeleton */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Artwork Views Charts Skeleton */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-44" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  </Card>
                </div>
                
                {/* Top Performing Artworks Skeleton */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-52" />
                    <div className="space-y-3">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-destructive mb-2">Error loading artwork views data</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Artwork Views Metrics */}
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                  {processedData.artworkViewsMetrics?.map((metric, index) => (
                    <ArtworkViewsMetricCard key={index} metric={metric} />
                  ))}
                </div>

                {/* Artwork Views Over Time Chart */}
                <ArtworkViewsChart data={{
                  labels: processedData.artworkViews?.dailyViews?.map(item => item.date) || [],
                  data: processedData.artworkViews?.dailyViews?.map(item => item.count) || []
                }} />

                {/* Most Viewed Artworks Chart */}
                <MostViewedArtworksChart artworks={processedData.artworkViews?.mostViewedArtworks || []} />

                {/* Top Performing Artworks Table */}
                <TopPerformingArtworks artworks={
                  processedData.topPerformers?.topPerformingArtworks?.map(artwork => ({
                    artwork: artwork.artworkTitle || 'Unknown Artwork',
                    artist: artwork.artistName || 'Unknown Artist',
                    views: artwork.views || 0,
                    saves: Math.floor((artwork.views || 0) * 0.3), // Generate demo saves data
                    shares: Math.floor((artwork.views || 0) * 0.15), // Generate demo shares data
                    inquiries: Math.floor((artwork.views || 0) * 0.08) // Generate demo inquiries data
                  })) || [
                    { artwork: "Guernica", artist: "Pablo Picasso", views: 2600, saves: 780, shares: 390, inquiries: 208 },
                    { artwork: "The Starry Night", artist: "Vincent van Gogh", views: 2350, saves: 705, shares: 352, inquiries: 188 },
                    { artwork: "Campbell's Soup Cans", artist: "Andy Warhol", views: 2100, saves: 630, shares: 315, inquiries: 168 },
                    { artwork: "The Persistence of Memory", artist: "Salvador Dalí", views: 1850, saves: 555, shares: 277, inquiries: 148 },
                    { artwork: "Radiant Baby", artist: "Keith Haring", views: 1650, saves: 495, shares: 247, inquiries: 132 }
                  ]
                } />
              </>
            )}
          </TabsContent>

             {/* Digital Floor Tab Content */}
          <TabsContent value="digital-floor" className="space-y-6 mt-6">
            {loading ? (
              <div className="space-y-6">
                {/* Digital Floor Metrics Grid Skeleton */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Digital Floor Charts Skeleton */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-52" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  </Card>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-destructive mb-2">Error loading digital floor data</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Digital Floor Metrics */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {processedData.digitalFloorMetrics?.map((metric, index) => (
                    <DigitalFloorMetricCard key={index} metric={metric} />
                  ))}
                </div>

                {/* Digital Floor Traffic Chart */}
                <DigitalFloorTrafficChart data={{
                  labels: processedData.digitalFloor?.labels || processedData.digitalFloor?.dailyViews?.map(item => item.date) || [],
                  views: processedData.digitalFloor?.views || processedData.digitalFloor?.dailyViews?.map(item => item.count) || [],
                  uniqueVisitors: processedData.digitalFloor?.uniqueVisitorsArray || processedData.digitalFloor?.dailyViews?.map(item => item.count * 0.6) || []
                }} />

                {/* Average Time Spent Chart */}
                <AverageTimeSpentChart data={{
                  labels: processedData.digitalFloor?.dailyViews?.map(item => item.date) || [],
                  time: processedData.digitalFloor?.dailyViews?.map((_, index) => {
                    // Generate realistic time spent data with some variation
                    const baseTime = processedData.overview?.averageTimeSpent || 4.2;
                    const variation = (Math.sin(index * 0.5) * 0.8) + (Math.random() * 0.4 - 0.2);
                    return Math.max(1, Math.min(6, baseTime + variation));
                  }) || []
                }} />
              </>
            )}
          </TabsContent>

           {/* Sales Tab Content */}
           <TabsContent value="sales" className="space-y-6 mt-6">
            {loading ? (
              <div className="space-y-6">
                {/* Sales Metrics Grid Skeleton */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Sales Charts Skeleton */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-44" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  </Card>
                  
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <Card className="p-6">
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-64 w-full" />
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-52" />
                        <Skeleton className="h-64 w-full" />
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-destructive mb-2">Error loading sales data</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Sales Metrics */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {processedData.salesMetrics?.map((metric, index) => (
                    <SalesMetricCard key={index} metric={metric} />
                  ))}
                </div>

                {/* Revenue Over Time Chart */}
                <RevenueOverTimeChart data={{
                  labels: processedData.sales?.dailyRevenue?.map(item => item.date) || [],
                  data: processedData.sales?.dailyRevenue?.map(item => item.revenue) || []
                }} />

                {/* Charts Grid */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <TopSellingArtworksChart artworks={processedData.sales?.topSellingArtworks || []} />
                  <SalesDistributionChart data={{
                    categories: processedData.sales?.topSellingArtworks?.slice(0, 4).map(artwork => ({
                      name: artwork.artworkTitle || 'Unknown Artwork',
                      value: artwork.revenue || 0,
                      percentage: processedData.sales?.totalRevenue ? Math.round((artwork.revenue || 0) / processedData.sales.totalRevenue * 100) : 0
                    })) || [],
                    total: processedData.sales?.totalRevenue || 0
                  }} />
                </div>
              </>
            )}
          </TabsContent>


          {/* Top Performers Tab Content */}
          <TabsContent value="top-performers" className="space-y-6 mt-6">
            {loading ? (
              <div className="space-y-6">
                {/* Top Performing Artworks Table Skeleton */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-56" />
                    <div className="space-y-3">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                          <div className="flex space-x-4">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
                
                {/* Top Performing Artists Table Skeleton */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-52" />
                    <div className="space-y-3">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-32" />
                          <div className="flex space-x-4">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
                
                {/* Charts Grid Skeleton */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-44" />
                      <Skeleton className="h-64 w-full" />
                    </div>
                  </Card>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-destructive mb-2">Error loading top performers data</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Top Performing Artworks Table */}
                <TopPerformingArtworksTable artworks={
                  processedData.topPerformers?.topPerformingArtworks?.map(artwork => ({
                    artwork: artwork.artworkTitle || 'Unknown Artwork',
                    artist: artwork.artistName || 'Unknown Artist',
                    views: artwork.views || 0,
                    saves: Math.floor((artwork.views || 0) * 0.3), // Generate demo saves data
                    shares: Math.floor((artwork.views || 0) * 0.15), // Generate demo shares data
                    inquiries: Math.floor((artwork.views || 0) * 0.08) // Generate demo inquiries data
                  })) || [
                    { artwork: "Guernica", artist: "Pablo Picasso", views: 2600, saves: 780, shares: 390, inquiries: 208 },
                    { artwork: "The Starry Night", artist: "Vincent van Gogh", views: 2350, saves: 705, shares: 352, inquiries: 188 },
                    { artwork: "Campbell's Soup Cans", artist: "Andy Warhol", views: 2100, saves: 630, shares: 315, inquiries: 168 },
                    { artwork: "The Persistence of Memory", artist: "Salvador Dalí", views: 1850, saves: 555, shares: 277, inquiries: 148 },
                    { artwork: "Radiant Baby", artist: "Keith Haring", views: 1650, saves: 495, shares: 247, inquiries: 132 }
                  ]
                } />

                {/* Top Performing Artists Table */}
                <TopPerformingArtistsTable artists={
                  processedData.topPerformers?.topPerformingArtists?.map(artist => ({
                    artist: artist.artistName || 'Unknown Artist',
                    views: artist.views || 0,
                    sales: artist.artworkCount || 0,
                    revenue: 0 // We don't have revenue data for artists in the current analytics
                  })) || []
                } />

                {/* Charts Grid */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <MostViewedArtworksBarChart artworks={processedData.artworkViews?.mostViewedArtworks || []} />
                                      <TopArtistsRevenueChart artists={
                      processedData.topPerformers?.topPerformingArtists?.map(artist => ({
                        artist: artist.artistName || 'Unknown Artist',
                        revenue: artist.views * 150 // Generate demo revenue based on views
                      })) || [
                        { artist: "Pablo Picasso", revenue: 390000 },
                        { artist: "Vincent van Gogh", revenue: 352500 },
                        { artist: "Andy Warhol", revenue: 315000 },
                        { artist: "Salvador Dalí", revenue: 280000 },
                        { artist: "Frida Kahlo", revenue: 245000 }
                      ]
                    } />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}