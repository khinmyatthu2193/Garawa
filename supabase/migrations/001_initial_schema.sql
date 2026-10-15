create extension if not exists pgcrypto;

create table if not exists public.offering_catalog (
  id text primary key,
  name_my text not null,
  name_en text,
  description text,
  image_path text,
  is_active boolean not null default true
);

create table if not exists public.offerings (
  id uuid primary key default gen_random_uuid(),
  share_token_hash text unique not null,
  request_key_hash text unique,
  recipient_name text not null check (char_length(btrim(recipient_name)) between 1 and 80),
  sender_name text not null check (char_length(btrim(sender_name)) between 1 and 80),
  message text not null check (char_length(btrim(message)) between 1 and 500),
  wishes text check (wishes is null or char_length(wishes) <= 300),
  selected_item_ids text[] not null check (cardinality(selected_item_ids) >= 1),
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now()
);

create table if not exists public.recipient_responses (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.offerings(id) on delete cascade,
  message text not null check (char_length(btrim(message)) between 1 and 300),
  created_at timestamptz not null default now(),
  constraint one_response_per_offering unique (offering_id)
);

insert into public.offering_catalog (id, name_my, name_en, description) values
  ('flowers', 'ပန်းစည်း', 'Flower Bouquet', 'နွေးထွေးသော မေတ္တာလက်ဆောင်'),
  ('lotus', 'ကြာပန်း', 'Lotus Flowers', 'ငြိမ်းချမ်းခြင်းနှင့် လေးစားခြင်း'),
  ('fruits', 'သစ်သီးခြင်း', 'Fruit Basket', 'ကျန်းမာပျော်ရွှင်စေဖို့'),
  ('snacks', 'မြန်မာမုန့်များ', 'Traditional Snacks', 'အိမ်အရသာလေးတစ်စိတ်'),
  ('tea', 'လက်ဖက်ရည်', 'Tea', 'အတူတူထိုင်သောက်ချင်တဲ့ လက်ဖက်ရည်'),
  ('gift', 'လက်ဆောင်ခြင်း', 'Gift Basket', 'စိတ်ရင်းနဲ့ ရွေးထားတဲ့ လက်ဆောင်')
on conflict (id) do update set name_my = excluded.name_my, name_en = excluded.name_en, description = excluded.description;

alter table public.offering_catalog enable row level security;
alter table public.offerings enable row level security;
alter table public.recipient_responses enable row level security;

revoke all on table public.offering_catalog from public, anon, authenticated;
revoke all on table public.offerings from public, anon, authenticated;
revoke all on table public.recipient_responses from public, anon, authenticated;

create table if not exists public.rate_limit_buckets (
  key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0
);

alter table public.rate_limit_buckets enable row level security;
revoke all on table public.rate_limit_buckets from public, anon, authenticated;

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns table(allowed boolean, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_bucket public.rate_limit_buckets%rowtype;
  window_end timestamptz;
begin
  select * into current_bucket from public.rate_limit_buckets where key = p_key for update;
  if not found then
    insert into public.rate_limit_buckets (key, window_started_at, request_count) values (p_key, now(), 1);
    return query select true, 0;
    return;
  end if;

  window_end := current_bucket.window_started_at + make_interval(secs => p_window_seconds);
  if window_end <= now() then
    update public.rate_limit_buckets set window_started_at = now(), request_count = 1 where key = p_key;
    return query select true, 0;
    return;
  end if;

  if current_bucket.request_count >= p_limit then
    return query select false, greatest(1, ceil(extract(epoch from (window_end - now())))::integer);
    return;
  end if;

  update public.rate_limit_buckets set request_count = request_count + 1 where key = p_key;
  return query select true, 0;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
