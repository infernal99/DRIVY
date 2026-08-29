import { useMemo, useState } from 'react';
import type { Question, QuestionSourceType } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  filterContent,
  getContentStats,
  getReviewState,
  setReviewState,
  clearReviewState,
} from '../services/contentAdminService';

// Dev-only content curation tool (content spec §15/§16/§17). Not part of the
// learner-facing product — no BottomNav, no Roady chrome, functional over
// pretty. Registered in App.tsx only when import.meta.env.DEV.

const SOURCE_TYPES: (QuestionSourceType | 'all')[] = ['all', 'official', 'derived', 'practice', 'needs_review'];

export function AdminContentPage() {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [sourceType, setSourceType] = useState<QuestionSourceType | 'all'>('all');
  const [selected, setSelected] = useState<Question | null>(null);
  const [, forceRerender] = useState(0);

  const stats = useMemo(() => getContentStats(), []);
  const results = useMemo(() => filterContent({ query, categoryId, sourceType }), [query, categoryId, sourceType]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 1100, margin: '0 auto', color: '#10192e' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Roady — Panel de contenido (dev)</h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
        Herramienta interna de curación de contenido. No forma parte de la experiencia del alumno. Los conteos de
        abajo son reales, calculados en tiempo de ejecución sobre el banco de preguntas actual.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 24 }}>
        <StatTile label="Preguntas totales" value={stats.total} />
        <StatTile label="Oficiales" value={stats.bySourceType.official} />
        <StatTile label="Derivadas" value={stats.bySourceType.derived} />
        <StatTile label="Práctica" value={stats.bySourceType.practice} />
        <StatTile label="Pendientes revisión" value={stats.needsReviewCount} warn={stats.needsReviewCount > 0} />
        <StatTile label="Con imagen" value={stats.withImages} />
      </div>

      {stats.duplicateGroups > 0 && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffe08a', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13 }}>
          ⚠️ {stats.duplicateGroups} grupo(s) de contenido duplicado detectado(s) por contentHash. Ejecuta{' '}
          <code>npm run content:dedupe</code> para el detalle.
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por texto, id o tag…"
          style={{ flex: 1, minWidth: 220, padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={sourceType} onChange={(e) => setSourceType(e.target.value as QuestionSourceType | 'all')} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}>
          {SOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'Todos los tipos' : t}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{results.length} resultado(s)</p>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1, maxHeight: 560, overflowY: 'auto', border: '1px solid #e5e5e5', borderRadius: 8 }}>
          {results.map((q) => {
            const review = getReviewState(q.id);
            return (
              <button
                key={q.id}
                onClick={() => setSelected(q)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  border: 'none',
                  borderBottom: '1px solid #f0f0f0',
                  background: selected?.id === q.id ? '#eef1f7' : '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong>{q.id}</strong>
                  <SourceBadge type={q.source.type} />
                </div>
                <div style={{ marginTop: 2, color: '#333' }}>{q.question}</div>
                <div style={{ marginTop: 2, fontSize: 11, color: '#888' }}>
                  {q.categoryId} / {q.subcategoryId}
                  {q.image && ' · 🖼️'}
                  {review && ` · admin: ${review.state}`}
                </div>
              </button>
            );
          })}
          {results.length === 0 && <div style={{ padding: 16, color: '#888', fontSize: 13 }}>Sin resultados.</div>}
        </div>

        <div style={{ flex: 1 }}>
          {selected ? (
            <QuestionDetail
              question={selected}
              onReviewChange={() => forceRerender((n) => n + 1)}
            />
          ) : (
            <div style={{ color: '#888', fontSize: 13, padding: 16 }}>Selecciona una pregunta para ver su procedencia completa.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 12, background: warn ? '#fff3cd' : '#fff' }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value.toLocaleString('es-ES')}</div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{label}</div>
    </div>
  );
}

const BADGE_COLOR: Record<QuestionSourceType, string> = {
  official: '#3ab26e',
  derived: '#2f6fed',
  practice: '#ff8a3d',
  needs_review: '#e5484d',
};

function SourceBadge({ type }: { type: QuestionSourceType }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: BADGE_COLOR[type], padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
      {type}
    </span>
  );
}

function QuestionDetail({ question, onReviewChange }: { question: Question; onReviewChange: () => void }) {
  const review = getReviewState(question.id);

  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 16, fontSize: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 15, margin: 0 }}>{question.id}</h2>
        <SourceBadge type={question.source.type} />
      </div>
      <p style={{ marginTop: 10 }}>{question.question}</p>
      <ul style={{ paddingLeft: 18 }}>
        {question.options.map((o) => (
          <li key={o.id} style={{ color: o.id === question.correctOptionId ? '#3ab26e' : '#333', fontWeight: o.id === question.correctOptionId ? 700 : 400 }}>
            {o.text} {o.id === question.correctOptionId && '✓'}
          </li>
        ))}
      </ul>
      {question.explanation && <p style={{ color: '#555' }}>{question.explanation}</p>}

      <h3 style={{ fontSize: 13, marginTop: 16, marginBottom: 6 }}>Procedencia</h3>
      <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 4, columnGap: 8, fontSize: 12 }}>
        <dt style={{ color: '#888' }}>Tipo</dt>
        <dd>{question.source.type}</dd>
        <dt style={{ color: '#888' }}>Nombre</dt>
        <dd>{question.source.name}</dd>
        <dt style={{ color: '#888' }}>URL</dt>
        <dd>{question.source.url ? <a href={question.source.url} target="_blank" rel="noreferrer">{question.source.url}</a> : '—'}</dd>
        <dt style={{ color: '#888' }}>Licencia</dt>
        <dd>{question.source.license ?? '—'}</dd>
        <dt style={{ color: '#888' }}>Repositorio</dt>
        <dd>{question.source.repository ?? '—'}</dd>
        <dt style={{ color: '#888' }}>Verificado</dt>
        <dd>{question.source.verified ? 'sí' : 'no'}</dd>
        <dt style={{ color: '#888' }}>contentHash</dt>
        <dd style={{ fontFamily: 'monospace', fontSize: 11 }}>{question.contentHash?.slice(0, 16)}…</dd>
        <dt style={{ color: '#888' }}>Creada</dt>
        <dd>{question.createdAt}</dd>
        <dt style={{ color: '#888' }}>Última verificación</dt>
        <dd>{question.lastVerifiedAt ?? '—'}</dd>
      </dl>

      {question.image && (
        <>
          <h3 style={{ fontSize: 13, marginTop: 16, marginBottom: 6 }}>Imagen</h3>
          <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 4, columnGap: 8, fontSize: 12 }}>
            <dt style={{ color: '#888' }}>Tipo</dt>
            <dd>{question.image.sourceType}</dd>
            <dt style={{ color: '#888' }}>signKey</dt>
            <dd>{question.image.signKey ?? '—'}</dd>
            <dt style={{ color: '#888' }}>URL</dt>
            <dd>{question.image.url ?? question.image.localPath ?? '—'}</dd>
            <dt style={{ color: '#888' }}>Alt</dt>
            <dd>{question.image.alt || '—'}</dd>
          </dl>
        </>
      )}

      <h3 style={{ fontSize: 13, marginTop: 16, marginBottom: 6 }}>Revisión manual (local, solo este navegador)</h3>
      <p style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
        {review ? `Marcada como "${review.state}" el ${new Date(review.reviewedAt).toLocaleString('es-ES')}` : 'Sin revisar todavía.'}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => {
            setReviewState(question.id, 'reviewed');
            onReviewChange();
          }}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #3ab26e', background: '#eafff2', cursor: 'pointer' }}
        >
          Marcar revisada
        </button>
        <button
          onClick={() => {
            setReviewState(question.id, 'needs_review');
            onReviewChange();
          }}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5484d', background: '#fff0f0', cursor: 'pointer' }}
        >
          Marcar needs_review
        </button>
        {review && (
          <button
            onClick={() => {
              clearReviewState(question.id);
              onReviewChange();
            }}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', background: 'var(--color-bg-card)', cursor: 'pointer' }}
          >
            Quitar marca
          </button>
        )}
      </div>
    </div>
  );
}
