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
  const [newMember, setNewMember] = useState({ id_usuario: '', rol_en_equipo: 'Titular' });
  
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

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.id_usuario) return toast.error('Selecciona un invocador');

    try {
      await teamService.addMember(teamId, {
        id_usuario: Number(newMember.id_usuario),
        rol_en_equipo: newMember.rol_en_equipo
      });
      toast.success('Invocador asignado al equipo');
      setNewMember({ id_usuario: '', rol_en_equipo: 'Titular' });
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al asignar miembro');
    }
  };

  return {
    team, members, allUsers, loading,
    newMember, setNewMember, handleAddMember,
    canManageTeams
  };
}