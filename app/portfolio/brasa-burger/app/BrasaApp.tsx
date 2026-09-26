'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, CircleCheck, ShoppingBag, Timer } from 'lucide-react'
import Menu from './Menu'
import ProductSheet from './ProductSheet'
import CartPanel from './CartPanel'
import Tracking from './Tracking'
import { addToCart, brl, productOf, trackState, totals, type CartItem, type Order, type Product } from './data'

const KEY = 'brasa-demo-v1'
const WHATSAPP = `https://wa.me/5517991191582?text=${encodeURIComponent('Vi a demo da Brasa Burger no portfólio e quero um cardápio digital assim.')}`

export default function BrasaApp() {
  const [ready, setReady] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [view, setView] = useState<'menu' | 'pedido'>('menu')
  const [picked, setPicked] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null')
      if (Array.isArray(saved?.cart)) setCart(saved.cart)
      if (saved?.order) setOrder(saved.order)
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try { localStorage.setItem(KEY, JSON.stringify({ cart, order })) } catch {}
  }, [cart, order, ready])

  const notify = useCallback((msg: string) => {
    clearTimeout(timer.current)
    setToast({ id: Date.now(), msg })
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const add = (item: Omit<CartItem, 'key'>) => {
    setCart((c) => addToCart(c, item))
    setPicked(null)
    notify(`${item.qty > 1 ? `${item.qty}× ` : ''}${productOf(item.productId).name} na sacola`)
  }

  const placeOrder = (o: Order) => {
    setOrder(o)
    setCart([])
    setCartOpen(false)
    setView('pedido')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const count = cart.reduce((s, i) => s + i.qty, 0)
  const orderActive = order && trackState(order.createdAt, Date.now()).step < 3

  return (
    <div className="min-h-dvh bg-[#0D0D0D] font-[family-name:var(--b-sans)] text-[#FFF4E8]">
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-3 border-b border-white/10 bg-black/85 px-3 backdrop-blur-md sm:px-5">
        <Link href="/portfolio/brasa-burger" className="flex min-h-11 items-center gap-2 text-xs font-semibold text-white/60 hover:text-white">
          <ArrowLeft size={15} aria-hidden="true" /> <span className="hidden sm:inline">Voltar ao case</span>
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-white/45">Demo · Cardápio digital</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hidden min-h-8 items-center gap-1.5 rounded-full bg-[#EA580C] px-3 text-xs font-bold text-black md:inline-flex">
          Quero um assim <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <span className="w-6 md:hidden" />
      </header>

      {view === 'pedido' && order ? (
        <Tracking order={order} notify={notify} onNew={() => {
          if (!orderActive) setOrder(null)
          setView('menu')
          window.scrollTo({ top: 0 })
        }} />
      ) : (
        <Menu
          onPick={setPicked}
          onQuickAdd={(p) => add({ productId: p.id, extras: [], note: '', qty: 1 })}
          aside={<CartPanel cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} onOrder={placeOrder} />}
        />
      )}

      <p className="border-t border-white/10 px-5 py-4 pb-24 text-center text-xs text-white/40 lg:pb-4">
        Projeto demonstrativo com marca e dados fictícios · desenvolvido por{' '}
        <Link href="/" className="font-semibold underline underline-offset-2 hover:text-white">Cubo Virtual</Link>
      </p>

      {/* barra inferior no celular: sacola ou pedido em andamento */}
      <AnimatePresence>
        {view === 'menu' && (count > 0 || orderActive) && !cartOpen && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed inset-x-3 bottom-3 z-30 grid gap-2 lg:hidden">
            {orderActive && (
              <button type="button" onClick={() => setView('pedido')} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#FFB81C]/40 bg-black/90 text-sm font-bold text-[#FFB81C] backdrop-blur">
                <Timer size={16} aria-hidden="true" /> Acompanhar pedido #{order!.id}
              </button>
            )}
            {count > 0 && (
              <button type="button" onClick={() => setCartOpen(true)} className="flex min-h-14 cursor-pointer items-center justify-between rounded-full bg-[#FF5A1F] px-5 font-extrabold text-black shadow-[0_10px_40px_-6px_#FF5A1F]">
                <span className="flex items-center gap-2">
                  <ShoppingBag size={18} aria-hidden="true" /> Ver sacola
                  <motion.span key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="grid size-6 place-items-center rounded-full bg-black text-xs text-[#FF5A1F]">{count}</motion.span>
                </span>
                <span className="tabular-nums">{brl(totals(cart, 'retirada', '').subtotal)}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'menu' && orderActive && (
        <button type="button" onClick={() => setView('pedido')} className="fixed bottom-6 right-6 z-30 hidden min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#FFB81C]/40 bg-black/90 px-4 text-sm font-bold text-[#FFB81C] backdrop-blur lg:flex">
          <Timer size={16} aria-hidden="true" /> Acompanhar pedido #{order!.id}
        </button>
      )}

      <ProductSheet product={picked} onClose={() => setPicked(null)} onAdd={add} />

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} role="status"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-4 top-16 z-[60] mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1A1A]/95 px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur">
            <CircleCheck size={18} className="shrink-0 text-[#4ADE80]" aria-hidden="true" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
