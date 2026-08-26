import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { AppShell } from '../components/layout/AppShell';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function SettingsPage() {
  const navigate = useNavigate();
  const userName = useProgressStore((s) => s.progress.userName);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <AppShell>
      <ScreenHeader title="Configuración" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>Nombre</div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted-60)', margin: 0 }}>{userName}</p>
        </Card>

        <Card style={{ padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>Datos guardados localmente</div>
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: 0 }}>
            Tu progreso se guarda en este dispositivo (localStorage), no en un servidor. Si borras los datos del
            navegador para este sitio, perderás tu progreso.
          </p>
        </Card>

        <Card style={{ padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-error)', marginBottom: 8 }}>Reiniciar progreso</div>
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.5, margin: '0 0 12px' }}>
            Borra XP, racha, logros, estadísticas y errores guardados. Esta acción no se puede deshacer.
          </p>
          {confirmingReset ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" onClick={() => setConfirmingReset(false)} style={{ flex: 1 }}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  resetProgress();
                  setConfirmingReset(false);
                  navigate('/');
                }}
                style={{ flex: 1 }}
              >
                Confirmar
              </Button>
            </div>
          ) : (
            <Button variant="danger" onClick={() => setConfirmingReset(true)}>
              Reiniciar progreso
            </Button>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
