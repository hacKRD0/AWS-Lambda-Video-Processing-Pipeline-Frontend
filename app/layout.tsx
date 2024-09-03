import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Header } from '@/components/Header';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
}
