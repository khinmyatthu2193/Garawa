import Image from 'next/image';

export function HeroArt() {
  return <div className="relative mx-auto flex aspect-[1.18] w-full max-w-[560px] items-center justify-center overflow-hidden lg:justify-end" role="img" aria-label="Golden lantern festival offering scene"><Image src="/Golden Lantern Festival Offering Scene.png" alt="Golden lantern festival offering scene with lotus flowers and a traditional offering tray" fill sizes="(max-width: 1024px) 92vw, 520px" className="object-contain object-center" priority /></div>;
}
