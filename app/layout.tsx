import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://yingjian-liu.fit-flame-7977.chatgpt.site'),
  title: 'Yingjian Liu — Quantum Physics',
  description:
    'Yingjian Liu is a PhD candidate in theoretical physics at Leiden University, researching quantum algorithms and quantum simulation. Research, academic updates, and life beyond physics.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Yingjian Liu — Quantum Physics',
    description:
      'Quantum algorithms, quantum simulation, and an academic journey across Europe.',
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
