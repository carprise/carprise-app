'use client';

import { unitEconomics, vehicles } from '@/lib/demo-data';
import { money } from '@/lib/format';
import { Card, PageHeader, Table } from '@/components/ui';

export default function EconomicsPage() {
  const cases = [
    { name: 'Low', data: unitEconomics.low },
    { name: 'Base', data: unitEconomics.base },
    { name: 'High', data: unitEconomics.high },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="PLANNING"
        title="Illustrative unit economics"
        copy="Per active vehicle monthly model from the business plan. Replace with pilot telemetry before external financial submission."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {cases.map(({ name, data }) => (
          <Card
            key={name}
            className={name === 'Base' ? 'border-gold/40 shadow-glow' : ''}
          >
            <p className="text-[10px] font-extrabold tracking-widest text-gold">
              {name.toUpperCase()} CASE
            </p>
            <p className="mt-3 text-3xl font-bold text-cream">
              {money(data.contribution * 100)}
            </p>
            <p className="text-xs text-muted">
              contribution before central overhead
            </p>
            <dl className="mt-5 space-y-2 text-sm">
              <Row label="Journeys exposed" value={String(data.journeys)} />
              <Row
                label="Engagement rate"
                value={`${data.engagementRate}%`}
              />
              <Row label="Commercial actions" value={String(data.actions)} />
              <Row
                label="Net revenue / action"
                value={`£${data.netPerAction.toFixed(2)}`}
              />
              <Row
                label="Txn / engagement rev"
                value={money(data.transactionRevenue * 100)}
              />
              <Row
                label="Brand / sponsorship"
                value={money(data.brandRevenue * 100)}
              />
              <Row
                label="Vehicle subscription"
                value={money(data.subscription * 100)}
              />
              <Row label="Gross platform" value={money(data.gross * 100)} />
              <Row
                label="Variable cost"
                value={money(data.variableCost * 100)}
              />
            </dl>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <p className="mb-3 text-[10px] font-extrabold tracking-widest text-muted">
          LIVE VEHICLE CONTRIBUTION (PILOT SNAPSHOT)
        </p>
        <Table
          headers={[
            'Vehicle',
            'Journeys',
            'Revenue',
            'vs base case £105',
            'Hardware',
          ]}
          rows={vehicles
            .filter((v) => v.active)
            .map((v) => {
              const rev = v.revenueThisMonthPence / 100;
              const vs = rev - 105;
              return [
                `${v.registration} · ${v.driverName}`,
                String(v.journeysThisMonth),
                money(v.revenueThisMonthPence),
                <span
                  key={v.id}
                  className={vs >= 0 ? 'text-success' : 'text-warning'}
                >
                  {vs >= 0 ? '+' : ''}
                  {money(Math.round(vs * 100))}
                </span>,
                v.hardwareStatus,
              ];
            })}
        />
      </div>

      <Card className="mt-8">
        <p className="font-bold">Commercial objective</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Increase total revenue per vehicle while preserving participant
          incentives. Drivers and fleets must be visibly better off; brands need
          measurable outcomes; passengers must accept or value the experience.
        </p>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line/60 py-1.5">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
