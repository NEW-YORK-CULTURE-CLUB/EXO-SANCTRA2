// data/salesData.js
export const salesMetrics = [
    {
      title: "Total Revenue",
      value: "$1,146,253",
      comparison: "vs. previous period",
      icon: "dollar",
      progress: 75,
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100"
    },
    {
      title: "Artworks Sold",
      value: "33",
      comparison: "vs. previous period",
      icon: "check",
      progress: 65,
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100"
    },
    {
      title: "Avg. Order Value",
      value: "$34,735",
      comparison: "vs. previous period",
      icon: "trending",
      progress: 80,
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100"
    },
    {
      title: "Sales Period",
      value: "21 days",
      subtitle: "20/05/2025 - 19/06/2025",
      icon: "calendar",
      progress: 100,
      bgColor: "bg-yellow-50/50",
      borderColor: "border-yellow-100"
    }
  ];
  
  // Mobile specific metrics
  export const salesMetricsMobile = [
    {
      title: "Total Revenue",
      value: "$1,197,023",
      comparison: "vs. previous period",
      icon: "dollar",
      progress: 78,
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100"
    },
    {
      title: "Artworks Sold",
      value: "33",
      comparison: "vs. previous period",
      icon: "check",
      progress: 65,
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100"
    },
    {
      title: "Avg. Order Value",
      value: "$36,273",
      comparison: "vs. previous period",
      icon: "trending",
      progress: 82,
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100"
    },
    {
      title: "Sales Period",
      value: "24 days",
      subtitle: "20/05/2025 - 19/06/2025",
      icon: "calendar",
      progress: 100,
      bgColor: "bg-yellow-50/50",
      borderColor: "border-yellow-100"
    }
  ];
  
  // Revenue Over Time data
  export const revenueOverTimeData = {
    labels: [
      "2025-05-22", "2025-05-25", "2025-05-29", 
      "2025-06-01", "2025-06-08", "2025-06-12", 
      "2025-06-16", "2025-06-19"
    ],
    data: [80000, 95000, 120000, 110000, 145000, 125000, 115000, 135000]
  };
  
  // Mobile specific revenue data
  export const revenueOverTimeDataMobile = {
    labels: [
      "2025-05-22", "2025-06-01", "2025-06-08", 
      "2025-06-14", "2025-06-18"
    ],
    data: [90000, 110000, 130000, 100000, 120000]
  };
  
  // Top Selling Artworks
  export const topSellingArtworks = [
    {
      title: "The Starry Night",
      revenue: 250000
    },
    {
      title: "Guernica",
      revenue: 180000
    },
    {
      title: "Campbell's Soup Cans",
      revenue: 150000
    },
    {
      title: "The Persistence of Memory",
      revenue: 120000
    },
    {
      title: "Radiant Baby",
      revenue: 100000
    }
  ];
  
  // Mobile specific top selling
  export const topSellingArtworksMobile = [
    {
      title: "The Starry Night",
      revenue: 200000
    },
    {
      title: "Radiant Baby",
      revenue: 120000
    },
    {
      title: "Guernica",
      revenue: 110000
    }
  ];
  
  // Sales Distribution data
  export const salesDistribution = {
    total: 1146253,
    categories: [
      { name: "Contemporary", value: 450000, percentage: 39 },
      { name: "Modern", value: 350000, percentage: 31 },
      { name: "Abstract", value: 250000, percentage: 22 },
      { name: "Other", value: 96253, percentage: 8 }
    ]
  };
  
  // Mobile specific distribution
  export const salesDistributionMobile = {
    total: 1197023,
    categories: [
      { name: "Contemporary", value: 480000, percentage: 40 },
      { name: "Modern", value: 360000, percentage: 30 },
      { name: "Abstract", value: 240000, percentage: 20 },
      { name: "Other", value: 117023, percentage: 10 }
    ]
  };