import React from 'react';

const Hero = () => {
  return (
    <section className="relative text-center py-16 sm:py-36 bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-neutral-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-light.svg')] dark:bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-4xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          Desenvolvemos sistemas que impulsionam resultados
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-neutral-300 max-w-3xl mx-auto">
          Transformamos ideias em realidade digital. Tenha um site profissional de alta performance e impulsione seu negócio na web.
        </p>
        <a 
          href="#planos"
          className="mt-10 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold px-10 py-4 rounded-full 
                     hover:scale-105 transition-transform shadow-lg hover:shadow-purple-500/40"
        >
          Conheça os Planos
        </a>
      </div>
    </section>
  );
};

export default Hero;