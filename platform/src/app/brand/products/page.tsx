'use client';

import { brands, products } from '@/lib/demo-data';
import { money } from '@/lib/format';
import { usePlatformStore } from '@/lib/store';
import { Card, PageHeader, Pill } from '@/components/ui';

export default function BrandProductsPage() {
  const { brandId } = usePlatformStore();
  const brand = brands.find((b) => b.id === brandId) ?? brands[0];
  const mine = products.filter((p) => p.brandId === brand.id);

  return (
    <div>
      <PageHeader
        eyebrow="CATALOGUE"
        title="Products & samples"
        copy="Prefer partner-funded, consignment or low-working-capital structures. Samples drive discovery; retail captures conversion."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {mine.map((p) => (
          <Card key={p.id} className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-panel2 text-3xl">
              {p.imageEmoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                <Pill tone={p.productType === 'sample' ? 'violet' : 'gold'}>
                  {p.productType}
                </Pill>
                <span className="text-xs text-muted">{p.sku}</span>
              </div>
              <h3 className="mt-2 font-bold">{p.name}</h3>
              <p className="mt-1 text-xs text-muted">{p.description}</p>
              <div className="mt-3 flex justify-between text-sm">
                <span className="font-extrabold text-gold">
                  {p.retailPricePence === 0
                    ? 'Free sample'
                    : money(p.retailPricePence)}
                </span>
                <span className="text-muted">Stock {p.stock}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
