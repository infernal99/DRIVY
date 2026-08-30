import type { Question } from '../types';

// Phase H: AI tutor abstraction — MOCK ONLY. No provider (OpenAI/Anthropic/
// Gemini/etc.) is wired in, no API key exists anywhere in this repo. Every
// function below returns template-based text built from data Roady already
// has (the question's own `explanation`), wrapped in a resolved Promise so
// callers already code against the shape a real network call would have.
// The rest of the app depends on this interface, not a concrete provider —
// swapping in a real model later means replacing the bodies of these three
// functions with an API call; nothing that imports this module changes.

export interface AiTutorResponse {
  text: string;
  /** Always true today — lets the UI mark this as a placeholder, not a real tutor's answer. */
  isPlaceholder: boolean;
}

function correctOptionText(question: Question): string {
  return question.options.find((o) => o.id === question.correctOptionId)?.text ?? '—';
}

/** "Explain this question to me" — used when the user answered correctly, or just wants more detail. */
export async function explainQuestion(question: Question): Promise<AiTutorResponse> {
  const base = question.explanation?.trim();
  const text = base
    ? `${base}\n\nEsta es la explicación registrada de Roady para esta pregunta. Un tutor con IA real podría además adaptarse a tus dudas concretas.`
    : `Todavía no hay una explicación redactada para esta pregunta. La opción correcta es: «${correctOptionText(question)}».`;
  return { text, isPlaceholder: true };
}

/** "Why was my answer wrong?" — used right after a mistake. */
export async function explainMistake(question: Question, selectedOptionId: string | null): Promise<AiTutorResponse> {
  const selected = question.options.find((o) => o.id === selectedOptionId);
  const intro = selected
    ? `Marcaste «${selected.text}», pero la opción correcta es «${correctOptionText(question)}».`
    : `No llegaste a responder a tiempo. La opción correcta era «${correctOptionText(question)}».`;
  const base = question.explanation?.trim();
  const text = base ? `${intro}\n\n${base}` : intro;
  return { text, isPlaceholder: true };
}

/** A free-text follow-up question about a specific item — "¿por qué...?". */
export async function askWhy(question: Question, prompt: string): Promise<AiTutorResponse> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return { text: 'Escribe tu duda sobre esta pregunta y te la explicaré en cuanto el tutor con IA esté disponible.', isPlaceholder: true };
  }
  const base = question.explanation?.trim() ?? 'Sin explicación disponible para esta pregunta todavía.';
  return {
    text: `Todavía no hay un tutor con IA conectado, así que no puedo responder a «${trimmed}» con detalle. Mientras tanto, aquí tienes la explicación de Roady para esta pregunta:\n\n${base}`,
    isPlaceholder: true,
  };
}
