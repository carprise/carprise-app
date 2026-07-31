/**
 * Driver GPS sampling for live daily distance / routes report.
 * Batches points to Supabase `telemetry_points`.
 */
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { supabase } from '@/src/lib/supabase';

export type TelemetrySample = {
  lat: number;
  lng: number;
  accuracy_m?: number | null;
  speed_mps?: number | null;
  heading?: number | null;
  recorded_at: string;
};

type StartOptions = {
  driverId: string;
  vehicleId?: string | null;
  onStatus?: (status: TelemetryStatus) => void;
};

export type TelemetryStatus = {
  tracking: boolean;
  permission: 'unknown' | 'granted' | 'denied';
  lastError?: string | null;
  buffered: number;
  lastUploadAt?: string | null;
};

const BUFFER_FLUSH_AT = 4;
const FLUSH_MS = 90_000;
const MIN_MOVE_M = 12;

let watchSub: Location.LocationSubscription | null = null;
let buffer: TelemetrySample[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let meta: StartOptions | null = null;
let lastPoint: { lat: number; lng: number } | null = null;
let status: TelemetryStatus = {
  tracking: false,
  permission: 'unknown',
  lastError: null,
  buffered: 0,
  lastUploadAt: null,
};

function emit() {
  meta?.onStatus?.({ ...status, buffered: buffer.length });
}

function haversineM(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

async function flush() {
  if (!supabase || !meta || buffer.length === 0) return;
  const batch = buffer.splice(0, buffer.length);
  status.buffered = 0;
  emit();

  const rows = batch.map(p => ({
    driver_id: meta!.driverId,
    vehicle_id: meta!.vehicleId || null,
    recorded_at: p.recorded_at,
    lat: p.lat,
    lng: p.lng,
    accuracy_m: p.accuracy_m ?? null,
    speed_mps: p.speed_mps ?? null,
    heading: p.heading ?? null,
    source: Platform.OS === 'web' ? 'web' : 'app',
  }));

  const { error } = await supabase.from('telemetry_points').insert(rows);
  if (error) {
    // Re-queue on failure (cap buffer)
    buffer = [...rows.map(r => ({
      lat: r.lat,
      lng: r.lng,
      accuracy_m: r.accuracy_m,
      speed_mps: r.speed_mps,
      heading: r.heading,
      recorded_at: r.recorded_at,
    })), ...buffer].slice(0, 80);
    status.lastError = error.message;
    status.buffered = buffer.length;
    emit();
    return;
  }

  status.lastError = null;
  status.lastUploadAt = new Date().toISOString();
  emit();
}

function pushSample(coords: Location.LocationObjectCoords) {
  if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) return;
  const point = { lat: coords.latitude, lng: coords.longitude };
  if (lastPoint && haversineM(lastPoint, point) < MIN_MOVE_M) return;
  lastPoint = point;

  buffer.push({
    lat: point.lat,
    lng: point.lng,
    accuracy_m: coords.accuracy,
    speed_mps: coords.speed,
    heading: coords.heading,
    recorded_at: new Date().toISOString(),
  });
  status.buffered = buffer.length;
  emit();

  if (buffer.length >= BUFFER_FLUSH_AT) {
    void flush();
  }
}

export async function requestTelemetryPermission(): Promise<boolean> {
  try {
    const current = await Location.getForegroundPermissionsAsync();
    if (current.granted) {
      status.permission = 'granted';
      emit();
      return true;
    }
    const asked = await Location.requestForegroundPermissionsAsync();
    status.permission = asked.granted ? 'granted' : 'denied';
    emit();
    return asked.granted;
  } catch (e) {
    status.permission = 'denied';
    status.lastError = e instanceof Error ? e.message : 'Location permission failed';
    emit();
    return false;
  }
}

export async function startTelemetry(options: StartOptions): Promise<TelemetryStatus> {
  await stopTelemetry({ flush: true });
  meta = options;

  const ok = await requestTelemetryPermission();
  if (!ok) {
    status.tracking = false;
    emit();
    return { ...status };
  }

  try {
    watchSub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 25_000,
        distanceInterval: 25,
        mayShowUserSettingsDialog: true,
      },
      loc => pushSample(loc.coords),
    );
    flushTimer = setInterval(() => {
      void flush();
    }, FLUSH_MS);
    status.tracking = true;
    status.lastError = null;
  } catch (e) {
    status.tracking = false;
    status.lastError = e instanceof Error ? e.message : 'Could not start location watch';
  }

  emit();
  return { ...status };
}

export async function stopTelemetry(opts?: { flush?: boolean }) {
  if (watchSub) {
    watchSub.remove();
    watchSub = null;
  }
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
  if (opts?.flush) await flush();
  status.tracking = false;
  emit();
  meta = null;
  lastPoint = null;
}

export function getTelemetryStatus(): TelemetryStatus {
  return { ...status, buffered: buffer.length };
}

/** Client-side haversine sum when RPC is unavailable. */
export function sumDistanceKm(
  points: { lat: number; lng: number; recorded_at: string }[],
): { distanceKm: number; activeMinutes: number; journeys: number } {
  if (points.length < 2) {
    return { distanceKm: 0, activeMinutes: 0, journeys: points.length ? 1 : 0 };
  }
  const sorted = [...points].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime(),
  );
  let distanceKm = 0;
  let activeMinutes = 0;
  let journeys = 1;
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1];
    const b = sorted[i];
    const m = haversineM(a, b);
    const km = m / 1000;
    if (km < 5) distanceKm += km;
    const gapMin =
      (new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()) / 60_000;
    if (gapMin > 0 && gapMin <= 12) activeMinutes += gapMin;
    if (gapMin > 20) journeys += 1;
  }
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    activeMinutes: Math.round(activeMinutes),
    journeys,
  };
}
