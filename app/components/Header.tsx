'use client'

import { useState } from 'react'
import { ArrowUpRight, Box, Menu, X } from 'lucide-react'
import { ThemeSwitcher } from './ThemeSwitcher'

const navItems = [
  { href: '#metodo', label: 'Método' },
  { href: '#servicos', label: 'Soluções' },
  { href: '#depoimentos', label: 'Resultados' },
  { href: '#planos', label: 'Planos' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-2 border-line bg-canvas/95 backdrop-blur-md">
      <nav className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8" aria-label="Navegação principal">
        <a href="#inicio" className="flex min-h-11 items-center gap-3 font-extrabold tracking-[-0.04em] transition-colors hover:text-primary">
          <span className="grid size-10 place-items-center border-2 border-ink bg-primary text-white shadow-brutal-sm" aria-hidden="true">
            <Box size={21} strokeWidth={2.5} />
          </span>
          <span className="text-lg">CUBO/VIRTUAL</span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-bold transition-colors hover:text-primary">
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <a
            href="https://wa.me/5517991191582?text=Vim%20pelo%20site%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 border-2 border-ink bg-accent px-5 text-sm font-extrabold text-black shadow-brutal-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Iniciar projeto <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="grid size-11 cursor-pointer place-items-center border-2 border-line bg-card lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t-2 border-line bg-card px-5 py-5 lg:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-1">
            {navItems.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-base font-bold">
                <span className="mr-4 text-xs text-primary">0{index + 1}</span>{item.label}
              </a>
            ))}
            <a href="https://wa.me/5517991191582" className="mt-4 flex min-h-12 items-center justify-center bg-accent font-extrabold text-black">
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
