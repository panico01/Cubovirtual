import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import HorizonteApp from './HorizonteApp'

const displayFont = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--h-display', display: 'swap' })
const sans = Inter({ subsets: ['latin'], variable: '--h-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'Horizonte Imóveis · Demo de CRM — Cubo Virtual',
  description: 'Demonstração interativa de CRM de vendas para imobiliárias, criada pela Cubo Virtual.',
  // Marca fictícia: não indexar como se fosse uma imobiliária real
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <div className={`${displayFont.variable} ${sans.variable}`}>
      <HorizonteApp />
    </div>
  )
}
