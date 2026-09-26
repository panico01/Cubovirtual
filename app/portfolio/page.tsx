import type { Metadata } from 'next'
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Portfólio — Cubo Virtual',
  description: 'Sistemas, plataformas e experiências digitais desenvolvidos pela Cubo Virtual.',
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
