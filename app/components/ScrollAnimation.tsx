'use client'; // Animações de cliente precisam desta diretiva

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

type ScrollAnimationProps = {
  children: React.ReactNode;
  className?: string;
};

const ScrollAnimation = ({ children, className }: ScrollAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
