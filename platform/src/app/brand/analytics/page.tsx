'use client';

import { brands, getCampaignsForBrand } from '@/lib/demo-data';
import { money, pct } from '@/lib/format';
import { usePlatformStore } from '@/lib/store';
import { Card, Metric, PageHeader, Table } from '@/components/ui';

export default function BrandAnalyticsPage() {
  const { brandId, transactions } = usePlatformStore();
  const brand = brands.find((b) => b.id === brandId) ?? brands[0];
  const mine = getCampaignsForBrand(brand.id);
  const campIds = new Set(mine.map((c) => c.id));
  const related = transactions.filter(
    (t) => t.campaignId && campIds.has(t.campaignId)
  );
  const retail = related
    .filter((t) => t.type === 'purchase')
    .reduce((s, t) => s + t.amountPence, 0);
  const samples = related.filter((t) => t.type === 'sample').length;

  const impressions = mine.reduce((s, c) => s + c.impressions, 0);
  const engagements = mine.reduce((s, c) => s + c.engagements, 0);
  const conversions = mine.reduce((s, c) => s + c.conversions, 0);
  const cpa =
    conversions > 0
      ? mine.reduce((s, c) => s + c.budgetPence, 0) / conversions
      : 0;

  return (
    <div>
      <PageHeader
        eyebrow="ANALYTICS"
        title="Campaign performance"
        copy="Evidence-led optimisation: reach, engagement, trial and conversion in a context-aware journey environment."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Impressions" value={impressions.toLocaleString()} />
        <Metric
          label="Engagement rate"
          value={pct(impressions ? (engagements / impressions) * 100 : 0)}
        />
        <Metric label="Sample events" value={String(samples + conversions)} />
        <Metric
          label="Est. CPA"
          value={conversions ? money(Math.round(cpa)) : '—'}
          hint="Budget ÷ conversions"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-[10px] font-extrabold tracking-widest text-gold">
            FUNNEL
          </p>
          <div className="mt-4 space-y-3">
            {[
              ['Exposed journeys', impressions, 100],
              [
                'Engaged',
                engagements,
                impressions ? (engagements / impressions) * 100 : 0,
              ],
              [
                'Converted',
                conversions,
                impressions ? (conversions / impressions) * 100 : 0,
              ],
            ].map(([label, value, width]) => (
              <div key={String(label)}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-bold">{Number(value).toLocaleString()}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-panel2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-violet to-gold"
                    style={{ width: `${Math.min(100, Number(width))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-[10px] font-extrabold tracking-widest text-gold">
            COMMERCE ATTRIBUTION
          </p>
          <p className="mt-3 text-3xl font-bold text-gold">{money(retail)}</p>
          <p className="text-xs text-muted">
            Session retail attributed to your campaigns (demo store + seed)
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Full data products (dashboards, API, enterprise insights) unlock in
            Phase 3 as consent-led event volume and partner demand grow.
          </p>
        </Card>
      </div>

      <div className="mt-8">
        <Table
          headers={[
            'Campaign',
            'Impressions',
            'Engagements',
            'Conversions',
            'Retail rev',
            'Budget',
          ]}
          rows={mine.map((c) => [
            c.title,
            c.impressions.toLocaleString(),
            String(c.engagements),
            String(c.conversions),
            money(c.revenuePence),
            money(c.budgetPence),
          ])}
        />
      </div>
    </div>
  );
}
