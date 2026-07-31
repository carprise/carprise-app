'use client';

import {
  campaigns,
  drivers,
  fleets,
  metrics,
  vehicles,
} from '@/lib/demo-data';
import { money, pct } from '@/lib/format';
import { usePlatformStore } from '@/lib/store';
import { Card, Metric, PageHeader, StatusPill, Table } from '@/components/ui';

export default function AdminHome() {
  const { transactions, evidence } = usePlatformStore();
  const pendingEvidence = evidence.filter((e) => e.reviewStatus === 'pending');
  const pendingVehicles = vehicles.filter(
    (v) => v.verificationStatus === 'pending'
  );

  return (
    <div>
      <PageHeader
        eyebrow="OPERATIONS"
        title="Manchester pilot overview"
        copy="Track vehicle density, commercial activity and ops queue for the founding fleet."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Active vehicles"
          value={String(metrics.activeVehicles)}
          hint={`${vehicles.length} registered`}
        />
        <Metric
          label="Journeys exposed"
          value={metrics.journeysExposed.toLocaleString()}
          hint="This month"
        />
        <Metric
          label="Engagement rate"
          value={pct(metrics.engagementRate)}
          hint="Base-case planning target 15%"
        />
        <Metric
          label="Gross platform revenue"
          value={money(metrics.grossRevenuePence)}
          hint={`Contribution ${money(metrics.contributionPence)}`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-[10px] font-extrabold tracking-widest text-gold">
            LIVE CAMPAIGNS
          </p>
          <div className="mt-4 space-y-3">
            {campaigns
              .filter((c) => ['live', 'pilot', 'active'].includes(c.status))
              .map((c) => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel2 px-4 py-3"
                >
                  <div>
                    <p className="font-bold">{c.brand}</p>
                    <p className="text-sm text-muted">{c.title}</p>
                  </div>
                  <div className="text-right">
                    <StatusPill status={c.status} />
                    <p className="mt-1 text-xs text-muted">
                      {c.engagements} eng · {money(c.revenuePence)} retail
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card>
          <p className="text-[10px] font-extrabold tracking-widest text-gold">
            OPS QUEUE
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">Evidence to review</span>
              <span className="font-bold text-warning">
                {pendingEvidence.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Vehicles pending verify</span>
              <span className="font-bold text-warning">
                {pendingVehicles.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Drivers onboarded</span>
              <span className="font-bold">
                {drivers.filter((d) => d.onboardingComplete).length}/
                {drivers.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Fleet partners</span>
              <span className="font-bold">{fleets.length}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Commerce events (session)</span>
              <span className="font-bold">{transactions.length}</span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-[10px] font-extrabold tracking-widest text-muted">
          RECENT COMMERCE
        </p>
        <Table
          headers={['Time', 'Product', 'Type', 'Amount', 'Driver share', 'City']}
          rows={transactions.slice(0, 6).map((t) => [
            new Date(t.createdAt).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
            t.productName,
            <StatusPill key={t.id + 't'} status={t.type} />,
            money(t.amountPence),
            money(t.driverSharePence),
            t.city,
          ])}
        />
      </div>
    </div>
  );
}
