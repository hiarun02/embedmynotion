alter table public.embeds
  add column width integer not null default 640;

alter table public.embeds
  add constraint embeds_width_check
    check (width between 320 and 1920);
