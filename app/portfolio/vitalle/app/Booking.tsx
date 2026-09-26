'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Clock, MapPin, Star, UserRound } from 'lucide-react'
import { addDays, brl, conflicts, freeSlots, fromKey, hhmm, proOf, prosFor, serviceOf, services, toKey, type Appt } from './data'

const serif = 'font-[family-name:var(--v-serif)]'
const steps = ['Escolha o tratamento', 'Escolha o profissional', 'Escolha data e horário', 'Seus dados']

type Draft = { serviceId?: string; proId?: string | null; date?: string; start?: number; slotPro?: string }

const maskPhone = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
}

const longDate = (key: string) => fromKey(key).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

export default function Booking({ appts, onBook, onSeeClinic }: {
  appts: Appt[]
  onBook: (appt: Appt) => void
  onSeeClinic: (id: string) => void
}) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>({})
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState<Appt | null>(null)

  const days = useMemo(() => {
    const out: string[] = []
    for (let i = 0; out.length < 12; i++) {
      const d = addDays(new Date(), i)
      if (d.getDay() !== 0) out.push(toKey(d))
    }
    return out
  }, [])

  const top = useRef<HTMLElement>(null)
  useEffect(() => {
    if (top.current && top.current.getBoundingClientRect().top < 0) top.current.scrollIntoView({ behavior: 'smooth' })
  }, [step, done])

  const date = draft.date ?? days[0]
  const slots = draft.serviceId ? freeSlots(appts, date, draft.serviceId, draft.proId ?? null) : []
  const go = (patch: Draft, next: number) => { setDraft((d) => ({ ...d, ...patch })); setStep(next); setError('') }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (name.trim().length < 3) return setError('Informe seu nome completo.')
    if (phone.replace(/\D/g, '').length < 10) return setError('Informe um WhatsApp válido com DDD.')
    const appt: Appt = {
      id: `n${Date.now()}`, patient: name.trim(), phone, serviceId: draft.serviceId!, proId: draft.slotPro!,
      date: draft.date ?? days[0], start: draft.start!, status: 'confirmado',
    }
    if (conflicts(appts, appt)) {
      setError('Esse horário acabou de ser ocupado. Escolha outro.')
      return setStep(2)
    }
    onBook(appt)
    setDone(appt)
  }

  const restart = () => { setDone(null); setDraft({}); setStep(0); setName(''); setPhone('') }

  return (
    <div className="grid min-h-[calc(100dvh-3rem)] lg:grid-cols-[.85fr_1.15fr]">
      <Hero />

      <main ref={top} className="scroll-mt-12 px-5 py-10 sm:px-10 lg:py-16">
        <div className="mx-auto max-w-xl">
          {done ? (
            <Success appt={done} onSeeClinic={() => onSeeClinic(done.id)} onRestart={restart} />
          ) : (
            <>
              <div className="flex min-h-11 items-center justify-between gap-4">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="-ml-2 flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-2 text-sm font-semibold hover:bg-[#1F3A2E]/5">
                    <ArrowLeft size={16} aria-hidden="true" /> Voltar
                  </button>
                ) : <span />}
                <span className="text-xs font-semibold uppercase tracking-[.2em] text-[#1F3A2E]/80">Etapa {step + 1} de 4</span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#1F3A2E]/10">
                <motion.div className="h-full rounded-full bg-[#B08D57]" initial={{ width: 0 }} animate={{ width: `${((step + 1) / 4) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>

              <h2 className={`${serif} mt-8 text-4xl font-semibold leading-tight sm:text-5xl`}>{steps[step]}</h2>
              {error && <p role="alert" className="mt-4 rounded-xl bg-[#B8694F]/10 px-4 py-3 text-sm font-semibold text-[#8A3F28]">{error}</p>}

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8"
                >
                  {step === 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {services.map((s) => (
                        <button key={s.id} type="button" onClick={() => go({ serviceId: s.id, start: undefined }, 1)}
                          className={`group cursor-pointer rounded-2xl border bg-white/70 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:shadow-[0_12px_30px_-12px_rgba(31,58,46,.35)] ${draft.serviceId === s.id ? 'border-[#B08D57]' : 'border-[#1F3A2E]/10'}`}>
                          <p className={`${serif} text-2xl font-semibold`}>{s.name}</p>
                          <p className="mt-1 text-sm text-[#1F3A2E]/80">{s.desc}</p>
                          <p className="mt-4 flex items-center justify-between text-sm font-semibold">
                            <span className="flex items-center gap-1.5 text-[#1F3A2E]/70"><Clock size={14} aria-hidden="true" /> {s.duration} min</span>
                            <span className="text-[#8C6D3F]">{brl(s.price)}</span>
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid gap-3">
                      {[null, ...prosFor(draft.serviceId ?? '')].map((p) => (
                        <button key={p?.id ?? 'any'} type="button" onClick={() => go({ proId: p?.id ?? null, start: undefined }, 2)}
                          className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[#1F3A2E]/10 bg-white/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#B08D57]">
                          <span className="grid size-12 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ background: p?.color ?? '#1F3A2E' }}>
                            {p ? p.name.replace('Dra. ', '').split(' ').map((w) => w[0]).join('').slice(0, 2) : <UserRound size={20} aria-hidden="true" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">{p?.name ?? 'Sem preferência'}</span>
                            <span className="block text-sm text-[#1F3A2E]/80">{p?.role ?? 'Mostramos o primeiro horário livre da equipe'}</span>
                          </span>
                          <ArrowRight size={18} className="shrink-0 text-[#B08D57]" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
                        {days.map((key) => {
                          const d = fromKey(key)
                          const active = key === date
                          return (
                            <button key={key} type="button" onClick={() => setDraft((x) => ({ ...x, date: key }))} aria-pressed={active}
                              className={`flex min-w-[4.25rem] shrink-0 cursor-pointer snap-start flex-col items-center rounded-2xl border px-3 py-3 transition-colors ${active ? 'border-[#1F3A2E] bg-[#1F3A2E] text-[#F4F1EA]' : 'border-[#1F3A2E]/10 bg-white/70 hover:border-[#B08D57]'}`}>
                              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                              <span className={`${serif} text-2xl font-semibold lining-nums`}>{d.getDate()}</span>
                            </button>
                          )
                        })}
                      </div>

                      <p className="mt-6 text-sm font-semibold text-[#1F3A2E]/70 first-letter:uppercase">{longDate(date)}</p>
                      {slots.length ? (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slots.map((slot, i) => (
                            <motion.button key={slot.start} type="button"
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                              onClick={() => go({ date, start: slot.start, slotPro: slot.proId }, 3)}
                              className="min-h-12 cursor-pointer rounded-xl border border-[#1F3A2E]/10 bg-white/70 font-semibold tabular-nums transition-colors hover:border-[#B08D57] hover:bg-[#B08D57] hover:text-white">
                              {hhmm(slot.start)}
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 rounded-2xl border border-dashed border-[#1F3A2E]/20 p-6 text-center text-sm text-[#1F3A2E]/80">Sem horários livres neste dia. Tente outra data.</p>
                      )}
                    </div>
                  )}

                  {step === 3 && draft.serviceId && draft.start !== undefined && (
                    <form onSubmit={submit} className="grid gap-5" noValidate>
                      <div className="rounded-2xl bg-[#1F3A2E] p-5 text-[#F4F1EA]">
                        <p className={`${serif} text-2xl font-semibold`}>{serviceOf(draft.serviceId).name}</p>
                        <p className="mt-1 text-sm opacity-75 first-letter:uppercase">{longDate(date)} · {hhmm(draft.start)}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4 text-sm">
                          <span>com {proOf(draft.slotPro!).name}</span>
                          <span className="font-semibold text-[#D9BC8C]">{brl(serviceOf(draft.serviceId).price)}</span>
                        </div>
                      </div>
                      <label className="grid gap-2 text-sm font-semibold">
                        Nome completo
                        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Como devemos te chamar?"
                          className="min-h-12 rounded-xl border border-[#1F3A2E]/15 bg-white px-4 text-base font-normal outline-none transition-colors focus:border-[#B08D57]" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        WhatsApp
                        <input value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} type="tel" inputMode="numeric" autoComplete="tel" placeholder="(11) 91234-5678"
                          className="min-h-12 rounded-xl border border-[#1F3A2E]/15 bg-white px-4 text-base font-normal outline-none transition-colors focus:border-[#B08D57]" />
                      </label>
                      <button type="submit" className="min-h-14 cursor-pointer rounded-full bg-[#B08D57] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(176,141,87,.8)] transition-transform hover:-translate-y-0.5">
                        Confirmar agendamento
                      </button>
                      <p className="text-center text-xs text-[#1F3A2E]/80">Demonstração: nenhuma mensagem é enviada e seus dados ficam apenas neste navegador.</p>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const float = (x: number, y: number, duration: number) =>
    reduce ? {} : { animate: { x: [0, x, 0], y: [0, y, 0] }, transition: { duration, repeat: Infinity, ease: 'easeInOut' as const } }

  return (
    <aside className="relative overflow-hidden bg-[#1F3A2E] px-5 py-8 text-[#F4F1EA] sm:px-10 sm:py-12 lg:py-16">
      <motion.div className="pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-[#B08D57] opacity-30 blur-3xl" {...float(-40, 50, 14)} aria-hidden="true" />
      <motion.div className="pointer-events-none absolute -bottom-24 -left-10 size-72 rounded-full bg-[#6B8F71] opacity-40 blur-3xl" {...float(50, -30, 18)} aria-hidden="true" />

      <div className="relative flex h-full flex-col justify-between gap-8 sm:gap-12">
        <div>
          <p className={`${serif} text-4xl font-semibold leading-none`}>Vitalle</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[.4em] text-[#D9BC8C]">Clínica</p>
        </div>

        <div>
          <h1 className={`${serif} max-w-md text-4xl font-medium leading-[1.02] sm:text-6xl`}>
            Sua pele em boas mãos. <em className="text-[#D9BC8C]">Seu horário em um toque.</em>
          </h1>
          <p className="mt-4 max-w-sm text-sm text-[#F4F1EA]/75 sm:mt-6 sm:text-base">Dermatologia e estética com agenda online 24 horas e confirmação direto no seu WhatsApp.</p>
        </div>

        <ul className="hidden gap-3 text-sm text-[#F4F1EA]/80 sm:grid">
          <li className="flex items-center gap-3"><MapPin size={16} className="text-[#D9BC8C]" aria-hidden="true" /> Rua das Acácias, 480 · Jardins</li>
          <li className="flex items-center gap-3"><Clock size={16} className="text-[#D9BC8C]" aria-hidden="true" /> Segunda a sábado · 8h às 18h</li>
          <li className="flex items-center gap-3"><Star size={16} className="text-[#D9BC8C]" fill="currentColor" aria-hidden="true" /> 4,9 · 312 avaliações de pacientes</li>
        </ul>
      </div>
    </aside>
  )
}

function Success({ appt, onSeeClinic, onRestart }: { appt: Appt; onSeeClinic: () => void; onRestart: () => void }) {
  const service = serviceOf(appt.serviceId)
  const first = appt.patient.split(' ')[0]
  const messages = [
    { me: false, text: `Olá, ${first}! Aqui é da Vitalle Clínica ✨` },
    { me: false, text: `Seu horário está reservado:\n📅 ${longDate(appt.date)}, às ${hhmm(appt.start)}\n💆 ${service.name} com ${proOf(appt.proId).name}` },
    { me: false, text: 'Responda 1 para confirmar ou 2 para remarcar.' },
    { me: true, text: '1' },
    { me: false, text: 'Presença confirmada! Te esperamos 💚' },
  ]

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <svg viewBox="0 0 52 52" className="size-16" aria-hidden="true">
          <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#B08D57" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          <motion.path d="M15 27l7 7 15-15" fill="none" stroke="#1F3A2E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
        </svg>
        <h2 className={`${serif} mt-6 text-5xl font-semibold leading-tight`}>Tudo certo, {first}!</h2>
        <p className="mt-3 text-[#1F3A2E]/70">Seu horário já aparece na agenda da clínica e a confirmação chegou no seu WhatsApp.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onSeeClinic} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1F3A2E] px-6 font-semibold text-[#F4F1EA] transition-transform hover:-translate-y-0.5">
            Ver na agenda da clínica <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={onRestart} className="min-h-12 cursor-pointer rounded-full border border-[#1F3A2E]/20 px-6 font-semibold transition-colors hover:bg-[#1F3A2E]/5">
            Novo agendamento
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[18rem] rounded-[2.2rem] border-[7px] border-[#111] bg-[#111] shadow-2xl" aria-label="Simulação da conversa no WhatsApp">
        <div className="overflow-hidden rounded-[1.7rem] bg-[#ECE5DD]">
          <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-5 text-white">
            <span className={`${serif} grid size-9 place-items-center rounded-full bg-[#F4F1EA] text-lg font-semibold text-[#1F3A2E]`}>V</span>
            <span><span className="block text-sm font-semibold">Vitalle Clínica</span><span className="block text-xs opacity-75">online</span></span>
          </div>
          <div className="flex min-h-[21rem] flex-col gap-2 p-3">
            {messages.map((m, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.9, type: 'spring', stiffness: 260, damping: 22 }}
                className={`max-w-[85%] whitespace-pre-line rounded-lg px-3 py-2 text-[13px] leading-snug text-[#111] shadow-sm ${m.me ? 'self-end bg-[#DCF8C6]' : 'self-start bg-white'}`}>
                {m.text}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
