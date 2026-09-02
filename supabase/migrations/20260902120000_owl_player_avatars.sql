-- 20 owl "player avatar" skins — replace the original driving-icon catalog
-- (see 20260829110000_avatar_catalog.sql) as the only avatars offered in
-- the picker, unlocked progressively by XP (same mechanic as before, just
-- a new set of art). The TS copy in src/data/avatars.ts is the source of
-- truth for how each one is named/drawn — keep the ids and thresholds in
-- sync by hand if this changes.
--
-- The old rows (volante, semaforo, ...) are deliberately left in place:
-- nothing here deletes them, so any profile that already has one saved as
-- avatar_url keeps working. They're just no longer offered for new picks
-- since src/data/avatars.ts no longer lists them.

insert into public.avatars (id, xp_required) values
  ('owl_professor', 0),
  ('owl_construction', 80),
  ('owl_pilot', 180),
  ('owl_student', 320),
  ('owl_detective', 500),
  ('owl_artist', 720),
  ('owl_gamer', 980),
  ('owl_scientist', 1280),
  ('owl_rockstar', 1620),
  ('owl_chef', 2000),
  ('owl_tech', 2420),
  ('owl_captain', 2880),
  ('owl_explorer', 3380),
  ('owl_athlete', 3920),
  ('owl_doctor', 4500),
  ('owl_magician', 5120),
  ('owl_football', 5780),
  ('owl_ninja', 6480),
  ('owl_musician', 7220),
  ('owl_astronaut', 8000)
on conflict (id) do update set xp_required = excluded.xp_required;
