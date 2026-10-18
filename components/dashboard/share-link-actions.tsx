'use client';

import { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

export function ShareLinkActions({ url }: { url: string | null }) {
  const [copied, setCopied] = useState(false);
  if (!url) return <p className="mt-3 rounded-2xl bg-[#F3DCC9] p-3 text-sm leading-6 text-[#746A5F]">ဒီ offering ကို ဖန်တီးစဉ်က recipient link ကို ပြန်လည်ရယူနိုင်အောင် သိမ်းထားခြင်း မရှိသေးပါ။ လုံခြုံရေးအရ link အသစ်ကို ခန့်မှန်းဖန်တီးမပေးနိုင်ပါ။</p>;
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard permission denied */ } };
  return <div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={copy} className="pill-button secondary min-h-11 px-4 text-sm"><Copy size={16} />{copied ? 'ကူးပြီးပါပြီ' : 'လင့်ကူးမည်'}</button><a href={url} target="_blank" rel="noreferrer" className="pill-button secondary min-h-11 px-4 text-sm"><ExternalLink size={16} />အသစ်ဖွင့်မည်</a></div>;
}
