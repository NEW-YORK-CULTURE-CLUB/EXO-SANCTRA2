// data/qrScansData.js
export const qrScanMetrics = [
    {
      period: "Today",
      value: "54",
      comparison: "vs. yesterday",
      icon: "scan",
      progress: 65
    },
    {
      period: "This Week",
      value: "227",
      comparison: "vs. last week",
      icon: "scan",
      progress: 75
    },
    {
      period: "This Month",
      value: "967",
      comparison: "vs. last month",
      icon: "scan",
      progress: 85
    },
    {
      period: "Selected Period",
      value: "238",
      comparison: "vs. previous period",
      icon: "scan",
      progress: 70
    }
  ];
  
  // For mobile view
  export const qrScanMetricsMobile = [
    {
      period: "Today",
      value: "21",
      comparison: "vs. yesterday",
      icon: "scan",
      progress: 35
    },
    {
      period: "This Week",
      value: "302",
      comparison: "vs. last week",
      icon: "scan",
      progress: 65
    },
    {
      period: "This Month",
      value: "1,170",
      comparison: "vs. last month",
      icon: "scan",
      progress: 85
    },
    {
      period: "Selected Period",
      value: "1,170",
      comparison: "vs. previous period",
      icon: "scan",
      progress: 85
    }
  ];
  
  export const qrScanTrendsData = {
    labels: ["2025-06-12", "2025-06-13", "2025-06-14", "2025-06-15", "2025-06-16", "2025-06-17", "2025-06-18", "2025-06-19"],
    data: [25, 35, 45, 40, 30, 35, 48, 54]
  };
  
  export const qrScanInsights = {
    averageDailyScans: {
      value: "30",
      description: "Average number of QR scans per day during the selected period"
    },
    peakDay: {
      value: "54",
      date: "19/06/2025",
      description: "Highest number of scans on"
    },
    growthRate: {
      value: "+5%",
      description: "Increase in QR scans compared to previous period"
    }
  };
  
  // Mobile specific insights
  export const qrScanInsightsMobile = {
    averageDailyScans: {
      value: "38",
      description: "Average number of QR scans per day during the selected period"
    },
    peakDay: {
      value: "59",
      date: "15/06/2025",
      description: "Highest number of scans on"
    },
    growthRate: {
      value: "+13%",
      description: "Increase in QR scans compared to previous period"
    }
  };