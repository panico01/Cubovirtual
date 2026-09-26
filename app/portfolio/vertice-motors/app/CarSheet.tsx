'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, CalendarCheck, Check, Fuel, Gauge, Repeat, Settings2, X } from 'lucide-react'
import credits from './credits.json'
import { TERMS, brl, installment, km, tradeIn, tradeModels, type Car } from './data'

export const display = 'font-[family-name:var(--v-display)] uppercase'

const maskPhone = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
}

const field = 'min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#D7263D]'
type Tab = 'financiar' | 'troca' | 'testdrive'

export default function CarSheet({ car, onClose, notify }: { car: Car | null; onClose: () => void; notify: (m: string) => void }) {
  return <AnimatePresence>{car && <Sheet key={car.id} car={car} onClose={onClose} notify={notify} />}</AnimatePresence>
}

function Sheet({ car, onClose, notify }: { car: Car; onClose: () => void; notify: (m: string) => void }) {
  const [tab, setTab] = useState<Tab>('financiar')
  const [down, setDown] = useState(Math.round(car.price * 0.3 / 1000) * 1000)
  const [term, setTerm] = useState(48)
  const [trade, setTrade] = useState({ model: '', year: 2019, km: 60_000 })
  const [tradeValue, setTradeValue] = useState<{ min: number; max: number } | null>(null)
  const [slot, setSlot] = useState<{ day: string; hour: string } | null>(null)
  const [contact, setContact] = useState({ name: '', phone: '' })
  const [booked, setBooked] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const financed = Math.max(0, car.price - down)
  const pmt = installment(financed, term)
  const days = useMemo(() => {
    const out: { key: string; label: string }[] = []
    for (let i = 1; out.length < 6; i++) {
      const d = new Date(); d.setDate(d.getDate() + i)
      if (d.getDay() !== 0) out.push({ key: d.toDateString(), label: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '') })
    }
    return out
  }, [])

  const evaluate = (e: React.FormEvent) => {
    e.preventDefault()
    const v = tradeIn(trade.model, trade.year, trade.km)
    if (!v) return setError('Escolha o modelo do seu carro.')
    setError('')
    setTradeValue(v)
  }

  const book = (e: React.FormEvent) => {
    e.preventDefault()
    if (!slot?.hour) return setError('Escolha dia e horário.')
    if (contact.name.trim().length < 3) return setError('Informe seu nome.')
    if (contact.phone.replace(/\D/g, '').length < 10) return setError('Informe um WhatsApp válido com DDD.')
    setError('')
    setBooked(true)
    notify(`Test drive agendado: ${slot.day} às ${slot.hour}`)
  }

  const tabs: { id: Tab; label: string; icon: typeof Repeat }[] = [
    { id: 'financiar', label: 'Financiar', icon: Gauge },
    { id: 'troca', label: 'Meu usado na troca', icon: Repeat },
    { id: 'testdrive', label: 'Test drive', icon: CalendarCheck },
  ]

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div role="dialog" aria-modal="true" aria-label={`${car.brand} ${car.model}`}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[94dvh] max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-[#F7F7F4] text-[#0E0F12] md:bottom-6 md:rounded-3xl">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-white shadow" aria-label="Fechar"><X size={20} /></button>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden bg-gradient-to-b from-[#E4E5E0] to-[#F7F7F4] p-6">
            <p className="text-xs font-bold text-black/50">{car.brand} · {car.year}</p>
            <h2 className={`${display} mt-1 text-2xl leading-tight sm:text-3xl`}>{car.model}</h2>
            <p className="text-sm text-black/60">{car.version}</p>
            <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}>
              <img src={`/portfolio/vertice/${car.id}.webp`} alt={`${car.brand} ${car.model}`} loading="lazy" className="mt-4 aspect-[16/10] w-full rounded-2xl object-cover shadow-lg" />
            </motion.div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {[[Gauge, km(car.km)], [Fuel, car.fuel], [Settings2, car.gear]].map(([Icon, v], i) => {
                const I = Icon as typeof Gauge
                return <div key={i} className="rounded-xl bg-white p-3"><I size={16} className="mx-auto text-[#D7263D]" aria-hidden="true" /><p className="mt-1 font-bold">{v as string}</p></div>
              })}
            </div>
            <p className="mt-4 text-xs text-black/55">Cor: {car.colorName} · <a href={credits[car.id as keyof typeof credits]?.source} target="_blank" rel="noopener noreferrer" className="underline">foto: {credits[car.id as keyof typeof credits]?.author} ({credits[car.id as keyof typeof credits]?.license})</a></p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {car.badges.map((b) => <li key={b} className="flex items-center gap-1 rounded-full bg-[#0E0F12] px-2.5 py-1 text-[11px] font-bold text-white"><BadgeCheck size={12} aria-hidden="true" /> {b}</li>)}
            </ul>
            <ul className="mt-4 grid grid-cols-2 gap-1.5 text-xs text-black/70">
              {car.items.map((it) => <li key={it} className="flex items-center gap-1.5"><Check size={13} className="text-[#D7263D]" aria-hidden="true" />{it}</li>)}
            </ul>
          </div>

          <div className="p-6">
            <p className={`${display} text-3xl text-[#D7263D]`}>{brl(car.price)}</p>
            <div className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-black/5 p-1" role="tablist">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setError('') }}
                  className={`relative flex min-h-11 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-bold sm:flex-row sm:gap-1.5 sm:text-xs ${tab === id ? 'text-white' : 'text-black/60'}`}>
                  {tab === id && <motion.span layoutId="v-tab" className="absolute inset-0 rounded-xl bg-[#0E0F12]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <Icon size={15} className="relative" aria-hidden="true" /><span className="relative text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              {tab === 'financiar' && (
                <div>
                  <label className="flex justify-between text-sm font-bold" htmlFor="entrada">Entrada <span className="tabular-nums">{brl(down)}</span></label>
                  <input id="entrada" type="range" min={0} max={car.price} step={1000} value={down} onChange={(e) => setDown(Number(e.target.value))} className="mt-3 w-full accent-[#D7263D]" />
                  <p className="mt-1 text-xs text-black/50">{Math.round((down / car.price) * 100)}% do valor · financiado {brl(financed)}</p>
                  <p className="mt-5 text-sm font-bold">Prazo</p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {TERMS.map((t) => (
                      <button key={t} type="button" onClick={() => setTerm(t)} aria-pressed={term === t}
                        className={`min-h-11 cursor-pointer rounded-xl border text-sm font-bold ${term === t ? 'border-[#D7263D] bg-[#D7263D] text-white' : 'border-black/10 bg-white'}`}>{t}x</button>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#0E0F12] p-5 text-white">
                    <p className="text-xs text-white/60">Parcela estimada</p>
                    <motion.p key={`${down}-${term}`} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`${display} mt-1 text-3xl tabular-nums`}>
                      {financed ? `${term}x ${brl(pmt)}` : 'À vista'}
                    </motion.p>
                    <p className="mt-2 text-[11px] text-white/50">Simulação ilustrativa com taxa de 1,49% a.m. Condição final sujeita à análise de crédito.</p>
                  </div>
                </div>
              )}

              {tab === 'troca' && (
                <form onSubmit={evaluate} className="grid gap-3">
                  <select className={field} value={trade.model} onChange={(e) => { setTrade({ ...trade, model: e.target.value }); setTradeValue(null) }} aria-label="Modelo do seu carro">
                    <option value="">Modelo do seu carro</option>
                    {tradeModels.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <select className={field} value={trade.year} onChange={(e) => { setTrade({ ...trade, year: Number(e.target.value) }); setTradeValue(null) }} aria-label="Ano">
                      {Array.from({ length: 12 }, (_, i) => 2026 - i).map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <input className={field} type="number" inputMode="numeric" min={0} step={1000} value={trade.km} onChange={(e) => { setTrade({ ...trade, km: Number(e.target.value) }); setTradeValue(null) }} aria-label="Quilometragem" />
                  </div>
                  <button type="submit" className="min-h-12 cursor-pointer rounded-full bg-[#0E0F12] font-bold text-white">Avaliar meu carro</button>
                  <AnimatePresence>
                    {tradeValue && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-[#D7263D]/30 bg-[#D7263D]/5 p-5">
                        <p className="text-xs text-black/55">Seu usado vale entre</p>
                        <p className={`${display} mt-1 text-xl`}>{brl(tradeValue.min)} e {brl(tradeValue.max)}</p>
                        <p className="mt-3 text-sm">Usando como entrada, faltam <b>{brl(Math.max(0, car.price - tradeValue.min))}</b> para o {car.model}.</p>
                        <button type="button" onClick={() => { setDown(Math.min(car.price, tradeValue.min)); setTab('financiar') }} className="mt-3 text-sm font-bold text-[#D7263D] underline underline-offset-4">Simular parcela com essa entrada</button>
                        <p className="mt-3 text-[11px] text-black/45">Estimativa ilustrativa. O valor final depende da vistoria presencial.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              )}

              {tab === 'testdrive' && (booked && slot ? (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl bg-[#0E0F12] p-6 text-white">
                  <CalendarCheck size={28} className="text-[#D7263D]" aria-hidden="true" />
                  <p className={`${display} mt-3 text-xl`}>Test drive confirmado</p>
                  <p className="mt-2 text-sm text-white/70">{contact.name.split(' ')[0]}, o {car.model} estará te esperando {slot.day} às {slot.hour}. Enviamos a confirmação no seu WhatsApp.</p>
                </motion.div>
              ) : (
                <form onSubmit={book} noValidate className="grid gap-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {days.map((d) => (
                      <button key={d.key} type="button" onClick={() => setSlot({ day: d.label, hour: slot?.hour ?? '' })} aria-pressed={slot?.day === d.label}
                        className={`min-h-12 shrink-0 cursor-pointer rounded-xl border px-3 text-xs font-bold capitalize ${slot?.day === d.label ? 'border-[#0E0F12] bg-[#0E0F12] text-white' : 'border-black/10 bg-white'}`}>{d.label}</button>
                    ))}
                  </div>
                  {slot?.day && (
                    <div className="grid grid-cols-4 gap-2">
                      {['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'].map((h) => (
                        <button key={h} type="button" onClick={() => setSlot({ day: slot.day, hour: h })} aria-pressed={slot.hour === h}
                          className={`min-h-11 cursor-pointer rounded-xl border text-sm font-bold ${slot.hour === h ? 'border-[#D7263D] bg-[#D7263D] text-white' : 'border-black/10 bg-white'}`}>{h}</button>
                      ))}
                    </div>
                  )}
                  <input className={field} placeholder="Seu nome" aria-label="Nome" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                  <input className={field} placeholder="WhatsApp (11) 91234-5678" aria-label="WhatsApp" type="tel" inputMode="numeric" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: maskPhone(e.target.value) })} />
                  <button type="submit" className="min-h-12 cursor-pointer rounded-full bg-[#D7263D] font-bold text-white">Agendar test drive</button>
                  <p className="text-center text-[11px] text-black/45">Demonstração: nenhum dado sai do seu navegador.</p>
                </form>
              ))}
              {error && <p role="alert" className="mt-3 rounded-xl bg-[#D7263D]/10 px-4 py-3 text-sm font-semibold text-[#9B1C2C]">{error}</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
