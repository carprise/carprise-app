'use client';

import { approveEvidence, rejectEvidence, usePlatformStore } from '@/lib/store';
import { Button, PageHeader, StatusPill, Table } from '@/components/ui';

export default function EvidencePage() {
  const { evidence } = usePlatformStore();

  return (
    <div>
      <PageHeader
        eyebrow="COMPLIANCE"
        title="Evidence review"
        copy="Approve installation and in-journey proof from drivers before releasing campaign payments."
      />
      <Table
        headers={[
          'Driver',
          'Campaign',
          'Type',
          'Submitted',
          'Status',
          'Actions',
        ]}
        rows={evidence.map((e) => [
          e.driverName,
          e.campaignTitle,
          e.evidenceType.replaceAll('_', ' '),
          new Date(e.createdAt).toLocaleString('en-GB'),
          <StatusPill key={e.id + 's'} status={e.reviewStatus} />,
          e.reviewStatus === 'pending' ? (
            <div key={e.id + 'a'} className="flex gap-2">
              <Button
                className="!px-2 !py-1 !text-xs"
                onClick={() => approveEvidence(e.id)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                className="!px-2 !py-1 !text-xs"
                onClick={() => rejectEvidence(e.id)}
              >
                Reject
              </Button>
            </div>
          ) : (
            <span key={e.id + 'done'} className="text-xs text-muted">
              Reviewed
            </span>
          ),
        ])}
      />
    </div>
  );
}
