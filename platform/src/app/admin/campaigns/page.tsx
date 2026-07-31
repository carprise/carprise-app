'use client';

import { useState } from 'react';
import { assignments, campaigns } from '@/lib/demo-data';
import { money, shortDate } from '@/lib/format';
import { updateAssignmentStatus, usePlatformStore } from '@/lib/store';
import {
  Button,
  Card,
  PageHeader,
  StatusPill,
  Table,
} from '@/components/ui';

export default function CampaignsPage() {
  const store = usePlatformStore();
  const [notice, setNotice] = useState('');

  return (
    <div>
      <PageHeader
        eyebrow="DEMAND"
        title="Campaigns & assignments"
        copy="Coordinate brand activations with driver supply. Phase 1 focus: product margin, transaction commission and pilot campaign fees."
      />

      {notice ? (
        <div className="mb-4 rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-extrabold tracking-widest text-gold">
                  {c.brand}
                </p>
                <h3 className="mt-1 text-lg font-bold">{c.title}</h3>
              </div>
              <StatusPill status={c.status} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {c.description}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted">Type</dt>
                <dd className="font-semibold capitalize">{c.campaignType}</dd>
              </div>
              <div>
                <dt className="text-muted">Driver pay</dt>
                <dd className="font-semibold">{money(c.paymentPence)}</dd>
              </div>
              <div>
                <dt className="text-muted">Window</dt>
                <dd className="font-semibold">
                  {shortDate(c.startsOn)} – {shortDate(c.endsOn)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Budget</dt>
                <dd className="font-semibold">{money(c.budgetPence)}</dd>
              </div>
              <div>
                <dt className="text-muted">Impressions</dt>
                <dd className="font-semibold">
                  {c.impressions.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Conversions</dt>
                <dd className="font-semibold">{c.conversions}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <p className="mb-3 text-[10px] font-extrabold tracking-widest text-muted">
          DRIVER ASSIGNMENTS
        </p>
        <Table
          headers={[
            'Driver',
            'Campaign',
            'Status',
            'Progress',
            'Revenue share',
            'Actions',
          ]}
          rows={store.assignments.map((a) => {
            const camp = campaigns.find((c) => c.id === a.campaignId);
            return [
              a.driverName,
              camp?.title ?? a.campaignId,
              <StatusPill key={a.id + 's'} status={a.status} />,
              `${a.progress}%`,
              money(a.revenueSharePence),
              <div key={a.id + 'a'} className="flex flex-wrap gap-2">
                {a.status === 'invited' ? (
                  <>
                    <Button
                      className="!px-2 !py-1 !text-xs"
                      onClick={() => {
                        updateAssignmentStatus(a.id, 'accepted');
                        setNotice(`Assignment accepted for ${a.driverName}`);
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      className="!px-2 !py-1 !text-xs"
                      onClick={() => {
                        updateAssignmentStatus(a.id, 'declined');
                        setNotice(`Assignment declined for ${a.driverName}`);
                      }}
                    >
                      Decline
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    className="!px-2 !py-1 !text-xs"
                    onClick={() => {
                      updateAssignmentStatus(a.id, 'active');
                      setNotice(`${a.driverName} marked active`);
                    }}
                  >
                    Set active
                  </Button>
                )}
              </div>,
            ];
          })}
        />
      </div>

      <p className="mt-4 text-xs text-muted">
        Seed assignments: {assignments.length} loaded · session mutations stay
        in browser demo store until Supabase is wired for writes.
      </p>
    </div>
  );
}
