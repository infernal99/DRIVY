# Cómo trabajamos en este repo

Este proyecto lo llevan dos personas — **Ian** e **Uri** — cada una con su propia
rama, a veces cada una con su propia sesión de Claude Code trabajando a la
vez. Este documento existe para que ninguna de las dos rutas (una persona
tecleando, o un agente de Claude leyendo el repo) tenga que adivinar el
flujo de trabajo.

**Si eres una sesión de Claude Code leyendo esto**: sigue exactamente las
reglas de abajo, no asumas el flujo por defecto de "commitear y hacer push
a main" — aquí no aplica desde que hay dos colaboradores.

## La regla de oro

**Nunca se hace `git push` directo a `main`.** Todo cambio entra por una
rama + Pull Request en GitHub, aunque sea un cambio pequeño. `main` es lo
que está desplegado en producción (Vercel se despliega automáticamente
desde `main`), así que solo debe recibir código ya revisado.

## Ramas

- `main` — rama protegida, siempre desplegable. Solo se actualiza
  fusionando Pull Requests.
- `ian` — rama de trabajo de Ian.
- `uri` — rama de trabajo de Uri.

Cada uno trabaja en la suya. Si vas a hacer algo grande o que pueda tardar,
puedes crear una rama más específica a partir de la tuya (por ejemplo
`uri/ranking-semanal`), pero la única regla que importa de verdad es: **tu
trabajo nunca sale directo a `main`**.

## Flujo de trabajo, paso a paso

Antes de empezar a tocar nada, en tu rama:

```bash
git checkout ian        # o `uri`
git pull origin main    # trae lo último que se haya fusionado
git merge main          # actualiza tu rama con esos cambios
```

Trabaja, y ve haciendo commits normales:

```bash
git add <ficheros concretos>   # evita `git add -A` a ciegas
git commit -m "mensaje claro de qué cambia y por qué"
```

Cuando quieras subir tu progreso o esté listo para revisión:

```bash
git push origin ian     # o `uri`
```

Y en GitHub, abre un **Pull Request** de `ian` (o `uri`) hacia `main`. El
otro le echa un vistazo rápido (o simplemente se fusiona si es un cambio
claro) y se hace **Merge** desde la propia web de GitHub.

Después de fusionar, vuelve a sincronizar tu rama:

```bash
git checkout ian
git pull origin main
git merge main
```

## Evitar pisaros

- **Avisaos por chat qué parte vais a tocar** ("yo voy con Amigos", "yo con
  Exámenes") — la forma más simple de no chocar es no editar los mismos
  ficheros a la vez desde dos ramas distintas.
- Si GitHub avisa de un conflicto al abrir o fusionar el Pull Request,
  resuélvelo tú mismo localmente (`git merge main` en tu rama, arreglar los
  marcadores de conflicto, commit) antes de reintentar — nunca se fuerza
  (`git push --force`) sobre el trabajo del otro.

## Migraciones de Supabase — coordinación obligatoria

`supabase/migrations/*.sql` son ficheros numerados por fecha/hora que se
aplican **a mano**, en orden, en el SQL Editor del panel de Supabase (no hay
CLI conectado a este proyecto todavía). Si los dos creáis una migración a
la vez sin avisaros, podéis acabar con dos ficheros que se pisan o que se
aplican en el orden equivocado.

Regla: antes de crear una migración nueva, haz `git pull` en `main` para
ver si el otro ya añadió alguna, y avisa en el chat de "voy a añadir una
migración para X" antes de escribirla. Solo una persona aplica cada
migración nueva en el SQL Editor (para no ejecutarla dos veces).

## Configuración local

1. `npm install`
2. Copia [`.env.example`](.env.example) a `.env.local` y rellena las dos
   variables de Supabase (pregunta al otro si no las tienes — son las
   mismas que están puestas en Vercel).
3. `npm run dev`

Para el resto (estructura del proyecto, cómo añadir preguntas/categorías,
cómo funciona el pipeline de contenido, la persistencia, etc.) ver
[`README.md`](README.md) y [`docs/content-pipeline.md`](docs/content-pipeline.md).
