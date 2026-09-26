import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import VitalleApp from './VitalleApp'

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--v-serif', display: 'swap' })
const sans = DM_Sans({ subsets: ['latin'], variable: '--v-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'Vitalle Clínica · Demo de agendamento — Cubo Virtual',
  description: 'Demonstração interativa de sistema de agendamento online para clínicas, criada pela Cubo Virtual.',
  // Marca fictícia: não indexar como se fosse uma clínica real
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <VitalleApp />
    </div>
  )
}
