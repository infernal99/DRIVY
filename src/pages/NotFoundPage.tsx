import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <EmptyState
        icon="sign"
        title="Página no encontrada"
        description="La pantalla que buscas no existe o se ha movido."
        action={<Button onClick={() => navigate('/')}>VOLVER AL INICIO</Button>}
      />
    </AppShell>
  );
}
