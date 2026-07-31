export type Role = 'driver' | 'brand' | 'admin' | 'fleet' | 'passenger';

export type CampaignStatus =
  | 'draft'
  | 'live'
  | 'active'
  | 'pilot'
  | 'paused'
  | 'completed';

export type AssignmentStatus =
  | 'invited'
  | 'accepted'
  | 'active'
  | 'review'
  | 'completed'
  | 'declined';

export type Product = {
  id: string;
  brandId: string;
  campaignId?: string;
  name: string;
  description: string;
  sku: string;
  retailPricePence: number;
  productType: 'retail' | 'sample' | 'service';
  stock: number;
  imageEmoji: string;
};

export type Campaign = {
  id: string;
  brandId: string;
  brand: string;
  title: string;
  description: string;
  area: string;
  startsOn: string;
  endsOn: string;
  paymentPence: number;
  budgetPence: number;
  campaignType: 'awareness' | 'sampling' | 'retail' | 'hybrid';
  status: CampaignStatus;
  targetVehicles: number;
  impressions: number;
  engagements: number;
  conversions: number;
  revenuePence: number;
};

export type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rating: number;
  city: string;
  verified: boolean;
  onboardingComplete: boolean;
  earningsPence: number;
  activeCampaigns: number;
};

export type Vehicle = {
  id: string;
  driverId: string;
  driverName: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  registration: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  journeyCode: string;
  hardwareStatus: 'not_installed' | 'installed' | 'online' | 'offline';
  city: string;
  active: boolean;
  journeysThisMonth: number;
  revenueThisMonthPence: number;
};

export type Assignment = {
  id: string;
  campaignId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  status: AssignmentStatus;
  progress: number;
  revenueSharePence: number;
};

export type EvidenceItem = {
  id: string;
  assignmentId: string;
  driverId: string;
  driverName: string;
  campaignTitle: string;
  evidenceType: string;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  note?: string;
};

export type Transaction = {
  id: string;
  vehicleId: string;
  productName: string;
  campaignId?: string;
  amountPence: number;
  platformFeePence: number;
  driverSharePence: number;
  type: 'purchase' | 'sample' | 'engagement' | 'subscription';
  status: string;
  createdAt: string;
  city: string;
};

export type Brand = {
  id: string;
  name: string;
  category: string;
  contactEmail: string;
  subscriptionTier: string;
  activeCampaigns: number;
  spendPence: number;
};

export type Fleet = {
  id: string;
  name: string;
  city: string;
  vehicles: number;
  subscriptionTier: string;
  monthlyFeePence: number;
};

export type PlatformMetrics = {
  activeVehicles: number;
  journeysExposed: number;
  engagementRate: number;
  transactions: number;
  grossRevenuePence: number;
  driverPayoutsPence: number;
  brandSpendPence: number;
  contributionPence: number;
};
