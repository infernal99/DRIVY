import { useSearchParams } from 'react-router-dom';
import { BattleResultScreen } from './BattlePage';
import type { BattleHistoryEntry } from '../services/battlesService';

const BASE: BattleHistoryEntry = {
  battleId: 0,
  friendUserId: 'demo',
  displayName: 'Pablo',
  avatarUrl: null,
  myCorrectCount: 7,
  opponentCorrectCount: 8,
  totalCount: 15,
  won: false,
  tied: false,
  status: 'completed',
  completedAt: new Date().toISOString(),
};

const OUTCOMES: Record<string, BattleHistoryEntry> = {
  lost: BASE,
  won: { ...BASE, myCorrectCount: 11, opponentCorrectCount: 6, won: true, tied: false },
  tied: { ...BASE, myCorrectCount: 9, opponentCorrectCount: 9, won: false, tied: true },
};

/**
 * Solo para desarrollo — mismo patrón que /dev/mascot: previsualizar la
 * pantalla de resultado de un duelo sin necesitar jugar uno real. El
 * desenlace se elige por query param (?outcome=won|tied|lost) en vez de un
 * toggle con estado, para no depender de que el clic llegue al botón
 * correcto en el entorno de captura.
 */
export function DevBattleResultPreviewPage() {
  const [params] = useSearchParams();
  const outcome = params.get('outcome') ?? 'lost';
  const result = OUTCOMES[outcome] ?? BASE;

  return (
    <BattleResultScreen
      result={result}
      durationSec={252}
      userName="Alex"
      onBack={() => alert('onBack')}
      onReview={() => alert('onReview')}
    />
  );
}
