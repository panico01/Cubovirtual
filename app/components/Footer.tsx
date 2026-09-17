import { ArrowUp, ArrowUpRight, Box, Mail, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contato" className="bg-ink text-canvas">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 border-b border-canvas/25 pb-16 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
          <div>
            <p className="eyebrow text-canvas">Seu próximo projeto</p>
            <h2 className="section-title mt-6 max-w-4xl text-balance">Vamos tirar essa ideia da tela mental?</h2>
          </div>
          <a
            href="https://wa.me/5517991191582?text=Vim%20pelo%20site%20e%20quero%20conversar%20sobre%20um%20projeto."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-16 items-center justify-center gap-3 border-2 border-canvas bg-accent px-7 font-extrabold text-black shadow-[6px_6px_0_var(--color-background)] transition-transform hover:-translate-y-1 lg:justify-self-end"
          >
            Conversar agora <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 text-lg font-extrabold tracking-[-.04em]"><Box aria-hidden="true" /> CUBO/VIRTUAL</div>
            <p className="mt-4 max-w-sm text-sm text-canvas/65">Estratégia, design e tecnologia trabalhando juntos para mover negócios.</p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-canvas/55">Contato</p>
            <a href="mailto:contato@cubovirtual.com.br" className="mt-4 flex min-h-11 items-center gap-3 font-bold hover:text-accent"><Mail size={18} aria-hidden="true" /> contato@cubovirtual.com.br</a>
            <a href="https://wa.me/5517991191582" className="flex min-h-11 items-center gap-3 font-bold hover:text-accent"><MessageCircle size={18} aria-hidden="true" /> (17) 99119-1582</a>
          </div>
          <div className="md:text-right">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-canvas/55">Navegação</p>
            <a href="#inicio" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold hover:text-accent">Voltar ao topo <ArrowUp size={18} aria-hidden="true" /></a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-canvas/25 pt-6 text-xs font-semibold uppercase tracking-wider text-canvas/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Cubo Virtual</p>
          <p>Feito para mover negócios</p>
        </div>
      </div>
    </footer>
  )
}
