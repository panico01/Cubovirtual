import React from 'react';
import { CheckCircle2 } from 'lucide-react';

type PlanCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
};

const PlanCard = ({ title, price, description, features, recommended = false }: PlanCardProps) => (
  // 👇 AS MUDANÇAS ESTÃO AQUI 👇
  <div className={`
    relative border rounded-2xl p-8 flex flex-col bg-white dark:bg-neutral-900 
    transition-all duration-300 ease-in-out cursor-pointer
    hover:scale-[1.03] hover:shadow-2xl 
    ${recommended 
      ? 'border-blue-500 shadow-blue-500/20 shadow-lg hover:shadow-blue-500/30' 
      : 'border-gray-200 dark:border-neutral-800 hover:border-blue-500/50 hover:shadow-blue-500/10'
    }
  `}>
    {recommended && (
      <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full absolute -top-4 left-1/2 -translate-x-1/2">
        MAIS POPULAR
      </span>
    )}
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-gray-500 dark:text-neutral-400 text-sm">{description}</p>
    <p className="mt-6 text-gray-600 dark:text-neutral-300">
      <span className="text-4xl font-extrabold text-gray-900 dark:text-white">R${price}</span>
      /mês
    </p>
    <ul className="mt-8 space-y-4 text-gray-600 dark:text-neutral-300 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <a href="https://wa.me/5517991191582?text=Vim%20pelo%20site%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." className={`mt-8 block w-full text-center font-semibold py-3 rounded-lg transition-all ${recommended ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'}`}>
      Contratar Plano
    </a>
  </div>
);

const Plans = () => {
    const plansData = [
        {
          title: 'Plano Essencial',
          price: '29,90',
          description: 'Ideal para marcar sua presença online de forma rápida e profissional.',
          features: ['Site Institucional One Page (até 5 secções)', 'Design baseado em template premium', 'Formulário de Contato funcional', 'Integração com Redes Sociais', 'Manutenção Mensal Básica', 'Suporte via E-mail'],
        },
        {
          title: 'Plano Intermediário',
          price: '49,90',
          description: 'Perfeito para empresas em crescimento que precisam de mais espaço.',
          features: ['Tudo do Plano Essencial', 'Site com até 5 Páginas', 'Design com Cores e Fontes Personalizadas', 'Otimização SEO', 'Manutenção Mensal Prioritária', 'Suporte via E-mail e WhatsApp'],
          recommended: true,
        },
        {
          title: 'Plano Avançado',
          price: '99,90',
          description: 'A solução completa para máxima performance e funcionalidades.',
          features: ['Tudo do Plano Intermediário', 'Site com até 10 Páginas', 'Design 100% Sob Medida e Exclusivo', 'Integrações Avançadas (agendamento)', 'Otimização SEO Avançada', 'Suporte Premium Completo via Telefone'],
        },
      ];

  return (
    <section id="planos" className="py-24 sm:py-28 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Planos Flexíveis para o seu Sucesso</h2>
          <p className="text-lg text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">Escolha o plano ideal para o seu momento e decole no ambiente online.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plansData.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;