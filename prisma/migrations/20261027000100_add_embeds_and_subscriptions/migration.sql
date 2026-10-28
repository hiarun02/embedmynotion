create type public.plan as enum ('FREE', 'PRO');
create type public.billing_interval as enum ('MONTHLY', 'YEARLY');
create type public.subscription_status as enum (
  'TRIALING',
  'ACTIVE',
  'PAST_DUE',
  'CANCELED',
  'EXPIRED'
);
create type public.embed_theme as enum ('LIGHT', 'DARK', 'SYSTEM');

create table public.embeds (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  notion_url text not null,
  slug text not null,
  theme public.embed_theme not null default 'LIGHT',
  full_width boolean not null default true,
  height integer not null default 700,
  border boolean not null default false,
  border_radius integer not null default 8,
  custom_css text,
  hide_watermark boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz(3) not null default current_timestamp,
  updated_at timestamptz(3) not null,

  constraint embeds_pkey primary key (id),
  constraint embeds_user_id_fkey
    foreign key (user_id)
    references public.users (id)
    on delete cascade
);

create unique index embeds_slug_key on public.embeds (slug);
create index embeds_user_id_idx on public.embeds (user_id);

create table public.subscriptions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  plan public.plan not null default 'PRO',
  billing_interval public.billing_interval not null,
  status public.subscription_status not null,
  provider text not null,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_start timestamptz(3),
  current_period_end timestamptz(3),
  cancel_at_period_end boolean not null default false,
  created_at timestamptz(3) not null default current_timestamp,
  updated_at timestamptz(3) not null,

  constraint subscriptions_pkey primary key (id),
  constraint subscriptions_user_id_fkey
    foreign key (user_id)
    references public.users (id)
    on delete cascade
);

create unique index subscriptions_user_id_key
  on public.subscriptions (user_id);
create unique index subscriptions_provider_subscription_id_key
  on public.subscriptions (provider_subscription_id);
create index subscriptions_provider_customer_id_idx
  on public.subscriptions (provider_customer_id);

alter table public.embeds enable row level security;
alter table public.subscriptions enable row level security;

revoke all on table public.embeds from anon, authenticated;
revoke all on table public.subscriptions from anon, authenticated;

grant select, insert, update, delete on table public.embeds to service_role;
grant select, insert, update, delete on table public.subscriptions to service_role;
