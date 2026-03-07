'use client'; 

import React, { useState } from 'react';
import { CheckCircle2, HelpCircle } from 'lucide-react';

declare global {
  interface Window {
    gtag_report_conversion: (url?: string) => void;
  }
}

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <span className="group relative flex items-center gap-1.5">
    {children}
    <HelpCircle className="text-gray-400 dark:text-neutral-500 flex-shrink-0" size={16} />
    <span className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full
                   w-64 p-3 bg-neutral-900 text-white text-sm rounded-lg shadow-lg 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10
                   pointer-events-none dark:bg-neutral-800">
      {text}
    </span>
  </span>
);

// 2. ATUALIZADO: Props do PlanCard
type PlanCardProps = {
  title: string;
  description: string;
  features: { text: string; tooltip?: string }[]; // -> Atualizado
  priceMonthly: string; // -> Novo
  priceAnnual: string; // -> Novo
  billingCycle: 'monthly' | 'annual'; // -> Novo
  recommended?: boolean;
};

const PlanCard = ({ title, priceMonthly, priceAnnual, description, features, recommended = false, billingCycle }: PlanCardProps) => {
  const rawText = `Olá! Vim pelo site e tenho interesse no plano: ${title}.`;
  const encodedText = encodeURIComponent(rawText);
  const whatsappUrl = `https://wa.me/5517991191582?text=${encodedText}`;

  const handleConversion = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    
    if (typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion(whatsappUrl);
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  // 3. NOVA LÓGICA: Lógica de exibição de preço
  const priceToDisplay = billingCycle === 'annual' ? priceAnnual : priceMonthly;
  const annualTotal = (parseFloat(priceAnnual.replace(',', '.')) * 12).toFixed(2).replace('.', ',');
  
  const priceHelperText = billingCycle === 'annual' 
    ? `Total R$ ${annualTotal} cobrado anualmente`
    : `R$ ${priceAnnual}/mês no plano anual`;

  return (
    <div className={`
      relative border rounded-2xl p-8 flex flex-col bg-white dark:bg-neutral-900 
      transition-all duration-300 ease-in-out
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
      
      {/* 4. ATUALIZADO: Exibição de Preço Dinâmico */}
      <div className="mt-6">
        <p className="text-gray-600 dark:text-neutral-300">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">R${priceToDisplay}</span>
          /mês
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400 h-4">
          {priceHelperText}
        </p>
      </div>
      
      {/* 5. ATUALIZADO: Lista de features com Tooltips */}
      <ul className="mt-8 space-y-4 text-gray-600 dark:text-neutral-300 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
            {feature.tooltip ? (
              <Tooltip text={feature.tooltip}>
                <span>{feature.text}</span>
              </Tooltip>
            ) : (
              <span>{feature.text}</span>
            )}
          </li>
        ))}
      </ul>

      <a 
        href={whatsappUrl} 
        onClick={handleConversion}
        target="_blank" 
        rel="noopener noreferrer"
        className={`mt-4 block w-full text-center font-semibold py-3 rounded-lg transition-all ${recommended ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'}`}
      >
        Contratar Plano
      </a>
    </div>
  );
};

const Plans = () => {
  // 7. NOVO: Estado para controlar o ciclo de pagamento
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // 8. ATUALIZADO: Dados dos planos com preços e tooltips
  const plansData = [
    {
      title: 'Plano Essencial',
      priceMonthly: '49,90',
      priceAnnual: '29,90',
      description: 'Ideal para marcar sua presença online de forma rápida e profissional.',
      features: [
        { text: 'Site Institucional One Page (até 5 secções)' },
        { text: 'Design baseado em template premium' },
        { text: 'Formulário de Contato funcional' },
        { text: 'Integração com Redes Sociais' },
        { 
          text: 'Manutenção Mensal Básica', 
          tooltip: 'Inclui atualizações de segurança, backups e pequenos ajustes de texto ou imagem (até 1h/mês).' 
        },
        { text: 'Suporte via E-mail' },
      ],
    },
    {
      title: 'Plano Intermediário',
      priceMonthly: '79,90',
      priceAnnual: '49,90',
      description: 'Perfeito para empresas em crescimento que precisam de mais espaço.',
      features: [
        { text: 'Tudo do Plano Essencial' },
        { text: 'Site com até 5 Páginas' },
        { text: 'Design com Cores e Fontes Personalizadas' },
        { 
          text: 'Otimização SEO',
          tooltip: 'Configuração inicial de SEO On-Page: meta tags, sitemap, e registro no Google Search Console.'
        },
        { 
          text: 'Manutenção Mensal Prioritária',
          tooltip: 'Suas solicitações de ajuste são tratadas com prioridade (até 3h/mês).'
        },
        { text: 'Suporte via E-mail e WhatsApp' },
      ],
      recommended: true,
    },
    {
      title: 'Plano Avançado',
      priceMonthly: '149,90',
      priceAnnual: '99,90',
      description: 'A solução completa para máxima performance e funcionalidades.',
      features: [
        { text: 'Tudo do Plano Intermediário' },
        { text: 'Site com até 10 Páginas' },
        { text: 'Design 100% Sob Medida e Exclusivo' },
        { text: 'Integrações Avançadas (agendamento)' },
        { 
          text: 'Otimização SEO Avançada',
          tooltip: 'SEO On-Page contínuo, monitoramento de palavras-chave e otimização de velocidade.'
        },
        { text: 'Suporte Premium Completo via Telefone' },
      ],
    },
  ];

  return (
    <section id="planos" className="py-24 sm:py-28 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Planos Flexíveis para o seu Sucesso</h2>
          <p className="text-lg text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">Escolha o plano ideal para o seu momento e decole no ambiente online.</p>
        </div>

        {/* 9. NOVO: Seletor de Ciclo de Pagamento (Toggle) */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-neutral-400'}`}>
            Mensal
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 ${billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-neutral-700'}`}
          >
            <span
              className={`block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`}
            />
          </button>
          <span className={`font-medium relative ${billingCycle === 'annual' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-neutral-400'}`}>
            Anual
            {billingCycle === 'annual' && (
              <span className="absolute -top-5 -right-24 text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap dark:bg-green-900 dark:text-green-200">
                Economize 40%
              </span>
            )}
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plansData.map((plan, index) => (
            <PlanCard 
              key={index} 
              {...plan} 
              billingCycle={billingCycle} // -> Passa o estado para o card
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;