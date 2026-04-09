// data/homePageData.js
export const statsData = [
    {
      title: "Total Revenue",
      value: "$68,500.00",
      change: "+10.5%",
      changeText: "from last month",
      trend: "up"
    },
    {
      title: "QR Scans",
      value: "312",
      change: "+12%",
      changeText: "from last week",
      trend: "up"
    },
    {
      title: "Digital Floor Views",
      value: "2340",
      change: "+18%",
      changeText: "from last month",
      trend: "up"
    },
    {
      title: "Daily Visitors",
      value: "124",
      change: "+5%",
      changeText: "from yesterday",
      trend: "up"
    }
  ];
  
  export const featuredArtworks = [
    {
      id: 1,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AndyWarhol_Soup-Cans.jpg-aCHtY41CCGHLPnd3fyh8JVZn8hqMpp.jpeg",
      title: "Campbell's Soup Cans",
      artist: "Andy Warhol",
      price: "$15,000,000.00"
    },
    {
      id: 2,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The-Starry-Night.jpg-DnOhAXOaP8FCtRYdcjqX5vKqYebJ89.jpeg",
      title: "The Starry Night",
      artist: "Vincent van Gogh",
      price: "$1,200,000.00"
    }
  ];
  
  export const recentActivity = [
    {
      id: 1,
      avatar: "S",
      title: "Placed a bid on 'Vibrant Horizon'",
      description: "Bid amount: $7,500",
      time: "10 minutes ago"
    },
    {
      id: 2,
      avatar: "M",
      title: "Added a new artwork",
      description: "'Urban Landscape' by Jean-Michel Basquiat",
      time: "2 hours ago"
    },
    {
      id: 3,
      avatar: "G",
      title: "Auction started",
      description: "Contemporary Masterpieces auction is now live",
      time: "5 hours ago"
    },
    {
      id: 4,
      avatar: "I",
      title: "Updated artist profile",
      description: "Added new biography for Keith Haring",
      time: "Yesterday"
    },
    {
      id: 5,
      avatar: "A",
      title: "Generated QR code",
      description: "For 'The Persistence of Memory' by Salvador Dalí",
      time: "2 days ago"
    }
  ];
  
  export const topArtists = [
    {
      id: 1,
      avatar: "A",
      name: "Andy Warhol",
      style: "Pop Art"
    },
    {
      id: 2,
      avatar: "K",
      name: "Keith Haring",
      style: "Street Art"
    },
    {
      id: 3,
      avatar: "J",
      name: "Jean-Michel Basquiat",
      style: "Neo-Expressionism"
    },
    {
      id: 4,
      avatar: "F",
      name: "Frida Kahlo",
      style: "Surrealism"
    },
    {
      id: 5,
      avatar: "S",
      name: "Salvador Dalí",
      style: "Surrealism"
    }
  ];
  
  export const upcomingAuctions = [
    {
      id: 1,
      title: "Modern Icons",
      startDate: "May 31, 2025, 5:59 PM",
      endDate: "Jun 6, 2025, 5:59 PM",
      items: "1 artworks",
      startingBid: "$15,000.00",
      status: "Upcoming"
    },
    {
      id: 2,
      title: "Surrealist Visions",
      startDate: "May 31, 2025, 5:59 PM",
      endDate: "Jun 6, 2025, 5:59 PM",
      items: "1 artworks",
      startingBid: "$45,000.00",
      status: "Upcoming"
    }
  ];
  
  export const topBidders = [
    {
      id: 1,
      rank: 1,
      name: "Sophia Reynolds",
      email: "sophia@example.com",
      amount: "$55,000.00",
      bids: "5 bids"
    },
    {
      id: 2,
      rank: 2,
      name: "Marcus Chen",
      email: "marcus@example.com",
      amount: "$42,000.00",
      bids: "4 bids"
    },
    {
      id: 3,
      rank: 3,
      name: "Isabella Martinez",
      email: "isabella@example.com",
      amount: "$38,000.00",
      bids: "3 bids"
    },
    {
      id: 4,
      rank: 4,
      name: "Alexander Kim",
      email: "alexander@example.com",
      amount: "$25,000.00",
      bids: "2 bids"
    },
    {
      id: 5,
      rank: 5,
      name: "Olivia Johnson",
      email: "olivia@example.com",
      amount: "$12,000.00",
      bids: "1 bids"
    }
  ];
  
  export const activeQRCodes = [
    {
      id: 1,
      code: "QR-001",
      location: "Gallery Entrance - Wall 1",
      scans: 145,
      lastUpdated: "5/15/2023",
      status: "Available"
    },
    {
      id: 2,
      code: "QR-002",
      location: "Main Hall - Wall 3",
      scans: 98,
      lastUpdated: "5/20/2023",
      status: "Available"
    },
    {
      id: 3,
      code: "QR-003",
      location: "Exhibition Room - Wall 2",
      scans: 212,
      lastUpdated: "6/1/2023",
      status: "Sold"
    }
  ];
  
  export const digitalFloorPerformance = {
    totalViews: {
      value: "2340",
      change: "+18%",
      changeText: "from last month"
    },
    conversionRate: {
      value: "3.2%",
      change: "+0.8%",
      changeText: "from last month"
    },
    avgTimeOnPage: {
      value: "2m 45s",
      change: "+15s",
      changeText: "from last month"
    },
    informationRequests: {
      value: "38",
      change: "+12%",
      changeText: "from last month"
    }
  };