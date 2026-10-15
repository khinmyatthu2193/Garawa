alter table public.offerings
  add column if not exists sender_access_token_hash text unique;

comment on column public.offerings.sender_access_token_hash is
  'SHA-256 hash of a separate private sender inbox capability token. Nullable for legacy offerings.';
