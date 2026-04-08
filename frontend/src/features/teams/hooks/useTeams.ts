import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { teamService } from '../services/team.service';
import { useAuth } from '../../../shared/hooks/useAuth';

export function useTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { canManageTeams } = useAuth();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getAll();
      setTeams(data);
    } catch (error) {
      toast.error('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const confirmDelete = async (id: number) => {
    try {
      await teamService.delete(id);
      toast.success('Equipo eliminado permanentemente');
      fetchTeams();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al eliminar el equipo');
    }
  };

  return { teams, loading, canManageTeams, fetchTeams, confirmDelete };
}