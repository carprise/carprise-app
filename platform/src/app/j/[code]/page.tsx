'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  getLiveProductsForVehicle,
  getVehicleByCode,
  products as allProducts,
  campaigns,
} from '@/lib/demo-data';
import { money } from '@/lib/format';
import {
  addToCart,
  claimSample,
  clearCart,
  completeCheckout,
  usePlatformStore,
} from '@/lib/store';
import { Button, Card, Pill } from '@/components/ui';

export default function JourneyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const vehicle = getVehicleByCode(code);
  const store = usePlatformStore();
  const [message, setMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'browse' | 'checkout' | 'done'>('browse');
  const [email, setEmail] = useState('');

  const liveProducts = useMemo(
    () => (vehicle ? getLiveProductsForVehicle(vehicle.id) : []),
    [vehicle]
  );

  const cartLines = store.cart
    .map((c) => {
      const product = allProducts.find((p) => p.id === c.productId);
      if (!product) return null;
      return { ...product, qty: c.qty };
    })
    .filter(Boolean) as (typeof allProducts[0] & { qty: number })[];

  const cartTotal = cartLines.reduce(
    (sum, line) => sum + line.retailPricePence * line.qty,
    0
  );

  if (!vehicle) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6">
        <Card className="max-w-md text-center">
          <p className="text-[11px] font-extrabold tracking-widest text-gold">
            CARPRISE JOURNEY
          </p>
          <h1 className="mt-3 text-2xl font-bold">Vehicle not found</h1>
          <p className="mt-3 text-sm text-muted">
            Code <span className="text-cream">{code}</span> is not active. Try
            demo code <strong className="text-gold">MCR01TAS</strong>.
          </p>
          <Button href="/j/MCR01TAS" className="mt-6 w-full">
            Open demo vehicle
          </Button>
        </Card>
      </div>
    );
  }

  const onSample = (productId: string, name: string) => {
    const ok = claimSample(productId);
    setMessage(
      ok
        ? `${name} claimed — ask your driver for the sample from the in-vehicle kit.`
        : 'You have already claimed this sample on this journey.'
    );
  };

  const onBuy = (productId: string) => {
    addToCart(productId);
    setMessage('Added to your journey bag.');
  };

  const pay = () => {
    const sampleItems = store.claimedSamples
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => ({
        productId: p!.id,
        name: p!.name,
        amountPence: 0,
        campaignId: p!.campaignId,
        type: 'sample' as const,
      }));

    const purchaseItems = cartLines.map((line) => ({
      productId: line.id,
      name: line.name,
      amountPence: line.retailPricePence * line.qty,
      campaignId: line.campaignId,
      type: 'purchase' as const,
    }));

    completeCheckout({
      vehicleId: vehicle.id,
      city: vehicle.city,
      items: [...sampleItems, ...purchaseItems],
    });
    clearCart();
    setStep('done');
    setMessage(null);
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-ink px-4 py-10">
        <div className="mx-auto max-w-md">
          <Card className="text-center shadow-glow">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-3xl">
              ✓
            </div>
            <h1 className="mt-5 text-2xl font-bold">Enjoy the rest of your journey</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {email
                ? `A receipt will be sent to ${email}. `
                : ''}
              Your driver earns a share of this journey commerce. Thanks for
              travelling with Carprise.
            </p>
            <Button
              className="mt-6 w-full"
              onClick={() => {
                setStep('browse');
                setMessage(null);
              }}
            >
              Browse more offers
            </Button>
            <Link href="/" className="mt-4 block text-sm text-gold">
              Back to Carprise home
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink pb-28">
      <div className="bg-gradient-to-b from-violet/20 to-ink px-4 pb-8 pt-10">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold tracking-[0.22em] text-gold">
              CARPRISE · LIVE JOURNEY
            </p>
            <Pill tone="success">Online</Pill>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Welcome aboard.
          </h1>
          <p className="mt-2 text-sm text-muted">
            {vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.city}
            <br />
            Driven by {vehicle.driverName} · Code {vehicle.journeyCode}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 px-4">
        {message ? (
          <div className="rounded-2xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-cream">
            {message}
          </div>
        ) : null}

        <Card>
          <p className="text-[10px] font-extrabold tracking-widest text-gold">
            WHY THIS EXISTS
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Relevant offers and samples for this journey. No fare changes —
            everything here is optional and consent-led.
          </p>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-lg font-bold">Available now</h2>
          <span className="text-xs text-muted">
            {liveProducts.length} items
          </span>
        </div>

        {liveProducts.map((product) => {
          const campaign = campaigns.find((c) => c.id === product.campaignId);
          const claimed = store.claimedSamples.includes(product.id);
          return (
            <Card key={product.id} className="!p-4">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-panel2 text-3xl">
                  {product.imageEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill
                      tone={
                        product.productType === 'sample' ? 'violet' : 'gold'
                      }
                    >
                      {product.productType}
                    </Pill>
                    {campaign ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        {campaign.brand}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-2 font-bold text-cream">{product.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-extrabold text-gold">
                      {product.retailPricePence === 0
                        ? 'Free sample'
                        : money(product.retailPricePence)}
                    </p>
                    {product.productType === 'sample' ? (
                      <Button
                        variant={claimed ? 'ghost' : 'secondary'}
                        className="!py-2 !text-xs"
                        disabled={claimed}
                        onClick={() => onSample(product.id, product.name)}
                      >
                        {claimed ? 'Claimed' : 'Claim sample'}
                      </Button>
                    ) : (
                      <Button
                        className="!py-2 !text-xs"
                        onClick={() => onBuy(product.id)}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {step === 'checkout' ? (
          <Card className="space-y-4">
            <h2 className="text-lg font-bold">Cashless checkout</h2>
            {cartLines.length === 0 && store.claimedSamples.length === 0 ? (
              <p className="text-sm text-muted">Your bag is empty.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {store.claimedSamples.map((id) => {
                  const p = allProducts.find((x) => x.id === id);
                  return p ? (
                    <li key={id} className="flex justify-between text-muted">
                      <span>{p.name} (sample)</span>
                      <span>Free</span>
                    </li>
                  ) : null;
                })}
                {cartLines.map((line) => (
                  <li key={line.id} className="flex justify-between">
                    <span>
                      {line.name} × {line.qty}
                    </span>
                    <span className="font-bold">
                      {money(line.retailPricePence * line.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between border-t border-line pt-3 text-sm">
              <span className="text-muted">Total</span>
              <span className="text-xl font-bold text-gold">
                {money(cartTotal)}
              </span>
            </div>
            <label className="block text-xs font-bold text-muted">
              Email for receipt (optional)
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-panel2 px-3 py-3 text-sm text-cream outline-none focus:border-gold/50"
                placeholder="you@email.com"
                type="email"
              />
            </label>
            <p className="text-xs text-muted">
              Demo mode — payment is simulated. Driver share and platform fee
              are recorded for pilot analytics.
            </p>
            <Button
              className="w-full"
              onClick={pay}
              disabled={cartLines.length === 0 && store.claimedSamples.length === 0}
            >
              {cartTotal === 0 ? 'Confirm samples' : `Pay ${money(cartTotal)}`}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep('browse')}
            >
              Keep browsing
            </Button>
          </Card>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-line bg-ink/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-extrabold tracking-wider text-muted">
              JOURNEY BAG
            </p>
            <p className="text-sm font-bold">
              {store.cart.reduce((s, c) => s + c.qty, 0)} items ·{' '}
              {store.claimedSamples.length} samples · {money(cartTotal)}
            </p>
          </div>
          <Button
            onClick={() => setStep('checkout')}
            className="!px-5"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
