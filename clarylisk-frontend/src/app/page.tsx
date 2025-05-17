'use client';

import { useState, useEffect } from 'react';
import Cta from '@/components/home/cta';
import Hero from '@/components/home/hero';
import HowItWorks from '@/components/home/how-it-works';
import Mission from '@/components/home/mission';
import Stats from '@/components/home/stats';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Mission />
      <HowItWorks />
      <Stats />
      <Cta />
    </main>
  );
}