-- 20 premium "player avatar" skins — same mechanism the old 'vip'/'cometa'
-- entries used: xp_required 0, gated purely client-side by
-- entry.requiresPremium in src/data/avatars.ts (fn_set_my_avatar itself
-- only checks xp_required, same as it always has — no premium check exists
-- server-side, consistent with the existing vip/cometa behavior this
-- mirrors). The TS copy (PREMIUM_AVATAR_CATALOG) is the source of truth for
-- naming/artwork — keep ids in sync by hand if this changes.

insert into public.avatars (id, xp_required) values
  ('premium_rey', 0),
  ('premium_duque', 0),
  ('premium_comandante', 0),
  ('premium_hechicero', 0),
  ('premium_magnate', 0),
  ('premium_aristocrata', 0),
  ('premium_cesar', 0),
  ('premium_almirante', 0),
  ('premium_streamer', 0),
  ('premium_inspector', 0),
  ('premium_caballero', 0),
  ('premium_vip', 0),
  ('premium_cosmonauta', 0),
  ('premium_padrino', 0),
  ('premium_sultan', 0),
  ('premium_pirata', 0),
  ('premium_dragon', 0),
  ('premium_samurai', 0),
  ('premium_archimago', 0),
  ('premium_heroe', 0)
on conflict (id) do nothing;
