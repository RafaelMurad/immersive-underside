import { useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins once
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Hook to ensure GSAP plugins are registered
 * Call this once at the app root level
 */
export function useGSAPSetup() {
  useEffect(() => {
    // Set GSAP defaults for consistent behavior
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8,
    });

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });
  }, []);
}

export { gsap, useGSAP, ScrollTrigger };
