create table if not exists public.user_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance bigint not null default 0 check (balance >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id text not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  canonical_question_set_hash text not null
);

create table if not exists public.quiz_attempt_questions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id text not null,
  position integer not null check (position between 1 and 5),
  submitted_answer text,
  is_correct boolean,
  answered_at timestamptz,
  unique (attempt_id, question_id),
  unique (attempt_id, position)
);

create table if not exists public.rewarded_questions (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  rewarded_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, question_id)
);

create table if not exists public.rewarded_quiz_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id text not null,
  canonical_question_set_hash text not null,
  rewarded_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, category_id, canonical_question_set_hash)
);

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount bigint not null check (amount > 0),
  transaction_type text not null check (transaction_type in ('question_reward', 'completion_bonus')),
  reference_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, transaction_type, reference_id)
);

create index if not exists quiz_attempts_user_created_idx on public.quiz_attempts(user_id, started_at desc);
create index if not exists point_transactions_user_created_idx on public.point_transactions(user_id, created_at desc);

alter table public.user_wallets enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_attempt_questions enable row level security;
alter table public.rewarded_questions enable row level security;
alter table public.rewarded_quiz_completions enable row level security;
alter table public.point_transactions enable row level security;

revoke all on table public.user_wallets, public.quiz_attempts, public.quiz_attempt_questions, public.rewarded_questions, public.rewarded_quiz_completions, public.point_transactions from anon;
grant select on table public.user_wallets, public.quiz_attempts, public.quiz_attempt_questions, public.point_transactions to authenticated;

drop policy if exists user_wallets_select_own on public.user_wallets;
create policy user_wallets_select_own on public.user_wallets for select to authenticated using (user_id = auth.uid());
drop policy if exists quiz_attempts_select_own on public.quiz_attempts;
create policy quiz_attempts_select_own on public.quiz_attempts for select to authenticated using (user_id = auth.uid());
drop policy if exists quiz_attempt_questions_select_own on public.quiz_attempt_questions;
create policy quiz_attempt_questions_select_own on public.quiz_attempt_questions for select to authenticated using (exists (select 1 from public.quiz_attempts a where a.id = attempt_id and a.user_id = auth.uid()));
drop policy if exists point_transactions_select_own on public.point_transactions;
create policy point_transactions_select_own on public.point_transactions for select to authenticated using (user_id = auth.uid());

create or replace function public.record_quiz_answer(
  p_user_id uuid,
  p_attempt_id uuid,
  p_question_id text,
  p_submitted_answer text,
  p_is_correct boolean,
  p_question_points bigint,
  p_complete boolean
)
returns table(is_correct boolean, question_points_awarded bigint, completion_bonus_awarded bigint, wallet_balance bigint, attempt_completed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  attempt_row public.quiz_attempts%rowtype;
  question_row public.quiz_attempt_questions%rowtype;
  question_reward bigint := 0;
  completion_reward bigint := 0;
  current_balance bigint;
begin
  select * into attempt_row from public.quiz_attempts where id = p_attempt_id and user_id = p_user_id for update;
  if not found then raise exception 'attempt_not_found'; end if;
  if attempt_row.status = 'completed' then raise exception 'attempt_completed'; end if;

  select * into question_row from public.quiz_attempt_questions where attempt_id = p_attempt_id and question_id = p_question_id for update;
  if not found then raise exception 'question_not_in_attempt'; end if;
  if question_row.answered_at is not null then raise exception 'question_already_answered'; end if;

  update public.quiz_attempt_questions
    set submitted_answer = p_submitted_answer, is_correct = p_is_correct, answered_at = timezone('utc', now())
    where id = question_row.id;

  insert into public.user_wallets (user_id) values (p_user_id) on conflict (user_id) do nothing;
  select balance into current_balance from public.user_wallets where user_id = p_user_id for update;

  if p_is_correct and p_question_points > 0 then
    insert into public.rewarded_questions (user_id, question_id) values (p_user_id, p_question_id) on conflict do nothing;
    if found then
      question_reward := p_question_points;
      insert into public.point_transactions (user_id, amount, transaction_type, reference_id)
        values (p_user_id, question_reward, 'question_reward', p_question_id)
        on conflict do nothing;
      if not found then question_reward := 0; end if;
    end if;
  end if;

  if p_complete then
    if (select count(*) from public.quiz_attempt_questions where attempt_id = p_attempt_id and answered_at is not null) <> 5 then raise exception 'attempt_incomplete'; end if;
    update public.quiz_attempts set status = 'completed', completed_at = timezone('utc', now()) where id = p_attempt_id;
    insert into public.rewarded_quiz_completions (user_id, category_id, canonical_question_set_hash)
      values (p_user_id, attempt_row.category_id, attempt_row.canonical_question_set_hash) on conflict do nothing;
    if found then
      completion_reward := 5;
      insert into public.point_transactions (user_id, amount, transaction_type, reference_id)
        values (p_user_id, completion_reward, 'completion_bonus', p_attempt_id::text) on conflict do nothing;
      if not found then completion_reward := 0; end if;
    end if;
  end if;

  update public.user_wallets set balance = balance + question_reward + completion_reward, updated_at = timezone('utc', now()) where user_id = p_user_id returning balance into current_balance;
  return query select p_is_correct, question_reward, completion_reward, current_balance, p_complete;
end;
$$;

revoke all on function public.record_quiz_answer(uuid, uuid, text, text, boolean, bigint, boolean) from public, anon, authenticated;
grant execute on function public.record_quiz_answer(uuid, uuid, text, text, boolean, bigint, boolean) to service_role;
