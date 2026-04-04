import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { tournamentService } from '../services/tournament.service';
import { useAuth } from '../../../shared/hooks/useAuth';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { canManageTournaments } = useAuth(); // Protegemos acciones desde el hook

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await tournamentService.getAll();
        setTournaments(data);
      } catch (error) {
        toast.error('Error al cargar la lista de torneos');
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  return {
    tournaments,
    loading,
    canManageTournaments
  };
}