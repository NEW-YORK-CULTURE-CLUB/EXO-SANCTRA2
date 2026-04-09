'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'textReveal' | 'imageReveal';
  delay?: number;
  duration?: number;
  threshold?: number;
  as?: keyof JSX.IntrinsicElements;
}

const animationVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  textReveal: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  imageReveal: {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 }
  }
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  as = 'div'
}) => {
  const { ref, isInView } = useScrollAnimation(threshold);

  return (
    <motion.div
      ref={ref}
      as={as}
      className={className}
      variants={animationVariants[animation]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered container for multiple items
interface StaggeredContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
  threshold = 0.1
}) => {
  const { ref, isInView } = useScrollAnimation(threshold);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.6,
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered item for use within StaggeredContainer
interface StaggeredItemProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
}

export const StaggeredItem: React.FC<StaggeredItemProps> = ({
  children,
  className = '',
  animation = 'fadeInUp'
}) => {
  return (
    <motion.div
      className={className}
      variants={animationVariants[animation]}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}; 