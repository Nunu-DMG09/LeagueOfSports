import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import type { JSX } from 'react/jsx-dev-runtime';

interface Props {
  permission: 'tournaments' | 'teams' | 'users';
  children: JSX.Element;
}

export default function RequirePermission({ permission, children }: Props) {
  const auth = useAuth();
  
  let isAllowed = false;
  if (permission === 'tournaments') isAllowed = auth.canManageTournaments;
  if (permission === 'teams') isAllowed = auth.canManageTeams;
  if (permission === 'users') isAllowed = auth.canManageUsers;

  if (!isAllowed) {
    setTimeout(() => {
      toast.error('Acceso Denegado', { description: 'Tu nivel de invocador no te permite entrar a esta zona.' });
    }, 100);
    
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}