import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import type { Campaign, CampaignStatus, Driver, Vehicle } from '@/src/types';

type SaveProfileInput = { firstName: string; lastName: string; phone: string };
type SaveVehicleInput = Vehicle;
type SignUpResult = { error: string | null; signedIn: boolean; needsConfirmation: boolean };

type Ctx = {
  session: Session | null;
  loading: boolean;
  refreshing: boolean;
  driver: Driver | null;
  vehicle: Vehicle | null;
  campaigns: Campaign[];
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  saveProfile: (input: SaveProfileInput) => Promise<string | null>;
  saveVehicle: (input: SaveVehicleInput) => Promise<string | null>;
  accept: (assignmentId: string) => Promise<string | null>;
  decline: (assignmentId: string) => Promise<string | null>;
  completeTask: (assignmentId: string, index: number) => Promise<string | null>;
  setCampaignProgress: (assignmentId: string, progress: number) => Promise<string | null>;
  uploadVehiclePhoto: (uri: string, fileName?: string) => Promise<string | null>;
  uploadEvidence: (assignmentId: string, uri: string, fileName?: string) => Promise<string | null>;
};

const Context = createContext<Ctx | null>(null);

const emptyDriver = (session: Session): Driver => ({
  id: session.user.id,
  firstName: String(session.user.user_metadata?.first_name ?? ''),
  lastName: String(session.user.user_metadata?.last_name ?? ''),
  name: String(session.user.user_metadata?.first_name ?? 'Driver'),
  email: session.user.email ?? '',
  phone: '',
  rating: 5,
  vehicle: 'Vehicle details required',
  plate: 'NOT SET',
  verified: false,
});

const formatDate = (date?: string | null) => {
  if (!date) return 'TBC';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));
};

const tasksFor = (status: CampaignStatus, progress: number) => [
  { label: 'Campaign accepted', done: status !== 'invited' && status !== 'declined', progress: 10 },
  { label: 'Installation approved', done: progress >= 25, progress: 25 },
  { label: 'First evidence uploaded', done: progress >= 50, progress: 50 },
  { label: 'Final evidence uploaded', done: progress >= 75, progress: 75 },
  { label: 'Final vehicle check complete', done: progress >= 100 || status === 'complete' || status === 'completed', progress: 100 },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [notifications, setNotifications] = useState(true);

  const loadData = useCallback(async (activeSession: Session | null, showRefresh = false) => {
    if (!supabase || !activeSession) {
      setDriver(null);
      setVehicle(null);
      setCampaigns([]);
      setLoading(false);
      return;
    }

    if (showRefresh) setRefreshing(true);
    const userId = activeSession.user.id;

    const [profileResult, vehicleResult, assignmentResult] = await Promise.all([
      supabase.from('profiles').select('id, first_name, last_name, phone, rating').eq('id', userId).maybeSingle(),
      supabase.from('vehicles').select('id, make, model, year, colour, registration, verification_status').eq('driver_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('campaign_assignments').select('id, status, progress, campaign:campaigns(id, brand, title, area, starts_on, ends_on, payment_pence)').eq('driver_id', userId).order('created_at', { ascending: false }),
    ]);

    const profile = profileResult.data;
    const vehicleRow = vehicleResult.data;
    const base = emptyDriver(activeSession);
    const firstName = profile?.first_name || base.firstName || 'Driver';
    const lastName = profile?.last_name || base.lastName;

    setDriver({
      ...base,
      firstName,
      lastName,
      name: firstName,
      phone: profile?.phone ?? '',
      rating: Number(profile?.rating ?? 5),
      vehicle: vehicleRow ? `${vehicleRow.year ?? ''} ${vehicleRow.make ?? ''} ${vehicleRow.model ?? ''}`.trim() : base.vehicle,
      plate: vehicleRow?.registration ?? base.plate,
      verified: vehicleRow?.verification_status === 'verified',
    });

    setVehicle(vehicleRow ? {
      id: vehicleRow.id,
      make: vehicleRow.make ?? '',
      model: vehicleRow.model ?? '',
      year: vehicleRow.year ? String(vehicleRow.year) : '',
      colour: vehicleRow.colour ?? '',
      registration: vehicleRow.registration ?? '',
      verificationStatus: vehicleRow.verification_status ?? 'pending',
    } : null);

    const rows = assignmentResult.data ?? [];
    setCampaigns(rows.flatMap((row: any) => {
      const campaign = Array.isArray(row.campaign) ? row.campaign[0] : row.campaign;
      if (!campaign) return [];
      const status = (row.status ?? 'invited') as CampaignStatus;
      const progress = Number(row.progress ?? 0);
      return [{
        id: campaign.id,
        assignmentId: row.id,
        brand: campaign.brand,
        title: campaign.title,
        status,
        pay: Number(campaign.payment_pence ?? 0) / 100,
        start: formatDate(campaign.starts_on),
        end: formatDate(campaign.ends_on),
        area: campaign.area ?? 'London',
        progress,
        tasks: tasksFor(status, progress),
      }];
    }));

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadData(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      loadData(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadData]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string): Promise<SignUpResult> => {
    if (!supabase) return { error: 'Supabase is not configured.', signedIn: false, needsConfirmation: false };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { first_name: firstName.trim(), last_name: lastName.trim() } },
    });
    if (error) return { error: error.message, signedIn: false, needsConfirmation: false };

    // A database trigger creates the profile. Do not treat a missing session as a failed sign-up:
    // Supabase returns a user without a session when email confirmation is required.
    return {
      error: null,
      signedIn: Boolean(data.session),
      needsConfirmation: Boolean(data.user && !data.session),
    };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return 'Supabase is not configured.';
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error?.message ?? null;
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  const saveProfile = async ({ firstName, lastName, phone }: SaveProfileInput) => {
    if (!supabase || !session) return 'You are not signed in.';
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
    });
    if (error) return error.message;
    await loadData(session, true);
    return null;
  };

  const saveVehicle = async (input: SaveVehicleInput) => {
    if (!supabase || !session) return 'You are not signed in.';
    const row = {
      driver_id: session.user.id,
      make: input.make.trim(),
      model: input.model.trim(),
      year: Number(input.year),
      colour: input.colour.trim(),
      registration: input.registration.trim().toUpperCase(),
    };
    const query = input.id
      ? supabase.from('vehicles').update(row).eq('id', input.id).eq('driver_id', session.user.id)
      : supabase.from('vehicles').insert(row);
    const { error } = await query;
    if (error) return error.message;
    await loadData(session, true);
    return null;
  };

  const updateAssignment = async (assignmentId: string, values: Record<string, string | number>) => {
    if (!supabase || !session) return 'You are not signed in.';
    const { error } = await supabase.from('campaign_assignments').update(values).eq('id', assignmentId).eq('driver_id', session.user.id);
    if (error) return error.message;
    await loadData(session, true);
    return null;
  };

  const upload = async (bucket: string, path: string, uri: string) => {
    if (!supabase) return 'Supabase is not configured.';
    const response = await fetch(uri);
    const bytes = await response.arrayBuffer();
    const extension = path.split('.').pop()?.toLowerCase();
    const contentType = extension === 'png' ? 'image/png' : 'image/jpeg';
    const { error } = await supabase.storage.from(bucket).upload(path, bytes, { contentType, upsert: false });
    return error?.message ?? null;
  };

  const uploadVehiclePhoto = async (uri: string, fileName = 'vehicle.jpg') => {
    if (!session) return 'You are not signed in.';
    const extension = fileName.split('.').pop() || 'jpg';
    return upload('vehicle-photos', `${session.user.id}/${Date.now()}.${extension}`, uri);
  };

  const uploadEvidence = async (assignmentId: string, uri: string, fileName = 'evidence.jpg') => {
    if (!supabase || !session) return 'You are not signed in.';
    const extension = fileName.split('.').pop() || 'jpg';
    const path = `${session.user.id}/${assignmentId}/${Date.now()}.${extension}`;
    const uploadError = await upload('campaign-evidence', path, uri);
    if (uploadError) return uploadError;
    const { error } = await supabase.from('evidence').insert({
      assignment_id: assignmentId,
      driver_id: session.user.id,
      storage_path: path,
      evidence_type: 'campaign_photo',
    });
    return error?.message ?? null;
  };

  const value = useMemo<Ctx>(() => ({
    session,
    loading,
    refreshing,
    driver,
    vehicle,
    campaigns,
    notifications,
    setNotifications,
    signUp,
    signIn,
    signOut,
    refresh: () => loadData(session, true),
    saveProfile,
    saveVehicle,
    accept: assignmentId => updateAssignment(assignmentId, { status: 'accepted', progress: 10 }),
    decline: assignmentId => updateAssignment(assignmentId, { status: 'declined' }),
    completeTask: (assignmentId, index) => {
      const progress = Math.min(100, [10, 25, 50, 75, 100][index] ?? 100);
      const status = progress >= 100 ? 'completed' : progress > 10 ? 'active' : 'accepted';
      return updateAssignment(assignmentId, { progress, status });
    },
    setCampaignProgress: (assignmentId, progress) => {
      const bounded = Math.max(0, Math.min(100, Math.round(progress / 5) * 5));
      const status = bounded >= 100 ? 'completed' : bounded > 10 ? 'active' : 'accepted';
      return updateAssignment(assignmentId, { progress: bounded, status });
    },
    uploadVehiclePhoto,
    uploadEvidence,
  }), [session, loading, refreshing, driver, vehicle, campaigns, notifications, loadData]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('AppProvider missing');
  return value;
}
