import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'ဂါရဝ | Garawa',description:'အဝေးကနေလည်း ချစ်ခြင်းနဲ့ ကန်တော့နိုင်တယ်။ Create a heartfelt digital offering.',openGraph:{title:'ဂါရဝ — Garawa',description:'A little offering. A lot of love.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="my"><body>{children}</body></html>}
