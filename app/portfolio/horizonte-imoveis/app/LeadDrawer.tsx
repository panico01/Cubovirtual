'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BedDouble, MessageCircle, Ruler, Send, X } from 'lucide-react'
import { ago, brl, brokerOf, brokers, initials, moveStage, propertyOf, sources, stageIndex, stages, type Lead, type Stage } from './data'
import { display, muted } from './ui'
import type { Notify } from './HorizonteApp'

export default function LeadDrawer({ lead, setLeads, now, notify, onClose }: {
  lead: Lead | null
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>
  now: number
  notify: Notify
  onClose: () => void
}) {
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!lead) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lead, onClose])

  const update = (fn: (l: Lead) => Lead) => lead && setLeads((list) => list.map((l) => (l.id === lead.id ? fn(l) : l)))
  const log = (text: string) => (l: Lead) => ({ ...l, updatedAt: Date.now(), events: [...l.events, { at: Date.now(), text }] })

  const setStage = (stage: Stage) => {
    if (!lead || stage === lead.stage) return
    if (!lead.brokerId && stage !== 'novo') return notify('Escolha um corretor antes de avançar o lead.', 'error')
    update((l) => moveStage(l, stage))
    notify(stage === 'fechado' ? `Venda fechada! ${brl(lead.value)}` : `Lead movido para ${stages[stageIndex(stage)].label}`)
  }

  const setBroker = (id: string) => {
    if (!lead || id === lead.brokerId) return
    const name = brokerOf(id)!.name
    update((l) => ({ ...log(`Lead atribuído a ${name}`)(l), brokerId: id }))
    notify(`${name.split(' ')[0]} agora cuida de ${lead.name.split(' ')[0]}`)
  }

  const addNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    update(log(`Anotação: ${note.trim()}`))
    setNote('')
  }

  const property = lead && propertyOf(lead.propertyId)
  const source = lead && sources.find((s) => s.id === lead.source)!

  return (
    <AnimatePresence>
      {lead && property && source && (
        <>
          <motion.div key="backdrop" className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside key="drawer" role="dialog" aria-modal="true" aria-label={`Ficha de ${lead.name}`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-[#0B181C]/95 p-6 text-[#E6F1F2] shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="rounded-md px-2 py-1 text-xs font-semibold" style={{ background: `${source.color}1f`, color: source.color }}>via {lead.source}</span>
              <button type="button" onClick={onClose} className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-white/[.06]" aria-label="Fechar ficha"><X size={20} /></button>
            </div>

            <h3 className={`${display} mt-5 text-3xl font-bold tracking-tight`}>{lead.name}</h3>
            <p className={`mt-1 text-sm ${muted}`}>{lead.phone} · chegou {ago(lead.createdAt, Math.max(now, Date.now()))}</p>

            <div className="mt-6 rounded-2xl border border-white/[.08] bg-gradient-to-br from-[#2DD4BF]/[.12] to-transparent p-4">
              <p className={`text-[11px] font-semibold uppercase tracking-[.2em] ${muted}`}>Imóvel de interesse</p>
              <p className="mt-2 font-semibold">{property.title} · {property.hood}</p>
              <p className={`mt-1 flex gap-4 text-xs ${muted}`}>
                {property.beds > 0 && <span className="flex items-center gap-1"><BedDouble size={13} aria-hidden="true" /> {property.beds} dorms</span>}
                <span className="flex items-center gap-1"><Ruler size={13} aria-hidden="true" /> {property.area} m²</span>
                <span>Anunciado por {brl(property.price)}</span>
              </p>
              <p className={`${display} mt-3 text-2xl font-bold tabular-nums text-[#2DD4BF]`}>{brl(lead.value)}</p>
            </div>

            <p className={`mt-6 text-[11px] font-semibold uppercase tracking-[.2em] ${muted}`}>Etapa</p>
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {stages.map((s, i) => (
                <button key={s.id} type="button" onClick={() => setStage(s.id)} aria-pressed={lead.stage === s.id} title={s.label}
                  className="group cursor-pointer text-left">
                  <span className={`block h-1.5 rounded-full transition-colors ${i <= stageIndex(lead.stage) ? 'bg-[#2DD4BF]' : 'bg-white/10 group-hover:bg-white/25'}`} />
                  <span className={`mt-1.5 block text-[10px] leading-tight ${lead.stage === s.id ? 'font-semibold text-[#2DD4BF]' : muted}`}>{s.label}</span>
                </button>
              ))}
            </div>

            <p className={`mt-6 text-[11px] font-semibold uppercase tracking-[.2em] ${muted}`}>Corretor responsável</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {brokers.map((b) => (
                <button key={b.id} type="button" onClick={() => setBroker(b.id)} aria-pressed={lead.brokerId === b.id}
                  className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-full border px-2.5 text-xs font-semibold transition-colors ${lead.brokerId === b.id ? 'border-transparent text-[#0A1418]' : 'border-white/10 text-white/70 hover:text-white'}`}
                  style={lead.brokerId === b.id ? { background: b.color } : undefined}>
                  <span className="grid size-5 place-items-center rounded-full bg-black/20 text-[9px] font-bold">{initials(b.name)}</span>
                  {b.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <button type="button" onClick={() => { update(log('Mensagem enviada por WhatsApp')); notify(`Conversa aberta com ${lead.name.split(' ')[0]} no WhatsApp`) }}
              className="mt-6 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-[#062B16]">
              <MessageCircle size={18} aria-hidden="true" /> Chamar no WhatsApp
            </button>

            <form onSubmit={addNote} className="mt-3 flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Registrar anotação…" aria-label="Nova anotação"
                className="min-h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-white/[.04] px-4 text-sm outline-none placeholder:text-white/35 focus:border-[#2DD4BF]/50" />
              <button type="submit" className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-white/[.08] hover:bg-[#2DD4BF] hover:text-[#0A1418]" aria-label="Salvar anotação"><Send size={16} /></button>
            </form>

            <p className={`mt-8 text-[11px] font-semibold uppercase tracking-[.2em] ${muted}`}>Linha do tempo</p>
            <ol className="mt-4 grid gap-4 border-l border-white/10 pl-5">
              {[...lead.events].reverse().map((e, i) => (
                <motion.li key={`${e.at}-${i}`} className="relative text-sm" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                  <span className={`absolute -left-[1.6rem] top-1 size-2.5 rounded-full ring-4 ring-[#0B181C] ${i === 0 ? 'bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]' : 'bg-white/30'}`} />
                  <p>{e.text}</p>
                  <p className={`text-xs ${muted}`}>{ago(e.at, Math.max(now, Date.now()))}</p>
                </motion.li>
              ))}
            </ol>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
