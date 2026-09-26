'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Cpu, Send, ShoppingBag, Users } from 'lucide-react'

// Diagrama do fluxo real do AffiliaBOT: ofertas percorrem o caminho Telegram → motor → lojas → WhatsApp
const nodes = [
  { icon: Send, title: 'Telegram', text: 'Canais de ofertas monitorados' },
  { icon: Cpu, title: 'Motor', text: 'Filtra, desencurta e converte' },
  { icon: ShoppingBag, title: 'Lojas', text: 'Amazon · Mercado Livre · Shopee' },
  { icon: Users, title: 'WhatsApp', text: 'Grupos do afiliado, 24 h' },
]

export default function Flow() {
  const reduce = useReducedMotion()

  return (
    <div className="relative rounded-none border-2 border-ink bg-[#0A0A0A] p-5 text-[#FAFAFA] shadow-brutal sm:p-7">
      <div className="flex items-center justify-between border-b border-white/15 pb-4">
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#FBBF24]">Fluxo de uma oferta</p>
        <span className="flex items-center gap-2 text-xs font-bold text-white/70">
          <span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#4ADE80]" /><span className="relative size-2 rounded-full bg-[#4ADE80]" /></span>
          em produção
        </span>
      </div>

      <ol className="relative mt-6 grid gap-4">
        <span className="absolute bottom-6 left-6 top-6 w-0.5 bg-white/10" aria-hidden="true" />
        {!reduce && [0, 1, 2].map((i) => (
          <motion.span key={i} className="absolute left-[1.3rem] size-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_12px_#FBBF24]" aria-hidden="true"
            initial={{ top: '8%', opacity: 0 }} animate={{ top: ['8%', '88%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i, ease: 'easeInOut' }} />
        ))}
        {nodes.map(({ icon: Icon, title, text }, i) => (
          <motion.li key={title} className="relative flex items-center gap-4"
            initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
            <span className="relative grid size-12 shrink-0 place-items-center border-2 border-white/20 bg-[#141414] text-[#FBBF24]"><Icon size={20} aria-hidden="true" /></span>
            <span>
              <span className="block font-extrabold">{title}</span>
              <span className="block text-sm text-white/60">{text}</span>
            </span>
          </motion.li>
        ))}
      </ol>

      <div className="mt-6 grid grid-cols-3 border-t border-white/15 pt-5 text-center">
        {[['3', 'lojas integradas'], ['24 h', 'no ar, sem pausa'], ['segundos', 'do canal ao grupo']].map(([n, l]) => (
          <div key={l}>
            <p className="text-2xl font-extrabold tracking-[-.04em] text-[#FBBF24]">{n}</p>
            <p className="text-xs font-semibold text-white/55">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
