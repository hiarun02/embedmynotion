alter table public.embeds
  add column full_height boolean not null default false,
  add column border_width smallint not null default 1,
  add column border_color text not null default '#e5e7eb';

alter table public.embeds
  add constraint embeds_height_check
    check (height between 200 and 2000),
  add constraint embeds_border_radius_check
    check (border_radius between 0 and 64),
  add constraint embeds_border_width_check
    check (border_width between 1 and 12),
  add constraint embeds_border_color_check
    check (border_color ~ '^#[0-9A-Fa-f]{6}$');
