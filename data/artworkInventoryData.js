// data/artworkInventoryData.js
export const artworkInventoryData = [
    {
      id: "ART-001",
      sku: "ART-001",
      title: "Campbell's Soup Cans",
      artist: "Andy Warhol",
      year: 1962,
      medium: "Acrylic on canvas",
      size: "20 x 16 inches",
      price: 15000000.00,
      priceType: "By Request",
      condition: "Excellent",
      framed: "Framed",
      location: "Main Gallery",
      digitalFloor: "Active",
      status: "active",
      matureContent: "No"
    },
    {
      id: "ART-002",
      sku: "ART-002",
      title: "Mona Lisa (Replica)",
      artist: "Leonardo Da Vinci",
      year: 1503,
      medium: "Oil on poplar panel",
      size: "30 x 21 inches",
      price: 850000.00,
      priceType: "Fixed",
      condition: "Good",
      framed: "Framed",
      location: "Vault A",
      digitalFloor: "Inactive",
      status: "inactive",
      matureContent: "No"
    },
    {
      id: "ART-003",
      sku: "ART-003",
      title: "Radiant Baby",
      artist: "Keith Haring",
      year: 1982,
      medium: "Acrylic on canvas",
      size: "48 x 48 inches",
      price: 3500000.00,
      priceType: "Auction",
      condition: "Excellent",
      framed: "Unframed",
      location: "Exhibition Hall",
      digitalFloor: "Active",
      status: "active",
      matureContent: "No"
    },
    {
      id: "ART-004",
      sku: "ART-004",
      title: "Marilyn Diptych",
      artist: "Andy Warhol",
      year: 1962,
      medium: "Silkscreen on canvas",
      size: "80 x 114 inches",
      price: 25000000.00,
      priceType: "By Request",
      condition: "Excellent",
      framed: "Framed",
      location: "Vault B",
      digitalFloor: "Inactive",
      status: "inactive",
      matureContent: "No"
    },
    {
      id: "ART-005",
      sku: "ART-005",
      title: "The Starry Night",
      artist: "Vincent van Gogh",
      year: 1889,
      medium: "Oil on canvas",
      size: "29 x 36 inches",
      price: 12000000.00,
      priceType: "Fixed",
      condition: "Good",
      framed: "Framed",
      location: "Main Gallery",
      digitalFloor: "Active",
      status: "active",
      matureContent: "No"
    },
    {
      id: "ART-006",
      sku: "ART-006",
      title: "Guernica",
      artist: "Pablo Picasso",
      year: 1937,
      medium: "Oil on canvas",
      size: "137 x 305 inches",
      price: 30000000.00,
      priceType: "By Request",
      condition: "Excellent",
      framed: "Unframed",
      location: "Exhibition Hall",
      digitalFloor: "Active",
      status: "active",
      matureContent: "Yes"
    },
    {
      id: "ART-007",
      sku: "ART-007",
      title: "The Persistence of Memory",
      artist: "Salvador Dalí",
      year: 1931,
      medium: "Oil on canvas",
      size: "9.5 x 13 inches",
      price: 8500000.00,
      priceType: "Auction",
      condition: "Excellent",
      framed: "Framed",
      location: "Vault A",
      digitalFloor: "Inactive",
      status: "inactive",
      matureContent: "No"
    }
  ];
  
  export const storageLocations = [
    { id: 1, name: "Main Gallery", count: 2 },
    { id: 2, name: "Exhibition Hall", count: 2 },
    { id: 3, name: "Vault A", count: 2 },
    { id: 4, name: "Vault B", count: 1 }
  ];
  
  export const bulkOperations = [
    "Update Prices",
    "Change Location",
    "Export Selected",
    "Archive",
    "Delete"
  ];
  
  export const columnOptions = [
    { id: "id", label: "Id", checked: false },
    { id: "title", label: "Title", checked: true },
    { id: "artist", label: "Artist", checked: true },
    { id: "year", label: "Year", checked: true },
    { id: "medium", label: "Medium", checked: true },
    { id: "size", label: "Size", checked: true },
    { id: "price", label: "Price", checked: true },
    { id: "priceType", label: "PriceType", checked: true },
    { id: "condition", label: "Condition", checked: true },
    { id: "framed", label: "Framed", checked: true },
    { id: "location", label: "Location", checked: true }
  ];

// Column options for different item types
export const collectibleColumnOptions = [
  { id: "id", label: "Id", checked: false },
  { id: "title", label: "Title", checked: true },
  { id: "seriesSetName", label: "Series/Set", checked: true },
  { id: "manufacturerBrand", label: "Manufacturer", checked: true },
  { id: "releaseYearEra", label: "Release Year", checked: true },
  { id: "size", label: "Size", checked: true },
  { id: "price", label: "Price", checked: true },
  { id: "priceType", label: "Price Type", checked: true },
  { id: "condition", label: "Condition", checked: true },
  { id: "location", label: "Location", checked: true }
];

export const memorabiliaColumnOptions = [
  { id: "id", label: "Id", checked: false },
  { id: "title", label: "Title", checked: true },
  { id: "associatedPersons", label: "Associated Persons", checked: true },
  { id: "associatedTeamOrganization", label: "Team/Organization", checked: true },
  { id: "eventNameDate", label: "Event/Date", checked: true },
  { id: "eraPeriod", label: "Era/Period", checked: true },
  { id: "size", label: "Size", checked: true },
  { id: "price", label: "Price", checked: true },
  { id: "priceType", label: "Price Type", checked: true },
  { id: "condition", label: "Condition", checked: true },
  { id: "location", label: "Location", checked: true }
];

export const objectColumnOptions = [
  { id: "id", label: "Id", checked: false },
  { id: "title", label: "Title", checked: true },
  { id: "makerManufacturer", label: "Maker/Manufacturer", checked: true },
  { id: "productionYearEra", label: "Production Year", checked: true },
  { id: "materialsComposition", label: "Materials", checked: true },
  { id: "size", label: "Size", checked: true },
  { id: "price", label: "Price", checked: true },
  { id: "priceType", label: "Price Type", checked: true },
  { id: "condition", label: "Condition", checked: true },
  { id: "location", label: "Location", checked: true }
];