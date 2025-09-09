import type { Metadata } from 'next'
import Header from './components/Header'
import Hero from './components/Hero'
import Plans from './components/Plans'
import FullService from './components/FullService'
import Faq from './components/Faq'
import Footer from './components/Footer'
import WhyUs from './components/WhyUs'
import SectionSeparator from './components/SectionSeparator'
import ScrollAnimation from './components/ScrollAnimation'
import Testimonials from './components/Testimonials'

export const metadata: Metadata = {
  title: 'Cubo Virtual - Criação de Sistemas Profissionais e de Alta Performance',
  description: 'Transformamos ideias em realidade digital. Crie seu site profissional de alta performance e impulsione seu negócio na web.',
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />

      <ScrollAnimation>
        <SectionSeparator />
        <WhyUs />
      </ScrollAnimation>

      <ScrollAnimation>
        <SectionSeparator />
        <FullService />
      </ScrollAnimation>

      <ScrollAnimation>
        <SectionSeparator />
        <Testimonials />
      </ScrollAnimation>

      <ScrollAnimation>
        <SectionSeparator />
        <Plans />
      </ScrollAnimation>

      <ScrollAnimation>
        <SectionSeparator />
        <Faq />
      </ScrollAnimation>

      <Footer />
    </main>
  )
}