import React from 'react';
import { Smartphone, Code, BarChart3, Palette, Share2, Lightbulb } from 'lucide-react';

type ServiceItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const ServiceItem = ({ icon, title, description }: ServiceItemProps) => (
  <div className="relative p-8 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors group">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div className="relative">
      <div className="mb-4 inline-block p-3 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-neutral-400">{description}</p>
    </div>
  </div>
);

const FullService = () => {
  const services = [
    { icon: <Smartphone size={28}/>, title: "Desenvolvimento de Apps Mobile", description: "Criamos aplicativos nativos e híbridos para iOS e Android, transformando sua ideia em uma ferramenta poderosa." },
    { icon: <Code size={28}/>, title: "Sistemas Desktop Personalizados", description: "Softwares sob medida para otimizar a gestão e os processos internos da sua empresa." },
    { icon: <BarChart3 size={28}/>, title: "Gestão de Tráfego Pago", description: "Campanhas no Google Ads e Social Ads para atrair o público certo e gerar resultados rápidos." },
    { icon: <Palette size={28}/>, title: "Identidade Visual e Branding", description: "Desenvolvemos logotipos e manuais de marca para sua empresa ser reconhecida e lembrada." },
    { icon: <Share2 size={28}/>, title: "Gestão de Redes Sociais", description: "Planejamento, criação de conteúdo e interação para construir uma comunidade engajada." },
    { icon: <Lightbulb size={28}/>, title: "Consultoria de Marketing Digital", description: "Analisamos seu negócio e traçamos as melhores estratégias para você alcançar seus objetivos." }
  ];

  return (
    <section id="servicos" className="py-16 bg-white dark:bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-light.svg')] dark:bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50 dark:opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Uma Agência de Soluções Completas</h2>
          <p className="text-lg text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">Vamos além da criação de sites. Oferecemos um ecossistema de soluções para sua marca prosperar no digital.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceItem key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FullService;