'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bike, Check, ChefHat, Flame, Home, PartyPopper, Receipt, Star, Store } from 'lucide-react'
import { STEP_MS, brl, extraOf, productOf, trackState, trackSteps, type Order } from './data'
import { display } from './Menu'

const ROUTE = 'M40,190 C90,185 95,140 150,132 S230,120 250,82 S320,40 370,36'
const icons = [Receipt, ChefHat, Bike, PartyPopper]

export default function Tracking({ order, onNew, notify }: { order: Order; onNew: () => void; notify: (msg: string) => void }) {
  const [now, setNow] = useState(() => Date.now())
  const [rating, setRating] = useState(0)
  const path = useRef<SVGPathElement>(null)
  const [dot, setDot] = useState({ x: 40, y: 190, len: 0, total: 1 })

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(t)
  }, [])

  const { step } = trackState(order.createdAt, now)
  const steps = trackSteps(order.mode)
  const done = step === 3
  // a moto só anda na etapa "Saiu para entrega"
  const ride = order.mode === 'entrega' ? Math.min(1, Math.max(0, (now - order.createdAt - 2 * STEP_MS) / STEP_MS)) : 0
  const secondsLeft = Math.max(0, Math.ceil((order.createdAt + 3 * STEP_MS - now) / 1000))

  useEffect(() => {
    const p = path.current
    if (!p) return
    const total = p.getTotalLength()
    const pt = p.getPointAtLength(total * ride)
    setDot({ x: pt.x, y: pt.y, len: total * ride, total })
  }, [ride])

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-5 py-8 lg:grid-cols-[1.2fr_.8fr]">
      <div>
        <p className="text-sm font-bold text-white/65">Pedido #{order.id}</p>
        <motion.h1 key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${display} mt-1 text-5xl leading-none sm:text-6xl`}>
          {done ? 'Bom apetite!' : steps[step]}
        </motion.h1>
        <p className="mt-3 text-white/60">
          {done
            ? order.mode === 'entrega' ? `Entregue para ${order.name.split(' ')[0]}. Conta pra gente como foi?` : 'Pedido retirado. Conta pra gente como foi?'
            : `Previsão: ${secondsLeft} s · demonstração acelerada (cada etapa leva 10 s)`}
        </p>

        <ol className="mt-8 grid grid-cols-4 gap-2">
          {steps.map((label, i) => {
            const Icon = icons[i]
            const reached = i <= step
            return (
              <li key={label} className="text-center">
                <motion.span animate={{ scale: i === step && !done ? [1, 1.12, 1] : 1 }} transition={{ repeat: i === step && !done ? Infinity : 0, duration: 1.4 }}
                  className={`mx-auto grid size-12 place-items-center rounded-full border-2 transition-colors ${reached ? 'border-[#FF5A1F] bg-[#FF5A1F] text-black shadow-[0_0_24px_-4px_#FF5A1F]' : 'border-white/15 text-white/65'}`}>
                  {reached && i < step ? <Check size={20} strokeWidth={3} aria-hidden="true" /> : <Icon size={20} aria-hidden="true" />}
                </motion.span>
                <span className={`mt-2 block text-xs font-bold leading-tight sm:text-xs ${reached ? 'text-white' : 'text-white/65'}`}>{label}</span>
              </li>
            )
          })}
        </ol>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#FF5A1F] to-[#FFB81C]" animate={{ width: `${trackState(order.createdAt, now).progress * 100}%` }} transition={{ ease: 'linear', duration: 0.2 }} />
        </div>

        {order.mode === 'entrega' ? (
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
            <svg viewBox="0 0 400 220" className="block w-full" role="img" aria-label="Mapa do trajeto da entrega">
              <defs>
                <pattern id="b-streets" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
                  <path d="M0 20h40M20 0v40" stroke="rgba(255,244,232,.06)" strokeWidth="6" />
                </pattern>
              </defs>
              <rect width="400" height="220" fill="url(#b-streets)" />
              <path d="M0 150 C120 170 260 60 400 90" stroke="rgba(255,244,232,.08)" strokeWidth="14" fill="none" />
              <path ref={path} d={ROUTE} fill="none" stroke="rgba(255,244,232,.18)" strokeWidth="4" strokeDasharray="2 8" strokeLinecap="round" />
              <path d={ROUTE} fill="none" stroke="#FF5A1F" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${dot.len} ${dot.total}`} />
              <circle cx="40" cy="190" r="14" fill="#FF5A1F" />
              <circle cx="370" cy="36" r="14" fill="#FFB81C" />
            </svg>
            <Flame size={16} className="absolute text-black" style={{ left: `calc(${(40 / 400) * 100}% - 8px)`, top: `calc(${(190 / 220) * 100}% - 8px)` }} aria-hidden="true" />
            <Home size={15} className="absolute text-black" style={{ left: `calc(${(370 / 400) * 100}% - 7.5px)`, top: `calc(${(36 / 220) * 100}% - 7.5px)` }} aria-hidden="true" />
            {ride > 0 && ride < 1 && (
              <span className="absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-[0_0_0_6px_rgba(255,90,31,.35)]"
                style={{ left: `${(dot.x / 400) * 100}%`, top: `${(dot.y / 220) * 100}%` }}>
                <Bike size={18} aria-hidden="true" />
              </span>
            )}
            <p className="absolute bottom-3 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold backdrop-blur">
              {ride === 0 ? 'Aguardando o entregador' : ride < 1 ? 'Entregador a caminho' : 'Chegou!'} · {order.address}
            </p>
          </div>
        ) : (
          <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-[#121212] p-5">
            <Store size={28} className="text-[#FFB81C]" aria-hidden="true" />
            <p className="text-sm text-white/70">Retire na <b className="text-white">Av. das Brasas, 1200</b>. Avisamos no seu WhatsApp quando estiver pronto.</p>
          </div>
        )}

        {done && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl border border-[#FFB81C]/30 bg-[#FFB81C]/[.06] p-5">
            <p className="font-bold">Avalie seu pedido</p>
            <div className="flex gap-1" role="radiogroup" aria-label="Nota">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} estrelas`}
                  onClick={() => { setRating(n); notify(n >= 4 ? 'Valeu! Sua avaliação vira cupom no próximo pedido.' : 'Obrigado! Vamos melhorar.') }}
                  className="grid size-10 cursor-pointer place-items-center">
                  <Star size={26} className={n <= rating ? 'text-[#FFB81C]' : 'text-white/25'} fill={n <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <aside className="h-fit rounded-3xl border border-white/10 bg-[#141414] p-5">
        <h2 className={`${display} text-2xl`}>Resumo</h2>
        <ul className="mt-4 grid gap-3 text-sm">
          {order.items.map((i) => (
            <li key={i.key} className="flex justify-between gap-3">
              <span>
                <b>{i.qty}×</b> {productOf(i.productId).name}
                {i.extras.length > 0 && <span className="block text-xs text-white/65">+ {i.extras.map((e) => extraOf(e).name).join(', ')}</span>}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 grid gap-1.5 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between text-white/60"><dt>Subtotal</dt><dd>{brl(order.totals.subtotal)}</dd></div>
          <div className="flex justify-between text-white/60"><dt>Entrega</dt><dd>{order.totals.fee ? brl(order.totals.fee) : 'Grátis'}</dd></div>
          {order.totals.discount > 0 && <div className="flex justify-between text-[#4ADE80]"><dt>Desconto</dt><dd>− {brl(order.totals.discount)}</dd></div>}
          <div className="mt-1 flex justify-between text-base font-extrabold"><dt>Total</dt><dd>{brl(order.totals.total)}</dd></div>
          <p className="text-xs text-white/65">Pagamento: {order.payment === 'pix' ? 'Pix' : order.payment === 'cartao' ? 'cartão na entrega' : 'dinheiro'}</p>
        </dl>
        <button type="button" onClick={onNew} className="mt-6 min-h-12 w-full cursor-pointer rounded-full bg-[#FF5A1F] font-extrabold text-black">
          {done ? 'Fazer novo pedido' : 'Voltar ao cardápio'}
        </button>
      </aside>
    </div>
  )
}
