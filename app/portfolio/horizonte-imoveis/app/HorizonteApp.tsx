'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, CircleAlert, CircleCheck, Columns3, LayoutDashboard, RotateCcw, Sparkles } from 'lucide-react'
import Dashboard from './Dashboard'
import Pipeline from './Pipeline'
import LeadDrawer from './LeadDrawer'
import { brokers, incoming, initials, seed, type Lead } from './data'
import { display } from './ui'

// Recomeça com dados frescos a cada dia, para as datas relativas ("há 2 h") sempre fazerem sentido
const KEY = 'horizonte-demo-v1'
const MAX_LIVE = 8
const WHATSAPP = `https://wa.me/5517991191582?text=${encodeURIComponent('Vi a demo do CRM Horizonte Imóveis no portfólio e quero um sistema assim.')}`

export type Notify = (msg: string, tone?: 'ok' | 'error' | 'lead') => void
type View = 'painel' | 'funil'

export default function HorizonteApp() {
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [view, setView] = useState<View>('painel')
  const [openId, setOpenId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ id: number; msg: string; tone: 'ok' | 'error' | 'lead' } | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const leadsRef = useRef(leads)
  leadsRef.current = leads

  useEffect(() => {
    const day = new Date().toDateString()
    let saved: { day: string; leads: Lead[] } | null = null
    try { saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') } catch {}
    setLeads(saved?.day === day && Array.isArray(saved.leads) ? saved.leads : seed())
  }, [])

  useEffect(() => {
    if (!leads) return
    try { localStorage.setItem(KEY, JSON.stringify({ day: new Date().toDateString(), leads })) } catch {}
  }, [leads])

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30_000); return () => clearInterval(t) }, [])

  const notify = useCallback<Notify>((msg, tone = 'ok') => {
    clearTimeout(timer.current)
    setToast({ id: Date.now(), msg, tone })
    timer.current = setTimeout(() => setToast(null), 4200)
  }, [])

  // Leads "chegando ao vivo": o primeiro em poucos segundos, depois a cada 15–30 s
  const ready = leads !== null
  useEffect(() => {
    if (!ready) return
    let t: ReturnType<typeof setTimeout>
    const schedule = (delay: number) => {
      t = setTimeout(() => {
        const live = (leadsRef.current ?? []).filter((l) => l.id.startsWith('live')).length
        if (!document.hidden && live < MAX_LIVE) {
          const lead = incoming(live)
          setLeads((list) => (list ? [...list, lead] : list))
          notify(`Novo lead via ${lead.source}: ${lead.name}`, 'lead')
          setNow(Date.now())
        }
        schedule(15_000 + Math.random() * 15_000)
      }, delay)
    }
    schedule(6_000)
    return () => clearTimeout(t)
  }, [ready, notify])

  const glow = (e: React.PointerEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-glow]')
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const nav = [
    { id: 'painel' as const, label: 'Painel', icon: LayoutDashboard },
    { id: 'funil' as const, label: 'Funil de vendas', icon: Columns3 },
  ]
  const open = leads?.find((l) => l.id === openId) ?? null
  const setList = setLeads as React.Dispatch<React.SetStateAction<Lead[]>>

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#0A1418] font-[family-name:var(--h-sans)] text-[#E6F1F2]" onPointerMove={glow}>
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-[#2DD4BF]/[.13] blur-[120px]" />
        <div className="absolute -right-40 top-1/3 size-[30rem] rounded-full bg-[#38BDF8]/[.10] blur-[120px]" />
        <div className="absolute inset-0 opacity-[.35] [background-image:linear-gradient(rgba(230,241,242,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(230,241,242,.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-3 border-b border-white/[.06] bg-[#050A0C]/80 px-3 backdrop-blur-md sm:px-5">
        <Link href="/portfolio/horizonte-imoveis" aria-label="Voltar ao case" className="flex min-h-11 items-center gap-2 text-xs font-semibold text-white/60 hover:text-white">
          <ArrowLeft size={15} aria-hidden="true" /> <span className="hidden sm:inline">Voltar ao case</span>
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/65">Demo · CRM imobiliário</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hidden min-h-8 items-center gap-1.5 rounded-full bg-[#EA580C] px-3 text-xs font-bold text-black md:inline-flex">
          Quero um assim <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <span className="w-6 md:hidden" />
      </header>

      <div className="relative grid min-h-[calc(100dvh-3rem)] lg:grid-cols-[15rem_1fr]">
        <aside className="hidden flex-col justify-between border-r border-white/[.06] p-6 lg:flex">
          <div>
            <Logo />
            <nav className="mt-10 grid gap-1" aria-label="CRM">
              {nav.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}
                  className={`relative flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${view === id ? 'text-[#2DD4BF]' : 'text-white/60 hover:text-white'}`}>
                  {view === id && <motion.span layoutId="h-nav" className="absolute inset-0 rounded-xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <Icon size={18} className="relative" aria-hidden="true" /><span className="relative">{label}</span>
                </button>
              ))}
            </nav>

            <p className="mt-10 text-xs font-semibold uppercase tracking-[.25em] text-white/65">Corretores online</p>
            <ul className="mt-4 grid gap-3">
              {brokers.map((b) => (
                <li key={b.id} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="relative grid size-8 place-items-center rounded-full text-xs font-bold text-[#0A1418]" style={{ background: b.color }}>
                    {initials(b.name)}
                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#0A1418] bg-[#4ADE80]" />
                  </span>
                  {b.name}
                </li>
              ))}
            </ul>
          </div>
          <button type="button" onClick={() => { setLeads(seed()); notify('Dados da demo restaurados') }} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-white/65 hover:text-white">
            <RotateCcw size={15} aria-hidden="true" /> Restaurar dados da demo
          </button>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="lg:hidden"><Logo /></div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-white/65 first-letter:uppercase">{new Date(now).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <h1 className={`${display} mt-1 text-3xl font-bold tracking-tight`}>{view === 'painel' ? 'Visão geral' : 'Funil de vendas'}</h1>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 px-3 py-1.5 text-xs font-semibold text-[#2DD4BF]">
              <span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#2DD4BF]" /><span className="relative size-2 rounded-full bg-[#2DD4BF]" /></span>
              Ao vivo · recebendo leads
            </span>
          </div>

          <div className="mt-5 flex gap-2 lg:hidden">
            {nav.map(({ id, label }) => (
              <button key={id} type="button" onClick={() => setView(id)} aria-pressed={view === id}
                className={`min-h-11 flex-1 cursor-pointer rounded-full text-sm font-semibold ${view === id ? 'bg-[#2DD4BF] text-[#0A1418]' : 'bg-white/[.06] text-white/75'}`}>
                {label}
              </button>
            ))}
          </div>

          {!leads ? (
            <div className="grid min-h-[60vh] place-items-center">
              <span className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-[#2DD4BF]" aria-label="Carregando" />
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="mt-6">
                {view === 'painel'
                  ? <Dashboard leads={leads} now={now} onOpen={setOpenId} />
                  : <Pipeline leads={leads} setLeads={setList} now={now} onOpen={setOpenId} notify={notify} />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <p className="relative border-t border-white/[.06] px-5 py-4 text-center text-xs text-white/65">
        Projeto demonstrativo com marca e dados fictícios · desenvolvido por{' '}
        <Link href="/" className="font-semibold underline underline-offset-2 hover:text-white">Cubo Virtual</Link>
      </p>

      <LeadDrawer lead={open} setLeads={setList} now={now} notify={notify} onClose={() => setOpenId(null)} />

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-4 bottom-5 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-[#0F1F24]/95 px-4 py-3 text-sm shadow-2xl shadow-black/50 backdrop-blur-md">
            {toast.tone === 'lead' && <Sparkles size={18} className="shrink-0 text-[#2DD4BF]" aria-hidden="true" />}
            {toast.tone === 'ok' && <CircleCheck size={18} className="shrink-0 text-[#4ADE80]" aria-hidden="true" />}
            {toast.tone === 'error' && <CircleAlert size={18} className="shrink-0 text-[#FB7185]" aria-hidden="true" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 32 32" className="size-9" aria-hidden="true">
        <path d="M5 21a11 11 0 0 1 22 0Z" fill="#2DD4BF" />
        <path d="M2 25h28M7 29h18" stroke="#E6F1F2" strokeWidth="2" strokeLinecap="round" opacity=".7" />
      </svg>
      <div className="leading-none">
        <p className={`${display} text-lg font-bold tracking-tight`}>horizonte</p>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-[.3em] text-[#2DD4BF]">imóveis</p>
      </div>
    </div>
  )
}
