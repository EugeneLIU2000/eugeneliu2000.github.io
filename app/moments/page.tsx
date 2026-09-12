import type { Metadata } from 'next';
import { ArrowDown } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { PhotoJournal, type JournalPhoto } from '@/components/photo-journal';
import { Footprints } from '@/components/footprints';
import photos from '@/content/photos.json';

export const metadata: Metadata = {
  title: 'Moments — Yingjian Liu',
  description: 'Personal photographs and places visited by Yingjian Liu.',
  alternates: { canonical: '/moments/' },
  openGraph: {
    title: 'Moments — Yingjian Liu',
    description: 'Personal photographs and places visited by Yingjian Liu.',
    url: '/moments/',
    type: 'website',
  },
};

export default function MomentsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader personal />
      <main id="main" className="moments-page">
        <section
          className="life section-width"
          id="life"
          aria-labelledby="moments-title"
        >
          <div className="moments-heading">
            <h1 id="moments-title">Moments</h1>
            <a className="text-link" href="#footprints">
              Footprints <ArrowDown size={15} />
            </a>
          </div>
          <PhotoJournal photos={photos as JournalPhoto[]} />
        </section>
        <section
          className="footprints section-width"
          id="footprints"
          aria-labelledby="footprints-title"
        >
          <div className="section-heading">
            <h2 id="footprints-title">Footprints</h2>
          </div>
          <Footprints />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
