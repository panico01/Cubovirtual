import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AffiliaDemo from './AffiliaDemo'

const sans = Inter({ subsets: ['latin'], variable: '--a-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'AffiliaBOT · Demo interativa — Cubo Virtual',
  description: 'Simulação do AffiliaBOT: ofertas do Telegram convertidas com a tag do afiliado e repassadas para grupos do WhatsApp.',
}

export default function Page() {
  return (
    <div className={sans.variable}>
      <AffiliaDemo />
    </div>
  )
}
