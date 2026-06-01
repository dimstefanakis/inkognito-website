import Link from 'next/link';
import { Apple, ArrowRight, EyeOff } from 'lucide-react';
import { LiveMapHero } from '@/components/LiveMapHero';

const downloadLink = 'https://inkognito.app.link/?~channel=website&~feature=landing';

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link className="brand-lockup" href="/" aria-label="Leaks home">
          <span>Leaks.</span>
        </Link>

        <div className="nav-links" aria-label="Site links">
          <a href="/privacy-policy">Privacy</a>
          <a href="/terms-of-use">Terms</a>
          <a href="/support">Support</a>
        </div>
      </nav>

      <section className="hero-stage" aria-label="Leaks app landing page">
        <div className="trust-row" aria-label="App highlights">
          <span>
            <Apple size={17} fill="currentColor" strokeWidth={2.1} aria-hidden="true" />
            #2 on app store
          </span>
          <span>
            <EyeOff size={17} strokeWidth={2.3} aria-hidden="true" />
            100k+ secrets shared
          </span>
        </div>

        <div className="hero-copy">
          <h1>
            <span className="hero-title-line">Your city&apos;s</span>
            <span className="hero-title-line">unfiltered truth</span>
          </h1>

          <p className="hero-subtitle">
            The things people won&apos;t say out loud, revealed.
          </p>

          <div className="hero-actions" aria-label="Download links">
            <a className="download-button" href={downloadLink}>
              Download the app
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="map-composition" aria-label="Interactive map preview">
          <LiveMapHero />
        </div>
      </section>
    </main>
  );
}
