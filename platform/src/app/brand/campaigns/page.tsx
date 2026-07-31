'use client';

import { useState } from 'react';
import { brands, getCampaignsForBrand } from '@/lib/demo-data';
import { money, shortDate } from '@/lib/format';
import { usePlatformStore } from '@/lib/store';
import { Button, Card, PageHeader, StatusPill } from '@/components/ui';

export default function BrandCampaignsPage() {
  const { brandId } = usePlatformStore();
  const brand = brands.find((b) => b.id === brandId) ?? brands[0];
  const mine = getCampaignsForBrand(brand.id);
  const [draft, setDraft] = useState({
    title: '',
    type: 'sampling',
    budget: '5000',
  });
  const [created, setCreated] = useState<string[]>([]);

  return (
    <div>
      <PageHeader
        eyebrow="CAMPAIGNS"
        title="Activations"
        copy="Campaign minimum plus variable performance component. Pilot packages favour measurable sampling and retail."
        action={
          <Button href="/j/MCR01TAS" variant="secondary">
            Preview passenger view
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {mine.map((c) => (
          <Card key={c.id}>
            <div className="flex justify-between gap-2">
              <div>
                <StatusPill status={c.status} />
                <h3 className="mt-3 text-xl font-bold">{c.title}</h3>
              </div>
              <p className="text-right text-sm font-extrabold text-gold">
                {money(c.budgetPence)}
                <span className="block text-[10px] font-normal text-muted">
                  budget
                </span>
              </p>
            </div>
            <p className="mt-2 text-sm text-muted">{c.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted">Type</dt>
                <dd className="font-semibold capitalize">{c.campaignType}</dd>
              </div>
              <div>
                <dt className="text-muted">Area</dt>
                <dd className="font-semibold">{c.area}</dd>
              </div>
              <div>
                <dt className="text-muted">Starts</dt>
                <dd className="font-semibold">{shortDate(c.startsOn)}</dd>
              </div>
              <div>
                <dt className="text-muted">Ends</dt>
                <dd className="font-semibold">{shortDate(c.endsOn)}</dd>
              </div>
              <div>
                <dt className="text-muted">Driver fee / vehicle</dt>
                <dd className="font-semibold">{money(c.paymentPence)}</dd>
              </div>
              <div>
                <dt className="text-muted">Retail revenue</dt>
                <dd className="font-semibold">{money(c.revenuePence)}</dd>
              </div>
            </dl>
          </Card>
        ))}

        {created.map((title) => (
          <Card key={title} className="border-violet/40">
            <StatusPill status="draft" />
            <h3 className="mt-3 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted">
              Draft saved in demo session. Ops will review before vehicle
              assignment.
            </p>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <p className="text-[10px] font-extrabold tracking-widest text-gold">
          REQUEST NEW PILOT PACKAGE
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-bold text-muted">
            Campaign title
            <input
              className="mt-1 w-full rounded-xl border border-line bg-panel2 px-3 py-3 text-sm text-cream outline-none"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Spring sampling burst"
            />
          </label>
          <label className="text-xs font-bold text-muted">
            Type
            <select
              className="mt-1 w-full rounded-xl border border-line bg-panel2 px-3 py-3 text-sm text-cream outline-none"
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value })}
            >
              <option value="awareness">Awareness</option>
              <option value="sampling">Sampling</option>
              <option value="retail">Retail</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label className="text-xs font-bold text-muted">
            Budget (£)
            <input
              className="mt-1 w-full rounded-xl border border-line bg-panel2 px-3 py-3 text-sm text-cream outline-none"
              value={draft.budget}
              onChange={(e) => setDraft({ ...draft, budget: e.target.value })}
            />
          </label>
        </div>
        <Button
          className="mt-4"
          onClick={() => {
            if (!draft.title.trim()) return;
            setCreated((c) => [...c, draft.title.trim()]);
            setDraft({ title: '', type: 'sampling', budget: '5000' });
          }}
        >
          Submit draft request
        </Button>
      </Card>
    </div>
  );
}
