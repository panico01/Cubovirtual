'use client'

import React from 'react';
import { Star } from 'lucide-react';
import styles from './Testimonials.module.css'; 

type Testimonial = {
  name: string;
  company: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  { name: 'João Silva', company: 'Tech Solutions', quote: 'A Cubo Virtual transformou a nossa presença online. O resultado foi incrível e o suporte, impecável.' },
  { name: 'Maria Oliveira', company: 'Inova Café', quote: 'O profissionalismo e a criatividade da equipa superaram todas as nossas expectativas. Recomendo fortemente!' },
  { name: 'Carlos Pereira', company: 'BuildFast Construções', quote: 'Desde o lançamento do novo site, os nossos leads aumentaram em 200%. Um parceiro estratégico essencial.' },
  { name: 'Ana Costa', company: 'Moda & Cia Boutique', quote: 'O novo site de e-commerce que desenvolveram é lindo e funcional. As nossas vendas online triplicaram em menos de três meses!' },
  { name: 'Ricardo Mendes', company: 'Mendes Advocacia', quote: 'A seriedade e o profissionalismo com que trataram a nossa imagem digital transmitiram a confiança que a nossa área exige. Excelente trabalho.' },
  { name: 'Sofia Lima', company: 'Sabor Real Restaurante', quote: 'A gestão das nossas redes sociais e o novo site trouxeram um público totalmente novo ao nosso restaurante. Estamos sempre cheios!' }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex-shrink-0 w-96 bg-white dark:bg-neutral-800/50 p-8 rounded-2xl border border-gray-200 dark:border-neutral-700 flex flex-col">
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => <Star key={i} className="text-yellow-400" fill="currentColor" size={20}/>)}
    </div>
    {/* 👇 A CORREÇÃO ESTÁ AQUI 👇 */}
    <p className="text-gray-700 dark:text-neutral-300 italic flex-grow">{`"${testimonial.quote}"`}</p>
    <div className="mt-6">
      <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
      <p className="text-sm text-gray-500 dark:text-neutral-400">{testimonial.company}</p>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">O Que os Nossos Clientes Dizem</h2>
          <p className="text-lg text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">O sucesso dos nossos parceiros é a nossa maior recompensa.</p>
        </div>
        
        <div className={styles.carouselContainer}>
          <div className={styles.carouselTrack}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`duplicate-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;