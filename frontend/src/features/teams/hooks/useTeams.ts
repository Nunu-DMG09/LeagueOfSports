import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { teamService } from '../services/team.service';
import { useAuth } from '../../../shared/hooks/useAuth';

export function useTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { canManageTeams } = useAuth(); 

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamService.getAll();
        setTeams(data);
      } catch (error) {
        toast.error('Error al cargar los equipos');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return { teams, loading, canManageTeams };
}