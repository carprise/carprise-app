export type CampaignStatus = 'invited' | 'accepted' | 'active' | 'review' | 'complete' | 'completed' | 'declined';
export type UserRole = 'driver' | 'brand' | 'admin' | 'fleet';

export type CampaignTask = {
  label: string;
  done: boolean;
  progress: number;
};

export type Campaign = {
  id: string;
  assignmentId: string;
  brand: string;
  title: string;
  status: CampaignStatus;
  pay: number;
  start: string;
  end: string;
  area: string;
  progress: number;
  tasks: CampaignTask[];
  campaignType?: string;
  description?: string;
};

export type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  vehicle: string;
  plate: string;
  verified: boolean;
  onboardingComplete?: boolean;
  bankSortCode?: string;
  bankAccountLast4?: string;
};

export type Vehicle = {
  id?: string;
  make: string;
  model: string;
  year: string;
  colour: string;
  registration: string;
  verificationStatus: string;
  journeyCode?: string;
  hardwareStatus?: string;
  city?: string;
};

export type DriverDocument = {
  id: string;
  label: string;
  status: 'missing' | 'uploaded' | 'approved' | 'rejected';
  updatedAt?: string;
};

export type CabinRequest = {
  id: string;
  kind: 'ask' | 'listen' | 'ride' | 'drink' | 'shop' | string;
  title: string;
  body: string;
  status: 'open' | 'done' | string;
  created_at: string;
};

export type LedgerEntry = {
  id: string;
  amount: number;
  entryType: string;
  description: string;
  status: string;
  createdAt: string;
};
