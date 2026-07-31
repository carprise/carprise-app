import Link from 'next/link';
import { Button, Card } from '@/components/ui';

const surfaces = [
  {
    href: '/j/MCR01TAS',
    eyebrow: 'PASSENGER',
    title: 'In-journey experience',
    copy: 'Scan a vehicle QR to discover offers, claim samples and pay cashlessly during the ride.',
    cta: 'Open demo journey',
  },
  {
    href: '/admin',
    eyebrow: 'OPS',
    title: 'Pilot control centre',
    copy: 'Verify drivers, assign campaigns, approve evidence and track unit economics per vehicle.',
    cta: 'Enter ops console',
  },
  {
    href: '/brand',
    eyebrow: 'BRAND',
    title: 'Campaign portal',
    copy: 'Launch sampling and retail activations, monitor reach and optimise spend with journey data.',
    cta: 'Open brand portal',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(141,109,232,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(230,199,121,0.12),_transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.28em] text-gold">
              CARPRISE
            </p>
            <p className="text-xs text-muted">Commercializing Mobility</p>
          </div>
          <div className="flex gap-2">
            <Button href="/admin/login" variant="secondary">
              Ops login
            </Button>
            <Button href="/brand/login" variant="primary">
              Brand login
            </Button>
          </div>
        </header>

        <section className="mt-16 max-w-3xl">
          <p className="text-[11px] font-extrabold tracking-[0.22em] text-violet">
            UK PILOT · MANCHESTER
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-cream sm:text-6xl">
            The commercial layer for passenger journeys.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Carprise connects drivers, fleets, brands and passengers through
            in-vehicle hardware, digital interfaces, cashless commerce and
            campaign analytics — without competing for the ride fare itself.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/j/MCR01TAS">Try passenger demo</Button>
            <Button href="/admin" variant="secondary">
              Ops dashboard
            </Button>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {surfaces.map((s) => (
            <Card key={s.href} className="flex flex-col shadow-glow">
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-gold">
                {s.eyebrow}
              </p>
              <h2 className="mt-3 text-xl font-bold text-cream">{s.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {s.copy}
              </p>
              <Link
                href={s.href}
                className="mt-6 text-sm font-extrabold text-gold hover:underline"
              >
                {s.cta} →
              </Link>
            </Card>
          ))}
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Supply side', 'Driver app + fleet density'],
            ['Demand side', 'Brand campaigns & sampling'],
            ['Journey layer', 'Passenger offers & checkout'],
            ['Platform income', 'Fees, SaaS, data & licences'],
          ].map(([k, v]) => (
            <Card key={k}>
              <p className="text-sm font-bold text-cream">{k}</p>
              <p className="mt-1 text-xs text-muted">{v}</p>
            </Card>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-line bg-panel/80 p-8">
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-gold">
            DRIVER NETWORK
          </p>
          <h2 className="mt-2 text-2xl font-bold">Mobile driver app</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            The Expo driver app lives in the repo root. Drivers accept
            campaigns, upload evidence, manage vehicles and track earnings.
            Run <code className="text-gold">npm start</code> from the project
            root for the native experience; this web platform is the passenger,
            brand and ops surface.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted">
            <span className="rounded-full border border-line px-3 py-1">
              Auth · campaigns · evidence
            </span>
            <span className="rounded-full border border-line px-3 py-1">
              Vehicle verification
            </span>
            <span className="rounded-full border border-line px-3 py-1">
              Earnings & revenue share
            </span>
            <span className="rounded-full border border-line px-3 py-1">
              Supabase ready
            </span>
          </div>
        </section>

        <footer className="mt-16 border-t border-line pt-8 text-xs text-muted">
          <p>
            Carprise Ltd · United Kingdom · Confidential pilot materials ·
            Mission: Commercializing Mobility
          </p>
        </footer>
      </div>
    </div>
  );
}
