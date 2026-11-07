create table public.security_rate_limits (
  key varchar(64) not null,
  attempts integer not null default 0,
  window_start timestamptz(3) not null,
  blocked_until timestamptz(3),
  updated_at timestamptz(3) not null,

  constraint security_rate_limits_pkey primary key (key)
);

create index security_rate_limits_updated_at_idx
  on public.security_rate_limits (updated_at);

alter table public.security_rate_limits enable row level security;

revoke all on table public.security_rate_limits from anon, authenticated;
grant select, insert, update, delete on table public.security_rate_limits to service_role;
