// app/layout.tsx
import { Poppins } from 'next/font/google';
import './globals.css';
import React from 'react';
import Script from 'next/script';
import type { Metadata } from 'next';
import ClientLayout from './components/ClientLayout'; // O caminho de importação foi ajustado

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "CUBOVIRTUAL - Agência Digital",
  description: "Agência digital completa: criação de sites, aplicativos e soluções personalizadas.",
  verification: {
    google: "m4h1GrjDlRyfhDfnNOporfqbjzGx2F8aoQCEThklQ8c",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Scripts do Google Analytics aqui */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17544538660"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17544538660');
          `}
        </Script>
        <Script id="google-ads-conversion-func" strategy="afterInteractive">
          {`
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-17544538660/GBzCCI3nu5cbEKTU8a1B',
                  'event_callback': callback
              });
              return false;
            }
          `}
        </Script>
      </head>
      <body className={poppins.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}