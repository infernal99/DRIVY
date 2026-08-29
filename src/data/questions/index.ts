import type { Question } from '../../types';
import { senalesQuestions } from './senales';
import { normasQuestions } from './normas';
import { viasQuestions } from './vias';
import { seguridadVialQuestions } from './seguridadVial';
import { alcoholDrogasQuestions } from './alcoholDrogas';
import { vehiculoQuestions } from './vehiculo';
import { conductorQuestions } from './conductor';
import { otrosUsuariosQuestions } from './otrosUsuarios';

/**
 * The full question bank. Every entry here is authored by us and grounded in
 * a cited official DGT source — `source.type: 'derived'` by default (see
 * data/questions/helpers.ts) — never `official`: we have no licensed access
 * to DGT's verbatim exam bank. See CONTENT-LICENSES.md for why, and
 * docs/content-pipeline.md for the full provenance model.
 *
 * To add content: create/extend a file in this folder using the `q()` helper
 * from ./helpers, give each question a stable unique id, then add the array
 * to ALL_QUESTIONS below. See README.md → "Cómo añadir preguntas".
 *
 * Do not import from this module in pages/components — go through
 * services/questionService.ts instead.
 */
export const ALL_QUESTIONS: Question[] = [
  ...senalesQuestions,
  ...normasQuestions,
  ...viasQuestions,
  ...seguridadVialQuestions,
  ...alcoholDrogasQuestions,
  ...vehiculoQuestions,
  ...conductorQuestions,
  ...otrosUsuariosQuestions,
];

const byId = new Map(ALL_QUESTIONS.map((question) => [question.id, question]));

export function getQuestionById(id: string): Question | undefined {
  return byId.get(id);
}

export function getQuestionsByCategory(categoryId: string): Question[] {
  return ALL_QUESTIONS.filter((question) => question.categoryId === categoryId);
}

export function getQuestionsBySubcategory(subcategoryId: string): Question[] {
  return ALL_QUESTIONS.filter((question) => question.subcategoryId === subcategoryId);
}

// import.meta.env only exists under Vite — this module is also imported
// directly by the Node/tsx content pipeline scripts, so guard it.
const isViteDev = typeof import.meta.env !== 'undefined' && import.meta.env.DEV;
if (isViteDev && byId.size !== ALL_QUESTIONS.length) {
  console.error('Roady: duplicate question ids detected in the question bank.');
}
