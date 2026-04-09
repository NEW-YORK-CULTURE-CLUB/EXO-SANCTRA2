// data/digitalFloorData.js
export const digitalFloorMetrics = [
    {
      title: "Total Views",
      value: "4,338",
      comparison: "vs. previous period",
      icon: "globe",
      progress: 55
    },
    {
      title: "Unique Visitors",
      value: "2,293",
      comparison: "vs. previous period",
      icon: "users",
      progress: 45
    },
    {
      title: "Avg. Time Spent",
      value: "2m 32s",
      comparison: "vs. previous period",
      icon: "clock",
      progress: 65
    },
    {
      title: "Engagement Rate",
      value: "84%",
      comparison: "vs. previous period",
      icon: "users",
      progress: 84
    }
  ];
  
  // Mobile specific metrics
  export const digitalFloorMetricsMobile = [
    {
      title: "Total Views",
      value: "4,819",
      comparison: "vs. previous period",
      icon: "globe",
      progress: 60
    },
    {
      title: "Unique Visitors",
      value: "2,391",
      comparison: "vs. previous period",
      icon: "users",
      progress: 50
    },
    {
      title: "Avg. Time Spent",
      value: "2m 18s",
      comparison: "vs. previous period",
      icon: "clock",
      progress: 55
    },
    {
      title: "Engagement Rate",
      value: "77%",
      comparison: "vs. previous period",
      icon: "users",
      progress: 77
    }
  ];
  
  // Digital Floor Traffic data for chart
  export const digitalFloorTrafficData = {
    labels: [
      "2025-05-21", "2025-05-22", "2025-05-23", "2025-05-24", "2025-05-25",
      "2025-05-26", "2025-05-27", "2025-05-28", "2025-05-29", "2025-05-30",
      "2025-05-31", "2025-06-01", "2025-06-02", "2025-06-03", "2025-06-04",
      "2025-06-05", "2025-06-06", "2025-06-07", "2025-06-08", "2025-06-09",
      "2025-06-10", "2025-06-11", "2025-06-12", "2025-06-13", "2025-06-14",
      "2025-06-15", "2025-06-16", "2025-06-17", "2025-06-18"
    ],
    views: [
      180, 220, 190, 240, 210, 180, 160, 140, 170, 190,
      220, 200, 180, 160, 190, 210, 230, 240, 220, 200,
      180, 190, 210, 200, 220, 210, 190, 180
    ],
    uniqueVisitors: [
      100, 120, 110, 130, 120, 100, 90, 80, 95, 105,
      115, 110, 100, 90, 105, 115, 125, 130, 120, 110,
      100, 105, 115, 110, 120, 115, 105, 100
    ]
  };
  
  // Mobile specific traffic data
  export const digitalFloorTrafficDataMobile = {
    labels: [
      "2025-05-21", "2025-05-25", "2025-05-29", 
      "2025-06-02", "2025-06-06", "2025-06-10", 
      "2025-06-14", "2025-06-18"
    ],
    views: [
      150, 200, 180, 220, 240, 200, 180, 160
    ],
    uniqueVisitors: [
      80, 110, 100, 120, 130, 110, 100, 90
    ]
  };
  
  // Average Time Spent data
  export const averageTimeSpentData = {
    labels: [
      "2025-05-21", "2025-05-22", "2025-05-23", "2025-05-24", "2025-05-25",
      "2025-05-26", "2025-05-27", "2025-05-28", "2025-05-29", "2025-05-30",
      "2025-05-31", "2025-06-01", "2025-06-02", "2025-06-03", "2025-06-04",
      "2025-06-05", "2025-06-06", "2025-06-07", "2025-06-08", "2025-06-09",
      "2025-06-10", "2025-06-11", "2025-06-12", "2025-06-13", "2025-06-14",
      "2025-06-15", "2025-06-16", "2025-06-17", "2025-06-18"
    ],
    time: [
      2.5, 3.0, 2.8, 3.2, 3.5, 4.0, 3.8, 3.5, 3.2, 3.0,
      2.8, 2.5, 2.3, 2.5, 2.8, 3.0, 2.8, 2.5, 2.3, 2.5,
      2.8, 3.2, 3.5, 3.2, 3.0, 2.8, 3.0, 3.2
    ]
  };
  
  // Mobile specific average time data
  export const averageTimeSpentDataMobile = {
    labels: [
      "2025-05-21", "2025-05-25", "2025-05-29", 
      "2025-06-02", "2025-06-06", "2025-06-10", 
      "2025-06-14", "2025-06-18"
    ],
    time: [
      2.0, 2.5, 3.0, 4.0, 3.5, 3.0, 2.5, 2.8
    ]
  };