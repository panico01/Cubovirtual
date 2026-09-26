import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { projects, type Project } from '../portfolio/projects'

// Miniatura do sistema nas cores da marca do cliente; troca por print/vídeo real quando a demo existir
function Screen({ project }: { project: Project }) {
  const { fg, accent } = project.brand
  const dim = { background: `${fg}1f` }
  const hot = { background: accent }

  switch (project.slug) {
    case 'vitalle':
      return (
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 21 }, (_, i) => (
            <span key={i} className="h-5 rounded-sm sm:h-7" style={[3, 9, 10, 16].includes(i) ? hot : dim} />
          ))}
        </div>
      )
    case 'horizonte-imoveis':
      return (
        <div className="grid grid-cols-3 gap-2">
          {[3, 2, 1].map((cards, col) => (
            <div key={col} className="space-y-1.5 rounded-md p-1.5" style={{ background: `${fg}0d` }}>
              {Array.from({ length: cards }, (_, i) => (
                <span key={i} className="block h-6 rounded sm:h-8" style={col === 2 ? hot : dim} />
              ))}
            </div>
          ))}
        </div>
      )
    case 'brasa-burger':
      return (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <span className="mx-auto block aspect-square w-3/5 rounded-full" style={i === 1 ? hot : dim} />
              <span className="mx-auto block h-2 w-2/3 rounded-full" style={dim} />
            </div>
          ))}
        </div>
      )
    case 'vertice-motors':
      return (
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5 rounded-md p-1.5" style={{ background: `${fg}0d` }}>
              <span className="block aspect-[16/9] rounded" style={i === 0 ? hot : dim} />
              <span className="block h-1.5 w-3/4 rounded-full" style={dim} />
              <span className="block h-1.5 w-1/2 rounded-full" style={i === 0 ? hot : dim} />
            </div>
          ))}
        </div>
      )
    default:
      return (
        <div className="space-y-2">
          {['w-3/4', 'ml-auto w-1/2', 'w-2/3'].map((w, i) => (
            <span key={i} className={`block h-5 rounded-md sm:h-7 ${w}`} style={i === 1 ? hot : dim} />
          ))}
        </div>
      )
  }
}

export function BrandPreview({ project }: { project: Project }) {
  const { bg, fg, accent, font } = project.brand

  return (
    <div className="relative aspect-[16/10] overflow-hidden border-2 border-ink" style={{ background: bg, color: fg }}>
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-40 blur-3xl transition-transform duration-700 group-hover:-translate-x-10 group-hover:translate-y-10"
        style={{ background: accent }}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-1.5 border-b px-3 py-2" style={{ borderColor: `${fg}26` }}>
        {[0, 1, 2].map((i) => <span key={i} className="size-2 rounded-full" style={{ background: `${fg}40` }} />)}
        {project.domain && <span className="ml-2 truncate rounded px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${fg}14` }}>{project.domain}</span>}
      </div>
      <div className="relative flex h-[calc(100%-2.25rem)] flex-col justify-between p-4 sm:p-6">
        <div>
          <p className={`text-2xl leading-none sm:text-4xl ${font}`}>{project.client}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[.18em] opacity-70">{project.system}</p>
        </div>
        <Screen project={project} />
      </div>
    </div>
  )
}

function Card({ project }: { project: Project }) {
  const body = (
    <>
      <BrandPreview project={project} />
      <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-5">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-primary">{project.segment}</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-[-.04em] sm:text-3xl">{project.client}</h3>
          <p className="mt-1 text-subtle">{project.system}</p>
        </div>
        {project.soon
          ? <span className="shrink-0 border-2 border-line px-2 py-1 text-xs font-extrabold uppercase tracking-widest">Case em breve</span>
          : <ArrowUpRight className="shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={28} aria-hidden="true" />}
      </div>
    </>
  )

  const base = 'group block border-2 border-line bg-card p-3 transition-all'
  if (project.soon) return <article className={`${base} opacity-80`}>{body}</article>

  return (
    <Link href={`/portfolio/${project.slug}`} className={`${base} hover:-translate-y-1 hover:border-ink hover:shadow-brutal`}>
      {body}
    </Link>
  )
}

export default function Portfolio({ standalone = false }: { standalone?: boolean }) {
  return (
    <section id="portfolio" className="border-b-2 border-line bg-card">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            {standalone ? <h1 className="eyebrow text-primary">Portfólio de sites e sistemas</h1> : <p className="eyebrow text-primary">Portfólio</p>}
            <h2 className="section-title mt-6 max-w-4xl text-balance">Não mostramos print. Mostramos sistema.</h2>
          </div>
          <p className="max-w-sm text-base font-medium text-subtle">
            Projetos-conceito com marcas fictícias e sistemas funcionando de verdade. Navegue como se fosse o cliente.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.map((project) => <Card key={project.slug} project={project} />)}
        </div>
      </div>
    </section>
  )
}
