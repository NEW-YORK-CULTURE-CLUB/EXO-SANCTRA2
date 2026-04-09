// app/gallery-analytics/page.js
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 5, 19),
  });
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedQuickRange, setSelectedQuickRange] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleQuickDateSelect = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ from: start, to: end });
    setSelectedQuickRange(days);
  };

  const currentQRMetrics = isMobile ? qrScanMetricsMobile : qrScanMetrics;
  const currentQRInsights = isMobile ? qrScanInsightsMobile : qrScanInsights;
  const currentArtworkMetrics = isMobile ? artworkViewsMetricsMobile : artworkViewsMetrics;
  const currentMostViewed = isMobile ? mostViewedArtworksMobile : mostViewedArtworks;
  const currentDigitalFloorMetrics = isMobile ? digitalFloorMetricsMobile : digitalFloorMetrics;
  const currentDigitalFloorTraffic = isMobile ? digitalFloorTrafficDataMobile : digitalFloorTrafficData;
  const currentAverageTime = isMobile ? averageTimeSpentDataMobile : averageTimeSpentData;
  const currentSalesMetrics = isMobile ? salesMetricsMobile : salesMetrics;
  const currentRevenue = isMobile ? revenueOverTimeDataMobile : revenueOverTimeData;
  const currentTopSelling = isMobile ? topSellingArtworksMobile : topSellingArtworks;
  const currentSalesDistribution = isMobile ? salesDistributionMobile : salesDistribution;
  const currentMostViewedArtworks = isMobile ? mostViewedArtworksDataMobile : mostViewedArtworksData;
  const currentTopArtistsRevenue = isMobile ? topArtistsByRevenueDataMobile : topArtistsByRevenueData;

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
            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
              {analyticsStats.map((stat) => (
                <AnalyticsStatsCard key={stat.id} stat={stat} />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <EngagementOverview data={engagementData} />
              <QRScanBreakdown data={qrScanBreakdown} />
            </div>
          </TabsContent>

          {/* QR Scans Tab Content */}
          <TabsContent value="qr-scans" className="space-y-6 mt-6">
            {/* QR Scan Metrics Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {currentQRMetrics.map((metric, index) => (
                <QRScanMetricCard key={index} metric={metric} />
              ))}
            </div>

            {/* QR Scan Trends Chart */}
            <QRScanTrendsChart data={qrScanTrendsData} />

            {/* QR Scan Insights */}
            <QRScanInsights insights={currentQRInsights} />
          </TabsContent>

          {/* Other tabs */}
          {/* Artwork Views Tab Content */}
          <TabsContent value="artwork-views" className="space-y-6 mt-6">
            {/* Artwork Views Metrics */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
              {currentArtworkMetrics.map((metric, index) => (
                <ArtworkViewsMetricCard key={index} metric={metric} />
              ))}
            </div>

            {/* Artwork Views Over Time Chart */}
            <ArtworkViewsChart data={artworkViewsOverTimeData} />

            {/* Most Viewed Artworks Chart */}
            <MostViewedArtworksChart artworks={currentMostViewed} />

            {/* Top Performing Artworks Table */}
            <TopPerformingArtworks artworks={topPerformingArtworks} />
          </TabsContent>

             {/* Digital Floor Tab Content */}
          <TabsContent value="digital-floor" className="space-y-6 mt-6">
            {/* Digital Floor Metrics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {currentDigitalFloorMetrics.map((metric, index) => (
                <DigitalFloorMetricCard key={index} metric={metric} />
              ))}
            </div>

            {/* Digital Floor Traffic Chart */}
            <DigitalFloorTrafficChart data={currentDigitalFloorTraffic} />

            {/* Average Time Spent Chart */}
            <AverageTimeSpentChart data={currentAverageTime} />
          </TabsContent>

           {/* Sales Tab Content */}
           <TabsContent value="sales" className="space-y-6 mt-6">
            {/* Sales Metrics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {currentSalesMetrics.map((metric, index) => (
                <SalesMetricCard key={index} metric={metric} />
              ))}
            </div>

            {/* Revenue Over Time Chart */}
            <RevenueOverTimeChart data={currentRevenue} />

            {/* Charts Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <TopSellingArtworksChart artworks={currentTopSelling} />
              <SalesDistributionChart data={currentSalesDistribution} />
            </div>
          </TabsContent>


          {/* Top Performers Tab Content */}
          <TabsContent value="top-performers" className="space-y-6 mt-6">
            {/* Top Performing Artworks Table */}
            <TopPerformingArtworksTable artworks={topPerformingArtworksData} />

            {/* Top Performing Artists Table */}
            <TopPerformingArtistsTable artists={topPerformingArtistsData} />

            {/* Charts Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <MostViewedArtworksBarChart artworks={currentMostViewedArtworks} />
              <TopArtistsRevenueChart artists={currentTopArtistsRevenue} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}