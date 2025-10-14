import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { firebaseConfig } from '@/firebase/config';

export const metadata: Metadata = {
  title: 'Cloudverse Store',
  description: 'The official store for the Cloudverse Minecraft server.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const missingConfig = Object.entries(firebaseConfig).filter(([_, value]) => !value);
  if (missingConfig.length > 0) {
    const missingKeys = missingConfig.map(([key]) => key).join(', ');
    // Allow missing measurementId only in dev mode
    if (!(missingKeys.includes('measurementId') && missingConfig.length === 1)) {
      throw new Error(`Missing Firebase config values for: ${missingKeys}`);
    }
  }

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider config={firebaseConfig}>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
