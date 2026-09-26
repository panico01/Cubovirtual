'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, CircleAlert, CircleCheck } from 'lucide-react'
import Booking from './Booking'
import Clinic from './Clinic'
import { seed, toKey, weekStart, type Appt } from './data'

// Guarda a agenda por semana; numa semana nova a demo recomeça com dados frescos
const KEY = 'vitalle-demo-v2'
const WHATSAPP = `https://wa.me/5517991191582?text=${encodeURIComponent('Vi a demo da Vitalle Clínica no portfólio e quero um sistema de agendamento.')}`

type View = 'paciente' | 'clinica'

export default function VitalleApp() {
  const [appts, setAppts] = useState<Appt[] | null>(null)
  const [view, setView] = useState<View>('paciente')
  const [highlight, setHighlight] = useState<string | null>(null)
  const [toast, setToast] = useState<{ id: number; msg: string; tone: 'ok' | 'error' } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const week = toKey(weekStart())
    let saved: { week: string; appts: Appt[] } | null = null
    try { saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') } catch {}
    setAppts(saved?.week === week && Array.isArray(saved.appts) ? saved.appts : seed())
  }, [])

  useEffect(() => {
    if (!appts) return
    try { localStorage.setItem(KEY, JSON.stringify({ week: toKey(weekStart()), appts })) } catch {}
  }, [appts])

  const notify = useCallback((msg: string, tone: 'ok' | 'error' = 'ok') => {
    clearTimeout(timer.current)
    setToast({ id: Date.now(), msg, tone })
    timer.current = setTimeout(() => setToast(null), 3800)
  }, [])

  const setList = setAppts as React.Dispatch<React.SetStateAction<Appt[]>>

  return (
    <div className="min-h-dvh bg-[#F4F1EA] font-[family-name:var(--v-sans)] text-[#1F3A2E]">
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-3 bg-[#111] px-3 text-white sm:px-5">
        <Link href="/portfolio/vitalle" aria-label="Voltar ao case" className="flex min-h-11 items-center gap-2 text-xs font-semibold text-white/70 hover:text-white">
          <ArrowLeft size={15} aria-hidden="true" /> <span className="hidden sm:inline">Voltar ao case</span>
        </Link>

        <div className="flex rounded-full bg-white/10 p-1 text-xs font-semibold" role="tablist" aria-label="Alternar visão da demo">
          {([['paciente', 'Site do paciente'], ['clinica', 'Painel da clínica']] as const).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}
              className={`relative min-h-8 cursor-pointer rounded-full px-3 transition-colors sm:px-4 ${view === id ? 'text-[#111]' : 'text-white/70 hover:text-white'}`}>
              {view === id && <motion.span layoutId="demo-view" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hidden min-h-8 items-center gap-1.5 rounded-full bg-[#EA580C] px-3 text-xs font-bold text-black md:inline-flex">
          Quero um assim <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <span className="text-xs font-semibold uppercase tracking-widest text-white/65 md:hidden">Demo</span>
      </header>

      {!appts ? (
        <div className="grid min-h-[calc(100dvh-3rem)] place-items-center">
          <span className="size-8 animate-spin rounded-full border-2 border-[#1F3A2E]/20 border-t-[#B08D57]" aria-label="Carregando" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {view === 'paciente' ? (
              <Booking
                appts={appts}
                onBook={(appt) => setAppts((list) => [...(list ?? []), appt])}
                onSeeClinic={(id) => { setHighlight(id); setView('clinica'); setTimeout(() => setHighlight(null), 8000) }}
              />
            ) : (
              <Clinic
                appts={appts}
                setAppts={setList}
                highlight={highlight}
                notify={notify}
                onReset={() => { setAppts(seed()); notify('Dados da demo restaurados') }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <p className="border-t border-[#1F3A2E]/10 px-5 py-4 text-center text-xs text-[#1F3A2E]/80">
        Projeto demonstrativo com marca e dados fictícios · desenvolvido por{' '}
        <Link href="/" className="font-semibold underline underline-offset-2 hover:text-[#1F3A2E]">Cubo Virtual</Link>
      </p>

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-4 bottom-5 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-[#111] px-4 py-3 text-sm text-white shadow-2xl">
            {toast.tone === 'ok'
              ? <CircleCheck size={18} className="shrink-0 text-[#25D366]" aria-hidden="true" />
              : <CircleAlert size={18} className="shrink-0 text-[#FF6B5A]" aria-hidden="true" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
