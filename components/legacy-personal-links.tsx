'use client';

import { useEffect } from 'react';

export function LegacyPersonalLinks() {
  useEffect(() => {
    const redirect = () => {
      if (
        window.location.hash === '#life' ||
        window.location.hash === '#footprints'
      ) {
        window.location.replace(`/moments/${window.location.hash}`);
      }
    };
    redirect();
    window.addEventListener('hashchange', redirect);
    return () => window.removeEventListener('hashchange', redirect);
  }, []);
  return null;
}
