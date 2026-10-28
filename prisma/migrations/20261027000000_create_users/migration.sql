create table public.users (
  id uuid not null,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz(3) not null default current_timestamp,
  updated_at timestamptz(3) not null,

  constraint users_pkey primary key (id),
  constraint users_id_fkey
    foreign key (id)
    references auth.users (id)
    on delete cascade
);

alter table public.users enable row level security;

revoke all on table public.users from anon, authenticated;
grant select, insert, update, delete on table public.users to service_role;

insert into public.users (
  id,
  email,
  name,
  avatar_url,
  created_at,
  updated_at
)
select
  id,
  email,
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name'),
  coalesce(raw_user_meta_data ->> 'avatar_url', raw_user_meta_data ->> 'picture'),
  created_at,
  now()
from auth.users
on conflict (id) do update set
  email = excluded.email,
  name = excluded.name,
  avatar_url = excluded.avatar_url,
  updated_at = now();
