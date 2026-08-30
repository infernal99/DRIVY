-- Roady: renombra el prefijo de los códigos de amigo de DRIVY- a ROADY-.
--
-- ⚠️  MIGRACIÓN DESTRUCTIVA / IRREVERSIBLE EN LA PRÁCTICA
--
-- Reescribe los códigos de TODOS los perfiles existentes. Cualquier código
-- que un usuario ya haya compartido (WhatsApp, en persona, etc.) deja de
-- funcionar en el momento en que esto se ejecuta. Se asume conscientemente
-- como parte del rebranding DRIVY → Roady.
--
-- Antes de aplicarla, según CONTRIBUTING.md:
--   1. Avisar en el chat de que se va a aplicar (solo una persona la ejecuta).
--   2. Ejecutarla a mano en el SQL Editor de Supabase.
--
-- Se cambia SOLO el prefijo y se conserva el sufijo de 5 caracteres. Es una
-- correspondencia uno-a-uno, así que no puede generar colisiones con la
-- restricción `unique` de profiles.friend_code. Regenerar los códigos desde
-- cero sí tendría riesgo de colisión y obligaría a un bucle de reintentos.
--
-- El bloque UPDATE está filtrado por `like 'DRIVY-%'`, así que es idempotente:
-- volver a ejecutarla no hace nada.

-- ---------------------------------------------------------------------------
-- 1. La función que genera códigos nuevos (altas futuras).
--    Copia exacta de fn_generate_friend_code en 20260826160000_friends.sql,
--    cambiando únicamente el literal del prefijo.
-- ---------------------------------------------------------------------------
create or replace function public.fn_generate_friend_code()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- No 0/O or 1/I — avoids codes that are ambiguous to read back over chat/voice.
  v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text;
  v_exists boolean;
begin
  loop
    v_code := 'ROADY-';
    for i in 1..5 loop
      v_code := v_code || substr(v_chars, (floor(random() * length(v_chars)) + 1)::integer, 1);
    end loop;
    select exists(select 1 from public.profiles where friend_code = v_code) into v_exists;
    exit when not v_exists;
  end loop;
  return v_code;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Los códigos ya emitidos.
--    'DRIVY-' son 6 caracteres, así que el sufijo empieza en la posición 7.
-- ---------------------------------------------------------------------------
update public.profiles
set friend_code = 'ROADY-' || substr(friend_code, 7)
where friend_code like 'DRIVY-%';
