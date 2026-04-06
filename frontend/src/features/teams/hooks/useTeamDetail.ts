import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { teamService } from '../services/team.service';
import { userService } from '../../users/services/user.service';
import { useAuth } from '../../../shared/hooks/useAuth';

export function useTeamDetail(teamId: number) {
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { canManageTeams } = useAuth(); 

  const loadData = async () => {
    if (!teamId || isNaN(teamId)) return;
    try {
      setLoading(true);
      const [teamData, membersData, usersData] = await Promise.all([
        teamService.getById(teamId),
        teamService.getMembers(teamId),
        userService.getAll()
      ]);
      setTeam(teamData);
      setMembers(membersData);
      setAllUsers(usersData);
    } catch (error) {
      toast.error('Error al cargar la información del equipo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [teamId]);

  // NUEVO: Asignar Miembro (Recibe el usuario y el rol directamente del botón)
  const handleAddMember = async (userId: number, role: string) => {
    try {
      await teamService.addMember(teamId, {
        id_usuario: userId,
        rol_en_equipo: role
      });
      toast.success(`Invocador reclutado como ${role}`);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al asignar miembro');
    }
  };

  // NUEVO: Expulsar Miembro
  const handleRemoveMember = async (userId: number) => {
    if (!window.confirm('¿Estás seguro de expulsar a este jugador del equipo?')) return;
    try {
      await teamService.removeMember(teamId, userId);
      toast.success('Jugador expulsado de la escuadra');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al expulsar al jugador');
    }
  };

  // NUEVO: Filtramos para que solo aparezcan los usuarios que NO están en el equipo actual
  const availableUsers = allUsers.filter(u => !members.some(m => m.id_usuario === u.id_usuario));

  return {
    team, members, availableUsers, loading,
    handleAddMember, handleRemoveMember,
    canManageTeams
  };
}