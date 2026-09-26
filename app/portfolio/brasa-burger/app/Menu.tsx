'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { Bike, Clock, Flame, Plus, Star } from 'lucide-react'
import { brl, categories, products, type Category, type Layer, type Product } from './data'

const Burger3D = dynamic(() => import('./Burger3D'), { ssr: false })

export const display = 'font-[family-name:var(--b-display)] uppercase tracking-wide'

const LAYER_STYLE: Record<Layer, string> = {
  top: 'h-8 w-[88%] rounded-t-[999px] bg-gradient-to-b from-[#F0B066] to-[#D98C3E]',
  bottom: 'h-4 w-[86%] rounded-b-2xl bg-[#C98242]',
  patty: 'h-3.5 w-[94%] rounded-full bg-[#4A2616]',
  veggie: 'h-3.5 w-[92%] rounded-full bg-[#9A7236]',
  cheese: 'h-1.5 w-[97%] rounded-sm bg-[#FFB81C]',
  bacon: 'h-1.5 w-[92%] rounded-full bg-[#9A3420]',
  lettuce: 'h-2 w-[99%] rounded-full bg-[#62C23F]',
  tomato: 'h-2 w-[84%] rounded-full bg-[#D9302A]',
  onion: 'h-1.5 w-[88%] rounded-full bg-[#B8702C]',
  sauce: 'h-1 w-[92%] rounded-full bg-[#F2B544]',
}

// Miniatura do lanche em CSS, com as mesmas camadas do 3D
export function MiniBurger({ layers, className = '' }: { layers: Layer[]; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-end gap-px ${className}`} aria-hidden="true">
      {[...layers].reverse().map((layer, i) => (
        <motion.span key={`${i}-${layer}-${layers.length}`} layout className={`relative block ${LAYER_STYLE[layer]}`}>
          {layer === 'top' && [18, 34, 50, 66, 26, 58].map((left, s) => (
            <span key={s} className="absolute h-1 w-1.5 rounded-full bg-[#FFF1D6]" style={{ left: `${left}%`, top: s < 4 ? '38%' : '18%' }} />
          ))}
        </motion.span>
      ))}
    </div>
  )
}

export default function Menu({ onPick, onQuickAdd, aside }: { onPick: (p: Product) => void; onQuickAdd: (p: Product) => void; aside: React.ReactNode }) {
  const burgers = products.filter((p) => p.category === 'burgers')
  const [hero, setHero] = useState(burgers[1])
  const [active, setActive] = useState<Category>('burgers')
  const reduce = useReducedMotion()

  // aba ativa acompanha a seção visível
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (seen) setActive(seen.target.id.replace('cat-', '') as Category)
    }, { rootMargin: '-45% 0px -50% 0px' })
    categories.forEach((c) => { const el = document.getElementById(`cat-${c.id}`); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        {!reduce && Array.from({ length: 16 }, (_, i) => (
          <motion.span key={i} className="pointer-events-none absolute bottom-0 size-1 rounded-full bg-[#FF7A2F] shadow-[0_0_8px_#FF5A1F]"
            style={{ left: `${45 + ((i * 37) % 50)}%` }}
            animate={{ y: [0, -420 - (i % 5) * 60], x: [0, (i % 2 ? 1 : -1) * (20 + (i % 3) * 15)], opacity: [0, 1, 0] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }} aria-hidden="true" />
        ))}
        <div className="pointer-events-none absolute right-[-10%] top-1/4 size-[28rem] rounded-full bg-[#FF5A1F]/20 blur-[110px]" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-4 px-5 pb-10 pt-8 lg:grid-cols-2 lg:py-14">
          <div>
            <p className={`${display} flex items-center gap-2 text-sm text-[#FF5A1F]`}><Flame size={16} aria-hidden="true" /> Brasa Burger Co.</p>
            <h1 className={`${display} mt-4 text-[3.4rem] leading-[.9] sm:text-7xl`}>Smash na brasa.<br /><span className="text-[#FF5A1F]">Direto da chapa</span><br />pra sua porta.</h1>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1.5 rounded-full bg-[#4ADE80]/15 px-3 py-1.5 text-[#4ADE80]"><span className="size-1.5 rounded-full bg-[#4ADE80]" /> Aberto agora</span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/[.07] px-3 py-1.5"><Clock size={13} aria-hidden="true" /> 30–40 min</span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/[.07] px-3 py-1.5"><Bike size={13} aria-hidden="true" /> Frete grátis acima de R$ 80</span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/[.07] px-3 py-1.5"><Star size={13} fill="currentColor" className="text-[#FFB81C]" aria-hidden="true" /> 4,8</span>
            </div>
            <a href="#cat-burgers" className="mt-8 hidden min-h-12 items-center rounded-full bg-[#FF5A1F] px-7 font-bold text-black shadow-[0_10px_40px_-8px_#FF5A1F] transition-transform hover:-translate-y-0.5 lg:inline-flex">
              Ver cardápio
            </a>
          </div>

          <div>
            <Burger3D layers={hero.layers!} className="mx-auto aspect-square w-full max-w-[26rem]" />
            <div className="-mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Ver outro burger em 3D">
              {burgers.map((b) => (
                <button key={b.id} type="button" onClick={() => setHero(b)} aria-pressed={hero.id === b.id}
                  className={`min-h-9 cursor-pointer rounded-full border px-3 text-xs font-bold transition-colors ${hero.id === b.id ? 'border-[#FF5A1F] bg-[#FF5A1F] text-black' : 'border-white/15 text-white/70 hover:text-white'}`}>
                  {b.name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-white/40">Arraste o burger para girar</p>
          </div>
        </div>
      </section>

      <nav className="sticky top-12 z-20 border-b border-white/10 bg-[#0D0D0D]/90 backdrop-blur-md" aria-label="Categorias">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2 sm:px-5">
          {categories.map((c) => (
            <a key={c.id} href={`#cat-${c.id}`} aria-current={active === c.id ? 'true' : undefined}
              className={`relative flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-bold transition-colors ${active === c.id ? 'text-black' : 'text-white/60 hover:text-white'}`}>
              {active === c.id && <motion.span layoutId="b-cat" className="absolute inset-0 rounded-full bg-[#FFB81C]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="relative">{c.label}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto grid max-w-6xl items-start gap-8 px-5 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-12 py-8">
        {categories.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-28">
            <h2 className={`${display} text-3xl`}>{c.label}</h2>
            {c.id === 'burgers' ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {products.filter((p) => p.category === c.id).map((p, i) => (
                  <motion.button key={p.id} type="button" onClick={() => onPick(p)}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#1C1C1C] to-[#121212] p-5 text-left transition-colors hover:border-[#FF5A1F]/60">
                    {p.tag && <span className="absolute right-4 top-4 rounded-full bg-[#FF5A1F] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black">{p.tag}</span>}
                    <div className="relative mx-auto flex h-36 w-44 items-end justify-center">
                      <span className="absolute bottom-0 h-4 w-40 rounded-[50%] bg-black/60 blur-md" aria-hidden="true" />
                      <MiniBurger layers={p.layers!} className="relative w-40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-3deg]" />
                    </div>
                    <p className={`${display} mt-5 text-2xl`}>{p.name}</p>
                    <p className="mt-1 text-sm text-white/60">{p.desc}</p>
                    <p className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-[#FFB81C]">{brl(p.price)}</span>
                      <span className="flex items-center gap-1 rounded-full bg-white/[.08] px-3 py-1.5 text-xs font-bold transition-colors group-hover:bg-[#FF5A1F] group-hover:text-black">Montar <Plus size={14} aria-hidden="true" /></span>
                    </p>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {products.filter((p) => p.category === c.id).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#161616] p-3">
                    <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#2A1A12] to-[#1A1A1A] text-3xl" aria-hidden="true">{p.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{p.name}</p>
                      <p className="line-clamp-1 text-xs text-white/55">{p.desc}</p>
                      <p className="mt-1 text-sm font-extrabold text-[#FFB81C]">{brl(p.price)}</p>
                    </div>
                    <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => onQuickAdd(p)} aria-label={`Adicionar ${p.name}`}
                      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-[#FF5A1F] text-black">
                      <Plus size={20} aria-hidden="true" />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      {aside}
      </div>
    </>
  )
}
