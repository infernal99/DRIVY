import type { LevelInfo } from '../types';

/** XP required per level grows slightly so early levels feel fast. */
const BASE_XP_PER_LEVEL = 150;
const XP_GROWTH = 1.12;

function xpRequiredForLevel(level: number): number {
  // XP needed to go from `level` to `level + 1`.
  return Math.round(BASE_XP_PER_LEVEL * Math.pow(XP_GROWTH, level - 1));
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = totalXp;
  let totalXpForCurrentLevel = 0;

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    totalXpForCurrentLevel += xpRequiredForLevel(level);
    level += 1;
  }

  return {
    level,
    xpIntoLevel: remaining,
    xpForNextLevel: xpRequiredForLevel(level),
    totalXpForCurrentLevel,
  };
}

export const XP_REWARDS = {
  correctAnswer: 10,
  wrongAnswer: 2,
  lessonComplete: 30,
  examPassed: 100,
  examFailed: 20,
  dailyChallenge: 15,
} as const;
