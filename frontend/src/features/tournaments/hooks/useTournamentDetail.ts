import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { tournamentService } from '../services/tournament.service';
import { teamService } from '../../teams/services/team.service';
import { matchService } from '../../matches/services/match.service';

export function useTournamentDetail(tournamentId: number) {
  const [tournament, setTournament] = useState<any>(null);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTeam, setSelectedTeam] = useState('');
  const [newMatch, setNewMatch] = useState({ equipo_azul: '', equipo_rojo: '' });

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
      toast.error('Error al conectar con el servidor');
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

  return {
    tournament, registeredTeams, allTeams, matches, loading,
    selectedTeam, setSelectedTeam, newMatch, setNewMatch,
    handleRegisterTeam, handleCreateMatch
  };
}