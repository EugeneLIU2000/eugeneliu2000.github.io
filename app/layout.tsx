import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://eugeneliu2000.github.io'),
  alternates: { canonical: '/' },
  title: 'Yingjian Liu — Quantum Physics',
  description:
    'Yingjian Liu is a PhD candidate in theoretical physics at Leiden University, researching quantum algorithms and quantum simulation. Publications, academic updates, education, and photographs.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    url: '/',
    title: 'Yingjian Liu — Quantum Physics',
    description:
      'Quantum algorithms and quantum simulation. PhD candidate at Leiden University.',
    type: 'website',
    locale: 'en_GB',
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
