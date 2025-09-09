import React from 'react';
import { Target, Zap, HeartHandshake } from 'lucide-react';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

const FeatureCard = ({ icon, title, children }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="p-4 bg-blue-100 dark:bg-blue-600/20 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-neutral-400">{children}</p>
    </div>
  );
};

const WhyUs = () => {
  return (
    <section id="why-us" className="py-16 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Por Que o Cubo Virtual?</h2>
          <p className="text-lg text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">O nosso compromisso vai além do código. Somos o seu parceiro estratégico para o sucesso digital.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <FeatureCard icon={<Target size={32} className="text-blue-600 dark:text-blue-400" />} title="Foco em Resultados">
            Não criamos apenas sites, criamos máquinas de conversão. Cada projeto é pensado para atingir os seus objetivos de negócio.
          </FeatureCard>
          <FeatureCard icon={<Zap size={32} className="text-blue-600 dark:text-blue-400" />} title="Tecnologia de Ponta">
            Utilizamos as ferramentas mais modernas e performáticas do mercado para garantir que o seu site seja rápido, seguro e escalável.
          </FeatureCard>
          <FeatureCard icon={<HeartHandshake size={32} className="text-blue-600 dark:text-blue-400" />} title="Suporte Humanizado">
            Estamos sempre disponíveis para ajudar. Conte com um atendimento próximo e dedicado para resolver qualquer questão.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;