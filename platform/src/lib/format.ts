export function money(pence: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100);
}

export function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

export function shortDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso.includes('T') ? iso : `${iso}T12:00:00`));
}

export function statusTone(status: string) {
  const s = status.toLowerCase();
  if (['live', 'active', 'approved', 'verified', 'completed', 'online'].includes(s))
    return 'success' as const;
  if (['pending', 'invited', 'review', 'pilot', 'installed'].includes(s))
    return 'warning' as const;
  if (['rejected', 'declined', 'offline'].includes(s)) return 'danger' as const;
  if (['draft', 'paused', 'not_installed'].includes(s)) return 'muted' as const;
  return 'gold' as const;
}
