'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Minus, Plus, X } from 'lucide-react'
import { brl, buildLayers, extras, unitPrice, type CartItem, type Extra, type Product } from './data'
import { display } from './Menu'

const Burger3D = dynamic(() => import('./Burger3D'), { ssr: false })

export default function ProductSheet({ product, onClose, onAdd }: {
  product: Product | null
  onClose: () => void
  onAdd: (item: Omit<CartItem, 'key'>) => void
}) {
  return (
    <AnimatePresence>
      {product && <Sheet key={product.id} product={product} onClose={onClose} onAdd={onAdd} />}
    </AnimatePresence>
  )
}

function Sheet({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (item: Omit<CartItem, 'key'>) => void }) {
  const [chosen, setChosen] = useState<Extra['id'][]>([])
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const layers = useMemo(() => buildLayers(product, chosen), [product, chosen])
  const price = unitPrice({ productId: product.id, extras: chosen }) * qty

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const toggle = (id: Extra['id']) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div role="dialog" aria-modal="true" aria-label={`Montar ${product.name}`}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[94dvh] max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#141414] md:bottom-6 md:rounded-3xl">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-black/50 hover:bg-black/80" aria-label="Fechar"><X size={20} /></button>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-2">
          <div className="relative bg-[radial-gradient(circle_at_50%_60%,rgba(255,90,31,.28),transparent_65%)]">
            <Burger3D layers={layers} className="mx-auto aspect-square w-full max-w-[22rem] md:max-w-none" />
            <p className="absolute inset-x-0 bottom-3 text-center text-[11px] text-white/40">Marque os adicionais e veja o burger mudar</p>
          </div>

          <div className="p-5 sm:p-7">
            <p className={`${display} text-4xl leading-none`}>{product.name}</p>
            <p className="mt-2 text-sm text-white/60">{product.desc}</p>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.18em] text-white/45">Adicionais</p>
            <div className="mt-3 grid gap-2">
              {extras.map((e) => {
                const on = chosen.includes(e.id)
                return (
                  <button key={e.id} type="button" onClick={() => toggle(e.id)} aria-pressed={on}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 text-left text-sm transition-colors ${on ? 'border-[#FF5A1F] bg-[#FF5A1F]/10' : 'border-white/10 hover:border-white/25'}`}>
                    <span className={`grid size-6 shrink-0 place-items-center rounded-md border transition-colors ${on ? 'border-[#FF5A1F] bg-[#FF5A1F] text-black' : 'border-white/25'}`}>
                      {on && <Check size={15} strokeWidth={3} aria-hidden="true" />}
                    </span>
                    <span className="flex-1 font-semibold">{e.name}</span>
                    <span className="text-white/60">+ {brl(e.price)}</span>
                  </button>
                )
              })}
            </div>

            <label className="mt-6 block text-xs font-extrabold uppercase tracking-[.18em] text-white/45" htmlFor="obs">Observações</label>
            <textarea id="obs" value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={140} placeholder="Ex.: sem tomate, ponto da carne mais passado…"
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[.04] px-3 py-2.5 text-sm outline-none placeholder:text-white/30 focus:border-[#FF5A1F]/60" />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-white/10 p-4">
          <div className="flex items-center rounded-full border border-white/15">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-11 cursor-pointer place-items-center" aria-label="Diminuir quantidade"><Minus size={16} /></button>
            <span className="w-6 text-center font-bold tabular-nums" aria-live="polite">{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} className="grid size-11 cursor-pointer place-items-center" aria-label="Aumentar quantidade"><Plus size={16} /></button>
          </div>
          <button type="button" onClick={() => onAdd({ productId: product.id, extras: chosen, note, qty })}
            className="flex min-h-12 flex-1 cursor-pointer items-center justify-between rounded-full bg-[#FF5A1F] px-5 font-extrabold text-black shadow-[0_10px_40px_-10px_#FF5A1F] transition-transform hover:-translate-y-0.5">
            <span>Adicionar</span>
            <motion.span key={price} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="tabular-nums">{brl(price)}</motion.span>
          </button>
        </div>
      </motion.div>
    </>
  )
}
