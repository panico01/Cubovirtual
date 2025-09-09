'use client';

import { Poppins } from 'next/font/google'
import './globals.css'
import { useMousePosition } from './components/useMousePosition'
import { ThemeProvider } from './theme-provider'
import React from 'react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { x, y } = useMousePosition()

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${poppins.className} bg-white dark:bg-black text-gray-800 dark:text-neutral-200`}
        style={{ '--x': `${x}px`, '--y': `${y}px` } as React.CSSProperties}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}