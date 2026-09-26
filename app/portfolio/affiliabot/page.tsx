import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Boxes, MonitorPlay, Gauge, Image as ImageIcon, KeyRound, LifeBuoy, Link2, ShieldCheck, Tag, TrendingUp } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ScrollAnimation from '../../components/ScrollAnimation'
import Flow from './Flow'
import { projects } from '../projects'

const project = projects.find((p) => p.slug === 'affiliabot')!

export const metadata: Metadata = {
  title: 'AffiliaBOT · Estudo de caso — Portfólio Cubo Virtual',
  description: 'Como a Cubo Virtual construiu o AffiliaBOT, SaaS que converte e repassa ofertas de afiliados do Telegram para o WhatsApp 24 horas por dia.',
  alternates: { canonical: '/portfolio/affiliabot/' },
}

const features = [
  { icon: Link2, title: 'Conversão automática', text: 'Cada link de Amazon, Mercado Livre e Shopee sai com a tag do afiliado. Link de loja sem integração derruba a mensagem inteira, para nunca repassar oferta que não gera comissão.' },
  { icon: ImageIcon, title: 'Foto ou card do produto', text: 'O afiliado escolhe: foto com legenda ou card clicável. O card é montado pelo próprio sistema, com foto tratada para sair nítida igual no Android e no iPhone.' },
  { icon: Gauge, title: 'Ritmo por rota', text: 'Limite de ofertas por hora e horário de silêncio por grupo. Quando lota, a oferta espera numa fila e sai a de melhor desconto.' },
  { icon: Tag, title: 'Selo e filtro de preço', text: 'Com o histórico de preços, a oferta ganha um selo quando está abaixo do normal, e a que está cara é descartada antes de chegar ao grupo.' },
  { icon: TrendingUp, title: 'Vendas por nicho', text: 'Relatório das vendas das lojas atribuídas a cada nicho de grupos, para o afiliado saber onde vale investir.' },
  { icon: LifeBuoy, title: 'Rede de segurança', text: 'O Telegram às vezes deixa de avisar mensagens novas. Uma varredura a cada 5 minutos recupera o que faltou, sem nunca enviar a mesma oferta duas vezes.' },
]

const engineering = [
  { icon: Boxes, text: 'Serviços separados em Docker: API, motor, WhatsApp, painel e banco' },
  { icon: KeyRound, text: 'Credenciais dos clientes criptografadas no banco' },
  { icon: ShieldCheck, text: 'Proteções contra SSRF ao seguir links e contra reuso de pagamentos' },
  { icon: Gauge, text: 'Multi-cliente: cada afiliado com as próprias sessões e configurações' },
]

export default function AffiliabotCase() {
  const whatsapp = `https://wa.me/5517991191582?text=${encodeURIComponent('Vi o case do AffiliaBOT no portfólio e quero conversar sobre um sistema.')}`

  return (
    <main>
      <Header />

      <section className="site-grid border-b-2 border-line">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <Link href="/portfolio" className="flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-subtle transition-colors hover:text-primary">
              <ArrowLeft size={16} aria-hidden="true" /> Portfólio
            </Link>
            <p className="eyebrow mt-6 text-primary">Produto próprio · SaaS em produção</p>
            <h1 className="section-title mt-6 text-balance">AffiliaBOT</h1>
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-subtle sm:text-xl">{project.tagline} Criado, operado e evoluído pela Cubo Virtual.</p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tecnologias">
              {project.stack.map((tech) => <li key={tech} className="border-2 border-line bg-card px-3 py-1 text-xs font-extrabold tracking-wide">{tech}</li>)}
            </ul>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/portfolio/affiliabot/app/" className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-ink bg-primary px-7 font-extrabold text-white shadow-brutal transition-transform hover:-translate-y-1">
                Abrir demo ao vivo <MonitorPlay size={21} aria-hidden="true" />
              </Link>
              <a href="https://affiliabot.com.br" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-ink bg-card px-7 font-extrabold transition-transform hover:-translate-y-1">
                Conhecer o produto <ArrowUpRight size={21} aria-hidden="true" />
              </a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-ink bg-accent px-7 font-extrabold text-black transition-transform hover:-translate-y-1">
                Quero um sistema assim <ArrowUpRight size={21} aria-hidden="true" />
              </a>
            </div>
          </div>
          <Flow />
        </div>
      </section>

      <ScrollAnimation>
        <section className="border-b-2 border-line bg-card">
          <div className="mx-auto grid max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-12">
            <div className="border-b-2 border-line pb-10 md:border-b-0 md:pb-0">
              <p className="eyebrow text-primary">O desafio</p>
              <p className="mt-6 text-xl font-semibold leading-relaxed sm:text-2xl">{project.challenge}</p>
            </div>
            <div className="pt-10 md:pt-0">
              <p className="eyebrow text-primary">A solução</p>
              <p className="mt-6 text-xl font-semibold leading-relaxed sm:text-2xl">{project.solution}</p>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="border-b-2 border-line">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
            <p className="eyebrow text-primary">O que o sistema faz</p>
            <div className="mt-10 grid border-l-2 border-t-2 border-line md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, text }, i) => (
                <article key={title} className="border-b-2 border-r-2 border-line bg-card p-6 transition-colors hover:bg-muted sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-primary">/0{i + 1}</span>
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h2 className="mt-10 text-xl font-extrabold tracking-[-.03em]">{title}</h2>
                  <p className="mt-3 text-subtle">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="border-b-2 border-line bg-ink text-canvas">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="eyebrow text-canvas">Engenharia</p>
              <h2 className="section-title mt-6 text-balance">Feito para rodar sozinho.</h2>
              <p className="mt-6 max-w-md text-canvas/70">Um robô que publica em nome do cliente não pode parar nem errar. Por isso a arquitetura foi pensada para isolar falhas e proteger dados.</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {engineering.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-4 border-2 border-canvas/20 p-5">
                  <Icon size={22} className="shrink-0 text-accent" aria-hidden="true" />
                  <span className="font-semibold">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollAnimation>

      <Footer />
    </main>
  )
}
