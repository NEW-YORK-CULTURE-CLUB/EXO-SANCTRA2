// data/analyticsData.js
export const analyticsStats = [
    {
      id: 1,
      title: "QR Scans",
      value: "977",
      subtitle: "Monthly scans",
      icon: "scan",
      color: "blue",
      progress: 82
    },
    {
      id: 2,
      title: "Artwork Views",
      value: "11,244",
      subtitle: "Total views",
      icon: "eye",
      color: "cyan",
      progress: 65
    },
    {
      id: 3,
      title: "Digital Floor Views",
      value: "4,572",
      subtitle: "Total views",
      icon: "globe",
      color: "purple",
      progress: 45
    },
    {
      id: 4,
      title: "Sales Revenue",
      value: "$833,770",
      subtitle: "23 artworks sold",
      icon: "dollar",
      color: "green",
      progress: 90
    }
  ];
  
  export const qrScanBreakdown = [
    {
      period: "Today",
      value: "52",
      progress: 52
    },
    {
      period: "This Week",
      value: "164",
      progress: 164
    },
    {
      period: "This Month",
      value: "977",
      progress: 100
    }
  ];
  
  export const engagementData = {
    total: 16793,
    artworkViews: 11244,
    digitalFloorViews: 4572,
    qrScans: 977
  };
  
  export const tabCategories = [
    { id: "overview", label: "Overview" },
    { id: "qr-scans", label: "QR Scans" },
    { id: "artwork-views", label: "Artwork Views" },
    { id: "digital-floor", label: "Digital Floor" },
    { id: "sales", label: "Sales" },
    { id: "top-performers", label: "Top Performers" }
  ];