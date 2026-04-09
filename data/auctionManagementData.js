export const upcomingAuctions = [
  {
    id: 1,
    title: 'Modern Icons',
    artwork: "Campbell's Soup Can by Andy Warhol",
    image: '/vault/AndyWarhol_Soup-Cans.jpg',
    status: 'Upcoming',
    time: 'in 7 days',
    startingBid: 15000,
    currentBid: null,
    bids: 0,
  },
  {
    id: 2,
    title: 'Surrealist Visions',
    artwork: 'The Persistence of Memory by Salvador...',
    image: '/vault/the-persistence-of-memory-1931.jpg',
    status: 'Upcoming',
    time: 'in 7 days',
    startingBid: 45000,
    currentBid: null,
    bids: 0,
  },
];

export const liveAuctions = [
  {
    id: 3,
    title: 'Contemporary Masterpieces',
    artwork: 'Growing 3 by Keith Haring',
    image: '/vault/growing3.jpg',
    status: 'Live',
    time: 'in 1 day',
    startingBid: 5000,
    currentBid: 15588,
    bids: 12,
  },
  {
    id: 4,
    title: 'Abstract Expressions',
    artwork: 'Convergence by Jackson Pollock',
    image: '/vault/convergence.jpg',
    status: 'Live',
    time: 'in 7 days',
    startingBid: 30000,
    currentBid: 40962,
    bids: 10,
  },
];

export const completedAuctions = [
  {
    id: 5,
    title: 'Renaissance Treasures',
    artwork: 'Head Of a Woman by Leonardo Da Vinci',
    image: '/vault/head-of-a-woman.jpg',
    status: 'Completed',
    time: 'Ended',
    startingBid: 50000,
    currentBid: 58537,
    bids: 10,
  },
];

export const recentActivities = [
  {
    id: 1,
    type: 'auction_start',
    title: 'Auction Modern Icons has started',
    time: 'in 1 day',
  },
  {
    id: 2,
    type: 'auction_start',
    title: 'Auction Surrealist Visions has started',
    time: 'in 1 day',
  },
  {
    id: 3,
    type: 'bid',
    title: 'Marcus Chen placed a bid of $15,588 on Contemporary Masterpieces',
    description: 'Marcus Chen ($15,588)',
    time: 'about 13 hours ago',
  },
  {
    id: 4,
    type: 'bid',
    title: 'Alexander Kim placed a bid of $14,960 on Contemporary Masterpieces',
    description: 'Alexander Kim ($14,960)',
    time: 'about 14 hours ago',
  },
  {
    id: 5,
    type: 'bid',
    title: 'Marcus Chen placed a bid of $13,698 on Contemporary Masterpieces',
    description: 'Marcus Chen ($13,698)',
    time: 'about 15 hours ago',
  },
  {
    id: 6,
    type: 'reserve_met',
    title: 'Reserve price met for Contemporary Masterpieces',
    description: 'Reserve Price Met',
    time: 'about 18 hours ago',
    type: 'reserve_met',
  },
  {
    id: 7,
    type: 'bid',
    title: 'Isabella Martinez placed a bid of $10,783 on Contemporary Masterpieces',
    description: 'Isabella Martinez ($10,783)',
    time: 'about 18 hours ago',
  },
]; 