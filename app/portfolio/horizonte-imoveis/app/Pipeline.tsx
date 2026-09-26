'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Hand, Shuffle } from 'lucide-react'
import { ago, brl, brokerOf, brokers, compact, distribute, initials, moveStage, propertyOf, sources, stageLabel, stages, type Lead, type Stage } from './data'
import { display, muted, panel } from './ui'
import type { Notify } from './HorizonteApp'

type Drag = { id: string; x: number; y: number; w: number; offX: number; offY: number; over: Stage | null }

export default function Pipeline({ leads, setLeads, now, onOpen, notify }: {
  leads: Lead[]
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>
  now: number
  onOpen: (id: string) => void
  notify: Notify
}) {
  const [broker, setBroker] = useState<string | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [burst, setBurst] = useState<{ id: number; x: number; y: number } | null>(null)
  const [fresh, setFresh] = useState<string | null>(null)
  const start = useRef<{ id: string; x: number; y: number; rect: DOMRect } | null>(null)
  const columns = useRef(new Map<Stage, HTMLElement>())
  const board = useRef<HTMLDivElement>(null)

  const visible = leads.filter((l) => !broker || l.brokerId === broker)
  const unassigned = leads.filter((l) => !l.brokerId).length

  const columnAt = (x: number, y: number) => {
    for (const [stage, el] of columns.current) {
      const r = el.getBoundingClientRect()
      if (x >= r.left && x <= r.right && y >= r.top - 40 && y <= r.bottom + 40) return stage
    }
    return null
  }

  const onDown = (e: React.PointerEvent<HTMLElement>, lead: Lead) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { id: lead.id, x: e.clientX, y: e.clientY, rect: e.currentTarget.getBoundingClientRect() }
  }

  const onMove = (e: React.PointerEvent) => {
    const s = start.current
    if (!s) return
    if (!drag && Math.hypot(e.clientX - s.x, e.clientY - s.y) < 6) return
    // arrasta o quadro junto quando o card encosta na borda (celular e telas estreitas)
    if (board.current) {
      if (e.clientX < 48) board.current.scrollLeft -= 14
      if (e.clientX > window.innerWidth - 48) board.current.scrollLeft += 14
    }
    setDrag({ id: s.id, x: e.clientX, y: e.clientY, w: s.rect.width, offX: s.x - s.rect.left, offY: s.y - s.rect.top, over: columnAt(e.clientX, e.clientY) })
  }

  const onUp = (lead: Lead) => {
    const d = drag
    start.current = null
    setDrag(null)
    if (!d) return onOpen(lead.id)
    if (!d.over || d.over === lead.stage) return
    if (!lead.brokerId && d.over !== 'novo') return notify('Distribua o lead para um corretor antes de avançar.', 'error')
    setLeads((list) => list.map((l) => (l.id === lead.id ? moveStage(l, d.over!) : l)))
    setFresh(lead.id)
    if (d.over === 'fechado') {
      setBurst({ id: Date.now(), x: d.x, y: d.y })
      notify(`Venda fechada! ${lead.name} · ${brl(lead.value)}`)
    } else {
      notify(`${lead.name.split(' ')[0]} movido para ${stageLabel(d.over)}`)
    }
  }

  const runRoulette = () => {
    const { leads: next, assigned } = distribute(leads)
    setLeads(next)
    const names = [...new Set(assigned.map((a) => brokerOf(a.brokerId)!.name.split(' ')[0]))]
    notify(`${assigned.length} ${assigned.length === 1 ? 'lead distribuído' : 'leads distribuídos'} pela roleta para ${names.join(', ')}`)
  }

  const dragged = drag && leads.find((l) => l.id === drag.id)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" aria-label="Filtrar por corretor">
          {[null, ...brokers].map((b) => {
            const active = broker === (b?.id ?? null)
            return (
              <button key={b?.id ?? 'all'} type="button" onClick={() => setBroker(b?.id ?? null)} aria-pressed={active}
                className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-colors ${active ? 'border-[#2DD4BF]/40 bg-[#2DD4BF]/15 text-[#2DD4BF]' : 'border-white/10 text-white/60 hover:text-white'}`}>
                {b && <span className="grid size-5 place-items-center rounded-full text-xs font-bold text-[#0A1418]" style={{ background: b.color }}>{initials(b.name)}</span>}
                {b ? b.name.split(' ')[0] : 'Toda a equipe'}
              </button>
            )
          })}
        </div>
        <AnimatePresence>
          {unassigned > 0 && (
            <motion.button type="button" onClick={runRoulette}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-[#2DD4BF] px-4 text-sm font-bold text-[#0A1418] shadow-[0_0_24px_-4px_#2DD4BF] transition-transform hover:-translate-y-0.5">
              <Shuffle size={16} aria-hidden="true" /> Distribuir {unassigned} {unassigned === 1 ? 'lead' : 'leads'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <p className={`mt-4 flex items-center gap-2 text-xs ${muted}`}><Hand size={14} aria-hidden="true" /> Arraste os cards entre as etapas · toque para abrir a ficha do lead</p>

      <div ref={board} className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8">
        {stages.map((s) => {
          const items = visible.filter((l) => l.stage === s.id).sort((a, b) => b.updatedAt - a.updatedAt)
          const over = drag?.over === s.id && dragged?.stage !== s.id
          return (
            <section key={s.id} ref={(el) => { if (el) columns.current.set(s.id, el); else columns.current.delete(s.id) }}
              aria-label={s.label}
              className={`flex w-[17rem] shrink-0 flex-col rounded-2xl border p-2.5 transition-colors xl:w-auto xl:min-w-0 xl:flex-1 ${over ? 'border-[#2DD4BF]/60 bg-[#2DD4BF]/[.07]' : 'border-white/[.06] bg-white/[.02]'}`}>
              <header className="flex items-center justify-between px-1.5 pb-3 pt-1">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  {s.id === 'fechado' && <BadgeCheck size={16} className="text-[#4ADE80]" aria-hidden="true" />}
                  {s.label}
                  <span className="rounded-full bg-white/[.08] px-2 py-0.5 text-xs tabular-nums text-white/70">{items.length}</span>
                </h2>
                <span className={`text-xs tabular-nums ${muted}`}>{compact(items.reduce((a, l) => a + l.value, 0))}</span>
              </header>
              <div className="grid min-h-24 content-start gap-2">
                <AnimatePresence initial={false}>
                  {items.map((lead) => (
                    <motion.div key={lead.id} layout
                      initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: drag?.id === lead.id ? 0.3 : 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}>
                      <Card lead={lead} now={now} glowing={fresh === lead.id}
                        onPointerDown={(e) => onDown(e, lead)} onPointerMove={onMove} onPointerUp={() => onUp(lead)}
                        onPointerCancel={() => { start.current = null; setDrag(null) }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(lead.id) } }} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )
        })}
      </div>

      {drag && dragged && (
        <div className="pointer-events-none fixed z-50 rotate-[2.5deg]" style={{ left: drag.x - drag.offX, top: drag.y - drag.offY, width: drag.w }}>
          <Card lead={dragged} now={now} lifted />
        </div>
      )}

      <AnimatePresence>
        {burst && (
          <div key={burst.id} className="pointer-events-none fixed z-50" style={{ left: burst.x, top: burst.y }} aria-hidden="true">
            {Array.from({ length: 22 }, (_, i) => {
              const angle = (i / 22) * Math.PI * 2
              const dist = 70 + (i % 4) * 28
              return (
                <motion.span key={i} className="absolute size-2 rounded-sm" style={{ background: ['#2DD4BF', '#38BDF8', '#FBBF24', '#4ADE80'][i % 4] }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist + 40, opacity: 0, rotate: 200 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  onAnimationComplete={() => i === 0 && setBurst(null)} />
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Card({ lead, now, lifted, glowing, ...handlers }: {
  lead: Lead
  now: number
  lifted?: boolean
  glowing?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  const property = propertyOf(lead.propertyId)
  const broker = brokerOf(lead.brokerId)
  const source = sources.find((s) => s.id === lead.source)!

  return (
    <div data-glow role="button" tabIndex={0} aria-label={`${lead.name}, ${property.title}`} {...handlers}
      className={`${panel} relative cursor-grab touch-none select-none bg-[#0F1F24]/80 p-3 active:cursor-grabbing ${lifted ? 'border-[#2DD4BF]/50 shadow-2xl shadow-black/60' : ''}`}>
      {glowing && (
        <motion.span key={lead.updatedAt} className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#2DD4BF] shadow-[0_0_28px_-2px_#2DD4BF]"
          initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.8, ease: 'easeOut' }} aria-hidden="true" />
      )}
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-sm font-semibold leading-tight">{lead.name}</p>
        <span className="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold" style={{ background: `${source.color}1f`, color: source.color }}>{lead.source}</span>
      </div>
      <p className={`mt-1 truncate text-xs ${muted}`}>{property.title} · {property.hood}</p>
      <p className={`${display} mt-2 text-base font-bold tabular-nums`}>{brl(lead.value)}</p>
      <div className="mt-2.5 flex items-center justify-between border-t border-white/[.06] pt-2.5">
        {broker ? (
          <span className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="grid size-5 place-items-center rounded-full text-xs font-bold text-[#0A1418]" style={{ background: broker.color }}>{initials(broker.name)}</span>
            {broker.name.split(' ')[0]}
          </span>
        ) : (
          <span className="rounded-full bg-[#FBBF24]/15 px-2 py-0.5 text-xs font-semibold text-[#FBBF24]">Sem corretor</span>
        )}
        <span className={`text-xs ${muted}`}>{ago(lead.updatedAt, now)}</span>
      </div>
    </div>
  )
}
