import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check, MonitorPlay } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ScrollAnimation from '../../components/ScrollAnimation'
import { BrandPreview } from '../../components/Portfolio'
import { projects } from '../projects'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return projects.filter((p) => !p.soon && !p.custom).map((p) => ({ slug: p.slug }))
}

const findProject = async (params: Props['params']) => {
  const { slug } = await params
  return projects.find((p) => p.slug === slug && !p.soon && !p.custom)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await findProject(params)
  if (!project) return {}
  return {
    title: `${project.keyword} — case ${project.client} | Cubo Virtual`,
    description: project.solution,
    alternates: { canonical: `/portfolio/${project.slug}/` },
  }
}

export default async function ProjectPage({ params }: Props) {
  const project = await findProject(params)
  if (!project) notFound()

  const whatsapp = `https://wa.me/5517991191582?text=${encodeURIComponent(`Vi o projeto ${project.client} no portfólio e quero um sistema de ${project.system.toLowerCase()}.`)}`

  return (
    <main>
      <Header />

      <section className="site-grid border-b-2 border-line">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Link href="/portfolio" className="flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-subtle transition-colors hover:text-primary">
              <ArrowLeft size={16} aria-hidden="true" /> Portfólio
            </Link>
            <h1 className="eyebrow mt-6 text-primary">{project.keyword}</h1>
            <p className="section-title mt-6 text-balance">{project.client}</p>
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-subtle sm:text-xl">{project.tagline}</p>

            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tecnologias">
              {project.stack.map((tech) => <li key={tech} className="border-2 border-line bg-card px-3 py-1 text-xs font-extrabold tracking-wide">{tech}</li>)}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              {project.real && project.domain ? (
                <a href={`https://${project.domain}/`} target="_blank" rel="noopener" className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-ink bg-primary px-7 font-extrabold text-white shadow-brutal transition-transform hover:-translate-y-1">
                  Visitar o site <ArrowUpRight size={21} aria-hidden="true" />
                </a>
              ) : project.live ? (
                <a href={`/portfolio/${project.slug}/app/`} className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-ink bg-primary px-7 font-extrabold text-white shadow-brutal transition-transform hover:-translate-y-1">
                  Abrir demo ao vivo <MonitorPlay size={21} aria-hidden="true" />
                </a>
              ) : (
                <span className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-dashed border-line px-7 font-extrabold text-subtle">
                  Demo interativa em breve
                </span>
              )}
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-ink bg-accent px-7 font-extrabold text-black transition-transform hover:-translate-y-1">
                Quero um sistema assim <ArrowUpRight size={21} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="group">
            <BrandPreview project={project} />
          </div>
        </div>
      </section>

      <ScrollAnimation>
        <section className="border-b-2 border-line bg-card">
          <div className="mx-auto grid max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-12">
            <div className="border-b-2 border-line pb-10 md:border-b-0 md:pb-0">
              <h2 className="eyebrow text-primary">O desafio</h2>
              <p className="mt-6 text-xl font-semibold leading-relaxed sm:text-2xl">{project.challenge}</p>
            </div>
            <div className="pt-10 md:pt-0">
              <h2 className="eyebrow text-primary">A solução</h2>
              <p className="mt-6 text-xl font-semibold leading-relaxed sm:text-2xl">{project.solution}</p>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="border-b-2 border-line bg-card">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="eyebrow text-primary">Para quem é · {project.segment}</h2>
            <p className="mt-6 max-w-4xl text-xl font-semibold leading-relaxed sm:text-2xl">{project.forWho}</p>
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="border-b-2 border-line">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="eyebrow text-primary">O que o sistema faz</h2>
            <div className="mt-10 grid border-l-2 border-t-2 border-line sm:grid-cols-2 lg:grid-cols-4">
              {project.features.map((feature, index) => (
                <div key={feature} className="flex min-h-44 flex-col justify-between border-b-2 border-r-2 border-line bg-card p-6 transition-colors hover:bg-muted">
                  <span className="text-sm font-extrabold text-primary">/0{index + 1}</span>
                  <p className="flex items-end justify-between gap-3 text-lg font-extrabold leading-snug tracking-[-.02em]">
                    {feature}<Check size={20} className="shrink-0 text-primary" aria-hidden="true" />
                  </p>
                </div>
              ))}
            </div>
            {!project.real && <p className="mt-8 max-w-2xl text-sm text-subtle">
              Projeto demonstrativo: marca, dados e cenário são fictícios, criados pela Cubo Virtual para mostrar como entregamos sistemas sob medida.
            </p>}
          </div>
        </section>
      </ScrollAnimation>

      <Footer />
    </main>
  )
}
