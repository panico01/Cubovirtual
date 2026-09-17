import type { Metadata } from 'next'
import Header from './components/Header'
import Hero from './components/Hero'
import Plans from './components/Plans'
import FullService from './components/FullService'
import Faq from './components/Faq'
import Footer from './components/Footer'
import WhyUs from './components/WhyUs'
import ScrollAnimation from './components/ScrollAnimation'
import Testimonials from './components/Testimonials'

export const metadata: Metadata = {
  title: 'Cubo Virtual — Sites e sistemas que trabalham pelo seu negócio',
  description: 'Criamos experiências digitais rápidas, estratégicas e prontas para transformar atenção em oportunidade.',
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
        <Testimonials />
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
