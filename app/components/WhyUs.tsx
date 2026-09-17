import { HeartHandshake, Target, Zap } from 'lucide-react'

const principles = [
  {
    icon: Target,
    number: '01',
    title: 'Resultado antes do ruído',
    text: 'Cada escolha de design e tecnologia começa nos objetivos reais do seu negócio.',
  },
  {
    icon: Zap,
    number: '02',
    title: 'Velocidade com critério',
    text: 'Processos enxutos, tecnologia moderna e entregas que não sacrificam qualidade.',
  },
  {
    icon: HeartHandshake,
    number: '03',
    title: 'Parceria sem distância',
    text: 'Comunicação direta e acompanhamento próximo do início à evolução do projeto.',
  },
]

export default function WhyUs() {
  return (
    <section id="metodo" className="border-b-2 border-line bg-card">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow text-primary">Nosso método</p>
            <h2 className="section-title mt-6 text-balance">Menos promessa.<br />Mais projeto.</h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-subtle lg:justify-self-end">
            Não entregamos apenas telas bonitas. Unimos visão de negócio, experiência e engenharia para criar produtos digitais úteis, rápidos e preparados para crescer.
          </p>
        </div>

        <div className="mt-14 grid border-l-2 border-t-2 border-line md:grid-cols-3">
          {principles.map(({ icon: Icon, number, title, text }) => (
            <article key={number} className="group min-h-72 border-b-2 border-r-2 border-line bg-canvas p-7 transition-colors hover:bg-muted sm:p-8">
              <div className="flex items-start justify-between">
                <span className="text-sm font-extrabold text-primary">/{number}</span>
                <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-16 text-2xl font-extrabold leading-tight tracking-[-.04em]">{title}</h3>
              <p className="mt-4 text-base leading-relaxed text-subtle">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
