-- 20 owl "player avatar" skins (cosmetic only — no XP or premium gate, per
-- explicit product decision). Same table as the original driving-icon
-- catalog (see 20260829110000_avatar_catalog.sql); the TS copy in
-- src/data/avatars.ts (OWL_AVATAR_CATALOG) is the source of truth for how
-- each one is named/drawn — keep the ids in sync by hand if this changes.

insert into public.avatars (id, xp_required) values
  ('owl_professor', 0),
  ('owl_construction', 0),
  ('owl_pilot', 0),
  ('owl_student', 0),
  ('owl_detective', 0),
  ('owl_artist', 0),
  ('owl_gamer', 0),
  ('owl_scientist', 0),
  ('owl_rockstar', 0),
  ('owl_chef', 0),
  ('owl_tech', 0),
  ('owl_captain', 0),
  ('owl_explorer', 0),
  ('owl_athlete', 0),
  ('owl_doctor', 0),
  ('owl_magician', 0),
  ('owl_football', 0),
  ('owl_ninja', 0),
  ('owl_musician', 0),
  ('owl_astronaut', 0)
on conflict (id) do nothing;
