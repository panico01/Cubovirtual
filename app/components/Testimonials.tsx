import { Quote, Star } from 'lucide-react'

const testimonials = [
  { name: 'João Silva', company: 'Tech Solutions', quote: 'A Cubo Virtual transformou a nossa presença online. O resultado foi incrível e o suporte, impecável.' },
  { name: 'Maria Oliveira', company: 'Inova Café', quote: 'O profissionalismo e a criatividade da equipe superaram todas as nossas expectativas.' },
  { name: 'Carlos Pereira', company: 'BuildFast Construções', quote: 'Desde o lançamento do novo site, nossos leads aumentaram em 200%. Um parceiro estratégico essencial.' },
  { name: 'Ana Costa', company: 'Moda & Cia Boutique', quote: 'O novo e-commerce é bonito e funcional. Nossas vendas online triplicaram em menos de três meses.' },
  { name: 'Ricardo Mendes', company: 'Mendes Advocacia', quote: 'A seriedade com que trataram nossa imagem digital transmitiu exatamente a confiança que precisávamos.' },
  { name: 'Sofia Lima', company: 'Sabor Real Restaurante', quote: 'A nova presença digital trouxe um público totalmente novo para o nosso restaurante.' },
]

export default function Testimonials() {
  return (
    <section id="depoimentos" className="border-b-2 border-line bg-primary text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end">
          <div>
            <p className="eyebrow text-white">Resultados compartilhados</p>
            <h2 className="section-title mt-6 max-w-4xl text-balance">Bom trabalho deixa rastro.</h2>
          </div>
          <p className="text-lg font-medium text-white/75">Negócios diferentes, a mesma sensação: ter uma equipe que entende, resolve e permanece por perto.</p>
        </div>

        <div className="mt-14 grid border-l border-t border-white/35 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <figure key={item.name} className="flex min-h-72 flex-col border-b border-r border-white/35 p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex gap-1" aria-label="5 de 5 estrelas">
                  {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={15} fill="currentColor" aria-hidden="true" />)}
                </div>
                <Quote size={25} className="text-white/60" aria-hidden="true" />
              </div>
              <blockquote className="mt-8 flex-1 text-lg font-semibold leading-relaxed">“{item.quote}”</blockquote>
              <figcaption className="mt-8 border-t border-white/30 pt-4">
                <p className="font-extrabold">{item.name}</p>
                <p className="text-sm text-white/70">{item.company} · 0{index + 1}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
