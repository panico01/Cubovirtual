'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Banknote, Bike, CreditCard, Minus, Plus, QrCode, ShoppingBag, Store, TicketPercent, X } from 'lucide-react'
import { COUPON, FREE_DELIVERY_FROM, brl, extraOf, productOf, totals, unitPrice, type CartItem, type Mode, type Order, type Payment } from './data'
import { MiniBurger, display } from './Menu'
import { buildLayers } from './data'

const maskPhone = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
}

const payments: { id: Payment; label: string; icon: typeof QrCode }[] = [
  { id: 'pix', label: 'Pix', icon: QrCode },
  { id: 'cartao', label: 'Cartão na entrega', icon: CreditCard },
  { id: 'dinheiro', label: 'Dinheiro', icon: Banknote },
]

const input = 'min-h-12 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm outline-none placeholder:text-white/65 focus:border-[#FF5A1F]/60'

export default function CartPanel({ cart, setCart, open, onClose, onOrder }: {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  open: boolean
  onClose: () => void
  onOrder: (order: Order) => void
}) {
  const [step, setStep] = useState<'sacola' | 'checkout'>('sacola')
  const [mode, setMode] = useState<Mode>('entrega')
  const [payment, setPayment] = useState<Payment>('pix')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState('')
  const [error, setError] = useState('')

  const t = totals(cart, mode, coupon)
  const count = cart.reduce((s, i) => s + i.qty, 0)
  const missing = Math.max(0, FREE_DELIVERY_FROM - t.subtotal)

  const changeQty = (key: string, delta: number) =>
    setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0))

  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === COUPON) { setCoupon(COUPON); setError('') }
    else setError('Cupom inválido. Nesta demo, use BRASA10.')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 3) return setError('Informe seu nome.')
    if (phone.replace(/\D/g, '').length < 10) return setError('Informe um WhatsApp válido com DDD.')
    if (mode === 'entrega' && address.trim().length < 6) return setError('Informe o endereço de entrega.')
    setError('')
    onOrder({ id: 4800 + Math.floor(Math.random() * 190), items: cart, mode, payment, name: name.trim(), address: address.trim(), totals: t, createdAt: Date.now() })
    setStep('sacola')
    setCoupon('')
    setCouponInput('')
  }

  return (
    <>
      <AnimatePresence>
        {open && <motion.div className="fixed inset-0 z-40 bg-black/70 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />}
      </AnimatePresence>

      <aside aria-label="Sacola"
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-3xl border border-white/10 bg-[#141414] transition-transform duration-300 ease-out lg:sticky lg:top-28 lg:z-0 lg:my-8 lg:max-h-[calc(100dvh-8rem)] lg:translate-y-0 lg:rounded-3xl ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          {step === 'checkout' ? (
            <button type="button" onClick={() => { setStep('sacola'); setError('') }} className="-ml-2 flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-2 text-sm font-bold hover:bg-white/[.06]">
              <ArrowLeft size={16} aria-hidden="true" /> Sacola
            </button>
          ) : (
            <h2 className={`${display} flex items-center gap-2 text-2xl`}><ShoppingBag size={20} className="text-[#FF5A1F]" aria-hidden="true" /> Sua sacola</h2>
          )}
          <button type="button" onClick={onClose} className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-white/[.06] lg:hidden" aria-label="Fechar sacola"><X size={20} /></button>
        </header>

        {!cart.length ? (
          <div className="grid place-items-center gap-2 px-6 py-12 text-center">
            <ShoppingBag size={36} className="text-white/20" aria-hidden="true" />
            <p className="font-bold">Sua sacola está vazia</p>
            <p className="text-sm text-white/65">Escolha um burger e monte do seu jeito.</p>
          </div>
        ) : step === 'sacola' ? (
          <>
            <ul className="min-h-0 flex-1 divide-y divide-white/[.06] overflow-y-auto px-5">
              <AnimatePresence initial={false}>
                {cart.map((item) => {
                  const p = productOf(item.productId)
                  return (
                    <motion.li key={item.key} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }} className="flex gap-3 py-4">
                      <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#1E1E1E] text-2xl" aria-hidden="true">
                        {p.layers ? <MiniBurger layers={buildLayers(p, item.extras)} className="w-11 scale-[.6]" /> : p.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-tight">{p.name}</p>
                        {item.extras.length > 0 && <p className="text-xs text-white/55">+ {item.extras.map((e) => extraOf(e).name).join(', ')}</p>}
                        {item.note && <p className="text-xs italic text-white/65">“{item.note}”</p>}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-white/15">
                            <button type="button" onClick={() => changeQty(item.key, -1)} className="grid size-9 cursor-pointer place-items-center" aria-label={`Remover um ${p.name}`}><Minus size={14} /></button>
                            <span className="w-5 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                            <button type="button" onClick={() => changeQty(item.key, 1)} className="grid size-9 cursor-pointer place-items-center" aria-label={`Adicionar mais um ${p.name}`}><Plus size={14} /></button>
                          </div>
                          <span className="font-bold tabular-nums">{brl(unitPrice(item) * item.qty)}</span>
                        </div>
                      </div>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>
            <div className="border-t border-white/10 p-5">
              <div className="text-xs text-white/60">
                {missing > 0 ? <>Faltam <b className="text-white">{brl(missing)}</b> para o frete grátis</> : <span className="font-bold text-[#4ADE80]">Frete grátis desbloqueado!</span>}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-[#FF5A1F] to-[#FFB81C]" animate={{ width: `${Math.min(100, (t.subtotal / FREE_DELIVERY_FROM) * 100)}%` }} />
                </div>
              </div>
              <button type="button" onClick={() => setStep('checkout')} className="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-between rounded-full bg-[#FF5A1F] px-5 font-extrabold text-black">
                <span>Continuar · {count} {count === 1 ? 'item' : 'itens'}</span><span className="tabular-nums">{brl(t.subtotal)}</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-1 rounded-full bg-white/[.06] p-1" role="radiogroup" aria-label="Como receber">
                {([['entrega', 'Entrega', Bike], ['retirada', 'Retirar na loja', Store]] as const).map(([id, label, Icon]) => (
                  <button key={id} type="button" role="radio" aria-checked={mode === id} onClick={() => setMode(id)}
                    className={`relative flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-bold ${mode === id ? 'text-black' : 'text-white/65'}`}>
                    {mode === id && <motion.span layoutId="b-mode" className="absolute inset-0 rounded-full bg-[#FFB81C]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <Icon size={16} className="relative" aria-hidden="true" /><span className="relative">{label}</span>
                  </button>
                ))}
              </div>

              <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" aria-label="Nome" autoComplete="name" />
              <input className={input} value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} placeholder="WhatsApp (11) 91234-5678" aria-label="WhatsApp" type="tel" inputMode="numeric" autoComplete="tel" />
              {mode === 'entrega'
                ? <input className={input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço e número" aria-label="Endereço de entrega" autoComplete="street-address" />
                : <p className="rounded-xl bg-white/[.04] px-4 py-3 text-xs text-white/60">Retirada na Av. das Brasas, 1200 · pronto em ~20 min</p>}

              <div className="grid gap-2" role="radiogroup" aria-label="Pagamento">
                {payments.map(({ id, label, icon: Icon }) => (
                  <button key={id} type="button" role="radio" aria-checked={payment === id} onClick={() => setPayment(id)}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 text-sm font-semibold transition-colors ${payment === id ? 'border-[#FF5A1F] bg-[#FF5A1F]/10' : 'border-white/10'}`}>
                    <Icon size={17} className={payment === id ? 'text-[#FF5A1F]' : 'text-white/65'} aria-hidden="true" />{label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <label className="relative flex-1">
                  <TicketPercent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/65" aria-hidden="true" />
                  <input className={`${input} pl-9 uppercase`} value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Cupom (tente BRASA10)" aria-label="Cupom de desconto" />
                </label>
                <button type="button" onClick={applyCoupon} className="min-h-12 cursor-pointer rounded-xl bg-white/[.08] px-4 text-sm font-bold hover:bg-white/[.14]">Aplicar</button>
              </div>

              <dl className="grid gap-1.5 text-sm">
                <div className="flex justify-between text-white/65"><dt>Subtotal</dt><dd className="tabular-nums">{brl(t.subtotal)}</dd></div>
                <div className="flex justify-between text-white/65"><dt>Entrega</dt><dd className="tabular-nums">{t.fee ? brl(t.fee) : 'Grátis'}</dd></div>
                <AnimatePresence>
                  {t.discount > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-between text-[#4ADE80]">
                      <dt>Cupom {COUPON}</dt><dd className="tabular-nums">− {brl(t.discount)}</dd>
                    </motion.div>
                  )}
                </AnimatePresence>
              </dl>
              {error && <p role="alert" className="rounded-xl bg-[#FB7185]/10 px-4 py-3 text-sm font-semibold text-[#FDA4AF]">{error}</p>}
            </div>
            <div className="border-t border-white/10 p-5">
              <button type="submit" className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-full bg-[#FF5A1F] px-5 font-extrabold text-black shadow-[0_10px_40px_-10px_#FF5A1F]">
                <span>Fazer pedido</span><span className="tabular-nums">{brl(t.total)}</span>
              </button>
              <p className="mt-2 text-center text-xs text-white/65">Demonstração: nenhum pagamento é processado.</p>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
