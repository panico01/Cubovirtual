'use client'

import { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

declare global {
  interface Window { gtag_report_conversion?: (url?: string) => void }
}

const plans = [
  {
    name: 'Essencial', monthly: '49,90', annual: '29,90',
    description: 'Para colocar sua empresa no digital com clareza e profissionalismo.',
    features: ['Site one page com até 5 seções', 'Template premium personalizado', 'Formulário de contato', 'Integração com redes sociais', 'Manutenção mensal básica', 'Suporte por e-mail'],
  },
  {
    name: 'Intermediário', monthly: '79,90', annual: '49,90', recommended: true,
    description: 'Para negócios em crescimento que precisam de mais presença e autonomia.',
    features: ['Tudo do plano Essencial', 'Site com até 5 páginas', 'Cores e fontes personalizadas', 'Configuração inicial de SEO', 'Manutenção mensal prioritária', 'Suporte por e-mail e WhatsApp'],
  },
  {
    name: 'Avançado', monthly: '149,90', annual: '99,90',
    description: 'Para operações que exigem experiência exclusiva e mais performance.',
    features: ['Tudo do plano Intermediário', 'Site com até 10 páginas', 'Design exclusivo e sob medida', 'Integrações avançadas', 'SEO avançado e contínuo', 'Suporte premium por telefone'],
  },
]

export default function Plans() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')

  const openPlan = (event: React.MouseEvent<HTMLAnchorElement>, plan: string) => {
    event.preventDefault()
    const url = `https://wa.me/5517991191582?text=${encodeURIComponent(`Olá! Vim pelo site e tenho interesse no plano ${plan}.`)}`
    if (typeof window.gtag_report_conversion === 'function') window.gtag_report_conversion(url)
    else window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="planos" className="site-grid border-b-2 border-line">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-primary">Planos transparentes</p>
            <h2 className="section-title mt-6 max-w-4xl text-balance">Comece do tamanho certo.</h2>
          </div>
          <div className="flex min-h-14 items-center border-2 border-ink bg-card p-1" aria-label="Ciclo de cobrança">
            <button type="button" onClick={() => setBilling('monthly')} className={`min-h-11 cursor-pointer px-5 text-sm font-extrabold transition-colors ${billing === 'monthly' ? 'bg-ink text-canvas' : 'hover:bg-muted'}`} aria-pressed={billing === 'monthly'}>Mensal</button>
            <button type="button" onClick={() => setBilling('annual')} className={`min-h-11 cursor-pointer px-5 text-sm font-extrabold transition-colors ${billing === 'annual' ? 'bg-primary text-white' : 'hover:bg-muted'}`} aria-pressed={billing === 'annual'}>Anual −40%</button>
          </div>
        </div>

        <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = billing === 'annual' ? plan.annual : plan.monthly
            const total = (Number(plan.annual.replace(',', '.')) * 12).toFixed(2).replace('.', ',')
            const href = `https://wa.me/5517991191582?text=${encodeURIComponent(`Olá! Tenho interesse no plano ${plan.name}.`)}`
            return (
              <article key={plan.name} className={`relative flex flex-col border-2 p-7 sm:p-8 ${plan.recommended ? 'border-ink bg-primary text-white shadow-brutal' : 'border-line bg-card'}`}>
                {plan.recommended && <span className="absolute right-0 top-0 bg-accent px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-black">Mais escolhido</span>}
                <p className={`text-xs font-extrabold uppercase tracking-[.18em] ${plan.recommended ? 'text-white/70' : 'text-primary'}`}>Plano</p>
                <h3 className="mt-3 text-3xl font-extrabold tracking-[-.05em]">{plan.name}</h3>
                <p className={`mt-4 min-h-20 ${plan.recommended ? 'text-white/75' : 'text-subtle'}`}>{plan.description}</p>
                <div className={`my-7 border-y py-6 ${plan.recommended ? 'border-white/35' : 'border-line'}`}>
                  <p className="flex items-end gap-2"><span className="text-lg font-bold">R$</span><span className="text-5xl font-extrabold tracking-[-.07em]">{price}</span><span className="mb-1 text-sm">/mês</span></p>
                  <p className={`mt-2 text-xs ${plan.recommended ? 'text-white/70' : 'text-subtle'}`}>{billing === 'annual' ? `R$ ${total} cobrados anualmente` : `R$ ${plan.annual}/mês no plano anual`}</p>
                </div>
                <ul className="flex-1 space-y-4">
                  {plan.features.map((feature) => <li key={feature} className="flex gap-3 text-sm font-medium"><Check size={18} className={`mt-0.5 shrink-0 ${plan.recommended ? 'text-white' : 'text-primary'}`} aria-hidden="true" />{feature}</li>)}
                </ul>
                <a href={href} onClick={(event) => openPlan(event, plan.name)} className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 border-2 font-extrabold transition-transform hover:-translate-y-0.5 ${plan.recommended ? 'border-white bg-white text-primary' : 'border-ink bg-accent text-black'}`}>
                  Escolher plano <ArrowUpRight size={19} aria-hidden="true" />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
