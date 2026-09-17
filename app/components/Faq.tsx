'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

const faqs = [
  ['Já tenho um domínio. Posso usá-lo?', 'Sim. Configuramos o novo site no domínio que você já possui. Se ainda não tiver um, ajudamos no registro.'],
  ['Em quanto tempo meu site fica pronto?', 'O prazo varia conforme o plano. O Essencial geralmente é entregue em até 10 dias úteis após recebermos todo o material necessário.'],
  ['Posso atualizar o conteúdo sozinho?', 'Sim. Nos planos Intermediário e Avançado, oferecemos orientação para você gerenciar o blog e realizar pequenas atualizações.'],
  ['Existe alguma taxa de cancelamento?', 'Não. Os planos são mensais e podem ser cancelados quando você desejar, sem multa.'],
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-b-2 border-line bg-card">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="eyebrow text-primary">Sem letras miúdas</p>
          <h2 className="section-title mt-6 text-balance">Perguntas diretas. Respostas também.</h2>
        </div>
        <div className="border-t-2 border-line">
          {faqs.map(([question, answer], index) => {
            const active = open === index
            return (
              <div key={question} className="border-b-2 border-line">
                <button
                  type="button"
                  onClick={() => setOpen(active ? null : index)}
                  className="flex min-h-20 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg font-extrabold transition-colors hover:text-primary sm:text-xl"
                  aria-expanded={active}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span><span className="mr-4 text-sm text-primary">0{index + 1}</span>{question}</span>
                  <span className="grid size-11 shrink-0 place-items-center border-2 border-line" aria-hidden="true">{active ? <Minus /> : <Plus />}</span>
                </button>
                <div id={`faq-answer-${index}`} className={`grid transition-[grid-template-rows,opacity] duration-200 ${active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden"><p className="max-w-2xl pb-7 pl-0 text-base leading-relaxed text-subtle sm:pl-10">{answer}</p></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
