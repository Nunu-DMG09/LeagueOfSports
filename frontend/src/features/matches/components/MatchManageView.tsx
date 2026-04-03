import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Crosshair, Flag, Shield, Activity } from 'lucide-react';
import { matchService } from '../services/match.service';
import { teamService } from '../../teams/services/team.service';

export default function MatchManageView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<any>(null);
  const [blueTeam, setBlueTeam] = useState<any[]>([]);
  const [redTeam, setRedTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el formulario de Estadísticas
  const [statsData, setStatsData] = useState({
    id_usuario: '', campeon_jugado: '', kills: 0, deaths: 0, assists: 0,
    minions_asesinados: 0, oro_total: 0, vision_score: 0
  });

  // Estado para finalizar partida
  const [finishData, setFinishData] = useState({ id_equipo_ganador: '', duracion_minutos: 0 });

  useEffect(() => {
    const loadMatchData = async () => {
      try {
        const matchData = await matchService.getById(Number(id));
        setMatch(matchData);
        // Cargamos los jugadores de ambos equipos para el selector
        const blue = await teamService.getMembers(matchData.id_equipo_azul);
        const red = await teamService.getMembers(matchData.id_equipo_rojo);
        setBlueTeam(blue);
        setRedTeam(red);
      } catch (error) {
        toast.error('Error al cargar la partida');
      } finally {
        setLoading(false);
      }
    };
    loadMatchData();
  }, [id]);

  const handleRegisterStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statsData.id_usuario) return toast.error('Selecciona un jugador');
    
    try {
      await matchService.registerStats(Number(id), {
        ...statsData,
        id_usuario: Number(statsData.id_usuario)
      });
      toast.success('¡Estadísticas registradas exitosamente!');
      // Limpiar formulario excepto campeón
      setStatsData({ ...statsData, id_usuario: '', kills: 0, deaths: 0, assists: 0, minions_asesinados: 0, oro_total: 0, vision_score: 0 });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al registrar estadísticas');
    }
  };

  const handleFinishMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishData.id_equipo_ganador) return toast.error('Selecciona el equipo ganador');
    if (finishData.duracion_minutos <= 0) return toast.error('La duración debe ser mayor a 0');

    if (!window.confirm('¿Estás seguro de finalizar la partida? Esto afectará el Salón de la Fama.')) return;

    try {
      await matchService.finish(Number(id), {
        id_equipo_ganador: Number(finishData.id_equipo_ganador),
        duracion_minutos: Number(finishData.duracion_minutos)
      });
      toast.success('¡Partida finalizada! El Nexo ha sido destruido.');
      navigate(`/tournaments/${match.id_torneo}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al finalizar partida');
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-ls-primary">Cargando la Grieta...</div>;
  if (!match) return <div className="text-center py-20 text-ls-danger">Partida no encontrada</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/tournaments/${match.id_torneo}`)} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Gestión de Partida</h1>
      </div>

      {/* MARCADOR SUPERIOR */}
      <div className="flex rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex-1 bg-blue-900/20 p-6 border-r border-blue-500/30 text-center">
          <Shield className="mx-auto mb-2 text-blue-400" size={32} />
          <h2 className="text-xl font-black text-blue-400 uppercase">{match.equipo_azul_nombre}</h2>
          <p className="text-xs text-blue-300">Lado Azul</p>
        </div>
        <div className="flex items-center justify-center bg-ls-bg px-8 font-black text-2xl text-gray-500">VS</div>
        <div className="flex-1 bg-red-900/20 p-6 border-l border-red-500/30 text-center">
          <Shield className="mx-auto mb-2 text-red-400" size={32} />
          <h2 className="text-xl font-black text-red-400 uppercase">{match.equipo_rojo_nombre}</h2>
          <p className="text-xs text-red-300">Lado Rojo</p>
        </div>
      </div>

      {match.id_equipo_ganador ? (
        <div className="rounded-lg bg-ls-success/20 border border-ls-success p-6 text-center text-ls-success">
          <h2 className="text-2xl font-bold">Partida Finalizada</h2>
          <p>Esta partida ya tiene un ganador y sus estadísticas están selladas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* FORMULARIO ESTADÍSTICAS INDIVIDUALES */}
          <div className="rounded-lg border border-ls-gold/20 bg-ls-surface p-6 shadow-lg">
            <h3 className="text-lg font-bold text-ls-gold mb-6 flex items-center gap-2">
              <Activity size={20} /> Registrar Rendimiento (KDA)
            </h3>
            <form onSubmit={handleRegisterStats} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Jugador</label>
                <select className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded focus:border-ls-primary outline-none"
                  value={statsData.id_usuario} onChange={e => setStatsData({...statsData, id_usuario: e.target.value})}>
                  <option value="">-- Seleccionar Jugador --</option>
                  <optgroup label={`Equipo Azul (${match.equipo_azul_nombre})`}>
                    {blueTeam.map(p => <option key={p.id_usuario} value={p.id_usuario}>{p.nickname}</option>)}
                  </optgroup>
                  <optgroup label={`Equipo Rojo (${match.equipo_rojo_nombre})`}>
                    {redTeam.map(p => <option key={p.id_usuario} value={p.id_usuario}>{p.nickname}</option>)}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Campeón Jugado</label>
                <input type="text" required placeholder="Ej. Lee Sin" className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded focus:border-ls-primary outline-none"
                  value={statsData.campeon_jugado} onChange={e => setStatsData({...statsData, campeon_jugado: e.target.value})} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-ls-success mb-1 block font-bold">Kills</label>
                  <input type="number" min="0" required className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded text-center"
                    value={statsData.kills} onChange={e => setStatsData({...statsData, kills: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs text-ls-danger mb-1 block font-bold">Deaths</label>
                  <input type="number" min="0" required className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded text-center"
                    value={statsData.deaths} onChange={e => setStatsData({...statsData, deaths: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs text-ls-primary mb-1 block font-bold">Assists</label>
                  <input type="number" min="0" required className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded text-center"
                    value={statsData.assists} onChange={e => setStatsData({...statsData, assists: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Minions (CS)</label>
                  <input type="number" min="0" className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded text-center"
                    value={statsData.minions_asesinados} onChange={e => setStatsData({...statsData, minions_asesinados: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs text-yellow-500 mb-1 block">Oro Total</label>
                  <input type="number" min="0" step="100" className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded text-center"
                    value={statsData.oro_total} onChange={e => setStatsData({...statsData, oro_total: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs text-purple-400 mb-1 block">Visión</label>
                  <input type="number" min="0" className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded text-center"
                    value={statsData.vision_score} onChange={e => setStatsData({...statsData, vision_score: Number(e.target.value)})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-ls-bg border border-ls-gold text-ls-gold font-bold py-3 rounded hover:bg-ls-gold/10 transition mt-4">
                Guardar Stats del Jugador
              </button>
            </form>
          </div>

          {/* FORMULARIO FINALIZAR PARTIDA */}
          <div className="rounded-lg border border-ls-danger/30 bg-ls-surface p-6 shadow-lg h-fit">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Flag size={20} className="text-ls-danger" /> Destrucción del Nexo
            </h3>
            <form onSubmit={handleFinishMatch} className="space-y-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-bold">Equipo Ganador</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer rounded border p-4 text-center transition-all ${finishData.id_equipo_ganador === String(match.id_equipo_azul) ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 bg-ls-bg hover:border-blue-500/50'}`}>
                    <input type="radio" name="ganador" value={match.id_equipo_azul} className="hidden"
                      onChange={e => setFinishData({...finishData, id_equipo_ganador: e.target.value})} />
                    <span className="font-bold text-blue-400">{match.equipo_azul_nombre}</span>
                  </label>
                  <label className={`cursor-pointer rounded border p-4 text-center transition-all ${finishData.id_equipo_ganador === String(match.id_equipo_rojo) ? 'border-red-500 bg-red-500/20' : 'border-gray-700 bg-ls-bg hover:border-red-500/50'}`}>
                    <input type="radio" name="ganador" value={match.id_equipo_rojo} className="hidden"
                      onChange={e => setFinishData({...finishData, id_equipo_ganador: e.target.value})} />
                    <span className="font-bold text-red-400">{match.equipo_rojo_nombre}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block font-bold">Duración (Minutos)</label>
                <input type="number" min="1" required placeholder="Ej. 35" className="w-full bg-ls-bg border border-gray-700 p-3 text-white rounded text-center focus:border-ls-danger outline-none text-xl"
                  value={finishData.duracion_minutos || ''} onChange={e => setFinishData({...finishData, duracion_minutos: Number(e.target.value)})} />
              </div>

              <button type="submit" disabled={!finishData.id_equipo_ganador || finishData.duracion_minutos <= 0}
                className="w-full bg-ls-danger text-white font-bold py-4 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-widest uppercase">
                Finalizar Partida
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}