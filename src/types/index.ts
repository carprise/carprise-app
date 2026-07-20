export type CampaignStatus = 'invited' | 'active' | 'review' | 'complete' | 'declined';

export type CampaignTask = {
  label: string;
  done: boolean;
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
};

export type Vehicle = {
  id?: string;
  make: string;
  model: string;
  year: string;
  colour: string;
  registration: string;
  verificationStatus: string;
};
