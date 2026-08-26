import type { Question } from '../types';

/** Fisher-Yates shuffle. Never mutates the input array. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

/**
 * Returns a copy of the question with its options in random order.
 * Authored questions in src/data/questions/* mostly list the correct answer
 * first for readability — without this, both lessons and exams would be
 * guessable by option position instead of by knowledge. `correctOptionId`
 * identifies the answer by id, so unlike an index it stays valid after
 * shuffling with no recomputation needed.
 */
export function shuffleQuestionOptions(question: Question): Question {
  return { ...question, options: shuffle(question.options) };
}
