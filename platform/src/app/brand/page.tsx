'use client';

import { brands, campaigns, getCampaignsForBrand } from '@/lib/demo-data';
import { money, pct } from '@/lib/format';
import { usePlatformStore } from '@/lib/store';
import { Card, Metric, PageHeader, StatusPill } from '@/components/ui';

export default function BrandHome() {
  const { brandId } = usePlatformStore();
  const brand = brands.find((b) => b.id === brandId) ?? brands[0];
  const mine = getCampaignsForBrand(brand.id);
  const impressions = mine.reduce((s, c) => s + c.impressions, 0);
  const engagements = mine.reduce((s, c) => s + c.engagements, 0);
  const conversions = mine.reduce((s, c) => s + c.conversions, 0);
  const spend = mine.reduce((s, c) => s + c.budgetPence, 0);
  const engRate = impressions ? (engagements / impressions) * 100 : 0;

  return (
    <div>
      <PageHeader
        eyebrow={brand.category.toUpperCase()}
        title={brand.name}
        copy="Contextual reach, product trial and measurable journey commerce — without buying broad OOH alone."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Active campaigns" value={String(mine.length)} />
        <Metric
          label="Impressions"
          value={impressions.toLocaleString()}
          hint="Passenger journeys exposed"
        />
        <Metric
          label="Engagement rate"
          value={pct(engRate)}
          hint={`${engagements} engagements`}
        />
        <Metric
          label="Conversions"
          value={String(conversions)}
          hint={`Budget ${money(spend)}`}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {mine.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">{c.title}</h3>
              <StatusPill status={c.status} />
            </div>
            <p className="mt-2 text-sm text-muted">{c.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-panel2 p-3">
                <p className="text-lg font-bold">
                  {c.impressions.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted">Impressions</p>
              </div>
              <div className="rounded-xl bg-panel2 p-3">
                <p className="text-lg font-bold">{c.engagements}</p>
                <p className="text-[10px] text-muted">Engagements</p>
              </div>
              <div className="rounded-xl bg-panel2 p-3">
                <p className="text-lg font-bold">{c.conversions}</p>
                <p className="text-[10px] text-muted">Conversions</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <p className="text-[10px] font-extrabold tracking-widest text-gold">
          PLATFORM CONTEXT
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Across all pilot brands there are {campaigns.length} campaigns live or
          in pilot. Carprise sequences monetisation from simple measurable
          activations first, then self-serve SaaS and analytics as density grows.
        </p>
      </Card>
    </div>
  );
}
