/**
 * Daily operational report for the driver B2B app.
 * Demo-stable numbers until live GPS / journey telemetry is connected.
 */

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
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(seed: number, items: T[]) {
  return items[seed % items.length];
}

export function getDailyReport(driverId?: string | null, date = new Date()): DailyReport {
  const dateKey = date.toISOString().slice(0, 10);
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
    dateLabel: new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date),
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
  };
}

export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}
