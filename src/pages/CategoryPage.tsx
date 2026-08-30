import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById } from '../data/categories';
import { getLessonsForCategory } from '../data/lessons';
import { getQuestionsByCategory } from '../services/questionService';
import { getCategoryMastery, MASTERY_TIER_COPY } from '../services/masteryService';
import { useProgressStore } from '../store/progressStore';
import { AppShell } from '../components/layout/AppShell';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Icon } from '../components/ui/Icon';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Pill } from '../components/ui/Pill';
import { EmptyState } from '../components/ui/EmptyState';

export function CategoryPage() {
  const { categoryId = '' } = useParams();
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const category = getCategoryById(categoryId);
  const lessons = useMemo(() => getLessonsForCategory(categoryId), [categoryId]);
  const totalQuestions = useMemo(() => getQuestionsByCategory(categoryId).length, [categoryId]);
  const catStat = progress.categoryStats[categoryId];
  const mastery = getCategoryMastery(progress, categoryId);

  if (!category) {
    return (
      <AppShell>
        <ScreenHeader title="Categoría" />
        <EmptyState title="Categoría no encontrada" icon="sign" />
      </AppShell>
    );
  }

  const lessonStates = lessons.map((lesson, i) => {
    const done = progress.completedLessonIds.includes(lesson.id);
    const prevDone = i === 0 || progress.completedLessonIds.includes(lessons[i - 1].id);
    return { lesson, done, unlocked: prevDone };
  });

  const completedCount = lessonStates.filter((l) => l.done).length;
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const nextLesson = lessonStates.find((l) => !l.done && l.unlocked)?.lesson ?? lessonStates[0]?.lesson;

  return (
    <AppShell>
      <ScreenHeader title={category.name} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 30px' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-node-active)',
            marginBottom: 16,
            color: '#fff',
          }}
        >
          <Icon name={category.icon} size={28} color="#fff" />
        </div>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 20px', maxWidth: 260 }}>
          {category.description}
        </p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          <Card style={{ flex: 1, padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-primary)' }}>{pct}%</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>Completado</div>
          </Card>
          <Card style={{ flex: 1, padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-text)' }}>
              {completedCount}/{lessons.length}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>Lecciones</div>
          </Card>
          <Card style={{ flex: 1, padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-text)' }}>
              {catStat?.answered ?? 0}/{totalQuestions}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>Preguntas</div>
          </Card>
        </div>

        <div style={{ marginBottom: 22 }}>
          <ProgressBar pct={pct} />
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Dominio de la categoría</span>
            <Pill bg="var(--color-bg-locked)" color={MASTERY_TIER_COPY[mastery.tier].color}>
              {MASTERY_TIER_COPY[mastery.tier].label} · {mastery.score}%
            </Pill>
          </div>
          <ProgressBar pct={mastery.score} color={MASTERY_TIER_COPY[mastery.tier].color} />
        </div>

        {lessonStates.map(({ lesson, done, unlocked }) => (
          <button
            key={lesson.id}
            type="button"
            disabled={!unlocked}
            onClick={() => navigate(`/learn/${categoryId}/lesson/${lesson.id.split('::')[1]}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--color-bg-card)',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              borderRadius: 14,
              padding: '12px 14px',
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(11,30,61,0.05)',
              opacity: unlocked ? 1 : 0.55,
              cursor: unlocked ? 'pointer' : 'default',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: done ? 'var(--color-success-bg)' : unlocked ? 'var(--color-info-bg)' : 'var(--color-bg-locked)',
                color: done ? 'var(--color-success)' : unlocked ? 'var(--color-primary)' : 'var(--color-text-muted-40)',
              }}
            >
              <Icon name={done ? 'check' : unlocked ? category.icon : 'lock'} size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{lesson.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted-50)', marginTop: 1 }}>
                {done ? `Completada · ${lesson.questionCount} preguntas` : `${lesson.questionCount} preguntas`}
              </div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ padding: '16px 20px 26px', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-topbar)' }}>
        <Button
          disabled={!nextLesson}
          onClick={() => nextLesson && navigate(`/learn/${categoryId}/lesson/${nextLesson.id.split('::')[1]}`)}
        >
          {completedCount === lessons.length ? 'REPASAR DE NUEVO' : 'CONTINUAR'}
        </Button>
      </div>
    </AppShell>
  );
}
