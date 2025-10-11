import type {Metadata} from 'next';
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

  // The config is now imported directly from a dedicated file.
  const missingConfig = Object.entries(firebaseConfig).filter(([key, value]) => !value);
  if (missingConfig.length > 0) {
    const missingKeys = missingConfig.map(([key]) => key).join(", ");
    // This error will now clearly indicate if the config file itself is missing values.
    throw new Error(`Missing values in Firebase config file (src/firebase/config.ts): ${missingKeys}`);
  }

  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider config={firebaseConfig as any}>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
