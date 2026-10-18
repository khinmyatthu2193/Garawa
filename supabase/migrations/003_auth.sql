create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Garawa user' check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.offerings add column if not exists sender_user_id uuid references auth.users(id) on delete set null;
create index if not exists offerings_sender_user_id_idx on public.offerings(sender_user_id);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Garawa user'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

grant select on public.offerings to authenticated;
drop policy if exists offerings_select_own on public.offerings;
create policy offerings_select_own on public.offerings for select to authenticated using (sender_user_id = auth.uid());
grant select on public.recipient_responses to authenticated;
drop policy if exists recipient_responses_select_own on public.recipient_responses;
create policy recipient_responses_select_own on public.recipient_responses for select to authenticated using (exists (select 1 from public.offerings where offerings.id = recipient_responses.offering_id and offerings.sender_user_id = auth.uid()));
