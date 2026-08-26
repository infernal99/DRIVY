import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryById, getSubcategoryName } from '../data/categories';
import { getLessonsForCategory, lessonId as buildLessonId } from '../data/lessons';
import { pickQuestionsForSubcategory } from '../services/questionService';
import { useProgressStore } from '../store/progressStore';
import { QuestionSession } from '../components/lesson/QuestionSession';
import { AppShell } from '../components/layout/AppShell';
import { EmptyState } from '../components/ui/EmptyState';

export function LessonPage() {
  const { categoryId = '', subcategoryId = '' } = useParams();
  const progress = useProgressStore((s) => s.progress);
  const category = getCategoryById(categoryId);
  const lessons = getLessonsForCategory(categoryId);
  const currentLesson = lessons.find((l) => l.id === buildLessonId(categoryId, subcategoryId));
  const nextLesson = currentLesson ? lessons[lessons.indexOf(currentLesson) + 1] : undefined;

  const [questions] = useState(() =>
    pickQuestionsForSubcategory(progress, subcategoryId, currentLesson?.questionCount ?? 10),
  );

  if (!category || !currentLesson) {
    return (
      <AppShell>
        <EmptyState title="Lección no encontrada" icon="book" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <QuestionSession
        questions={questions}
        exitTo={`/learn/${categoryId}`}
        lessonId={currentLesson.id}
        nextLessonName={nextLesson?.name}
        emptyTitle="Aún no hay preguntas en esta lección"
        emptyDescription={`Vuelve pronto — estamos ampliando ${getSubcategoryName(categoryId, subcategoryId)}.`}
      />
    </AppShell>
  );
}
