import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import type { FirebaseOptions } from 'firebase/app';

export const metadata: Metadata = {
  title: 'Cloudverse Store',
  description: 'The official store for the Cloudverse Minecraft server.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const missingConfig = Object.entries(firebaseConfig).filter(([key, value]) => !value && key !== 'measurementId');
  if (missingConfig.length > 0) {
    const missingKeys = missingConfig.map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`).join(", ");
    throw new Error(`Missing Firebase config. Please set the following environment variables: ${missingKeys}`);
  }

  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
