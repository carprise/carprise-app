'use client';

import { drivers } from '@/lib/demo-data';
import { money } from '@/lib/format';
import { PageHeader, StatusPill, Table } from '@/components/ui';

export default function DriversPage() {
  return (
    <div>
      <PageHeader
        eyebrow="SUPPLY"
        title="Drivers"
        copy="Founding driver network for the Manchester pilot. Economic proposition: incremental income without more driving hours."
      />
      <Table
        headers={[
          'Driver',
          'City',
          'Rating',
          'Verified',
          'Onboarding',
          'Active campaigns',
          'Earnings',
        ]}
        rows={drivers.map((d) => [
          <div key={d.id}>
            <p className="font-bold">
              {d.firstName} {d.lastName}
            </p>
            <p className="text-xs text-muted">{d.email}</p>
          </div>,
          d.city,
          d.rating.toFixed(1),
          <StatusPill
            key={d.id + 'v'}
            status={d.verified ? 'verified' : 'pending'}
          />,
          <StatusPill
            key={d.id + 'o'}
            status={d.onboardingComplete ? 'completed' : 'pending'}
          />,
          String(d.activeCampaigns),
          money(d.earningsPence),
        ])}
      />
    </div>
  );
}
