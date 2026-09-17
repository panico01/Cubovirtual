import { ArrowUpRight, BarChart3, Code2, Lightbulb, Palette, Share2, Smartphone } from 'lucide-react'

const services = [
  { icon: Smartphone, code: 'APP', title: 'Aplicativos mobile', text: 'Experiências nativas e híbridas para iOS e Android.' },
  { icon: Code2, code: 'SYS', title: 'Sistemas personalizados', text: 'Ferramentas sob medida para organizar e acelerar operações.' },
  { icon: BarChart3, code: 'ADS', title: 'Tráfego pago', text: 'Campanhas orientadas a dados para atrair quem realmente importa.' },
  { icon: Palette, code: 'ID', title: 'Identidade visual', text: 'Marcas coerentes, reconhecíveis e prontas para se destacar.' },
  { icon: Share2, code: 'SOC', title: 'Redes sociais', text: 'Conteúdo e presença capazes de construir comunidade.' },
  { icon: Lightbulb, code: 'MKT', title: 'Consultoria digital', text: 'Clareza estratégica para escolher e executar o próximo passo.' },
]

export default function FullService() {
  return (
    <section id="servicos" className="site-grid border-b-2 border-line">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-primary">Soluções integradas</p>
            <h2 className="section-title mt-6 max-w-4xl text-balance">Do primeiro clique ao próximo nível.</h2>
          </div>
          <p className="max-w-sm text-base font-medium text-subtle">Escolha uma frente ou combine especialidades em uma operação digital completa.</p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, code, title, text }, index) => (
            <article key={code} className={`group relative min-h-72 overflow-hidden border-2 border-line bg-card p-7 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-brutal ${index === 0 ? 'lg:col-span-2' : ''}`}>
              <div className="flex items-start justify-between">
                <span className="border-2 border-line px-2 py-1 text-xs font-extrabold tracking-widest">{code}</span>
                <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div className="absolute inset-x-7 bottom-7">
                <h3 className="flex items-end justify-between gap-4 text-2xl font-extrabold tracking-[-.04em] sm:text-3xl">
                  {title}<ArrowUpRight className="shrink-0 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </h3>
                <p className="mt-3 max-w-lg text-subtle">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
