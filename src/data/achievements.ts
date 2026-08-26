import type { AchievementDef } from '../types';

// Achievement unlock conditions read from UserStats (a derived, read-only
// snapshot) — they never touch storage or components directly.
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'primera-leccion',
    name: 'Primera lección',
    description: 'Completa tu primera lección.',
    icon: 'book',
    check: (s) => s.questionsAnswered >= 1,
  },
  {
    id: 'preguntas-100',
    name: '100 preguntas',
    description: 'Responde 100 preguntas en total.',
    icon: 'target',
    check: (s) => s.questionsAnswered >= 100,
  },
  {
    id: 'preguntas-500',
    name: '500 preguntas',
    description: 'Responde 500 preguntas en total.',
    icon: 'target',
    check: (s) => s.questionsAnswered >= 500,
  },
  {
    id: 'preguntas-1000',
    name: '1000 preguntas',
    description: 'Responde 1.000 preguntas en total.',
    icon: 'target',
    check: (s) => s.questionsAnswered >= 1000,
  },
  {
    id: 'racha-7',
    name: '7 días seguidos',
    description: 'Mantén una racha de 7 días.',
    icon: 'flame',
    check: (s) => s.bestStreak >= 7,
  },
  {
    id: 'racha-30',
    name: '30 días seguidos',
    description: 'Mantén una racha de 30 días.',
    icon: 'flame',
    check: (s) => s.bestStreak >= 30,
  },
  {
    id: 'examen-1',
    name: 'Primer examen aprobado',
    description: 'Aprueba tu primer simulacro de examen.',
    icon: 'flag',
    check: (s) => s.examsPassed >= 1,
  },
  {
    id: 'examen-3',
    name: '3 exámenes aprobados',
    description: 'Aprueba 3 simulacros de examen.',
    icon: 'flag',
    check: (s) => s.examsPassed >= 3,
  },
  {
    id: 'examen-10',
    name: '10 exámenes aprobados',
    description: 'Aprueba 10 simulacros de examen.',
    icon: 'flag',
    check: (s) => s.examsPassed >= 10,
  },
  {
    id: 'categoria-perfecta',
    name: '100% en una categoría',
    description: 'Consigue el 100% de aciertos en una categoría.',
    icon: 'shield',
    check: (s) => s.perfectCategoryCount >= 1,
  },
  {
    id: 'racha-aciertos-10',
    name: '10 aciertos seguidos',
    description: 'Responde 10 preguntas correctas seguidas.',
    icon: 'check',
    check: (s) => s.longestCorrectStreak >= 10,
  },
];

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
