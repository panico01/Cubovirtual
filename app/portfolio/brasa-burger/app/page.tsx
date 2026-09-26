import type { Metadata } from 'next'
import { Anton, Manrope } from 'next/font/google'
import BrasaApp from './BrasaApp'

const displayFont = Anton({ subsets: ['latin'], weight: '400', variable: '--b-display', display: 'swap' })
const sans = Manrope({ subsets: ['latin'], variable: '--b-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'Brasa Burger Co. · Demo de cardápio digital — Cubo Virtual',
  description: 'Demonstração interativa de cardápio digital com pedido direto e acompanhamento de entrega, criada pela Cubo Virtual.',
  // Marca fictícia: não indexar como se fosse uma hamburgueria real
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <div className={`${displayFont.variable} ${sans.variable}`}>
      <BrasaApp />
    </div>
  )
}
