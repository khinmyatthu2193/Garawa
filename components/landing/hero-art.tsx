'use client';

import Image from 'next/image';
import { useState } from 'react';

export function HeroArt() {
  const [available, setAvailable] = useState(true);
  return <div className="relative mx-auto flex aspect-[1.18] w-full max-w-[560px] items-center justify-center overflow-hidden lg:justify-end" role="img" aria-label="Myanmar Thadingyut-inspired Garawa artwork">{available ? <Image src="/images/landing/thadingyut-hero.webp" alt="" fill sizes="(max-width: 1024px) 92vw, 520px" className="object-contain object-center" priority onError={() => setAvailable(false)} /> : <div className="hero-art-fallback"><span className="hero-art-line" /><p>THADINGYUT<br /><span>GARAWA</span></p><span className="hero-art-line" /></div>}</div>;
}
