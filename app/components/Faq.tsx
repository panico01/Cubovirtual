'use client';
import React, { useState } from 'react';

type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-neutral-800 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <p className="pt-4 text-gray-600 dark:text-neutral-400">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  const faqs = [
    { question: "Já tenho um domínio, posso usá-lo?", answer: "Sim, configuramos o seu novo site no seu domínio já existente. Se não tiver um, nós auxiliamo-lo no registo." },
    { question: "Em quanto tempo o meu site fica pronto?", answer: "O prazo varia conforme o plano. O Plano Essencial geralmente é entregue em até 10 dias úteis após o recebimento de todo o material necessário." },
    { question: "Eu mesmo posso atualizar o conteúdo do site?", answer: "Sim! Para os planos Intermediário e Avançado, oferecemos uma formação básica para que possa gerir o seu blog e fazer pequenas atualizações." },
    { question: "Existe alguma taxa de cancelamento?", answer: "Não há taxa de cancelamento. Os nossos planos são mensais e pode cancelar quando desejar, sem multas." }
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Perguntas Frequentes</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
