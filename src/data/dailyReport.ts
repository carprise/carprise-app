/**
 * Daily operational report for the driver B2B app.
 * Prefers live GPS telemetry; falls back to stable pilot estimates.
 */
import { supabase } from '@/src/lib/supabase';
import { sumDistanceKm } from '@/src/lib/telemetry';

export type DailyReport = {
  dateLabel: string;
  dateKey: string;
  distanceKm: number;
  journeys: number;
  activeMinutes: number;
  campaignHours: number;
  estimatedEarnings: number;
  idleShare: number;
  topArea: string;
  note: string;
  source: 'live' | 'estimate';
  pointCount: number;
  trackingHint?: string;
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(seed: number, items: T[]) {
  return items[seed % items.length];
}

function dayKey(date = new Date()) {
  // Europe/London calendar day for pilot reporting
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function dateLabelFor(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function estimateReport(driverId?: string | null, date = new Date()): DailyReport {
  const dateKey = dayKey(date);
  const seed = hashSeed(`${driverId ?? 'driver'}:${dateKey}`);

  const distanceKm = 45 + (seed % 90) + (seed % 10) / 10;
  const journeys = 6 + (seed % 12);
  const activeMinutes = 180 + (seed % 220);
  const campaignHours = Math.round((1 + (seed % 50) / 10) * 10) / 10;
  const estimatedEarnings = Math.round((18 + (seed % 55) + distanceKm * 0.12) * 100) / 100;
  const idleShare = 12 + (seed % 18);

  const areas = [
    'City of London',
    'Westminster',
    'Canary Wharf',
    'Kensington',
    'Heathrow corridor',
    'Shoreditch',
  ];

  return {
    dateKey,
    dateLabel: dateLabelFor(date),
    distanceKm: Math.round(distanceKm * 10) / 10,
    journeys,
    activeMinutes,
    campaignHours,
    estimatedEarnings,
    idleShare,
    topArea: pick(seed, areas),
    note:
      seed % 3 === 0
        ? 'Strong corridor coverage today. Keep stock topped up for evening demand.'
        : seed % 3 === 1
          ? 'Steady journey volume. Check campaign evidence before end of day.'
          : 'Quieter midday window. Good time to restock samples if needed.',
    source: 'estimate',
    pointCount: 0,
    trackingHint: 'Turn on route tracking to replace estimates with live distance.',
  };
}

export async function fetchDailyReport(
  driverId?: string | null,
  options?: { campaignHours?: number; activePay?: number },
): Promise<DailyReport> {
  const base = estimateReport(driverId);
  if (!supabase || !driverId) return base;

  const dateKey = base.dateKey;

  // Prefer SQL aggregate when migration is applied
  try {
    const { data, error } = await supabase.rpc('driver_daily_stats', {
      p_driver_id: driverId,
      p_day: dateKey,
    });
    if (!error && data) {
      const row = Array.isArray(data) ? data[0] : data;
      const pointCount = Number(row?.point_count ?? 0);
      if (pointCount >= 2) {
        const distanceKm = Math.round(Number(row.distance_km ?? 0) * 10) / 10;
        const activeMinutes = Math.round(Number(row.active_minutes ?? 0));
        const journeys = Math.max(1, Number(row.journeys ?? 1));
        const idleShare = activeMinutes > 0
          ? Math.min(80, Math.max(5, Math.round(100 - (activeMinutes / Math.max(activeMinutes + 30, 1)) * 100)))
          : base.idleShare;
        const campaignHours = options?.campaignHours ?? base.campaignHours;
        const estimatedEarnings =
          options?.activePay != null
            ? Math.round((options.activePay * 0.35 + distanceKm * 0.08) * 100) / 100
            : Math.round((12 + distanceKm * 0.15 + journeys * 1.2) * 100) / 100;

        return {
          ...base,
          distanceKm,
          journeys,
          activeMinutes: Math.max(activeMinutes, 1),
          campaignHours,
          estimatedEarnings,
          idleShare,
          source: 'live',
          pointCount,
          note:
            distanceKm > 40
              ? 'Solid distance on the network today. Keep evidence and stock aligned to evening demand.'
              : 'Live tracking is on. Distance builds as you move through the day.',
          trackingHint: `${pointCount} GPS samples today`,
        };
      }
    }
  } catch {
    // fall through to client-side points
  }

  // Client-side fall back: last 24h points
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    // Approximate London day start in local; good enough if RPC missing
    const { data: points, error } = await supabase
      .from('telemetry_points')
      .select('lat, lng, recorded_at')
      .eq('driver_id', driverId)
      .gte('recorded_at', start.toISOString())
      .order('recorded_at', { ascending: true })
      .limit(2000);

    if (!error && points && points.length >= 2) {
      const summed = sumDistanceKm(points);
      if (summed.distanceKm > 0 || points.length >= 3) {
        return {
          ...base,
          distanceKm: summed.distanceKm,
          journeys: Math.max(1, summed.journeys),
          activeMinutes: Math.max(summed.activeMinutes, 1),
          source: 'live',
          pointCount: points.length,
          estimatedEarnings: Math.round((12 + summed.distanceKm * 0.15 + summed.journeys * 1.2) * 100) / 100,
          note: 'Live distance from your device GPS. Full corridor analytics refine as samples accumulate.',
          trackingHint: `${points.length} GPS samples today`,
        };
      }
    }
  } catch {
    // keep estimate
  }

  return base;
}

/** Sync helper for screens that still want a non-async seed (rare). */
export function getDailyReport(driverId?: string | null, date = new Date()): DailyReport {
  return estimateReport(driverId, date);
}

export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}
