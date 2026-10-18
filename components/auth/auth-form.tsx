'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { authErrorMessage, safeNext } from '@/lib/auth/redirect';
import { ConnectivityNotice } from '@/components/auth/connectivity-notice';

type Mode = 'login' | 'signup' | 'forgot' | 'reset';

export function AuthForm({ mode, next = '/dashboard' }: { mode: Mode; next?: string }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  const title = mode === 'login' ? 'ပြန်လည်ဝင်ရောက်ပါ' : mode === 'signup' ? 'Garawa အကောင့်ဖွင့်ပါ' : mode === 'forgot' ? 'စကားဝှက် ပြန်ယူပါ' : 'စကားဝှက်အသစ်ထားပါ';
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const supabase = createSupabaseBrowserClient();
      if (mode === 'login') { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; window.location.assign(safeNext(next)); }
      else if (mode === 'signup') { if (password.length < 8 || password !== confirm) throw new Error('password'); const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` } }); if (error) throw error; if (data.session) window.location.assign('/dashboard'); else setMessage('အကောင့်ဖွင့်ပြီးပါပြီ။ ဝင်ရောက်အသုံးပြုနိုင်ပါပြီ။'); }
      else if (mode === 'forgot') { await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` }); setMessage('အီးမေးလ်လိပ်စာ မှန်ကန်ပါက ပြန်လည်သတ်မှတ်ရန် လင့်ခ်တစ်စောင် ပို့ပေးပါမည်။'); }
      else { if (password.length < 8 || password !== confirm) throw new Error('password'); const { error } = await supabase.auth.updateUser({ password }); if (error) throw error; setMessage('စကားဝှက် ပြောင်းပြီးပါပြီ။'); setTimeout(() => window.location.assign('/dashboard'), 700); }
    } catch (caught) { setError(authErrorMessage(caught instanceof Error ? caught.message : undefined)); } finally { setBusy(false); }
  };
  const google = async () => { setBusy(true); setError(''); const supabase = createSupabaseBrowserClient(); const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext(next))}` } }); if (error) { setError(authErrorMessage(error.message)); setBusy(false); } };
  return <section className="container-page section-pad max-w-xl"><div className="storybook-card p-6 sm:p-10"><p className="eyebrow">GARAWA</p><h1 className="section-title mt-2">{title}</h1><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{mode === 'forgot' ? 'အီးမေးလ်ထည့်ပေးပါ။' : mode === 'reset' ? 'အနည်းဆုံး အက္ခရာ ၈ လုံးရှိသော စကားဝှက်အသစ်ထားပါ။' : 'သင့်ရဲ့ ဆုတောင်းလက်ဆောင်တွေကို လုံခြုံစွာ စီမံထားပါ။'}</p>
    {mode !== 'reset' && (mode === 'login' || mode === 'signup') && <ConnectivityNotice mode={mode} />}
    {mode !== 'reset' && <button type="button" onClick={google} disabled={busy} className="mt-7 flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--line)] bg-white px-4 font-bold text-[var(--ink)] disabled:opacity-60">Google နဲ့ ဆက်လုပ်မယ်</button>}
    {mode !== 'reset' && <div className="my-6 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]" />သို့မဟုတ်<span className="h-px flex-1 bg-[var(--line)]" /></div>}
    <form onSubmit={submit} className="space-y-4">{mode === 'signup' && <label className="block text-sm font-bold">အမည်<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={80} className="auth-input" /></label>}{mode !== 'reset' && <label className="block text-sm font-bold">အီးမေးလ်<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" /></label>}{mode !== 'forgot' && <label className="block text-sm font-bold">စကားဝှက်<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="auth-input" /></label>}{(mode === 'signup' || mode === 'reset') && <label className="block text-sm font-bold">စကားဝှက် ထပ်ထည့်ပါ<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} className="auth-input" /></label>}{error && <p role="alert" className="rounded-2xl bg-red-50 p-3 text-sm leading-6 text-red-800">{error}</p>}{message && <p role="status" className="rounded-2xl bg-green-50 p-3 text-sm leading-6 text-green-800">{message}</p>}<button disabled={busy} className="pill-button w-full disabled:opacity-60">{busy ? 'ခဏစောင့်ပါ…' : mode === 'login' ? 'ဝင်ရောက်မယ်' : mode === 'signup' ? 'အကောင့်ဖွင့်မယ်' : mode === 'forgot' ? 'လင့်ခ်ပို့မယ်' : 'စကားဝှက်သိမ်းမယ်'}</button></form>
    <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--red)]">{mode === 'login' && <><Link href={`/signup?next=${encodeURIComponent(next)}`}>အကောင့်မရှိသေးပါ</Link><Link href="/forgot-password">စကားဝှက်မေ့နေပါသလား</Link></>}{mode === 'signup' && <Link href={`/login?next=${encodeURIComponent(next)}`}>အကောင့်ရှိပြီးသားပါ</Link>}{mode === 'forgot' && <Link href="/login">ဝင်ရောက်ရန် ပြန်သွားမယ်</Link>}</div></div></section>;
}
