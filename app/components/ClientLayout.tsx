// components/ClientLayout.tsx
'use client';

import React from 'react';
import { ThemeProvider } from '../theme-provider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-canvas text-ink">
        {children}
      </div>
    </ThemeProvider>
  );
}
