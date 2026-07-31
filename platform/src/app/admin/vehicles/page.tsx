'use client';

import Link from 'next/link';
import { vehicles } from '@/lib/demo-data';
import { money } from '@/lib/format';
import { Button, PageHeader, StatusPill, Table } from '@/components/ui';

export default function VehiclesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="SUPPLY"
        title="Vehicles"
        copy="Each vehicle is a commerce node. Journey codes power passenger QR access; hardware status tracks device readiness."
      />
      <Table
        headers={[
          'Vehicle',
          'Driver',
          'Journey code',
          'Verification',
          'Hardware',
          'Journeys',
          'Revenue / mo',
          'Passenger',
        ]}
        rows={vehicles.map((v) => [
          <div key={v.id}>
            <p className="font-bold">
              {v.year} {v.make} {v.model}
            </p>
            <p className="text-xs text-muted">
              {v.registration} · {v.colour}
            </p>
          </div>,
          v.driverName,
          <code key={v.id + 'c'} className="text-gold">
            {v.journeyCode}
          </code>,
          <StatusPill key={v.id + 'vs'} status={v.verificationStatus} />,
          <StatusPill key={v.id + 'h'} status={v.hardwareStatus} />,
          String(v.journeysThisMonth),
          money(v.revenueThisMonthPence),
          v.active ? (
            <Button
              key={v.id + 'j'}
              href={`/j/${v.journeyCode}`}
              variant="secondary"
              className="!px-3 !py-1.5 !text-xs"
            >
              Open journey
            </Button>
          ) : (
            <span key={v.id + 'na'} className="text-xs text-muted">
              Inactive
            </span>
          ),
        ])}
      />
      <p className="mt-4 text-xs text-muted">
        Passenger deep links use pattern{' '}
        <Link href="/j/MCR01TAS" className="text-gold">
          /j/[journeyCode]
        </Link>
        . Print as QR stickers for each verified vehicle.
      </p>
    </div>
  );
}
