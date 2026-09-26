import type { Metadata } from 'next'
import { Inter_Tight, Michroma } from 'next/font/google'
import VerticeApp from './VerticeApp'

const displayFont = Michroma({ subsets: ['latin'], weight: '400', variable: '--v-display', display: 'swap' })
const sans = Inter_Tight({ subsets: ['latin'], variable: '--v-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'Vértice Motors · Demo de showroom — Cubo Virtual',
  description: 'Demonstração interativa de showroom de seminovos com filtros, comparador, financiamento e test drive, criada pela Cubo Virtual.',
  // Marca fictícia: não indexar como se fosse uma loja real
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <div className={`${displayFont.variable} ${sans.variable}`}>
      <VerticeApp />
    </div>
  )
}
