# Roady content pipeline

This documents how Roady's question bank is authored, validated, deduplicated,
and kept traceable back to a real source — the system built to satisfy the
"Roady debe saber exactamente de dónde procede cada pieza de contenido"
requirement. Read [`CONTENT-LICENSES.md`](../CONTENT-LICENSES.md) alongside
this for what we can/can't reuse from each source we looked at.

## 1. Fuentes

Every source the pipeline knows about — official DGT pages, the BOE text of
the Reglamento General de Circulación, and the two third-party repositories
we were asked to evaluate — is a `ContentSource` record in
[`src/data/sources.ts`](../src/data/sources.ts). That file is the single
source of truth; `npm run content:sources` regenerates
`content/sources/dgt-sources.json` and `CONTENT-LICENSES.md` from it. Never
hand-edit the generated files.

Each source carries a `reviewStatus`:

| Status | Meaning |
|---|---|
| `cleared` | Safe to ground `derived` (or, if ever verified, `official`) content in. |
| `needs_review` | Provenance/license unclear — reference-only, never merged automatically. |
| `reference_only` | Useful only to spot missing topics (content spec §27, priority 4). |

**Research findings that shaped this** (see `CONTENT-LICENSES.md` for the full
entries):

- **DGT's sede electrónica test tool** and **Revista DGT's test section** are
  real and free, but neither publishes a bulk-reuse license, and the sede
  tool itself says its question sets are "muy limitados" — it's a practice
  tool, not an exam-bank export.
- **`alvarolozano/dgt-test-downloader`** scrapes that same sede tool. Its
  CC BY-NC-SA license covers the scraper code, not DGT's content, and its own
  README says it's been unmaintained since DGT changed the site (May 2025).
- **`donmerendolo/anki-carnet-conducir`** ships ~2,890 questions under a
  GPL-3.0 *code* license, with no separate content license, no stated
  question provenance, and images hosted via an ad-hoc external link.

None of the four gave us a clean basis for `official` content, and the third
line of the anki deck's chain-of-custody was thin enough that we didn't treat
it as a safe basis for silent `derived` content either. That's why the whole
bank today is `derived`, grounded in cited DGT/BOE pages we *can* point to —
matching the spec's own preference: "500 preguntas verificadas antes que
3.000 de procedencia dudosa."

## 2. Modelo de datos

`src/types/index.ts` defines the shapes; `src/data/questions/helpers.ts`'s
`q()` builds them. Key fields:

- `source: QuestionSource` — `{ type, name, url?, repository?, license?,
  attribution?, verified }`. `type` is `official | derived | practice |
  needs_review`.
- `correctOptionId` — the correct option's `id`, not an index. This is
  deliberate: it stays valid after `shuffleQuestionOptions` reorders
  `options`, whereas an index would need recomputing (and did, in an earlier
  version of this app, which is exactly the kind of bug this avoids).
- `contentHash` — SHA-256 (see `src/utils/sha256.ts`, a small dependency-free
  implementation so it runs identically in the browser and in the Node
  scripts) over normalized `question + sorted option texts`. Used for
  deduplication.
- `image?: QuestionImage` — `signKey` for one of our own `<TrafficSign>`
  illustrations, or `url`/`localPath` for a real asset once one is cleared
  for reuse. Never a bare string.
- `createdAt` / `updatedAt` / `lastVerifiedAt` — the last one is what a
  normative-change review should bump.

`src/data/signs.ts` holds the internal sign catalogue (`TrafficSign[]`):
official R-/P-/S- codes where we could verify them against a citable source,
left `undefined` where we couldn't (never guessed).

## 3. Pipeline

```
Official Sources → Fetcher → Parser → Normalizer → Validator → Deduplicator → Classifier → License/Source Check → Question Database → Roady
```

Mapped onto this repo:

| Stage | Where |
|---|---|
| Sources | `src/data/sources.ts` |
| Fetcher | `scripts/lib/fetchWithPolicy.ts` (rate-limited, cached, retried) + `scripts/import-*.ts` |
| Parser / Normalizer | `scripts/normalize-questions.ts` (staged imports only — our own authored content is already in the shape we want) |
| Validator | `scripts/lib/validate.ts` / `scripts/validate-questions.ts` |
| Deduplicator | `scripts/lib/dedupe.ts` / `scripts/deduplicate-questions.ts` (also mirrored client-side in `src/services/contentAdminService.ts` for the dashboard) |
| Classifier | Author-assigned `categoryId`/`subcategoryId`, cross-checked against `src/data/categories.ts` during validation |
| License/Source check | `scripts/lib/validate.ts` (missing source/license → error/warning) + manual review via `/admin/content` |
| Question Database | `content/questions/generated/*.json` (build artifact) — see below |
| Roady | `src/data/questions/*.ts`, imported at runtime |

**Important adaptation**: this is a Vite/React SPA, not a service with its
own database. `src/data/questions/*.ts` (written with the `q()` helper) is
the actual editable, type-checked source, and stays that way — the app
imports it directly for zero-latency dev/HMR. `content/questions/generated/`
is the pipeline's **build artifact**: a snapshot the scripts produce after
validating/deduping/hashing, useful for tooling and transparency, but not
something the React app reads at runtime. See `content/README.md`.

## 4. Fetching, respectfully

`scripts/lib/fetchWithPolicy.ts`:

- Disk-caches every response (`content/.cache/`, 24h TTL by default) so
  re-running the pipeline doesn't re-hit sources.
- Rate-limits to one request per 1.5s minimum.
- Retries failed requests with exponential backoff (3 attempts by default).
- Hard-caps a single run at 20 network requests — this pipeline checks a
  handful of pages, it does not crawl.
- Identifies itself with a descriptive `User-Agent`.

`scripts/import-dgt-tests.ts` uses this to check reachability of the two
official DGT pages named in the content spec — nothing more. It does not
parse or store question content from them (see §1 above for why).

## 5. Los dos importadores externos

Both `scripts/import-dgt-test-downloader.ts` and `scripts/import-anki.ts`:

- **Never** hit the network themselves.
- Accept a **local file path** an administrator provides, on the assumption
  they obtained it themselves through legitimate means (e.g. personally
  using DGT's own free test tool, or exporting an Anki deck they have rights
  to).
- Tag everything they produce `source.type: 'needs_review'`,
  `verified: false`, and write it to `content/imports/<source>/staged/` —
  **never** into `src/data/questions/`.
- Log a loud warning that a human must review each item before it could ever
  become `derived` (never `official`).

Promoting a staged item is a manual step: read it, verify it against an
actual DGT source yourself, and if it holds up, write it as a new `q()` entry
in `src/data/questions/` with real source info — don't copy the staged
record's `needs_review` source as-is.

## 6. Deduplication

`computeContentHash()` (in `src/data/questions/helpers.ts`) normalizes the
question text and every option's text (lowercase, strip accents/punctuation,
collapse whitespace, sort options so order doesn't matter) and SHA-256s the
result. `scripts/lib/dedupe.ts` groups by that hash; if a group has more than
one member, all but the first are reported as duplicates (kept vs. dropped),
never silently discarded — the report names both ids so a human can decide
whether to merge source references.

## 7. Validation rules (content spec §16)

See `scripts/lib/validate.ts` for the exact list — briefly: a question is
rejected (error) if it has no question text, fewer than 2 options, duplicate
or empty option text, no `correctOptionId` matching a real option, no
`source`, or (for `official`/`derived`) no `source.url`. It's flagged
(warning, not rejected) if its license is undocumented, its image has no alt
text, or it's `official` but unverified (which is itself promoted to an
error — an unverified item cannot be `official`).

## 8. Running it

```bash
npm run content:update    # the whole pipeline, prints a summary
npm run content:sources   # regenerate content/sources/*.json + CONTENT-LICENSES.md only
npm run content:build     # normalize staged imports + validate + dedupe + write generated snapshot
npm run content:validate  # validation only, exits non-zero on any error
npm run content:dedupe    # duplicate report only
```

`content:update` never hard-fails because one source was unreachable — it
logs the problem and continues with whatever sources answered (content spec
§29). Its build report lives at `content/metadata/build-report.json`, with a
`content-hashes.json` snapshot next to it that later runs diff against to
report genuinely new/updated questions (not just "everything is new every
time").

## 9. Manual review — the admin content dashboard

`npm run dev`, then visit `/admin/content` (registered only when
`import.meta.env.DEV` — it's excluded from production builds by Rollup's
tree-shaking, verified by grepping the built bundle). It shows real, live
counts by source type and category, lets you search/filter, inspect any
question's full provenance (source, license, image info, contentHash), and
locally mark a question reviewed / needs-review (stored in this browser's
`localStorage`, separate from user progress — it's a curation aid, not app
state).
