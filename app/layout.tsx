// app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import React from 'react';
import Script from 'next/script';
import type { Metadata } from 'next';

import ClientLayout from './components/ClientLayout'; // O caminho de importação foi ajustado

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cubovirtual.com.br"),
  title: "Cubo Virtual — Produtos digitais que movem negócios",
  description: "Sites, sistemas, aplicativos e marketing digital desenvolvidos para transformar presença online em resultado.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Cubo Virtual" },
  twitter: { card: "summary_large_image" },
  verification: {
    google: "m4h1GrjDlRyfhDfnNOporfqbjzGx2F8aoQCEThklQ8c",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Cubo Virtual",
  url: "https://cubovirtual.com.br/",
  image: "https://cubovirtual.com.br/opengraph-image.png",
  telephone: "+55-17-99119-1582",
  email: "contato@cubovirtual.com.br",
  address: { "@type": "PostalAddress", addressLocality: "Sumaré", addressRegion: "SP", addressCountry: "BR" },
  areaServed: { "@type": "Country", name: "Brasil" },
  priceRange: "R$ 29,90 – R$ 149,90/mês",
  knowsAbout: ["Criação de sites", "Desenvolvimento de sistemas", "Aplicativos", "Tráfego pago", "Identidade visual"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Scripts do Google Analytics aqui */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17544538660"
          strategy="lazyOnload"
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
      <body className={jakarta.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
