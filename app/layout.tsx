import type { Metadata } from 'next';
import { Noto_Serif_Myanmar, Padauk, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { MusicPlayerShell } from '@/components/music/music-player-shell';
import { MusicProvider } from '@/components/music/music-provider';
const displayMyanmar = Noto_Serif_Myanmar({ subsets: ['myanmar'], weight: ['600', '700'], variable: '--font-display-myanmar', display: 'swap' });
const bodyMyanmar = Padauk({ subsets: ['myanmar'], weight: ['400', '700'], variable: '--font-body-myanmar', display: 'swap' });
const decorativeSerif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-decorative-serif', display: 'swap' });
export const metadata: Metadata = {title:'ဂါရဝ | Garawa',description:'အဝေးကနေလည်း ချစ်ခြင်းနဲ့ ကန်တော့နိုင်တယ်။ Create a heartfelt digital offering.',openGraph:{title:'ဂါရဝ — Garawa',description:'A little offering. A lot of love.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="my"><body className={`${displayMyanmar.variable} ${bodyMyanmar.variable} ${decorativeSerif.variable}`}><MusicProvider>{children}<MusicPlayerShell /></MusicProvider></body></html>}
