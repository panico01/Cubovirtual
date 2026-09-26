'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { ago, brokerOf, brokers, compact, dailySeries, initials, sources, stageIndex, stages, type Lead } from './data'
import { display, muted, panel } from './ui'

const negotiating = (l: Lead) => stageIndex(l.stage) >= 1 && l.stage !== 'fechado'

export default function Dashboard({ leads, now, onOpen }: { leads: Lead[]; now: number; onOpen: (id: string) => void }) {
  const series = useMemo(() => {
    const base = dailySeries()
    base[base.length - 1] += leads.filter((l) => l.id.startsWith('live')).length
    return base
  }, [leads])

  const received = series.reduce((a, b) => a + b, 0)
  const closed = leads.filter((l) => l.stage === 'fechado')
  const kpis = [
    { label: 'Leads recebidos · 30 dias', value: received, format: (n: number) => Math.round(n).toLocaleString('pt-BR'), trend: '+18%' },
    { label: 'VGV em negociação', value: leads.filter(negotiating).reduce((s, l) => s + l.value, 0), format: compact, trend: '+9%' },
    { label: 'Vendas no mês', value: closed.reduce((s, l) => s + l.value, 0), format: compact, note: `${closed.length} imóveis` },
    { label: 'Taxa de conversão', value: (closed.length / received) * 100, format: (n: number) => `${n.toFixed(1).replace('.', ',')}%`, trend: '+0,3 p.p.' },
  ]

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} data-glow className={`${panel} p-4 sm:p-5`}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <p className={`text-xs font-medium ${muted}`}>{k.label}</p>
            <p className={`${display} mt-2 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl`}><CountUp value={k.value} format={k.format} /></p>
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#2DD4BF]">
              {k.trend ? <><TrendingUp size={13} aria-hidden="true" /> {k.trend} vs mês anterior</> : <span className={muted}>{k.note}</span>}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <section data-glow className={`${panel} p-5`}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className={`${display} text-lg font-bold`}>Leads recebidos</h2>
              <p className={`text-xs ${muted}`}>Todos os canais · últimos 30 dias</p>
            </div>
            <p className={`${display} text-2xl font-bold tabular-nums`}>{series[series.length - 1]} <span className={`text-xs font-medium ${muted}`}>hoje</span></p>
          </div>
          <AreaChart data={series} />
        </section>

        <section data-glow className={`${panel} p-5`}>
          <h2 className={`${display} text-lg font-bold`}>Funil ativo</h2>
          <p className={`text-xs ${muted}`}>Leads por etapa e valor em jogo</p>
          <div className="mt-5 grid gap-3">
            {stages.map((s, i) => {
              const inStage = leads.filter((l) => l.stage === s.id)
              const max = Math.max(...stages.map((x) => leads.filter((l) => l.stage === x.id).length), 1)
              return (
                <div key={s.id}>
                  <div className="flex justify-between text-xs"><span className="text-white/75">{s.label}</span><span className={`tabular-nums ${muted}`}>{inStage.length} · {compact(inStage.reduce((a, l) => a + l.value, 0))}</span></div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/[.06]">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#38BDF8]"
                      initial={{ width: 0 }} animate={{ width: `${(inStage.length / max) * 100}%` }} transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 90, damping: 18 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Sources leads={leads} />
        <Ranking leads={leads} />
        <Feed leads={leads} now={now} onOpen={onOpen} />
      </div>
    </div>
  )
}

function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const [shown, setShown] = useState(0)
  const last = useRef(0)
  useEffect(() => {
    const controls = animate(last.current, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => { last.current = v; setShown(v) } })
    return () => controls.stop()
  }, [value])
  return <>{format(shown)}</>
}

function AreaChart({ data }: { data: number[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 600
  const H = 200
  const max = Math.max(...data) * 1.15
  const x = (i: number) => (i / (data.length - 1)) * W
  const y = (v: number) => H - (v / max) * H
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setHover(Math.max(0, Math.min(data.length - 1, Math.round(((e.clientX - r.left) / r.width) * (data.length - 1)))))
  }

  return (
    <div className="relative mt-6 h-52 touch-pan-y" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="size-full overflow-visible" aria-label="Gráfico de leads por dia">
        <defs>
          <linearGradient id="h-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2DD4BF" stopOpacity=".35" /><stop offset="1" stopColor="#2DD4BF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="h-line" x1="0" x2="1"><stop offset="0" stopColor="#38BDF8" /><stop offset="1" stopColor="#2DD4BF" /></linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(230,241,242,.07)" vectorEffect="non-scaling-stroke" />)}
        <motion.path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#h-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} />
        <motion.path d={line} fill="none" stroke="url(#h-line)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1="0" y2={H} stroke="rgba(45,212,191,.4)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />}
      </svg>
      {hover !== null && (
        <>
          <span className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0A1418] bg-[#2DD4BF] shadow-[0_0_16px_#2DD4BF]"
            style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(data[hover]) / H) * 100}%` }} />
          <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-lg border border-white/10 bg-[#0F1F24] px-2.5 py-1.5 text-xs shadow-xl"
            style={{ left: `${Math.min(88, Math.max(12, (x(hover) / W) * 100))}%`, top: `${(y(data[hover]) / H) * 100}%` }}>
            <b className="tabular-nums">{data[hover]}</b> leads · {hover === data.length - 1 ? 'hoje' : `há ${data.length - 1 - hover} d`}
          </span>
        </>
      )}
      <div className={`mt-2 flex justify-between text-[11px] ${muted}`}><span>há 30 dias</span><span>hoje</span></div>
    </div>
  )
}

function Sources({ leads }: { leads: Lead[] }) {
  const total = leads.length
  const R = 42
  const C = 2 * Math.PI * R
  let offset = 0
  const parts = sources.map((s) => {
    const count = leads.filter((l) => l.source === s.id).length
    const len = (count / total) * C
    const part = { ...s, count, len, offset }
    offset += len
    return part
  })

  return (
    <section data-glow className={`${panel} p-5`}>
      <h2 className={`${display} text-lg font-bold`}>Origem dos leads</h2>
      <div className="mt-4 flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="size-32 shrink-0 -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(230,241,242,.06)" strokeWidth="12" />
          {parts.map((p, i) => (
            <motion.circle key={p.id} cx="50" cy="50" r={R} fill="none" stroke={p.color} strokeWidth="12"
              strokeDashoffset={-p.offset}
              initial={{ strokeDasharray: `0 ${C}` }} animate={{ strokeDasharray: `${Math.max(p.len - 1.5, 0)} ${C}` }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease: 'easeOut' }} />
          ))}
        </svg>
        <ul className="grid flex-1 gap-2 text-sm">
          {parts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-white/80"><span className="size-2.5 rounded-full" style={{ background: p.color }} />{p.id}</span>
              <span className={`tabular-nums ${muted}`}>{Math.round((p.count / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Ranking({ leads }: { leads: Lead[] }) {
  const rows = brokers.map((b) => {
    const mine = leads.filter((l) => l.brokerId === b.id)
    return { ...b, sold: mine.filter((l) => l.stage === 'fechado').reduce((s, l) => s + l.value, 0), active: mine.filter((l) => l.stage !== 'fechado').length }
  }).sort((a, b) => b.sold - a.sold)
  const top = Math.max(...rows.map((r) => r.sold), 1)

  return (
    <section data-glow className={`${panel} p-5`}>
      <h2 className={`${display} text-lg font-bold`}>Ranking de corretores</h2>
      <ol className="mt-4 grid gap-4">
        {rows.map((r, i) => (
          <li key={r.id} className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-[#0A1418]" style={{ background: r.color }}>{initials(r.name)}</span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2 text-sm"><span className="truncate font-medium">{r.name}</span><span className={`${display} font-bold tabular-nums`}>{compact(r.sold)}</span></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
                <motion.div className="h-full rounded-full" style={{ background: r.color }} initial={{ width: 0 }} animate={{ width: `${(r.sold / top) * 100}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} />
              </div>
              <p className={`mt-1 text-[11px] ${muted}`}>{r.active} leads em andamento</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Feed({ leads, now, onOpen }: { leads: Lead[]; now: number; onOpen: (id: string) => void }) {
  const items = leads
    .flatMap((l) => l.events.map((e, i) => ({ key: `${l.id}-${i}`, lead: l, ...e })))
    .sort((a, b) => b.at - a.at)
    .slice(0, 7)

  return (
    <section data-glow className={`${panel} p-5 lg:col-span-2 xl:col-span-1`}>
      <h2 className={`${display} text-lg font-bold`}>Atividade recente</h2>
      <ul className="mt-4 grid gap-1">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const broker = brokerOf(item.lead.brokerId)
            return (
              <motion.li key={item.key} layout initial={{ opacity: 0, x: -12, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }} exit={{ opacity: 0 }}>
                <button type="button" onClick={() => onOpen(item.lead.id)} className="group flex w-full cursor-pointer items-start gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/[.04]">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-bold" style={{ background: broker ? `${broker.color}26` : 'rgba(251,191,36,.15)', color: broker?.color ?? '#FBBF24' }}>
                    {initials(item.lead.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.lead.name}</span>
                    <span className={`line-clamp-1 text-xs ${muted}`}>{item.text}</span>
                  </span>
                  <span className={`shrink-0 text-[11px] ${muted}`}>{ago(item.at, now)}</span>
                  <ArrowUpRight size={14} className="mt-1 shrink-0 text-[#2DD4BF] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </button>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </section>
  )
}
