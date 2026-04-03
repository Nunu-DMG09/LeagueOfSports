import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Shield, Swords, PlayCircle } from 'lucide-react'; // <-- Añade Swords y PlayCircle
import { tournamentService } from '../services/tournament.service';
import { teamService } from '../../teams/services/team.service';
import { matchService } from '../../matches/services/match.service'; // <-- Importa el servicio

export default function TournamentDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<any>(null);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]); // <-- Estado para partidas
  const [loading, setLoading] = useState(true);

  // Estados para formularios
  const [selectedTeam, setSelectedTeam] = useState('');
  const [newMatch, setNewMatch] = useState({ equipo_azul: '', equipo_rojo: '' });

  const loadData = async () => {
    try {
      const tournamentData = await tournamentService.getById(Number(id));
      setTournament(tournamentData);
      const teamsIn = await tournamentService.getRegisteredTeams(Number(id));
      setRegisteredTeams(teamsIn);
      const teamsAll = await teamService.getAll();
      setAllTeams(teamsAll);
      
      // Cargar partidas
      const matchesData = await matchService.getByTournament(Number(id));
      setMatches(matchesData);
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleRegisterTeam = async () => {
    if (!selectedTeam) return;
    try {
      await tournamentService.registerTeam(Number(id), Number(selectedTeam));
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
        id_torneo: Number(id),
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

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="text-lg text-ls-primary animate-pulse">Cargando información del torneo...</div></div>;
  if (!tournament) return <div className="text-center py-20 text-ls-danger"><p className="text-2xl font-bold mb-4">Error: El torneo no existe</p><button onClick={() => navigate('/tournaments')} className="rounded bg-ls-bg border border-ls-danger px-6 py-2 text-white hover:bg-ls-danger/20">Volver a la lista</button></div>;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-ls-gold/20 pb-4">
        <button onClick={() => navigate('/tournaments')} className="text-gray-400 hover:text-white transition"><ArrowLeft size={24} /></button>
        <div>
          <h1 className="text-2xl font-bold text-ls-gold uppercase tracking-wider">{tournament.nombre}</h1>
          <p className="text-sm text-gray-400">Modalidad: <span className="text-ls-primary">{tournament.modalidad}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* COLUMNA IZQUIERDA: Equipos y Partidas */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECCIÓN PARTIDAS */}
          <div className="rounded-lg border border-ls-gold/10 bg-ls-surface p-6 shadow-lg">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white mb-4">
              <Swords className="text-ls-primary" /> Cronograma de Partidas
            </h2>
            <div className="space-y-3">
              {matches.length === 0 ? (
                <p className="text-gray-500 italic">No hay partidas programadas.</p>
              ) : (
                matches.map(m => (
                  <div key={m.id_partida} className="flex items-center justify-between rounded border border-gray-700 bg-ls-bg p-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-1 text-right font-bold text-blue-400">{m.equipo_azul_nombre}</div>
                      <div className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 font-black">VS</div>
                      <div className="flex-1 text-left font-bold text-red-400">{m.equipo_rojo_nombre}</div>
                    </div>
                    <div className="ml-6 flex-shrink-0">
                      {m.id_equipo_ganador ? (
                        <span className="text-xs font-bold text-ls-success uppercase px-2 py-1 bg-ls-success/10 rounded">Finalizado</span>
                      ) : (
                        <button 
                          onClick={() => navigate(`/matches/${m.id_partida}/manage`)}
                          className="flex items-center gap-2 text-xs font-bold text-ls-bg bg-ls-primary hover:bg-ls-primary-hover px-3 py-2 rounded transition"
                        >
                          <PlayCircle size={16} /> Jugar / Stats
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECCIÓN EQUIPOS PARTICIPANTES (La que ya tenías) */}
          <div className="rounded-lg border border-ls-gold/10 bg-ls-surface p-6 shadow-lg">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white mb-4">
              <Shield className="text-ls-gold" /> Equipos Participantes
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {registeredTeams.map(t => (
                <div key={t.id_equipo} className="flex items-center gap-4 rounded border border-gray-700 bg-ls-bg p-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-gray-800 rounded p-1">
                    <img src={t.logo_url || 'https://cdn-icons-png.flaticon.com/512/814/814513.png'} className="h-full w-full object-contain" alt={t.nombre} />
                  </div>
                  <span className="font-bold text-white">{t.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formularios de Inscripción y Creación de Partidas */}
        <div className="space-y-6">
          {/* Formulario Inscribir Equipo */}
          <div className="rounded-lg border border-ls-gold/20 bg-ls-surface p-6 shadow-xl">
            <h3 className="mb-4 font-bold text-white uppercase border-b border-gray-700 pb-2">Inscribir Equipo</h3>
            <select className="w-full rounded bg-ls-bg border border-gray-700 p-2 text-white focus:border-ls-primary outline-none"
              value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
              <option value="">-- Seleccionar --</option>
              {allTeams.map(t => <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
            </select>
            <button onClick={handleRegisterTeam} disabled={!selectedTeam}
              className="mt-4 w-full rounded py-2 font-bold bg-ls-gold text-ls-bg hover:bg-ls-gold-hover transition disabled:opacity-50">
              Añadir al Torneo
            </button>
          </div>

          {/* Formulario Crear Partida */}
          <div className="rounded-lg border border-ls-primary/30 bg-ls-surface p-6 shadow-xl">
            <h3 className="mb-4 font-bold text-white uppercase border-b border-gray-700 pb-2">Generar Partida</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-blue-400 font-bold">Lado Azul</label>
                <select className="w-full rounded bg-ls-bg border border-blue-900/50 p-2 text-white focus:border-blue-500 outline-none"
                  value={newMatch.equipo_azul} onChange={e => setNewMatch({...newMatch, equipo_azul: e.target.value})}>
                  <option value="">-- Equipo Azul --</option>
                  {registeredTeams.map(t => <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-red-400 font-bold">Lado Rojo</label>
                <select className="w-full rounded bg-ls-bg border border-red-900/50 p-2 text-white focus:border-red-500 outline-none"
                  value={newMatch.equipo_rojo} onChange={e => setNewMatch({...newMatch, equipo_rojo: e.target.value})}>
                  <option value="">-- Equipo Rojo --</option>
                  {registeredTeams.map(t => <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
                </select>
              </div>
              <button onClick={handleCreateMatch} disabled={!newMatch.equipo_azul || !newMatch.equipo_rojo}
                className="w-full rounded py-2 font-bold bg-ls-primary text-ls-bg hover:bg-ls-primary-hover transition disabled:opacity-50 mt-2">
                Programar VS
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}