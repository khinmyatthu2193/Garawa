alter table public.offerings add column if not exists recipient_share_token_encrypted text;

comment on column public.offerings.recipient_share_token_encrypted is
  'Encrypted recipient capability token. Decrypt only on the trusted server with OFFERING_TOKEN_ENCRYPTION_KEY; legacy rows remain null.';
