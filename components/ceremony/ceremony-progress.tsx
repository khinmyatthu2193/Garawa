import type { CeremonyStage } from '@/types/offering';

const labels = ['ကြိုဆိုခြင်း', 'ကန်တော့လက်ဆောင်', 'မေတ္တာစာ', 'ဆုတောင်းစကား'];
const stages: CeremonyStage[] = ['welcome', 'offerings', 'message', 'response'];

export function CeremonyProgress({ stage }: { stage: CeremonyStage }) {
  const index = stages.indexOf(stage);
  return <nav aria-label="Ceremony progress" className="mb-8"><div className="flex items-center justify-center gap-2 sm:gap-4"><ol className="flex w-full max-w-xl items-center justify-between">{labels.map((label, position) => { const active = position === index; const complete = position < index; return <li key={label} className="flex flex-1 items-center last:flex-none"><div className="flex flex-col items-center"><span className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${active ? 'border-[#8D3430] bg-[#8D3430] text-white' : complete ? 'border-[#D8A348] bg-[#F7E8BD] text-[#8D3430]' : 'border-[#DCCDBA] bg-[#FFFDF7] text-[#8B8074]'}`} aria-current={active ? 'step' : undefined}>{complete ? '✓' : position + 1}</span><span className={`mt-2 hidden text-center text-xs sm:block ${active ? 'font-bold text-[#8D3430]' : 'text-[#8B8074]'}`}>{label}</span></div>{position < labels.length - 1 && <span aria-hidden="true" className={`mx-2 h-px flex-1 sm:mx-4 ${complete ? 'bg-[#D8A348]' : 'bg-[#E9DFD0]'}`} />}</li>; })}</ol></div><p className="mt-3 text-center text-sm font-semibold text-[#746A5F] sm:hidden">အဆင့် {Math.max(index + 1, 1)} / ၄ · {labels[Math.max(index, 0)]}</p></nav>;
}
