'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, Hand, MessageCircle, RotateCcw, Search, UsersRound, X } from 'lucide-react'
import {
  CLOSE, DAYS, OPEN, SLOT, addDays, brl, conflicts, dayLabel, fromKey, hhmm, proOf, pros, serviceOf, toKey, weekStart, type Appt,
} from './data'

const serif = 'font-[family-name:var(--v-serif)]'
const ROW = 28 // px por 30 minutos
const first = (name: string) => name.split(' ')[0]
const sortAppts = (a: Appt, b: Appt) => a.date.localeCompare(b.date) || a.start - b.start

type Props = {
  appts: Appt[]
  setAppts: React.Dispatch<React.SetStateAction<Appt[]>>
  highlight: string | null
  notify: (msg: string, tone?: 'ok' | 'error') => void
  onReset: () => void
}

export default function Clinic({ appts, setAppts, highlight, notify, onReset }: Props) {
  const [tab, setTab] = useState<'agenda' | 'pacientes'>('agenda')
  const [week, setWeek] = useState(() => {
    const target = appts.find((a) => a.id === highlight)
    return weekStart(target ? fromKey(target.date) : new Date())
  })
  const [visible, setVisible] = useState(pros.map((p) => p.id))
  const [openId, setOpenId] = useState<string | null>(null)

  const days = useMemo(() => Array.from({ length: DAYS }, (_, i) => toKey(addDays(week, i))), [week])
  const weekAppts = appts.filter((a) => days.includes(a.date))
  const open = appts.find((a) => a.id === openId) ?? null

  const toggle = (id: string) =>
    setVisible((v) => (v.includes(id) ? (v.length > 1 ? v.filter((x) => x !== id) : v) : pros.map((p) => p.id).filter((p) => p === id || v.includes(p))))

  const nav = [
    { id: 'agenda' as const, label: 'Agenda', icon: CalendarDays },
    { id: 'pacientes' as const, label: 'Pacientes', icon: UsersRound },
  ]

  return (
    <div className="grid min-h-[calc(100dvh-3rem)] bg-[#F7F5F0] lg:grid-cols-[15rem_1fr]">
      <aside className="hidden flex-col justify-between bg-[#16291F] p-6 text-[#F4F1EA] lg:flex">
        <div>
          <p className={`${serif} text-3xl font-semibold leading-none`}>Vitalle</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[.4em] text-[#D9BC8C]">Painel da clínica</p>
          <nav className="mt-10 grid gap-1" aria-label="Painel">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
                className={`relative flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${tab === id ? 'text-[#16291F]' : 'text-[#F4F1EA]/75 hover:text-[#F4F1EA]'}`}>
                {tab === id && <motion.span layoutId="clinic-nav" className="absolute inset-0 rounded-xl bg-[#F4F1EA]" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <Icon size={18} className="relative" aria-hidden="true" /><span className="relative">{label}</span>
              </button>
            ))}
          </nav>
          <p className="mt-10 text-[10px] font-semibold uppercase tracking-[.25em] text-[#F4F1EA]/50">Equipe</p>
          <ul className="mt-3 grid gap-3 text-sm">
            {pros.map((p) => (
              <li key={p.id} className="flex items-center gap-3"><span className="size-2.5 rounded-full" style={{ background: p.color }} />{p.name}</li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={onReset} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-[#F4F1EA]/60 hover:text-[#F4F1EA]">
          <RotateCcw size={15} aria-hidden="true" /> Restaurar dados da demo
        </button>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-8">
        <div className="mb-6 flex gap-2 lg:hidden">
          {nav.map(({ id, label }) => (
            <button key={id} type="button" onClick={() => setTab(id)} aria-pressed={tab === id}
              className={`min-h-11 flex-1 cursor-pointer rounded-full text-sm font-semibold ${tab === id ? 'bg-[#16291F] text-[#F4F1EA]' : 'bg-white text-[#1F3A2E]'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'agenda' ? (
          <>
            <Kpis appts={weekAppts} />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setWeek(addDays(week, -7))} className="grid size-11 cursor-pointer place-items-center rounded-full bg-white hover:bg-[#1F3A2E]/5" aria-label="Semana anterior"><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => setWeek(addDays(week, 7))} className="grid size-11 cursor-pointer place-items-center rounded-full bg-white hover:bg-[#1F3A2E]/5" aria-label="Próxima semana"><ChevronRight size={18} /></button>
                <h2 className={`${serif} ml-2 text-2xl font-semibold sm:text-3xl`}>
                  {week.getDate()} {week.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')} – {addDays(week, DAYS - 1).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '')}
                </h2>
                <button type="button" onClick={() => setWeek(weekStart())} className="ml-1 min-h-9 cursor-pointer rounded-full border border-[#1F3A2E]/15 px-3 text-xs font-semibold hover:bg-white">Hoje</button>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Filtrar por profissional">
                {pros.map((p) => (
                  <button key={p.id} type="button" onClick={() => toggle(p.id)} aria-pressed={visible.includes(p.id)}
                    className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-opacity ${visible.includes(p.id) ? 'border-transparent bg-white shadow-sm' : 'border-[#1F3A2E]/15 opacity-50'}`}>
                    <span className="size-2 rounded-full" style={{ background: p.color }} />{p.name.split(' ').slice(0, 2).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-[#1F3A2E]/60"><Hand size={14} aria-hidden="true" /> Arraste uma consulta para remarcar · toque para abrir a ficha</p>

            <WeekGrid days={days} appts={weekAppts} all={appts} visible={visible} highlight={highlight} setAppts={setAppts} notify={notify} onOpen={setOpenId} />
          </>
        ) : (
          <Patients appts={appts} onOpen={setOpenId} />
        )}
      </main>

      <Drawer appt={open} appts={appts} setAppts={setAppts} notify={notify} onClose={() => setOpenId(null)} />
    </div>
  )
}

function CountUp({ value, format = (n: number) => String(Math.round(n)) }: { value: number; format?: (n: number) => string }) {
  const [shown, setShown] = useState(0)
  const last = useRef(0)
  useEffect(() => {
    const controls = animate(last.current, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => { last.current = v; setShown(v) } })
    return () => controls.stop()
  }, [value])
  return <>{format(shown)}</>
}

function Kpis({ appts }: { appts: Appt[] }) {
  const minutes = appts.reduce((sum, a) => sum + serviceOf(a.serviceId).duration, 0)
  const items = [
    { label: 'Consultas na semana', value: appts.length },
    { label: 'Confirmadas', value: appts.length ? (appts.filter((a) => a.status === 'confirmado').length / appts.length) * 100 : 0, format: (n: number) => `${Math.round(n)}%` },
    { label: 'Faturamento previsto', value: appts.reduce((sum, a) => sum + serviceOf(a.serviceId).price, 0), format: (n: number) => brl(Math.round(n)) },
    { label: 'Ocupação da equipe', value: (minutes / (pros.length * DAYS * (CLOSE - OPEN))) * 100, format: (n: number) => `${Math.round(n)}%` },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item, i) => (
        <div key={item.label} className={`rounded-2xl p-4 sm:p-5 ${i === 2 ? 'bg-[#1F3A2E] text-[#F4F1EA]' : 'bg-white'}`}>
          <p className={`text-xs font-semibold ${i === 2 ? 'text-[#F4F1EA]/65' : 'text-[#1F3A2E]/60'}`}>{item.label}</p>
          <p className={`${serif} mt-2 text-3xl font-semibold lining-nums tabular-nums sm:text-4xl`}><CountUp value={item.value} format={item.format} /></p>
        </div>
      ))}
    </div>
  )
}

function WeekGrid({ days, appts, all, visible, highlight, setAppts, notify, onOpen }: {
  days: string[]
  appts: Appt[]
  all: Appt[]
  visible: string[]
  highlight: string | null
  setAppts: Props['setAppts']
  notify: Props['notify']
  onOpen: (id: string) => void
}) {
  const body = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: string; x: number; y: number; day: number; start: number; moved: boolean } | null>(null)
  const [ghost, setGhost] = useState<{ id: string; day: number; start: number } | null>(null)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(t) }, [])

  const lanes = pros.map((p) => p.id).filter((id) => visible.includes(id))
  const rows = (CLOSE - OPEN) / SLOT
  const todayIdx = days.indexOf(toKey(now))
  const nowMin = now.getHours() * 60 + now.getMinutes()

  const moveTo = (a: Appt, g: { day: number; start: number }) => ({ ...a, date: days[g.day], start: g.start })
  const ghostAppt = ghost && all.find((a) => a.id === ghost.id)
  const ghostBad = !!ghostAppt && conflicts(all, moveTo(ghostAppt, ghost))

  const onDown = (e: React.PointerEvent, a: Appt, day: number) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: a.id, x: e.clientX, y: e.clientY, day, start: a.start, moved: false }
  }

  const onMove = (e: React.PointerEvent, a: Appt) => {
    const d = drag.current
    if (!d || !body.current) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) < 5) return
    d.moved = true
    const colW = body.current.clientWidth / DAYS
    const day = Math.max(0, Math.min(DAYS - 1, d.day + Math.round(dx / colW)))
    const start = Math.max(OPEN, Math.min(CLOSE - serviceOf(a.serviceId).duration, d.start + Math.round(dy / ROW) * SLOT))
    setGhost({ id: a.id, day, start })
  }

  const onUp = (a: Appt) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    if (!d.moved) return onOpen(a.id)
    setGhost(null)
    if (!ghost) return
    const moved = moveTo(a, ghost)
    if (moved.date === a.date && moved.start === a.start) return
    if (conflicts(all, moved)) return notify(`${proOf(a.proId).name} já tem atendimento nesse horário.`, 'error')
    setAppts((list) => list.map((x) => (x.id === a.id ? moved : x)))
    notify(`${first(a.patient)} remarcada para ${dayLabel(moved.date)} às ${hhmm(moved.start)} · aviso enviado no WhatsApp`)
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl bg-white p-3 shadow-sm">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[3rem_repeat(6,1fr)] pb-2">
          <span />
          {days.map((key, i) => {
            const d = fromKey(key)
            return (
              <div key={key} className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1F3A2E]/55">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</p>
                <p className={`${serif} mx-auto mt-0.5 grid size-9 place-items-center rounded-full text-xl font-semibold lining-nums ${i === todayIdx ? 'bg-[#B08D57] text-white' : ''}`}>{d.getDate()}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-[3rem_1fr]">
          <div className="relative" style={{ height: rows * ROW }}>
            {Array.from({ length: rows / 2 }, (_, h) => (
              <span key={h} className="absolute -translate-y-1/2 text-[10px] font-semibold tabular-nums text-[#1F3A2E]/45" style={{ top: h * 2 * ROW }}>{hhmm(OPEN + h * 60)}</span>
            ))}
          </div>

          <div ref={body} className="relative border-t border-[#1F3A2E]/10" style={{
            height: rows * ROW,
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${2 * ROW - 1}px, rgba(31,58,46,.08) ${2 * ROW - 1}px ${2 * ROW}px)`,
          }}>
            {days.map((key, i) => (
              <div key={key} className={`absolute inset-y-0 border-l border-[#1F3A2E]/10 ${i === todayIdx ? 'bg-[#B08D57]/[.06]' : ''}`} style={{ left: `${(i * 100) / DAYS}%`, width: `${100 / DAYS}%` }} />
            ))}

            {todayIdx >= 0 && nowMin > OPEN && nowMin < CLOSE && (
              <div className="pointer-events-none absolute z-20 h-0.5 bg-[#C0392B]" style={{ top: ((nowMin - OPEN) / SLOT) * ROW, left: `${(todayIdx * 100) / DAYS}%`, width: `${100 / DAYS}%` }}>
                <span className="absolute -left-1 -top-1 size-2.5 rounded-full bg-[#C0392B]" />
              </div>
            )}

            {appts.filter((a) => visible.includes(a.proId)).map((a) => {
              const g = ghost?.id === a.id ? ghost : null
              const day = g ? g.day : days.indexOf(a.date)
              const start = g ? g.start : a.start
              const lane = lanes.indexOf(a.proId)
              const service = serviceOf(a.serviceId)
              const height = (service.duration / SLOT) * ROW
              const color = proOf(a.proId).color
              const pending = a.status === 'pendente'
              return (
                <motion.button
                  key={a.id}
                  type="button"
                  initial={false}
                  animate={{ top: ((start - OPEN) / SLOT) * ROW, left: `${((day + lane / lanes.length) * 100) / DAYS}%`, height }}
                  transition={g ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  style={{ width: `${100 / DAYS / lanes.length}%`, zIndex: g ? 30 : 10 }}
                  onPointerDown={(e) => onDown(e, a, day)}
                  onPointerMove={(e) => onMove(e, a)}
                  onPointerUp={() => onUp(a)}
                  onPointerCancel={() => { drag.current = null; setGhost(null) }}
                  onClick={(e) => { if (e.detail === 0) onOpen(a.id) }}
                  aria-label={`${a.patient}, ${service.name}, ${hhmm(a.start)}`}
                  className="absolute cursor-grab touch-none select-none p-px text-left active:cursor-grabbing"
                >
                  <span
                    className={`relative flex h-full flex-col overflow-hidden rounded-md px-1.5 py-[3px] text-[11px] leading-tight transition-shadow ${g ? 'shadow-xl' : ''} ${g && ghostBad ? 'ring-2 ring-[#C0392B]' : ''}`}
                    style={pending ? { background: `${color}1f`, color, borderLeft: `3px solid ${color}` } : { background: color, color: '#fff' }}
                  >
                    {height > ROW ? (
                      <>
                        <span className="font-semibold tabular-nums">{hhmm(start)}</span>
                        <span className="truncate font-semibold">{first(a.patient)}</span>
                      </>
                    ) : (
                      <span className="truncate"><span className="font-semibold tabular-nums">{hhmm(start)}</span> {first(a.patient)}</span>
                    )}
                    {height > 56 && <span className="truncate opacity-80">{service.name}</span>}
                    {a.id === highlight && <span className="absolute inset-0 animate-ping rounded-md ring-2 ring-[#B08D57]" aria-hidden="true" />}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Patients({ appts, onOpen }: { appts: Appt[]; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const today = toKey(new Date())

  const list = useMemo(() => {
    const byName = new Map<string, Appt[]>()
    for (const a of [...appts].sort(sortAppts)) byName.set(a.patient, [...(byName.get(a.patient) ?? []), a])
    return [...byName.entries()].map(([name, items]) => {
      const next = items.find((a) => a.date >= today)
      return { name, phone: items[0].phone, items, next, focus: next ?? items[items.length - 1], total: items.reduce((s, a) => s + serviceOf(a.serviceId).price, 0) }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [appts, today])

  const plain = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const q = plain(query.trim())
  const shown = q ? list.filter((p) => plain(p.name).includes(q) || p.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '') || '-')) : list

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={`${serif} text-4xl font-semibold`}>Pacientes <span className="text-[#1F3A2E]/40">{list.length}</span></h2>
        <label className="flex min-h-11 w-full items-center gap-2 rounded-full bg-white px-4 shadow-sm sm:w-72">
          <Search size={16} className="text-[#1F3A2E]/50" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome ou telefone" aria-label="Buscar paciente" className="w-full bg-transparent text-sm outline-none" />
        </label>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="hidden grid-cols-[2fr_1.2fr_.8fr_1.2fr_1fr] gap-4 border-b border-[#1F3A2E]/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#1F3A2E]/50 md:grid">
          <span>Paciente</span><span>WhatsApp</span><span>Consultas</span><span>Próxima</span><span className="text-right">Total</span>
        </div>
        {shown.map((p, i) => (
          <motion.button key={p.name} type="button" onClick={() => onOpen(p.focus.id)}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.025, 0.4) }}
            className="grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-[#1F3A2E]/5 px-5 py-4 text-left text-sm transition-colors last:border-0 hover:bg-[#F7F5F0] md:grid-cols-[2fr_1.2fr_.8fr_1.2fr_1fr]">
            <span className="flex items-center gap-3 font-semibold">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#1F3A2E]/10 text-xs">{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
              {p.name}
            </span>
            <span className="text-right text-[#1F3A2E]/60 md:text-left">{p.phone}</span>
            <span className="hidden md:block">{p.items.length}</span>
            <span className="col-span-2 pl-12 text-xs text-[#1F3A2E]/60 md:col-span-1 md:pl-0 md:text-sm">{p.next ? `${dayLabel(p.next.date)} · ${hhmm(p.next.start)}` : 'Sem retorno marcado'}</span>
            <span className="hidden text-right font-semibold md:block">{brl(p.total)}</span>
          </motion.button>
        ))}
        {!shown.length && <p className="p-8 text-center text-sm text-[#1F3A2E]/60">Nenhum paciente encontrado.</p>}
      </div>
    </div>
  )
}

function Drawer({ appt, appts, setAppts, notify, onClose }: {
  appt: Appt | null
  appts: Appt[]
  setAppts: Props['setAppts']
  notify: Props['notify']
  onClose: () => void
}) {
  useEffect(() => {
    if (!appt) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [appt, onClose])

  const history = appt ? appts.filter((a) => a.patient === appt.patient).sort(sortAppts) : []

  return (
    <AnimatePresence>
      {appt && (
        <>
          <motion.div key="backdrop" className="fixed inset-0 z-40 bg-[#0F1D16]/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside key="drawer" role="dialog" aria-modal="true" aria-label={`Ficha de ${appt.patient}`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-[#FBFAF7] p-6 text-[#1F3A2E] shadow-2xl">
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${appt.status === 'confirmado' ? 'bg-[#3F6B55]/15 text-[#2C5140]' : 'bg-[#B08D57]/20 text-[#7A5E30]'}`}>
                {appt.status === 'confirmado' ? 'Presença confirmada' : 'Aguardando confirmação'}
              </span>
              <button type="button" onClick={onClose} className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-[#1F3A2E]/5" aria-label="Fechar ficha"><X size={20} /></button>
            </div>

            <h3 className={`${serif} mt-6 text-4xl font-semibold leading-tight`}>{appt.patient}</h3>
            <p className="mt-1 text-sm text-[#1F3A2E]/65">{appt.phone}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-white p-5 text-sm shadow-sm">
              {[
                ['Tratamento', serviceOf(appt.serviceId).name],
                ['Profissional', proOf(appt.proId).name],
                ['Data', dayLabel(appt.date)],
                ['Horário', `${hhmm(appt.start)} – ${hhmm(appt.start + serviceOf(appt.serviceId).duration)}`],
                ['Valor', brl(serviceOf(appt.serviceId).price)],
              ].map(([label, value]) => (
                <div key={label}><dt className="text-xs text-[#1F3A2E]/55">{label}</dt><dd className="mt-0.5 font-semibold first-letter:uppercase">{value}</dd></div>
              ))}
            </dl>

            <div className="mt-5 grid gap-2">
              {appt.status === 'pendente' && (
                <button type="button" className="min-h-12 cursor-pointer rounded-full bg-[#1F3A2E] font-semibold text-[#F4F1EA]"
                  onClick={() => { setAppts((l) => l.map((a) => (a.id === appt.id ? { ...a, status: 'confirmado' } : a))); notify(`Presença de ${first(appt.patient)} confirmada`) }}>
                  Confirmar presença
                </button>
              )}
              <button type="button" className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-[#0B3D20]"
                onClick={() => notify(`Lembrete enviado para ${first(appt.patient)} no WhatsApp`)}>
                <MessageCircle size={18} aria-hidden="true" /> Enviar lembrete no WhatsApp
              </button>
              <button type="button" className="min-h-12 cursor-pointer rounded-full border border-[#B8694F]/40 font-semibold text-[#8A3F28] hover:bg-[#B8694F]/10"
                onClick={() => { setAppts((l) => l.filter((a) => a.id !== appt.id)); onClose(); notify('Consulta cancelada e horário liberado na agenda') }}>
                Cancelar consulta
              </button>
            </div>

            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[.2em] text-[#1F3A2E]/50">Histórico · {history.length} {history.length === 1 ? 'consulta' : 'consultas'}</p>
            <ol className="mt-4 grid gap-3 border-l border-[#1F3A2E]/15 pl-5">
              {history.map((a) => (
                <li key={a.id} className="relative text-sm">
                  <span className="absolute -left-[1.61rem] top-1.5 size-2.5 rounded-full border-2 border-[#FBFAF7]" style={{ background: a.id === appt.id ? '#B08D57' : proOf(a.proId).color }} />
                  <p className="font-semibold first-letter:uppercase">{dayLabel(a.date)} · {hhmm(a.start)} {a.id === appt.id && <span className="text-[#B08D57]">(esta)</span>}</p>
                  <p className="text-[#1F3A2E]/60">{serviceOf(a.serviceId).name} com {proOf(a.proId).name}</p>
                </li>
              ))}
            </ol>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
