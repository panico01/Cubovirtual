'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <button
      type="button"
      onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="grid size-11 cursor-pointer place-items-center border-2 border-line bg-card transition-colors hover:border-primary hover:text-primary"
      aria-label={mounted && resolvedTheme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {mounted && resolvedTheme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
    </button>
  )
}
