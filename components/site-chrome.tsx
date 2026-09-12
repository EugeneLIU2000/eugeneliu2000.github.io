/* eslint-disable nextjs/no-html-link-for-pages -- Native navigation works on the static host without a client router. */
import { ArrowUpRight, Mail } from 'lucide-react';

export function SiteHeader({ personal = false }: { personal?: boolean }) {
  return (
    <header className="site-header">
      <nav aria-label="Main navigation">
        <a href={personal ? '/' : '#about'}>
          {personal ? 'Home' : 'About'}
        </a>
        <a href={personal ? '/#research' : '#research'}>
          Publications
        </a>
        <a href={personal ? '/#journey' : '#journey'}>
          CV
        </a>
        <a
          href="/moments/"
          aria-current={personal ? 'page' : undefined}
        >
          Moments
        </a>
      </nav>
      <a
        className="header-contact"
        href="mailto:yingjian@lorentz.leidenuniv.nl"
      >
        Email <ArrowUpRight size={16} />
      </a>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer section-width">
      <div>
        <a className="footer-name" href="/#about">
          Yingjian Liu
        </a>
        <p>Theoretical physics · Leiden University</p>
      </div>
      <a className="text-link" href="mailto:yingjian@lorentz.leidenuniv.nl">
        <Mail size={17} /> Email <ArrowUpRight size={16} />
      </a>
      <div className="copyright">
        <p>© 2026 Yingjian Liu</p>
        <p>Last updated September 2026</p>
      </div>
    </footer>
  );
}
