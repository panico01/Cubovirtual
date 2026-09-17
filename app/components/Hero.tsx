import { ArrowDownRight, ArrowUpRight, Check } from 'lucide-react'

const capabilities = ['Estratégia', 'Design', 'Tecnologia', 'Crescimento']

export default function Hero() {
  return (
    <section id="inicio" className="site-grid relative border-b-2 border-line">
      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] lg:grid-cols-[1.15fr_.85fr]">
        <div className="flex flex-col justify-between border-line px-5 py-16 sm:px-8 sm:py-20 lg:border-r-2 lg:py-24">
          <div>
            <p className="eyebrow text-primary">Agência digital full service</p>
            <h1 className="display-title mt-8 max-w-5xl text-balance">
              Ideias digitais.<br />
              <span className="text-primary">Impacto real.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-subtle sm:text-xl">
              Projetamos sites, sistemas e estratégias que transformam presença online em oportunidade de negócio.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#planos" className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-ink bg-accent px-7 font-extrabold text-black shadow-brutal transition-transform hover:-translate-y-1">
              Conhecer os planos <ArrowDownRight size={21} aria-hidden="true" />
            </a>
            <a href="#servicos" className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-ink bg-card px-7 font-extrabold transition-colors hover:bg-muted">
              Explorar soluções <ArrowUpRight size={21} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-primary p-5 text-white sm:p-8 lg:p-10">
          <div className="flex items-start justify-between border-b border-white/40 pb-6">
            <p className="text-xs font-extrabold uppercase tracking-[.2em]">Cubo Operating System</p>
            <span className="border border-white/60 px-2 py-1 text-xs font-bold">ONLINE</span>
          </div>

          <div className="my-10 grid grid-cols-2 border-l border-t border-white/45">
            {capabilities.map((item, index) => (
              <div key={item} className="min-h-36 min-w-0 border-b border-r border-white/45 p-4 sm:min-h-44 sm:p-5">
                <span className="text-xs font-bold text-white/65">0{index + 1}</span>
                <div className="mt-12 flex items-end justify-between gap-2">
                  <p className="min-w-0 break-words text-base font-extrabold sm:text-xl">{item}</p>
                  <Check size={19} aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto] items-end gap-8 border-t border-white/40 pt-6">
            <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80">Um parceiro único do primeiro rascunho à evolução contínua do seu produto.</p>
            <p className="text-5xl font-extrabold tracking-[-.08em] sm:text-7xl">360°</p>
          </div>
        </div>
      </div>
    </section>
  )
}
