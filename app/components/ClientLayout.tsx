// components/ClientLayout.tsx
'use client';

import React from 'react';
import { useMousePosition } from './useMousePosition';
import { ThemeProvider } from '../theme-provider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { x, y } = useMousePosition();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <body
        className={`bg-white dark:bg-black text-gray-800 dark:text-neutral-200`}
        style={{ '--x': `${x}px`, '--y': `${y}px` } as React.CSSProperties}
      >
        {children}
      </body>
    </ThemeProvider>
  );
}