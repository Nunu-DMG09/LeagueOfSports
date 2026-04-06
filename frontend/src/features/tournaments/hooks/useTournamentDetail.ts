import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { tournamentService } from '../services/tournament.service';
import { teamService } from '../../teams/services/team.service';
import { matchService } from '../../matches/services/match.service';
import { useAuth } from '../../../shared/hooks/useAuth';

export function useTournamentDetail(tournamentId: number) {
  const [tournament, setTournament] = useState<any>(null);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTeam, setSelectedTeam] = useState('');
  const [newMatch, setNewMatch] = useState({ equipo_azul: '', equipo_rojo: '' });
  
  // Nuevos estados para el Modal de Miembros de Equipo
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [viewingTeam, setViewingTeam] = useState<any>(null);
  const [viewingTeamMembers, setViewingTeamMembers] = useState<any[]>([]);

  const { canManageTournaments } = useAuth(); 

  const loadData = async () => {
    if (!tournamentId || isNaN(tournamentId)) return;
    try {
      setLoading(true);
      const tournamentData = await tournamentService.getById(tournamentId);
      setTournament(tournamentData);
      
      const teamsIn = await tournamentService.getRegisteredTeams(tournamentId);
      setRegisteredTeams(teamsIn);
      
      const teamsAll = await teamService.getAll();
      setAllTeams(teamsAll);
      
      const matchesData = await matchService.getByTournament(tournamentId);
      setMatches(matchesData);
    } catch (error) {
      toast.error('Error al cargar la información del torneo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  const handleRegisterTeam = async () => {
    if (!selectedTeam) return;
    try {
      await tournamentService.registerTeam(tournamentId, Number(selectedTeam));
      toast.success('Equipo inscrito correctamente');
      setSelectedTeam('');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al inscribir');
    }
  };

  const handleCreateMatch = async () => {
    if (!newMatch.equipo_azul || !newMatch.equipo_rojo) return toast.error('Selecciona ambos equipos');
    if (newMatch.equipo_azul === newMatch.equipo_rojo) return toast.error('Un equipo no puede jugar contra sí mismo');
    
    try {
      await matchService.create({
        id_torneo: tournamentId,
        id_equipo_azul: Number(newMatch.equipo_azul),
        id_equipo_rojo: Number(newMatch.equipo_rojo)
      });
      toast.success('¡Partida generada en la Grieta!');
      setNewMatch({ equipo_azul: '', equipo_rojo: '' });
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear partida');
    }
  };

  // NUEVA FUNCIÓN: Remover Equipo
  const handleRemoveTeam = async (teamId: number) => {
    if (!window.confirm('¿Seguro que deseas expulsar a este equipo del torneo?')) return;
    try {
      await tournamentService.removeTeam(tournamentId, teamId);
      toast.success('Equipo eliminado del torneo');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'No se puede eliminar el equipo (¿Ya tiene partidas?)');
    }
  };

  // NUEVA FUNCIÓN: Borrar Partida
  const handleRemoveMatch = async (matchId: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este enfrentamiento programado?')) return;
    try {
      await matchService.delete(matchId);
      toast.success('Enfrentamiento eliminado correctamente');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al eliminar la partida');
    }
  };

  // NUEVA FUNCIÓN: Ver Miembros del equipo
  const handleViewTeamMembers = async (team: any) => {
    try {
      setViewingTeam(team);
      setTeamModalOpen(true);
      const members = await teamService.getMembers(team.id_equipo);
      setViewingTeamMembers(members);
    } catch (error) {
      toast.error('Error al cargar la alineación del equipo');
    }
  };

  return {
    tournament, registeredTeams, allTeams, matches, loading,
    selectedTeam, setSelectedTeam, newMatch, setNewMatch,
    handleRegisterTeam, handleCreateMatch, canManageTournaments,
    handleRemoveTeam, handleRemoveMatch, // Exportamos funciones de borrado
    teamModalOpen, setTeamModalOpen, viewingTeam, viewingTeamMembers, handleViewTeamMembers // Exportamos funciones del modal
  };
}