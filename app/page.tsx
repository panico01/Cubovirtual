import type { Metadata } from 'next'
import Header from './components/Header'
import Hero from './components/Hero'
import Plans from './components/Plans'
import FullService from './components/FullService'
import Faq from './components/Faq'
import Footer from './components/Footer'
import WhyUs from './components/WhyUs'
import ScrollAnimation from './components/ScrollAnimation'
import Portfolio from './components/Portfolio'

export const metadata: Metadata = {
  title: 'Criação de Sites e Sistemas sob Medida | Cubo Virtual',
  description: 'Criação de sites, sistemas sob medida, aplicativos e tráfego pago para empresas de todo o Brasil. Planos a partir de R$ 29,90/mês e atendimento pelo WhatsApp.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />

      <ScrollAnimation>
        <WhyUs />
      </ScrollAnimation>

      <ScrollAnimation>
        <FullService />
      </ScrollAnimation>

      <ScrollAnimation>
        <Portfolio />
      </ScrollAnimation>

      <ScrollAnimation>
        <Plans />
      </ScrollAnimation>

      <ScrollAnimation>
        <Faq />
      </ScrollAnimation>

      <Footer />
    </main>
  )
}
