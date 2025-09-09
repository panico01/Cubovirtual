import React from 'react';
import { Rocket } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contato" className="bg-gray-100 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Rocket className="text-blue-500" size={28} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cubo Virtual</h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-400">Transformando ideias em realidade digital.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contato</h3>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-neutral-400">
              <li><a href="mailto:contato@cubovirtual.com.br" className="hover:text-blue-500">contato@cubovirtual.com.br</a></li>
              <li>(17) 99119-1582</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pronto para Começar?</h3>
            <p className="mt-4 text-gray-600 dark:text-neutral-400">Vamos conversar sobre o seu projeto. Entre em contato conosco sem compromisso.</p>
            <a 
              href="https://wa.me/5517991191582?text=Vim%20pelo%20site%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-5 py-3 rounded-full hover:bg-green-700 transition-all"
            >
              <Rocket size={18} /> 
              <span>Fale com um especialista</span>
            </a>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-neutral-700 pt-6 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cubo Virtual. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;