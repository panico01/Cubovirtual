'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Bot, Check, CircleSlash, Cpu, Image as ImageIcon, Link2, Pause, Play, Send, Sparkles, Users, X } from 'lucide-react'
import { offers, processOffer, stores, TAG, type Offer, type Result, type Store } from './data'

type Status = 'processando' | 'enviada' | 'descartada'
type Entry = { key: number; offer: Offer; result: Result; status: Status }
type WaMsg = { key: number; offer: Offer; text: string; converted: string; format: 'foto' | 'card' }

const GROUPS = ['Ofertas do Dia 🔥', 'Achadinhos VIP', 'Casa & Cozinha']
const STEP_MS = 520
const card = 'rounded-[14px] border border-[#1C2330] bg-[#0D1117]'

const stepsFor = (r: Result) => r.ok
  ? [`Link da ${stores.find((s) => s.id === r.store)!.name} detectado`, 'Link encurtado aberto com segurança', `Convertido com a tag ${TAG}`, 'Frases bloqueadas removidas', `Enviado para ${GROUPS.length} grupos`]
  : ['Links analisados', r.reason]

export default function AffiliaDemo() {
  const [enabled, setEnabled] = useState<Record<Store, boolean>>({ amazon: true, ml: true, shopee: true })
  const [format, setFormat] = useState<'foto' | 'card'>('foto')
  const [running, setRunning] = useState(true)
  const [feed, setFeed] = useState<Entry[]>([])
  const [wa, setWa] = useState<WaMsg[]>([])
  const [current, setCurrent] = useState<Entry | null>(null)
  const [step, setStep] = useState(0)
  const [stats, setStats] = useState({ recebidas: 0, enviadas: 0, descartadas: 0 })
  const next = useRef(0)
  const settled = useRef<number | null>(null)
  const cfg = useRef({ enabled, format })
  cfg.current = { enabled, format }

  const receive = useCallback(() => {
    const offer = offers[next.current++ % offers.length]
    const entry: Entry = { key: Date.now(), offer, result: processOffer(offer.text, cfg.current.enabled), status: 'processando' }
    setFeed((f) => [entry, ...f].slice(0, 8))
    setCurrent(entry)
    setStep(0)
    setStats((s) => ({ ...s, recebidas: s.recebidas + 1 }))
  }, [])

  // chegada automática de ofertas enquanto a automação está ligada
  useEffect(() => {
    if (!running) return
    const first = setTimeout(receive, 900)
    const t = setInterval(() => { if (!document.hidden) receive() }, 6500)
    return () => { clearTimeout(first); clearInterval(t) }
  }, [running, receive])

  // etapas do motor aparecem uma a uma; na última, a oferta é enviada ou descartada
  useEffect(() => {
    if (!current) return
    const total = stepsFor(current.result).length
    if (step < total) {
      const t = setTimeout(() => setStep((s) => s + 1), STEP_MS)
      return () => clearTimeout(t)
    }
    if (settled.current === current.key) return
    settled.current = current.key
    const r = current.result
    const status: Status = r.ok ? 'enviada' : 'descartada'
    setFeed((f) => f.map((e) => (e.key === current.key ? { ...e, status } : e)))
    setStats((s) => (r.ok ? { ...s, enviadas: s.enviadas + 1 } : { ...s, descartadas: s.descartadas + 1 }))
    if (r.ok) setWa((w) => [...w, { key: current.key, offer: current.offer, text: r.text, converted: r.converted, format: cfg.current.format }].slice(-6))
  }, [current, step])

  const kpis = [
    { label: 'Ofertas recebidas', value: stats.recebidas, icon: Send },
    { label: 'Enviadas aos grupos', value: stats.enviadas, icon: Check },
    { label: 'Descartadas', value: stats.descartadas, icon: CircleSlash },
    { label: 'Grupos de destino', value: GROUPS.length, icon: Users },
  ]

  return (
    <div className="min-h-dvh bg-[#07090E] font-[family-name:var(--a-sans)] text-[#E9EDF5]">
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-3 border-b border-[#1C2330] bg-[#07090E]/90 px-3 backdrop-blur sm:px-5">
        <Link href="/portfolio/affiliabot" className="flex min-h-11 items-center gap-2 text-xs font-semibold text-white/60 hover:text-white">
          <ArrowLeft size={15} aria-hidden="true" /> <span className="hidden sm:inline">Voltar ao case</span>
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-white/45">Demo · Simulação do AffiliaBOT</p>
        <a href="https://affiliabot.com.br" target="_blank" rel="noopener noreferrer" className="hidden min-h-8 items-center gap-1.5 rounded-full bg-[#2563EB] px-3 text-xs font-bold text-white md:inline-flex">
          Conhecer o produto <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <span className="w-6 md:hidden" />
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#2563EB]"><Bot size={22} aria-hidden="true" /></span>
            <div>
              <p className="text-lg font-bold">AffiliaBOT</p>
              <p className="text-xs text-[#A0AABB]">Telegram → conversão de links → WhatsApp</p>
            </div>
          </div>
          <button type="button" onClick={() => setRunning((r) => !r)} aria-pressed={running}
            className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold ${running ? 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#4ADE80]' : 'border-[#1C2330] text-[#A0AABB]'}`}>
            {running ? <><span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#4ADE80]" /><span className="relative size-2 rounded-full bg-[#4ADE80]" /></span> Automação ligada <Pause size={14} aria-hidden="true" /></> : <>Automação pausada <Play size={14} aria-hidden="true" /></>}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ label, value, icon: Icon }) => (
            <div key={label} className={`${card} p-4`}>
              <p className="flex items-center justify-between text-xs text-[#A0AABB]">{label}<Icon size={14} aria-hidden="true" /></p>
              <motion.p key={value} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="mt-2 text-3xl font-bold tabular-nums">{value}</motion.p>
            </div>
          ))}
        </div>

        <div className={`${card} mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 p-4`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8599]">Lojas</p>
          {stores.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <button type="button" role="switch" aria-checked={enabled[s.id]} aria-label={s.name} onClick={() => setEnabled((e) => ({ ...e, [s.id]: !e[s.id] }))}
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${enabled[s.id] ? 'bg-[#2563EB]' : 'bg-[#242C3B]'}`}>
                <motion.span layout className={`absolute top-1 size-4 rounded-full bg-white ${enabled[s.id] ? 'right-1' : 'left-1'}`} />
              </button>
              <span className="size-2 rounded-full" style={{ background: s.color }} />{s.name}
            </label>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8599]">Formato</p>
            <div className="flex rounded-[10px] bg-[#131924] p-1 text-xs font-semibold">
              {([['foto', 'Foto + legenda', ImageIcon], ['card', 'Card do link', Link2]] as const).map(([id, label, Icon]) => (
                <button key={id} type="button" onClick={() => setFormat(id)} aria-pressed={format === id}
                  className={`flex min-h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 ${format === id ? 'bg-[#2563EB] text-white' : 'text-[#A0AABB]'}`}>
                  <Icon size={13} aria-hidden="true" />{label}
                </button>
              ))}
            </div>
            <button type="button" onClick={receive} className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#2C3648] px-3 text-xs font-semibold hover:bg-[#131924]">
              <Sparkles size={13} aria-hidden="true" /> Simular oferta
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.1fr_1fr]">
          <section className={`${card} p-4`} aria-label="Canais do Telegram">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><Send size={15} className="text-[#38BDF8]" aria-hidden="true" /> Canais do Telegram</h2>
            <ul className="mt-3 grid gap-2">
              <AnimatePresence initial={false}>
                {feed.map((e) => (
                  <motion.li key={e.key} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="rounded-[10px] border border-[#1C2330] bg-[#131924] p-3">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-[#38BDF8]">{e.offer.channel}</span>
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${e.status === 'enviada' ? 'bg-[#22C55E]/15 text-[#4ADE80]' : e.status === 'descartada' ? 'bg-[#EF4444]/15 text-[#F87171]' : 'bg-[#FBBF24]/15 text-[#FBBF24]'}`}>{e.status}</span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs text-[#A0AABB]">{e.offer.text.split('\n')[0]}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
              {!feed.length && <p className="py-8 text-center text-xs text-[#7A8599]">Aguardando ofertas dos canais…</p>}
            </ul>
          </section>

          <section className={`${card} p-4`} aria-label="Motor de conversão">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><Cpu size={15} className="text-[#3B82F6]" aria-hidden="true" /> Motor</h2>
            {current ? (
              <div className="mt-3">
                <p className="text-xs text-[#7A8599]">Processando: <span className="text-[#E9EDF5]">{current.offer.title}</span></p>
                <ol className="mt-4 grid gap-2.5">
                  {stepsFor(current.result).map((label, i) => {
                    const failed = !current.result.ok && i === 1
                    const shown = i < step
                    return (
                      <motion.li key={`${current.key}-${i}`} initial={{ opacity: 0.25 }} animate={{ opacity: shown ? 1 : 0.25 }} className="flex items-center gap-3 text-sm">
                        <span className={`grid size-6 shrink-0 place-items-center rounded-full border ${shown ? (failed ? 'border-[#EF4444] bg-[#EF4444] text-white' : 'border-[#2563EB] bg-[#2563EB] text-white') : 'border-[#2C3648]'}`}>
                          {shown && (failed ? <X size={13} aria-hidden="true" /> : <Check size={13} aria-hidden="true" />)}
                        </span>
                        <span className={failed && shown ? 'font-semibold text-[#F87171]' : ''}>{failed ? `Descartada: ${label}` : label}</span>
                      </motion.li>
                    )
                  })}
                </ol>
                {current.result.ok && step >= 3 && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid gap-1.5 rounded-[10px] bg-[#090C12] p-3 font-mono text-[11px] leading-relaxed">
                    <p className="break-all text-[#7A8599] line-through">{current.result.original}</p>
                    <p className="break-all text-[#E9EDF5]">
                      {current.result.converted.split(TAG)[0]}<mark className="rounded bg-[#2563EB]/30 px-0.5 text-[#93C5FD]">{TAG}</mark>{current.result.converted.split(TAG)[1]}
                    </p>
                  </motion.div>
                )}
                {!current.result.ok && step >= 2 && (
                  <p className="mt-4 rounded-[10px] border border-[#EF4444]/30 bg-[#EF4444]/10 p-3 text-xs text-[#FCA5A5]">
                    Regra do produto: se qualquer link não gera comissão, a mensagem inteira (texto e foto) não é repassada.
                  </p>
                )}
              </div>
            ) : <p className="py-8 text-center text-xs text-[#7A8599]">Motor ocioso</p>}
          </section>

          <section className="overflow-hidden rounded-[14px] border border-[#1C2330] bg-[#0B141A]" aria-label="Grupo do WhatsApp">
            <div className="flex items-center gap-3 bg-[#1F2C34] px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-[#25D366]/20 text-[#25D366]"><Users size={17} aria-hidden="true" /></span>
              <div><p className="text-sm font-semibold">{GROUPS[0]}</p><p className="text-[11px] text-[#8696A0]">+ {GROUPS.length - 1} grupos recebendo junto</p></div>
            </div>
            <div className="flex min-h-[26rem] flex-col justify-end gap-2 bg-[#0B141A] p-3">
              <AnimatePresence initial={false}>
                {wa.map((m) => (
                  <motion.div key={m.key} layout initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="max-w-[92%] self-start rounded-lg rounded-tl-none bg-[#202C33] p-1.5 text-[13px] leading-snug">
                    {m.format === 'foto' ? (
                      <div className="grid aspect-[4/3] w-56 max-w-full place-items-center rounded-md bg-gradient-to-br from-[#2A3942] to-[#111B21] text-6xl" aria-hidden="true">{m.offer.image}</div>
                    ) : (
                      <div className="flex gap-2 rounded-md bg-[#111B21] p-2">
                        <span className="grid size-14 shrink-0 place-items-center rounded bg-[#2A3942] text-3xl" aria-hidden="true">{m.offer.image}</span>
                        <span className="min-w-0"><span className="block truncate text-xs font-semibold">{m.offer.title}</span><span className="block truncate text-[11px] text-[#8696A0]">{m.converted.replace(/^https?:\/\//, '').split('/')[0]}</span></span>
                      </div>
                    )}
                    <p className="whitespace-pre-line break-words px-1.5 pb-1 pt-1.5">
                      {m.text.split(m.converted).map((part, i, arr) => (
                        <span key={i}>{part}{i < arr.length - 1 && <span className="break-all text-[#53BDEB] underline">{m.converted}</span>}</span>
                      ))}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!wa.length && <p className="py-8 text-center text-xs text-[#8696A0]">As ofertas convertidas aparecem aqui</p>}
            </div>
          </section>
        </div>

        <p className="mt-6 text-center text-xs text-[#7A8599]">
          Simulação com ofertas e links fictícios, feita para mostrar como o AffiliaBOT trabalha. Nenhuma mensagem é enviada de verdade.
        </p>
      </main>
    </div>
  )
}
