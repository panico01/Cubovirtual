'use client'
import React from 'react';
import { Rocket } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 py-3 px-6 bg-white/80 dark:bg-black/50 backdrop-blur-lg border-b border-gray-200 dark:border-neutral-800">
      <nav className="container mx-auto flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <Rocket className="text-blue-500" size={28} />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cubo Virtual</h1>
        </a>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#planos" className="text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors">Planos</a>
          <a href="#servicos" className="text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors">Serviços</a>
          <a href="#faq" className="text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <a 
            href="https://wa.me/5517991191582?text=Vim%20pelo%20site%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/40"
          >
            Whatsapp
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;