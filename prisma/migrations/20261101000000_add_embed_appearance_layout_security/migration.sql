create type public.embed_font as enum ('DEFAULT', 'SANS', 'SERIF', 'MONO');

alter table public.embeds
  add column font public.embed_font not null default 'DEFAULT',
  add column custom_css_enabled boolean not null default false,
  add column show_top_bar boolean not null default false,
  add column show_cover_image boolean not null default true,
  add column show_page_header boolean not null default true,
  add column password_hash text,
  add column email_access boolean not null default false,
  add column allowed_emails text[] not null default array[]::text[];
