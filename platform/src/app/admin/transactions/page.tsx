'use client';

import { fleets, products } from '@/lib/demo-data';
import { money } from '@/lib/format';
import { usePlatformStore } from '@/lib/store';
import { Card, Metric, PageHeader, StatusPill, Table } from '@/components/ui';

export default function TransactionsPage() {
  const { transactions } = usePlatformStore();
  const gross = transactions.reduce((s, t) => s + t.amountPence, 0);
  const platform = transactions.reduce((s, t) => s + t.platformFeePence, 0);
  const driverShare = transactions.reduce((s, t) => s + t.driverSharePence, 0);

  return (
    <div>
      <PageHeader
        eyebrow="COMMERCE"
        title="Transactions & inventory"
        copy="Cashless purchases, samples and engagement economics flowing through connected vehicles."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Gross retail" value={money(gross)} />
        <Metric label="Platform fees" value={money(platform)} />
        <Metric label="Driver share" value={money(driverShare)} />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-[10px] font-extrabold tracking-widest text-muted">
          LEDGER
        </p>
        <Table
          headers={[
            'When',
            'Product',
            'Type',
            'Amount',
            'Platform',
            'Driver',
            'City',
          ]}
          rows={transactions.map((t) => [
            new Date(t.createdAt).toLocaleString('en-GB'),
            t.productName,
            <StatusPill key={t.id} status={t.type} />,
            money(t.amountPence),
            money(t.platformFeePence),
            money(t.driverSharePence),
            t.city,
          ])}
        />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[10px] font-extrabold tracking-widest text-muted">
            PRODUCT STOCK (PILOT)
          </p>
          <Table
            headers={['Product', 'SKU', 'Type', 'Stock', 'Price']}
            rows={products.map((p) => [
              p.name,
              p.sku,
              p.productType,
              String(p.stock),
              p.retailPricePence === 0 ? 'Sample' : money(p.retailPricePence),
            ])}
          />
        </div>
        <div>
          <p className="mb-3 text-[10px] font-extrabold tracking-widest text-muted">
            FLEET SUBSCRIPTIONS
          </p>
          <div className="space-y-3">
            {fleets.map((f) => (
              <Card key={f.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{f.name}</p>
                    <p className="text-xs text-muted">
                      {f.city} · {f.vehicles} vehicles · {f.subscriptionTier}
                    </p>
                  </div>
                  <p className="font-extrabold text-gold">
                    {money(f.monthlyFeePence)}
                    <span className="text-xs font-normal text-muted">/veh</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
