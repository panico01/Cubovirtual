import type { Metadata } from 'next'
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Portfólio de Sites e Sistemas | Cubo Virtual',
  description: 'Veja sistemas funcionando: agendamento online para clínicas, CRM para imobiliárias, cardápio digital e showroom de carros. Navegue nas demos como se fosse o cliente.',
  alternates: { canonical: '/portfolio/' },
}

export default function PortfolioPage() {
  return (
    <main>
      <Header />
      <Portfolio standalone />
      <Footer />
    </main>
  )
}
