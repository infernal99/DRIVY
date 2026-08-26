# DRIVY — Preparación del teórico del permiso B

Aplicación web (React + TypeScript + Vite) para aprender y practicar de cara al examen teórico del
permiso B en España. El diseño visual es el del prototipo original `DRIVY.dc.html`; este repositorio
implementa la funcionalidad real sobre esa misma base visual (colores, tipografías, cards, navegación).

> **¿Vas a colaborar en este repo (o eres una sesión de Claude Code leyéndolo)?** Lee primero
> [`CONTRIBUTING.md`](CONTRIBUTING.md) — el flujo de ramas y Pull Requests que seguimos Ian y Uri no es
> el de "commit y push directo a main".

## Cómo ejecutar el proyecto

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción (tsc -b && vite build)
npm run preview  # sirve el build de producción
```

## Muy importante: origen del contenido

Cada pregunta tiene un `source.type` explícito — `official`, `derived`, `practice` o `needs_review` (ver
`src/types/index.ts`). Hoy el banco entero es `derived`: redactado por nosotros a partir de normativa y
páginas oficiales de la DGT (Reglamento General de Circulación, alcoholemia, puntos, límites de
velocidad, catálogo de señales…), citando siempre `source.url`. **Ninguna pregunta se presenta como
pregunta oficial de examen de la DGT** — no tenemos acceso legítimo a ese banco para redistribuirlo (ver
[`CONTENT-LICENSES.md`](CONTENT-LICENSES.md) para la investigación completa, incluida la de los dos
repositorios de terceros analizados). El listado completo de fuentes consultadas está en
[`src/data/sources.ts`](src/data/sources.ts) y se muestra en la app en Perfil → Fuentes oficiales.

El pipeline de contenido (investigación de fuentes, validación, deduplicación por huella de contenido,
generación de informes) está documentado a fondo en
[`docs/content-pipeline.md`](docs/content-pipeline.md) — léelo antes de tocar `scripts/` o `content/`.
Ejecuta `npm run content:update` para correrlo completo.

Las señales de tráfico no usan imágenes oficiales de la DGT (no tenemos licencia para redistribuirlas).
En su lugar, [`src/components/ui/TrafficSign.tsx`](src/components/ui/TrafficSign.tsx) dibuja ilustraciones
propias en SVG, reutilizando únicamente la gramática de forma/color internacional (triángulo rojo =
peligro, círculo rojo = prohibición, círculo azul = obligación, cuadrado azul = indicación), nunca el
pictograma artístico propio del catálogo DGT.

## Estructura del proyecto

```
src/
  types/          Tipos de dominio (Question, QuestionSource, TrafficSign, UserProgress, ExamResult, ...)
  data/
    categories.ts     Árbol de categorías y subcategorías (el "temario")
    lessons.ts        Una lección = una subcategoría
    achievements.ts   Definición de logros y su condición de desbloqueo
    sources.ts        Registro canónico de fuentes (licencia, qué se puede/no se puede reutilizar)
    signs.ts          Catálogo interno de señales (código oficial cuando se ha podido verificar)
    questions/        El banco de preguntas, un fichero por categoría + helpers.ts
  services/       Lógica de negocio pura, sin React ni almacenamiento directo
    storage.ts        Interfaz ProgressRepository + implementación localStorage
    progressService.ts   XP, racha, logros, estadísticas, aciertos/fallos
    questionService.ts   Única puerta de entrada a las preguntas para la UI (selección, búsqueda, exámenes)
    examService.ts       Generación y corrección de exámenes
    contentAdminService.ts   Estadísticas y anotaciones para el panel de contenido (dev)
  store/          Estado global (Zustand) — conecta componentes con los servicios
  hooks/          Hooks de React (p.ej. useLearnPath para el camino de aprendizaje)
  components/     UI reutilizable (layout, ui, lesson, exam, learn, achievements)
  pages/          Una pantalla = un fichero, enrutado en App.tsx (incluye AdminContentPage, solo en dev)
scripts/          Pipeline de contenido (Node, vía tsx) — ver docs/content-pipeline.md
content/          Workspace del pipeline: fuentes, imports en cuarentena, informes generados
```

La UI **nunca** llama a `localStorage` ni a `src/data/questions` directamente, ni contiene normativa
embebida: los componentes pasan siempre por `services/questionService.ts` y `services/progressService.ts`.
Esto permite sustituir `LocalStorageProgressRepository` por una implementación con
Supabase/Postgres/Firebase implementando la misma interfaz `ProgressRepository`
(`src/services/storage.ts`), sin tocar componentes ni páginas.

## Cómo añadir preguntas

1. Abre el fichero de la categoría en `src/data/questions/` (o crea uno nuevo).
2. Usa el helper `q({...})` de [`./helpers.ts`](src/data/questions/helpers.ts):

```ts
q({
  id: 'SEN-PEL-99',              // único y estable — no lo cambies una vez publicado
  categoryId: 'senales',
  subcategoryId: 'senales-peligro',
  question: '¿Qué anuncia esta señal?',
  options: ['Respuesta correcta', 'Distractor 1', 'Distractor 2'],
  correctAnswer: 0,               // índice dentro de `options`, antes de barajar
  explanation: 'Por qué es correcta, en 1-2 frases.',
  difficulty: 'medium',           // 'easy' | 'medium' | 'hard'
  tags: ['señales', 'peligro'],
  sourceUrl: 'https://www.dgt.es/...',
  // sourceType?: 'official' | 'derived' | 'practice' | 'needs_review' — por defecto 'derived'.
  // license?: string — por defecto documenta que las páginas DGT no publican licencia explícita.
})
```

El helper calcula por ti `correctOptionId` (a partir del índice `correctAnswer`), `contentHash` (SHA-256
del texto normalizado, para deduplicación — ver `computeContentHash` en `helpers.ts`) y las fechas
`createdAt`/`updatedAt`/`lastVerifiedAt`.

3. Añade el array exportado a `ALL_QUESTIONS` en [`src/data/questions/index.ts`](src/data/questions/index.ts)
   si has creado un fichero nuevo.
4. El `id` es la clave con la que se guardan las estadísticas y errores del usuario: no lo reutilices ni
   lo cambies para otra pregunta.
5. Las opciones se muestran en orden aleatorio en tiempo de ejecución (`shuffleQuestionOptions` en
   `src/utils/shuffle.ts`); como la respuesta correcta se identifica por `correctOptionId` (no por índice),
   el orden se mantiene válido sin recalcular nada.
6. Después de añadir o editar preguntas, ejecuta `npm run content:validate` (te avisa de opciones
   duplicadas, falta de fuente, imágenes sin procedencia, etc. — ver §16 de `docs/content-pipeline.md`) y
   `npm run content:update` para regenerar los informes.

### Señales con ilustración

Si la pregunta necesita una señal, usa `image: 'sign:<clave>'` con una clave de
[`TrafficSign.tsx`](src/components/ui/TrafficSign.tsx) (o añade una nueva ahí). Si en el futuro se
incorporan fotografías o imágenes oficiales con licencia, `image` puede apuntar directamente a una ruta
en `public/content/images/...`.

## Cómo añadir categorías

Edita [`src/data/categories.ts`](src/data/categories.ts): añade un objeto `Category` con `id`, `name`,
`emoji`, `icon` (debe existir en `IconName`, ver `src/components/ui/Icon.tsx`) y su lista de
`subcategories`. Cada subcategoría se convierte automáticamente en una lección
(`src/data/lessons.ts`); no hace falta tocar nada más para que aparezca en el camino de aprendizaje.

## Cómo actualizar contenido / fuentes

- Cambios normativos → localiza las preguntas afectadas (por `tags` o `subcategoryId`) y actualiza
  `question`, `options`, `explanation` y `lastVerifiedAt`.
- Nueva fuente consultada → añádela a `CONTENT_SOURCES` en [`src/data/sources.ts`](src/data/sources.ts)
  (esa es la fuente de verdad; no edites `CONTENT-LICENSES.md` ni `content/sources/*.json` a mano, se
  regeneran con `npm run content:sources`). Clasifícala como `cleared`, `needs_review` o
  `reference_only` — nunca asumas que "público en internet" es "libre para reutilizar".
- Catálogo de señales 2025 → las preguntas que dependen de una versión concreta del catálogo llevan
  `signCatalogVersion: '2015' | '2025'`; añade ese campo si redactas contenido sensible al cambio de
  catálogo. El catálogo interno de señales vive en `src/data/signs.ts`.
- Pipeline completo → `npm run content:update` (fuentes → normaliza imports en cuarentena → valida →
  deduplica → genera informe). Ver [`docs/content-pipeline.md`](docs/content-pipeline.md).
- Panel de contenido (dev) → arranca `npm run dev` y visita `/admin/content` para buscar, filtrar por
  categoría/tipo/fuente y ver la procedencia completa de cualquier pregunta. No existe en producción
  (se elimina del bundle).

## Cómo funciona el sistema de preguntas

`services/questionService.ts` implementa un algoritmo ligero de repetición espaciada: cada pregunta
respondida tiene un `dueScore` que sube al fallarla y baja al acertarla; el peso de selección también
sube con los días transcurridos desde el último intento y baja cuando la pregunta ya está "dominada"
(≥3 aciertos y el último intento fue correcto). Esto prioriza fallos, huecos largos sin repasar y
preguntas nunca vistas, sin descartar del todo las ya dominadas.

## Cómo funciona el simulador de examen

`services/examService.ts` genera exámenes de 30 preguntas con 3 opciones cada una y 30 minutos de
tiempo (formato del examen teórico oficial del permiso B), evitando repetir las preguntas del examen
inmediatamente anterior cuando el banco lo permite. El flujo (`pages/ExamPage.tsx`) es: responder sin
feedback inmediato → pantalla de revisión (salta a cualquier pregunta, ve cuáles faltan) → enviar →
resultado con aciertos/fallos y explicación de cada fallo. Aprobar exige un máximo de 3 fallos (≥27/30),
igual que el examen real. "Examen real" usa la misma lógica con una interfaz más sobria.

## Cómo funciona la persistencia

Todo el progreso (XP, racha, logros, estadísticas por pregunta/categoría, errores, exámenes) se guarda
en `localStorage` bajo la clave `drivy.progress.v1`, a través de `LocalStorageProgressRepository`
(`src/services/storage.ts`). El store de Zustand (`src/store/progressStore.ts`) es el único punto que
llama a esa interfaz; para migrar a un backend real, implementa `ProgressRepository` contra tu API y
sustituye la instancia exportada al final de `storage.ts`. `UserProgress.schemaVersion` +
`migrateProgress()` en `progressService.ts` dejan sitio para migraciones futuras del formato guardado.

## Limitaciones conocidas de esta versión

- El banco de preguntas es `derived` (no oficial) y cubre las categorías del temario con una cantidad
  representativa de preguntas por subcategoría (132 hoy), no miles — la arquitectura (tipos, pipeline,
  deduplicación por hash) está lista para crecer; el contenido no se ha inflado artificialmente para
  aparentar volumen. Ver `CONTENT-LICENSES.md` para por qué no hay contenido `official` todavía.
- Las señales se ilustran con SVG propio, no con el catálogo oficial DGT.
- Los importadores de fuentes externas (`scripts/import-dgt-test-downloader.ts`,
  `scripts/import-anki.ts`) existen pero no traen nada a producción automáticamente: solo permiten a un
  administrador poner en cuarentena (`needs_review`) un export ya obtenido legalmente, para revisión
  manual — ver `docs/content-pipeline.md`.
- No hay backend: el progreso vive en el dispositivo/navegador actual.
