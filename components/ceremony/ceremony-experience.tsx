'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, SkipForward } from 'lucide-react';
import { CeremonyProgress } from '@/components/ceremony/ceremony-progress';
import { OfferingTray } from '@/components/ceremony/offering-tray';
import type { CeremonyStage, RecipientOffering } from '@/types/offering';

const responseLimit = 300;
const stageOrder: CeremonyStage[] = ['welcome', 'offerings', 'message', 'response'];

export function CeremonyExperience({ offering, shareToken }: { offering: RecipientOffering; shareToken?: string }) {
  const [stage, setStage] = useState<CeremonyStage>('welcome');
  const [response, setResponse] = useState('');
  const [responseError, setResponseError] = useState('');
  const [responseSaved, setResponseSaved] = useState(false);
  const [responseSaving, setResponseSaving] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, [stage]);
  const advance = () => { setResponseError(''); const next = stageOrder[stageOrder.indexOf(stage) + 1]; if (next) setStage(next); else setStage('complete'); };
  const goBack = () => { setResponseError(''); const previous = stageOrder[stageOrder.indexOf(stage) - 1]; if (previous) setStage(previous); };
  const submitResponse = async () => {
    const trimmed = response.trim();
    if (!trimmed) { setResponseError('စာလေး ရေးချင်ရင် အနည်းဆုံး စာလုံးတစ်လုံး ရေးပေးပါ။ မရေးဘဲလည်း ဆက်သွားနိုင်ပါတယ်။'); return; }
    setResponse(trimmed); setResponseError('');
    if (!shareToken) { setResponseSaved(true); return; }
    setResponseSaving(true);
    try {
      const result = await fetch('/api/offerings/' + shareToken + '/responses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: trimmed }) });
      const payload = await result.json() as { error?: string };
      if (!result.ok) throw new Error(payload.error ?? 'တုံ့ပြန်မှုကို ယခုသိမ်းမရသေးပါ။');
      setResponseSaved(true);
    } catch (error) {
      setResponseError(error instanceof Error ? error.message : 'တုံ့ပြန်မှုကို ယခုသိမ်းမရသေးပါ။');
    } finally { setResponseSaving(false); }
  };
  const restart = () => { setStage('welcome'); setResponse(''); setResponseError(''); setResponseSaved(false); setSkipAnimation(false); };

  if (stage === 'complete') return <Completion offering={offering} response={response} onRestart={restart} />;
  return <main className="container-page py-8 pb-16 sm:py-12"><div className="mx-auto max-w-[980px]"><CeremonyProgress stage={stage} /><section aria-live="polite" aria-labelledby="ceremony-heading" className="ceremony-panel mx-auto max-w-[880px]"><div className="text-center"><p className="eyebrow">GARAWA · DIGITAL CEREMONY</p><StageContent stage={stage} offering={offering} shareToken={shareToken} response={response} responseError={responseError} responseSaved={responseSaved} responseSaving={responseSaving} skipAnimation={skipAnimation} headingRef={headingRef} setResponse={setResponse} setResponseError={setResponseError} submitResponse={submitResponse} setResponseSaved={setResponseSaved} setSkipAnimation={setSkipAnimation} /></div><div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">{stage !== 'welcome' ? <button type="button" onClick={goBack} className="pill-button secondary"><ArrowLeft size={18} /> နောက်သို့</button> : <span />}{stage === 'response' ? <button type="button" onClick={advance} className="pill-button secondary">မရေးဘဲ ဆက်မည် <ArrowRight size={18} /></button> : <button type="button" onClick={advance} className="pill-button">{stage === 'welcome' ? 'ကန်တော့လက်ဆောင် ဖွင့်ကြည့်မည်' : stage === 'offerings' ? 'ကန်တော့စာလေး ဖတ်မည်' : 'ဆုတောင်းစကားလေး ရေးမည်'} <ArrowRight size={18} /></button>}</div></section></div></main>;
}

type StageContentProps = { stage: CeremonyStage; offering: RecipientOffering; shareToken?: string; response: string; responseError: string; responseSaved: boolean; responseSaving: boolean; skipAnimation: boolean; headingRef: React.RefObject<HTMLHeadingElement | null>; setResponse: (value: string) => void; setResponseError: (value: string) => void; submitResponse: () => Promise<void>; setResponseSaved: (value: boolean) => void; setSkipAnimation: (value: boolean) => void };

function StageContent({ stage, offering, shareToken, response, responseError, responseSaved, responseSaving, skipAnimation, headingRef, setResponse, setResponseError, submitResponse, setResponseSaved, setSkipAnimation }: StageContentProps) {
  if (stage === 'welcome') return <div className="ceremony-card mt-5 overflow-hidden rounded-[30px] bg-[#F3DCC9] px-6 py-12 sm:px-16"><DecorativeArt /><h1 ref={headingRef} tabIndex={-1} id="ceremony-heading" className="relative mt-7 text-3xl font-extrabold leading-[1.5] text-[#493129] sm:text-5xl">မင်္ဂလာပါ မေမေ 🌸</h1><p className="relative mx-auto mt-5 max-w-xl text-xl font-bold leading-9 text-[#493129]">{offering.recipientName} အတွက် {offering.senderName} က ချစ်ခြင်းမေတ္တာနဲ့ ကန်တော့လက်ဆောင်လေး ပို့ထားပါတယ်။</p><p className="relative mx-auto mt-4 max-w-lg leading-8 text-[#746A5F]">ဒီလက်ဆောင်လေးကို ဖြည်းဖြည်းချင်း ဖွင့်ကြည့်လိုက်ရအောင်။</p></div>;
  if (stage === 'offerings') return <div className="ceremony-card mt-5 rounded-[30px] bg-[#FFFDF7] p-6 sm:p-10"><h1 ref={headingRef} tabIndex={-1} id="ceremony-heading" className="text-3xl font-extrabold leading-[1.5] text-[#493129] sm:text-4xl">မေတ္တာနဲ့ ရွေးထားတဲ့ ကန်တော့လက်ဆောင်လေးတွေ 🎁</h1><p className="mx-auto mt-4 max-w-xl leading-8 text-[#746A5F]">{offering.senderName} က {offering.recipientName} အတွက် ရွေးချယ်ထားတဲ့ သင်္ကေတလက်ဆောင်လေးတွေပါ။</p><OfferingTray selectedOfferings={offering.selectedOfferings} skipAnimation={skipAnimation} /><button type="button" onClick={() => setSkipAnimation(true)} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-[#8D3430] hover:bg-[#FAF0E6]" aria-label="Skip offering reveal animation"><SkipForward size={15} /> လှုပ်ရှားမှု ကျော်မည်</button><p className="mt-2 text-xs text-[#8B8074]">ဒစ်ဂျစ်တယ် သင်္ကေတလက်ဆောင်များသာ ဖြစ်ပါတယ်။</p></div>;
  if (stage === 'message') return <div className="ceremony-card mt-5 rounded-[30px] bg-[#F7E7D0] p-5 sm:p-12"><h1 ref={headingRef} tabIndex={-1} id="ceremony-heading" className="text-3xl font-extrabold leading-[1.5] text-[#493129] sm:text-4xl">ရင်ထဲက ကန်တော့စာလေး 💌</h1><div className="mx-auto mt-8 max-w-2xl rounded-[24px] border border-[#D8A348]/50 bg-[#FFFDF7] p-6 text-left shadow-[0_14px_35px_rgba(91,59,35,.08)] sm:p-10"><p className="font-bold text-[#8D3430]">ချစ်ရတဲ့ {offering.recipientName}၊</p><p className="mt-5 whitespace-pre-wrap text-lg leading-9 text-[#493129]">{offering.message}</p>{offering.wishes && <p className="mt-7 whitespace-pre-wrap border-l-2 border-[#D8A348] pl-4 leading-8 text-[#746A5F]">{offering.wishes}</p>}<p className="mt-8 border-t border-[#E9DFD0] pt-5 text-right font-bold leading-8 text-[#493129]">ချစ်ခြင်းမေတ္တာဖြင့်၊<br />{offering.senderName}</p></div></div>;
  return <div className="ceremony-card mt-5 rounded-[30px] bg-[#E8F0E4] p-6 sm:p-12"><h1 ref={headingRef} tabIndex={-1} id="ceremony-heading" className="text-3xl font-extrabold leading-[1.5] text-[#493129] sm:text-4xl">ဆုတောင်းစကားလေး ပြန်ပို့မလား? 🌷</h1><p className="mx-auto mt-4 max-w-xl leading-8 text-[#746A5F]">ဒီကန်တော့လက်ဆောင်လေးအတွက် ဆုတောင်းစကား ဒါမှမဟုတ် ကျေးဇူးတင်စကားလေး ပြန်ရေးပေးနိုင်ပါတယ်။</p><div className="mx-auto mt-7 max-w-2xl rounded-[24px] bg-[#FFFDF7] p-5 text-left sm:p-8"><label htmlFor="ceremony-response" className="font-bold text-[#493129]">ပြန်လည်ဆုတောင်းစကား <span className="font-normal text-[#8B8074]">(မဖြည့်လည်း ရပါတယ်)</span></label><textarea id="ceremony-response" value={response} maxLength={responseLimit} onChange={(event) => { setResponse(event.target.value); setResponseError(''); setResponseSaved(false); }} placeholder="ဥပမာ - သမီးလေး စိတ်ချမ်းသာပြီး နေ့ရက်တိုင်း ပျော်ရွှင်ပါစေ..." rows={5} aria-invalid={Boolean(responseError)} aria-describedby={responseError ? 'response-error' : 'response-count'} className="mt-3 w-full resize-y rounded-2xl border border-[#DCCDBA] bg-[#FFFDF7] px-4 py-3 leading-8 outline-none transition placeholder:text-[#A59B91] focus:border-[#8D3430] focus:ring-2 focus:ring-[#F0C8A4]" /><div className="mt-2 flex justify-between text-xs text-[#8B8074]"><span id="response-count">{response.length}/{responseLimit}</span>{responseSaved && <span className="font-bold text-[#456B50]"><Check size={14} className="mr-1 inline" /> သိမ်းပြီးပါပြီ</span>}</div>{responseError && <p id="response-error" role="alert" className="mt-3 text-sm font-semibold text-[#8D3430]">{responseError}</p>}<button type="button" onClick={submitResponse} disabled={responseSaving} className="pill-button mt-5 w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto">{responseSaving ? 'သိမ်းဆည်းနေပါတယ်…' : 'ဆုတောင်းစကား သိမ်းမည်'}</button></div><p className="mx-auto mt-5 max-w-lg text-xs leading-6 text-[#746A5F]">{shareTokenNotice(shareToken)}</p></div>;
}

function shareTokenNotice(shareToken?: string) { return shareToken ? 'သင်ရေးထားသော စကားကို သိမ်းဆည်းထားပြီး ပေးပို့သူက ကိုယ်ပိုင် inbox လင့်မှတစ်ဆင့် ကြည့်ရှုနိုင်ပါတယ်။ အကြောင်းကြားစာတော့ မပို့နိုင်သေးပါ။' : 'အစမ်းဗားရှင်းဖြစ်သောကြောင့် သင်ရေးထားသော စကားသည် ဒီစက်ထဲမှာသာ သိမ်းထားပါတယ်။'; }
function DecorativeArt() { return <div className="relative mx-auto h-24 max-w-sm" aria-hidden="true"><span className="absolute left-8 top-2 text-4xl">🏮</span><span className="absolute left-1/2 top-0 -translate-x-1/2 text-5xl">🪷</span><span className="absolute right-8 top-2 text-4xl">🏮</span><span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-3xl">✦</span></div>; }
function Completion({ offering, response, onRestart }: { offering: RecipientOffering; response: string; onRestart: () => void }) { return <main className="container-page flex min-h-[76vh] items-center justify-center py-16"><section className="storybook-card w-full max-w-2xl p-8 text-center sm:p-14"><DecorativeArt /><h1 className="mt-5 text-3xl font-extrabold leading-[1.5] text-[#493129] sm:text-4xl">Garawa လေးကို လက်ခံပေးလို့ ကျေးဇူးတင်ပါတယ် 🌸</h1><p className="body-my mx-auto mt-4 max-w-lg text-[#746A5F]">{offering.senderName} ရဲ့ ချစ်ခြင်းမေတ္တာနဲ့ ပြုလုပ်ထားတဲ့ ကန်တော့လက်ဆောင်လေးကို ဖွင့်ကြည့်ပြီးပါပြီ။</p>{response && <p className="mx-auto mt-5 max-w-lg rounded-2xl bg-[#F3EBDC] px-4 py-3 text-sm leading-7 text-[#746A5F]">သင်ရေးထားသော စကားကို ဒီအတွေ့အကြုံထဲမှာသာ သိမ်းထားပါတယ်။ ပေးပို့သူထံ မရောက်သေးပါ။</p>}<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={onRestart} className="pill-button secondary"><RotateCcw size={17} /> အစကနေ ပြန်ကြည့်မည်</button><a href="/" className="pill-button">ပင်မစာမျက်နှာသို့</a></div></section></main>; }
