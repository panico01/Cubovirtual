'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, CircleCheck, GitCompare, Search, ShieldCheck, SlidersHorizontal, Wrench, X } from 'lucide-react'
import credits from './credits.json'
import CarSheet, { display } from './CarSheet'
import { bestOf, bodies, brl, carOf, cars, defaultFilters, filterCars, installment, km, type Car, type Filters } from './data'

const WHATSAPP = `https://wa.me/5517991191582?text=${encodeURIComponent('Vi a demo da Vértice Motors no portfólio e quero um site assim para minha loja de veículos.')}`
const control = 'min-h-11 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-[#D7263D]'

export default function VerticeApp() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [open, setOpen] = useState<Car | null>(null)
  const [compare, setCompare] = useState<string[]>([])
  const [comparing, setComparing] = useState(false)
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reduce = useReducedMotion()

  const list = filterCars(cars, filters)
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }))
  const notify = useCallback((msg: string) => {
    clearTimeout(timer.current)
    setToast({ id: Date.now(), msg })
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const toggleCompare = (id: string) => setCompare((c) => {
    if (c.includes(id)) return c.filter((x) => x !== id)
    if (c.length >= 3) { notify('Compare até 3 carros por vez'); return c }
    return [...c, id]
  })

  return (
    <div className="min-h-dvh bg-[#EDEEE9] font-[family-name:var(--v-sans)] text-[#0E0F12]">
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-3 bg-[#0E0F12] px-3 text-white sm:px-5">
        <Link href="/portfolio/vertice-motors" aria-label="Voltar ao case" className="flex min-h-11 items-center gap-2 text-xs font-semibold text-white/60 hover:text-white">
          <ArrowLeft size={15} aria-hidden="true" /> <span className="hidden sm:inline">Voltar ao case</span>
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/65">Demo · Showroom de seminovos</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hidden min-h-8 items-center gap-1.5 rounded-full bg-[#EA580C] px-3 text-xs font-bold text-black md:inline-flex">
          Quero um assim <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <span className="w-6 md:hidden" />
      </header>

      <section className="relative overflow-hidden bg-[#0E0F12] text-white">
        {!reduce && [0, 1, 2, 3, 4].map((i) => (
          <motion.span key={i} className="absolute h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ top: `${58 + i * 7}%`, width: `${20 + i * 8}%` }}
            animate={{ x: ['120vw', '-60vw'] }} transition={{ duration: 1.4 + i * 0.3, repeat: Infinity, ease: 'linear', delay: i * 0.25 }} aria-hidden="true" />
        ))}
        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 py-10 lg:grid-cols-[1fr_1.1fr] lg:py-14">
          <div>
            <p className={`${display} text-sm tracking-[.3em] text-[#D7263D]`}>Vértice Motors</p>
            <h1 className={`${display} mt-4 text-3xl leading-[1.1] sm:text-5xl`}>Seminovos com procedência. Sem letra miúda.</h1>
            <ul className="mt-6 grid gap-2 text-sm text-white/75">
              <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#D7263D]" aria-hidden="true" /> Laudo cautelar aprovado em 100% do estoque</li>
              <li className="flex items-center gap-2"><Wrench size={16} className="text-[#D7263D]" aria-hidden="true" /> Garantia de 12 meses em motor e câmbio</li>
              <li className="flex items-center gap-2"><GitCompare size={16} className="text-[#D7263D]" aria-hidden="true" /> Seu usado entra na troca</li>
            </ul>
          </div>
          {/* sem animação de entrada: a foto é o LCP e precisa pintar antes do JS */}
          <div>
            <img src="/portfolio/vertice/compass.webp" alt="Jeep Compass vermelho" fetchPriority="high" className="aspect-[16/10] w-full rounded-3xl object-cover shadow-[0_30px_60px_-10px_rgba(215,38,61,.45)]" />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-3 rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/65" aria-hidden="true" />
            <input className={`${control} w-full pl-9`} placeholder="Buscar marca ou modelo" aria-label="Buscar marca ou modelo" value={filters.q} onChange={(e) => set({ q: e.target.value })} />
          </label>
          <select className={control} value={filters.minYear} onChange={(e) => set({ minYear: Number(e.target.value) })} aria-label="Ano mínimo">
            {[2021, 2022, 2023, 2024].map((y) => <option key={y} value={y}>A partir de {y}</option>)}
          </select>
          <select className={control} value={filters.gear} onChange={(e) => set({ gear: e.target.value as Filters['gear'] })} aria-label="Câmbio">
            <option value="todos">Qualquer câmbio</option><option value="Automático">Automático</option><option value="Manual">Manual</option>
          </select>
          <select className={control} value={filters.sort} onChange={(e) => set({ sort: e.target.value as Filters['sort'] })} aria-label="Ordenar">
            <option value="preco">Menor preço</option><option value="km">Menor km</option><option value="ano">Mais novo</option>
          </select>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            {bodies.map((b) => {
              const on = filters.bodies.includes(b.id)
              return (
                <button key={b.id} type="button" aria-pressed={on} onClick={() => set({ bodies: on ? filters.bodies.filter((x) => x !== b.id) : [...filters.bodies, b.id] })}
                  className={`min-h-10 cursor-pointer rounded-full border px-4 text-sm font-bold transition-colors ${on ? 'border-[#0E0F12] bg-[#0E0F12] text-white' : 'border-black/10 bg-white hover:border-black/30'}`}>{b.label}</button>
              )
            })}
          </div>
          <label className="md:col-span-2">
            <span className="flex justify-between text-xs font-bold"><span className="flex items-center gap-1.5"><SlidersHorizontal size={13} aria-hidden="true" /> Até</span><span className="tabular-nums">{brl(filters.maxPrice)}</span></span>
            <input type="range" min={70_000} max={350_000} step={5_000} value={filters.maxPrice} onChange={(e) => set({ maxPrice: Number(e.target.value) })} className="mt-2 w-full accent-[#D7263D]" aria-label="Preço máximo" />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-bold"><motion.span key={list.length} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block tabular-nums">{list.length}</motion.span> {list.length === 1 ? 'carro encontrado' : 'carros encontrados'}</p>
          {JSON.stringify(filters) !== JSON.stringify(defaultFilters) && (
            <button type="button" onClick={() => setFilters(defaultFilters)} className="text-sm font-bold text-[#D7263D] underline underline-offset-4">Limpar filtros</button>
          )}
        </div>

        <motion.div layout className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((car) => {
              const inCompare = compare.includes(car.id)
              return (
                <motion.article key={car.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl">
                  <button type="button" onClick={() => setOpen(car)} className="block w-full cursor-pointer text-left">
                    <div className="relative p-3 pb-0">
                      <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-1">
                        {car.badges.slice(0, 2).map((b) => <span key={b} className="rounded-full bg-[#0E0F12] px-2 py-0.5 text-xs font-bold text-white">{b}</span>)}
                      </div>
                      <div className="overflow-hidden rounded-2xl"><img src={`/portfolio/vertice/${car.id}.webp`} alt={`${car.brand} ${car.model}`} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                    </div>
                    <div className="p-5 pt-3">
                      <p className="text-xs font-bold text-black/65">{car.brand} · {car.year} · {km(car.km)}</p>
                      <p className={`${display} mt-1 text-lg leading-tight`}>{car.model}</p>
                      <p className="truncate text-sm text-black/60">{car.version}</p>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className={`${display} text-xl text-[#D7263D]`}>{brl(car.price)}</p>
                          <p className="text-xs text-black/65">ou 48x {brl(installment(car.price * 0.7, 48))}*</p>
                        </div>
                        <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-bold transition-colors group-hover:bg-[#0E0F12] group-hover:text-white">Ver detalhes</span>
                      </div>
                    </div>
                  </button>
                  <label className="absolute right-4 top-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-xs font-bold shadow-sm">
                    <input type="checkbox" checked={inCompare} onChange={() => toggleCompare(car.id)} className="accent-[#D7263D]" /> Comparar
                  </label>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>
        {!list.length && <p className="mt-10 rounded-3xl border border-dashed border-black/20 p-10 text-center text-sm text-black/60">Nenhum carro com esses filtros. Tente ampliar a faixa de preço.</p>}
        <p className="mt-6 text-xs text-black/65">*Parcela ilustrativa com 30% de entrada e taxa de 1,49% a.m.</p>
        <details className="mt-6 text-xs text-black/65">
          <summary className="cursor-pointer font-semibold">Créditos das fotos (Wikimedia Commons)</summary>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {Object.entries(credits).map(([id, c]) => (
              <li key={id}>{carOf(id).brand} {carOf(id).model}: <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline">{c.author}</a>, {c.license}</li>
            ))}
          </ul>
        </details>
      </main>

      <p className="border-t border-black/10 px-5 py-4 pb-24 text-center text-xs text-black/65">
        Projeto demonstrativo com marca e dados fictícios · desenvolvido por{' '}
        <Link href="/" className="font-semibold underline underline-offset-2 hover:text-black">Cubo Virtual</Link>
      </p>

      <AnimatePresence>
        {compare.length > 0 && !comparing && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-xl items-center gap-3 rounded-full bg-[#0E0F12] p-2 pl-5 text-white shadow-2xl">
            <GitCompare size={18} className="shrink-0 text-[#D7263D]" aria-hidden="true" />
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">{compare.map((id) => carOf(id).model).join(' · ')}</p>
            <button type="button" onClick={() => setCompare([])} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-white/10" aria-label="Limpar comparação"><X size={16} /></button>
            <button type="button" disabled={compare.length < 2} onClick={() => setComparing(true)} className="min-h-10 shrink-0 cursor-pointer rounded-full bg-[#D7263D] px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">
              Comparar {compare.length}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{comparing && <Compare ids={compare} onClose={() => setComparing(false)} onOpen={(c) => { setComparing(false); setOpen(c) }} />}</AnimatePresence>
      <CarSheet car={open} onClose={() => setOpen(null)} notify={notify} />

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} role="status" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed inset-x-4 top-16 z-[60] mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-[#0E0F12] px-4 py-3 text-sm font-semibold text-white shadow-2xl">
            <CircleCheck size={18} className="shrink-0 text-[#4ADE80]" aria-hidden="true" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Compare({ ids, onClose, onOpen }: { ids: string[]; onClose: () => void; onOpen: (c: Car) => void }) {
  const list = ids.map(carOf)
  const best = bestOf(list)
  const rows: { label: string; value: (c: Car) => string; best?: (c: Car) => boolean }[] = [
    { label: 'Preço', value: (c) => brl(c.price), best: (c) => c.price === best.price },
    { label: 'Ano', value: (c) => String(c.year), best: (c) => c.year === best.year },
    { label: 'Quilometragem', value: (c) => km(c.km), best: (c) => c.km === best.km },
    { label: 'Câmbio', value: (c) => c.gear },
    { label: 'Combustível', value: (c) => c.fuel },
    { label: 'Parcela 48x*', value: (c) => brl(installment(c.price * 0.7, 48)) },
  ]

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div role="dialog" aria-modal="true" aria-label="Comparar carros" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="fixed inset-x-3 top-16 z-50 mx-auto max-h-[calc(100dvh-5rem)] max-w-4xl overflow-auto rounded-3xl bg-[#F7F7F4] p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className={`${display} text-xl`}>Comparar</h2>
          <button type="button" onClick={onClose} className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-black/5" aria-label="Fechar"><X size={20} /></button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-x-2 text-sm">
            <thead>
              <tr>
                <th className="w-32" />
                {list.map((c) => (
                  <th key={c.id} className="align-bottom font-normal">
                    <img src={`/portfolio/vertice/${c.id}.webp`} alt={`${c.brand} ${c.model}`} loading="lazy" className="aspect-[16/10] w-full rounded-xl object-cover" />
                    <button type="button" onClick={() => onOpen(c)} className={`${display} mt-1 cursor-pointer text-sm hover:text-[#D7263D]`}>{c.model}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="py-2.5 text-left text-xs font-bold text-black/65">{r.label}</th>
                  {list.map((c) => (
                    <td key={c.id} className={`rounded-xl px-3 py-2.5 text-center font-semibold tabular-nums ${r.best?.(c) ? 'bg-[#D7263D]/10 text-[#9B1C2C]' : 'bg-white'}`}>{r.value(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-black/65">Em destaque, o melhor de cada linha. *Parcela ilustrativa com 30% de entrada.</p>
      </motion.div>
    </>
  )
}
