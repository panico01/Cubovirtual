'use client'; // Animações de cliente precisam desta diretiva

import { motion } from 'framer-motion';
import React from 'react';

type ScrollAnimationProps = {
  children: React.ReactNode;
  className?: string;
};

const ScrollAnimation = ({ children, className }: ScrollAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Começa invisível e 50px para baixo
      whileInView={{ opacity: 1, y: 0 }} // Anima para visível e na posição original
      viewport={{ once: true }} // A animação ocorre apenas uma vez
      transition={{ duration: 0.8, ease: "easeOut" }} // Duração e tipo de transição
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;