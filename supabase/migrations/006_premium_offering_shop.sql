alter table public.offering_catalog add column if not exists tier text not null default 'free';
alter table public.offering_catalog add column if not exists point_price bigint not null default 0;
alter table public.offering_catalog add column if not exists sort_order integer not null default 0;
alter table public.offering_catalog drop constraint if exists offering_catalog_tier_check;
alter table public.offerings drop constraint if exists offerings_selected_item_ids_check;
alter table public.offering_catalog add constraint offering_catalog_tier_check check (tier in ('free', 'premium'));
alter table public.offering_catalog add constraint offering_catalog_point_price_check check ((tier = 'free' and point_price = 0) or (tier = 'premium' and point_price > 0));
alter table public.offerings add constraint offerings_selected_item_ids_check check (cardinality(selected_item_ids) >= 1);

update public.offering_catalog set tier = 'free', point_price = 0, sort_order = case id when 'flowers' then 10 when 'lotus' then 20 when 'fruits' then 30 when 'snacks' then 40 when 'tea' then 50 when 'gift' then 60 else sort_order end;
insert into public.offering_catalog (id, name_my, name_en, description, tier, point_price, sort_order) values
  ('premium-gift-basket', 'အထူးလက်ဆောင်ခြင်း', 'Traditional Premium Gift Basket', 'ရိုးရာအမှတ်တရများဖြင့် ပြင်ဆင်ထားသော အထူးလက်ဆောင်', 'premium', 100, 110),
  ('premium-lotus-arrangement', 'ကြာပန်းအလှဆင်', 'Decorative Premium Lotus', 'ငြိမ်းချမ်းမှုနှင့် ရိုသေမှုကို ကိုယ်စားပြုသော အထူးကြာပန်း', 'premium', 150, 120),
  ('premium-lantern-gift', 'မီးပုံးအလင်းလက်ဆောင်', 'Lantern Light Gift', 'အလင်းရောင်နှင့် မေတ္တာကို မျှဝေသော အထူးလက်ဆောင်', 'premium', 250, 130)
on conflict (id) do update set name_my = excluded.name_my, name_en = excluded.name_en, description = excluded.description, tier = excluded.tier, point_price = excluded.point_price, sort_order = excluded.sort_order;

create table if not exists public.user_inventory (
  user_id uuid not null references auth.users(id) on delete cascade,
  catalog_item_id text not null references public.offering_catalog(id) on delete restrict,
  unlocked_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, catalog_item_id)
);
alter table public.user_inventory enable row level security;
revoke all on table public.user_inventory from public, anon;
grant select on public.user_inventory to authenticated;
drop policy if exists user_inventory_select_own on public.user_inventory;
create policy user_inventory_select_own on public.user_inventory for select to authenticated using (user_id = auth.uid());

alter table public.point_transactions drop constraint if exists point_transactions_amount_check;
alter table public.point_transactions drop constraint if exists point_transactions_transaction_type_check;
alter table public.point_transactions add constraint point_transactions_amount_check check (amount <> 0);
alter table public.point_transactions add constraint point_transactions_transaction_type_check check (transaction_type in ('question_reward', 'completion_bonus', 'premium_purchase'));

create or replace function public.unlock_premium_offering(p_user_id uuid, p_catalog_item_id text, p_idempotency_key text)
returns table(status text, price bigint, wallet_balance bigint, unlocked_at timestamptz)
language plpgsql security definer set search_path = public
as $$
declare item public.offering_catalog%rowtype; current_balance bigint; owned_at timestamptz;
begin
  select * into item from public.offering_catalog where id = p_catalog_item_id and is_active = true for update;
  if not found or item.tier <> 'premium' then return query select 'unavailable', 0::bigint, 0::bigint, null::timestamptz; return; end if;
  insert into public.user_wallets (user_id) values (p_user_id) on conflict (user_id) do nothing;
  select balance into current_balance from public.user_wallets where user_id = p_user_id for update;
  if exists (select 1 from public.point_transactions where user_id = p_user_id and transaction_type = 'premium_purchase' and reference_id = p_idempotency_key) then
    return query select 'already_processed', 0::bigint, current_balance, null::timestamptz; return;
  end if;
  select unlocked_at into owned_at from public.user_inventory where user_id = p_user_id and catalog_item_id = item.id;
  if owned_at is not null then return query select 'already_owned', item.point_price, current_balance, owned_at; return; end if;
  if current_balance < item.point_price then return query select 'insufficient_points', item.point_price, current_balance, null::timestamptz; return; end if;
  insert into public.user_inventory (user_id, catalog_item_id) values (p_user_id, item.id) returning user_inventory.unlocked_at into owned_at;
  update public.user_wallets set balance = balance - item.point_price, updated_at = timezone('utc', now()) where user_id = p_user_id returning balance into current_balance;
  insert into public.point_transactions (user_id, amount, transaction_type, reference_id) values (p_user_id, -item.point_price, 'premium_purchase', p_idempotency_key) on conflict do nothing;
  return query select 'unlocked', item.point_price, current_balance, owned_at;
end;
$$;
revoke all on function public.unlock_premium_offering(uuid, text, text) from public, anon, authenticated;
grant execute on function public.unlock_premium_offering(uuid, text, text) to service_role;
