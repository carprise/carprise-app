import type {
  Assignment,
  Brand,
  Campaign,
  Driver,
  EvidenceItem,
  Fleet,
  PlatformMetrics,
  Product,
  Transaction,
  Vehicle,
} from './types';

export const brands: Brand[] = [
  {
    id: 'brand-1',
    name: 'Northern Brew Co',
    category: 'FMCG · Beverage',
    contactEmail: 'campaigns@northernbrew.co.uk',
    subscriptionTier: 'pilot',
    activeCampaigns: 1,
    spendPence: 450000,
  },
  {
    id: 'brand-2',
    name: 'Glow Lab Skincare',
    category: 'Beauty · Sampling',
    contactEmail: 'partnerships@glowlab.uk',
    subscriptionTier: 'pilot',
    activeCampaigns: 1,
    spendPence: 320000,
  },
  {
    id: 'brand-3',
    name: 'MetroSnack',
    category: 'Retail · Snacking',
    contactEmail: 'trade@metrosnack.com',
    subscriptionTier: 'growth',
    activeCampaigns: 1,
    spendPence: 280000,
  },
];

export const fleets: Fleet[] = [
  {
    id: 'fleet-1',
    name: 'MCR Executive Cars',
    city: 'Manchester',
    vehicles: 12,
    subscriptionTier: 'pilot',
    monthlyFeePence: 2000,
  },
  {
    id: 'fleet-2',
    name: 'Northern Ride Partners',
    city: 'Manchester',
    vehicles: 8,
    subscriptionTier: 'pilot',
    monthlyFeePence: 1500,
  },
];

export const drivers: Driver[] = [
  {
    id: 'drv-1',
    firstName: 'Tasha',
    lastName: 'Card',
    email: 'tasha@carprise.demo',
    phone: '+44 7700 900123',
    rating: 4.9,
    city: 'Manchester',
    verified: true,
    onboardingComplete: true,
    earningsPence: 18400,
    activeCampaigns: 1,
  },
  {
    id: 'drv-2',
    firstName: 'James',
    lastName: 'Okoro',
    email: 'james@carprise.demo',
    phone: '+44 7700 900456',
    rating: 4.8,
    city: 'Manchester',
    verified: true,
    onboardingComplete: true,
    earningsPence: 12200,
    activeCampaigns: 1,
  },
  {
    id: 'drv-3',
    firstName: 'Priya',
    lastName: 'Shah',
    email: 'priya@carprise.demo',
    phone: '+44 7700 900789',
    rating: 5.0,
    city: 'Manchester',
    verified: false,
    onboardingComplete: false,
    earningsPence: 0,
    activeCampaigns: 0,
  },
  {
    id: 'drv-4',
    firstName: 'Marcus',
    lastName: 'Lee',
    email: 'marcus@carprise.demo',
    phone: '+44 7700 900321',
    rating: 4.7,
    city: 'Manchester',
    verified: true,
    onboardingComplete: true,
    earningsPence: 9600,
    activeCampaigns: 2,
  },
];

export const vehicles: Vehicle[] = [
  {
    id: 'veh-1',
    driverId: 'drv-1',
    driverName: 'Tasha Card',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2022,
    colour: 'Black',
    registration: 'CP26 ONE',
    verificationStatus: 'verified',
    journeyCode: 'MCR01TAS',
    hardwareStatus: 'online',
    city: 'Manchester',
    active: true,
    journeysThisMonth: 312,
    revenueThisMonthPence: 10500,
  },
  {
    id: 'veh-2',
    driverId: 'drv-2',
    driverName: 'James Okoro',
    make: 'BMW',
    model: '5 Series',
    year: 2021,
    colour: 'Silver',
    registration: 'CP26 TWO',
    verificationStatus: 'verified',
    journeyCode: 'MCR02JAM',
    hardwareStatus: 'online',
    city: 'Manchester',
    active: true,
    journeysThisMonth: 278,
    revenueThisMonthPence: 8200,
  },
  {
    id: 'veh-3',
    driverId: 'drv-3',
    driverName: 'Priya Shah',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    colour: 'White',
    registration: 'CP26 THR',
    verificationStatus: 'pending',
    journeyCode: 'MCR03PRI',
    hardwareStatus: 'not_installed',
    city: 'Manchester',
    active: false,
    journeysThisMonth: 0,
    revenueThisMonthPence: 0,
  },
  {
    id: 'veh-4',
    driverId: 'drv-4',
    driverName: 'Marcus Lee',
    make: 'Audi',
    model: 'A6',
    year: 2020,
    colour: 'Grey',
    registration: 'CP26 FOR',
    verificationStatus: 'verified',
    journeyCode: 'MCR04MAR',
    hardwareStatus: 'installed',
    city: 'Manchester',
    active: true,
    journeysThisMonth: 241,
    revenueThisMonthPence: 7100,
  },
];

export const campaigns: Campaign[] = [
  {
    id: 'camp-1',
    brandId: 'brand-1',
    brand: 'Northern Brew Co',
    title: 'Cold Brew Discovery',
    description:
      'In-journey sampling and retail of ready-to-drink cold brew. Passengers can claim a free sample or purchase a multipack.',
    area: 'Manchester city centre',
    startsOn: '2026-03-01',
    endsOn: '2026-04-15',
    paymentPence: 12000,
    budgetPence: 450000,
    campaignType: 'hybrid',
    status: 'live',
    targetVehicles: 20,
    impressions: 8420,
    engagements: 1263,
    conversions: 412,
    revenuePence: 186400,
  },
  {
    id: 'camp-2',
    brandId: 'brand-2',
    brand: 'Glow Lab Skincare',
    title: 'Glow On The Go',
    description:
      'Mini serum samples with QR-led brand story and optional full-size purchase link.',
    area: 'Manchester & Salford',
    startsOn: '2026-03-10',
    endsOn: '2026-05-01',
    paymentPence: 9500,
    budgetPence: 320000,
    campaignType: 'sampling',
    status: 'live',
    targetVehicles: 15,
    impressions: 5210,
    engagements: 980,
    conversions: 640,
    revenuePence: 0,
  },
  {
    id: 'camp-3',
    brandId: 'brand-3',
    brand: 'MetroSnack',
    title: 'Airport Run Retail',
    description: 'Cashless snack retail for airport corridor journeys.',
    area: 'MAN Airport corridor',
    startsOn: '2026-04-01',
    endsOn: '2026-06-30',
    paymentPence: 8000,
    budgetPence: 280000,
    campaignType: 'retail',
    status: 'pilot',
    targetVehicles: 10,
    impressions: 2100,
    engagements: 310,
    conversions: 95,
    revenuePence: 42800,
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    brandId: 'brand-1',
    campaignId: 'camp-1',
    name: 'Northern Brew RTD 250ml',
    description: 'Smooth cold brew, lightly sweetened. Perfect mid-journey pick-me-up.',
    sku: 'NBC-RTD-250',
    retailPricePence: 350,
    productType: 'retail',
    stock: 48,
    imageEmoji: '☕',
  },
  {
    id: 'prod-2',
    brandId: 'brand-1',
    campaignId: 'camp-1',
    name: 'Cold Brew Sample Shot',
    description: 'Complimentary 60ml sample. One per passenger.',
    sku: 'NBC-SAMP-60',
    retailPricePence: 0,
    productType: 'sample',
    stock: 120,
    imageEmoji: '🧪',
  },
  {
    id: 'prod-3',
    brandId: 'brand-2',
    campaignId: 'camp-2',
    name: 'Glow Serum Mini',
    description: 'Travel-size vitamin C serum sample with brand trial card.',
    sku: 'GLW-SER-MINI',
    retailPricePence: 0,
    productType: 'sample',
    stock: 80,
    imageEmoji: '✨',
  },
  {
    id: 'prod-4',
    brandId: 'brand-2',
    campaignId: 'camp-2',
    name: 'Glow Serum Full Size',
    description: 'Full-size serum — order in-journey for home delivery.',
    sku: 'GLW-SER-FULL',
    retailPricePence: 2800,
    productType: 'retail',
    stock: 999,
    imageEmoji: '💧',
  },
  {
    id: 'prod-5',
    brandId: 'brand-3',
    campaignId: 'camp-3',
    name: 'Metro Nut Mix',
    description: 'Premium roasted nut mix. Ideal for longer journeys.',
    sku: 'MTS-NUT-100',
    retailPricePence: 299,
    productType: 'retail',
    stock: 36,
    imageEmoji: '🥜',
  },
  {
    id: 'prod-6',
    brandId: 'brand-3',
    campaignId: 'camp-3',
    name: 'Protein Bite Box',
    description: 'Three high-protein bites. Cashless pay in-seat.',
    sku: 'MTS-PRO-3',
    retailPricePence: 450,
    productType: 'retail',
    stock: 24,
    imageEmoji: '🍫',
  },
];

export const assignments: Assignment[] = [
  {
    id: 'asg-1',
    campaignId: 'camp-1',
    driverId: 'drv-1',
    driverName: 'Tasha Card',
    vehicleId: 'veh-1',
    status: 'active',
    progress: 65,
    revenueSharePence: 4200,
  },
  {
    id: 'asg-2',
    campaignId: 'camp-2',
    driverId: 'drv-2',
    driverName: 'James Okoro',
    vehicleId: 'veh-2',
    status: 'active',
    progress: 40,
    revenueSharePence: 2100,
  },
  {
    id: 'asg-3',
    campaignId: 'camp-1',
    driverId: 'drv-4',
    driverName: 'Marcus Lee',
    vehicleId: 'veh-4',
    status: 'accepted',
    progress: 25,
    revenueSharePence: 800,
  },
  {
    id: 'asg-4',
    campaignId: 'camp-3',
    driverId: 'drv-4',
    driverName: 'Marcus Lee',
    vehicleId: 'veh-4',
    status: 'invited',
    progress: 0,
    revenueSharePence: 0,
  },
];

export const evidence: EvidenceItem[] = [
  {
    id: 'ev-1',
    assignmentId: 'asg-1',
    driverId: 'drv-1',
    driverName: 'Tasha Card',
    campaignTitle: 'Cold Brew Discovery',
    evidenceType: 'installation_photo',
    reviewStatus: 'approved',
    createdAt: '2026-03-12T10:22:00Z',
  },
  {
    id: 'ev-2',
    assignmentId: 'asg-1',
    driverId: 'drv-1',
    driverName: 'Tasha Card',
    campaignTitle: 'Cold Brew Discovery',
    evidenceType: 'in_journey_photo',
    reviewStatus: 'pending',
    createdAt: '2026-03-28T14:05:00Z',
  },
  {
    id: 'ev-3',
    assignmentId: 'asg-2',
    driverId: 'drv-2',
    driverName: 'James Okoro',
    campaignTitle: 'Glow On The Go',
    evidenceType: 'installation_photo',
    reviewStatus: 'pending',
    createdAt: '2026-03-27T09:41:00Z',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'tx-1',
    vehicleId: 'veh-1',
    productName: 'Northern Brew RTD 250ml',
    campaignId: 'camp-1',
    amountPence: 350,
    platformFeePence: 70,
    driverSharePence: 105,
    type: 'purchase',
    status: 'completed',
    createdAt: '2026-03-28T11:20:00Z',
    city: 'Manchester',
  },
  {
    id: 'tx-2',
    vehicleId: 'veh-1',
    productName: 'Cold Brew Sample Shot',
    campaignId: 'camp-1',
    amountPence: 0,
    platformFeePence: 0,
    driverSharePence: 50,
    type: 'sample',
    status: 'completed',
    createdAt: '2026-03-28T11:22:00Z',
    city: 'Manchester',
  },
  {
    id: 'tx-3',
    vehicleId: 'veh-2',
    productName: 'Glow Serum Mini',
    campaignId: 'camp-2',
    amountPence: 0,
    platformFeePence: 0,
    driverSharePence: 40,
    type: 'sample',
    status: 'completed',
    createdAt: '2026-03-28T12:01:00Z',
    city: 'Manchester',
  },
  {
    id: 'tx-4',
    vehicleId: 'veh-4',
    productName: 'Metro Nut Mix',
    campaignId: 'camp-3',
    amountPence: 299,
    platformFeePence: 60,
    driverSharePence: 90,
    type: 'purchase',
    status: 'completed',
    createdAt: '2026-03-28T13:15:00Z',
    city: 'Manchester',
  },
  {
    id: 'tx-5',
    vehicleId: 'veh-1',
    productName: 'Glow Serum Full Size',
    campaignId: 'camp-2',
    amountPence: 2800,
    platformFeePence: 560,
    driverSharePence: 280,
    type: 'purchase',
    status: 'completed',
    createdAt: '2026-03-27T16:40:00Z',
    city: 'Manchester',
  },
];

export const metrics: PlatformMetrics = {
  activeVehicles: 3,
  journeysExposed: 831,
  engagementRate: 15.2,
  transactions: 47,
  grossRevenuePence: 229200,
  driverPayoutsPence: 40200,
  brandSpendPence: 1050000,
  contributionPence: 189000,
};

export function money(pence: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100);
}

export function getVehicleByCode(code: string) {
  return vehicles.find(
    (v) => v.journeyCode.toLowerCase() === code.toLowerCase() && v.active
  );
}

export function getLiveProductsForVehicle(vehicleId: string) {
  const vehicleCampaigns = assignments
    .filter(
      (a) =>
        a.vehicleId === vehicleId &&
        ['accepted', 'active', 'review'].includes(a.status)
    )
    .map((a) => a.campaignId);

  const liveCampaignIds = campaigns
    .filter(
      (c) =>
        vehicleCampaigns.includes(c.id) &&
        ['live', 'active', 'pilot'].includes(c.status)
    )
    .map((c) => c.id);

  // Fallback: show all live pilot products for demo if vehicle has campaigns
  if (liveCampaignIds.length === 0) {
    return products.filter((p) =>
      campaigns.some(
        (c) =>
          c.id === p.campaignId && ['live', 'active', 'pilot'].includes(c.status)
      )
    );
  }

  return products.filter(
    (p) => p.campaignId && liveCampaignIds.includes(p.campaignId)
  );
}

export function getCampaignsForBrand(brandId: string) {
  return campaigns.filter((c) => c.brandId === brandId);
}

export const unitEconomics = {
  low: {
    journeys: 180,
    engagementRate: 8,
    actions: 14,
    netPerAction: 0.8,
    transactionRevenue: 11,
    brandRevenue: 15,
    subscription: 10,
    gross: 36,
    variableCost: 18,
    contribution: 18,
  },
  base: {
    journeys: 300,
    engagementRate: 15,
    actions: 45,
    netPerAction: 1.1,
    transactionRevenue: 50,
    brandRevenue: 35,
    subscription: 20,
    gross: 105,
    variableCost: 42,
    contribution: 63,
  },
  high: {
    journeys: 450,
    engagementRate: 22,
    actions: 99,
    netPerAction: 1.4,
    transactionRevenue: 139,
    brandRevenue: 70,
    subscription: 30,
    gross: 239,
    variableCost: 80,
    contribution: 159,
  },
};
