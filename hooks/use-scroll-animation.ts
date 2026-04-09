'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold,
    margin: "0px 0px -100px 0px"
  });

  return { ref, isInView };
};

// Animation variants for different effects
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 60,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const fadeInDown = {
  hidden: { 
    opacity: 0, 
    y: -60,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -60,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 60,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Container variants for different layouts
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Card hover animations
export const cardHover = {
  rest: { 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Text reveal animation
export const textReveal = {
  hidden: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Image reveal animation
export const imageReveal = {
  hidden: { 
    opacity: 0,
    scale: 1.1,
    transition: { duration: 0.8, ease: "easeOut" }
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
}; 