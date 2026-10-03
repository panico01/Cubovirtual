import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react'

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
            <div className="flex items-center gap-3 text-lg font-extrabold tracking-[-.04em]"><svg viewBox="0 0 100 100" className="size-7" aria-hidden="true"><rect width="100" height="100" rx="24" fill="#2563eb" /><path d="M50 18 78 34 50 50 22 34Z" fill="#fff" /><path d="M22 34 50 50V82L22 66Z" fill="#bfdbfe" /><path d="M78 34 50 50V82L78 66Z" fill="#93c5fd" /></svg> CUBO/VIRTUAL</div>
            <p className="mt-4 max-w-sm text-sm text-canvas/65">Estratégia, design e tecnologia trabalhando juntos para mover negócios.</p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-canvas/55">Contato</p>
            <a href="mailto:contato@cubovirtual.com.br" className="mt-4 flex min-h-11 items-center gap-3 font-bold hover:text-accent"><Mail size={18} aria-hidden="true" /> contato@cubovirtual.com.br</a>
            <a href="https://wa.me/5517991191582" className="flex min-h-11 items-center gap-3 font-bold hover:text-accent"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.7-.1 1.3z"/></svg> (17) 99119-1582</a>
          </div>
          <div className="md:text-right">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-canvas/55">Navegação</p>
            <a href="#" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold hover:text-accent">Voltar ao topo <ArrowUp size={18} aria-hidden="true" /></a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-canvas/25 pt-6 text-xs font-semibold uppercase tracking-wider text-canvas/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Cubo Virtual · Sumaré-SP · <a href="/privacidade/" className="hover:text-accent">Política de Privacidade</a></p>
          <p>Feito para mover negócios</p>
        </div>
      </div>
    </footer>
  )
}
