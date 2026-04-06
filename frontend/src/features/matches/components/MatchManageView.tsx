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

  const [statsData, setStatsData] = useState({
    id_usuario: '', campeon_jugado: '', kills: 0, deaths: 0, assists: 0,
    minions_asesinados: 0, oro_total: 0, vision_score: 0
  });

  const [finishData, setFinishData] = useState({ id_equipo_ganador: '', duracion_minutos: 0 });

  useEffect(() => {
    const loadMatchData = async () => {
      try {
        const matchData = await matchService.getById(Number(id));
        setMatch(matchData);
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
        ...statsData, id_usuario: Number(statsData.id_usuario)
      });
      toast.success('¡Estadísticas registradas exitosamente!');
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

  if (loading) return <div className="text-center py-20 animate-pulse text-ls-primary font-bold text-sm sm:text-base">Cargando la Grieta...</div>;
  if (!match) return <div className="text-center py-20 text-ls-danger font-bold text-xl">Partida no encontrada</div>;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-10">
      {/* HEADER */}
      <div className="flex items-center gap-3 sm:gap-4 border-b border-gray-800 pb-4 sm:pb-6">
        <button onClick={() => navigate(`/tournaments/${match.id_torneo}`)} className="text-gray-400 hover:text-white p-1 transition-colors">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px]" />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider">Gestión de Partida</h1>
      </div>

      {/* MARCADOR SUPERIOR RESPONSIVO */}
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex-1 bg-blue-900/20 p-4 sm:p-6 md:border-r border-b md:border-b-0 border-blue-500/30 text-center flex flex-col items-center justify-center">
          <Shield className="mb-2 text-blue-400" size={32} />
          <h2 className="text-lg sm:text-xl font-black text-blue-400 uppercase truncate w-full px-2" title={match.equipo_azul_nombre}>{match.equipo_azul_nombre}</h2>
          <p className="text-[10px] sm:text-xs text-blue-300 uppercase tracking-widest mt-1">Lado Azul</p>
        </div>
        <div className="flex items-center justify-center bg-gray-900 px-4 py-3 md:py-0 md:px-8 font-black text-xl sm:text-2xl text-gray-500 border-y md:border-y-0 border-gray-800">VS</div>
        <div className="flex-1 bg-red-900/20 p-4 sm:p-6 md:border-l border-red-500/30 text-center flex flex-col items-center justify-center">
          <Shield className="mb-2 text-red-400" size={32} />
          <h2 className="text-lg sm:text-xl font-black text-red-400 uppercase truncate w-full px-2" title={match.equipo_rojo_nombre}>{match.equipo_rojo_nombre}</h2>
          <p className="text-[10px] sm:text-xs text-red-300 uppercase tracking-widest mt-1">Lado Rojo</p>
        </div>
      </div>

      {match.id_equipo_ganador ? (
        <div className="rounded-xl bg-ls-success/10 border border-ls-success/50 p-6 sm:p-8 text-center text-ls-success shadow-lg shadow-ls-success/5">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Partida Finalizada</h2>
          <p className="text-sm sm:text-base text-gray-300">Esta partida ya tiene un ganador y sus estadísticas están selladas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* FORMULARIO ESTADÍSTICAS INDIVIDUALES */}
          <div className="rounded-xl border border-ls-gold/20 bg-ls-surface p-5 sm:p-6 shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-ls-gold mb-5 sm:mb-6 flex items-center gap-2 border-b border-gray-800 pb-3">
              <Activity size={20} /> Registrar Rendimiento (KDA)
            </h3>
            <form onSubmit={handleRegisterStats} className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-[10px] sm:text-xs text-gray-400 mb-1.5 block uppercase tracking-wider font-bold">Jugador</label>
                <select className="w-full bg-ls-bg border border-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white rounded-lg focus:border-ls-primary outline-none transition-colors"
                  value={statsData.id_usuario} onChange={e => setStatsData({...statsData, id_usuario: e.target.value})}>
                  <option value="">-- Seleccionar Jugador --</option>
                  <optgroup label={`🔵 Equipo Azul (${match.equipo_azul_nombre})`}>
                    {blueTeam.map(p => <option key={p.id_usuario} value={p.id_usuario}>{p.nickname}</option>)}
                  </optgroup>
                  <optgroup label={`🔴 Equipo Rojo (${match.equipo_rojo_nombre})`}>
                    {redTeam.map(p => <option key={p.id_usuario} value={p.id_usuario}>{p.nickname}</option>)}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-[10px] sm:text-xs text-gray-400 mb-1.5 block uppercase tracking-wider font-bold">Campeón Jugado</label>
                <input type="text" required placeholder="Ej. Lee Sin" className="w-full bg-ls-bg border border-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white rounded-lg focus:border-ls-primary outline-none transition-colors"
                  value={statsData.campeon_jugado} onChange={e => setStatsData({...statsData, campeon_jugado: e.target.value})} />
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="text-[10px] sm:text-xs text-ls-success mb-1.5 block font-bold uppercase tracking-wider">Kills</label>
                  <input type="number" min="0" required className="w-full bg-ls-bg border border-gray-700 p-2 sm:p-3 text-sm sm:text-base text-white rounded-lg text-center outline-none focus:border-ls-success transition-colors"
                    value={statsData.kills} onChange={e => setStatsData({...statsData, kills: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs text-ls-danger mb-1.5 block font-bold uppercase tracking-wider">Deaths</label>
                  <input type="number" min="0" required className="w-full bg-ls-bg border border-gray-700 p-2 sm:p-3 text-sm sm:text-base text-white rounded-lg text-center outline-none focus:border-ls-danger transition-colors"
                    value={statsData.deaths} onChange={e => setStatsData({...statsData, deaths: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs text-ls-primary mb-1.5 block font-bold uppercase tracking-wider">Assists</label>
                  <input type="number" min="0" required className="w-full bg-ls-bg border border-gray-700 p-2 sm:p-3 text-sm sm:text-base text-white rounded-lg text-center outline-none focus:border-ls-primary transition-colors"
                    value={statsData.assists} onChange={e => setStatsData({...statsData, assists: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 mb-1.5 block uppercase tracking-wider font-bold">Minions (CS)</label>
                  <input type="number" min="0" className="w-full bg-ls-bg border border-gray-700 p-2 sm:p-3 text-sm sm:text-base text-white rounded-lg text-center outline-none focus:border-gray-400 transition-colors"
                    value={statsData.minions_asesinados} onChange={e => setStatsData({...statsData, minions_asesinados: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs text-yellow-500 mb-1.5 block uppercase tracking-wider font-bold">Oro Total</label>
                  <input type="number" min="0" step="100" className="w-full bg-ls-bg border border-gray-700 p-2 sm:p-3 text-sm sm:text-base text-white rounded-lg text-center outline-none focus:border-yellow-500 transition-colors"
                    value={statsData.oro_total} onChange={e => setStatsData({...statsData, oro_total: Number(e.target.value)})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] sm:text-xs text-purple-400 mb-1.5 block uppercase tracking-wider font-bold">Visión</label>
                  <input type="number" min="0" className="w-full bg-ls-bg border border-gray-700 p-2 sm:p-3 text-sm sm:text-base text-white rounded-lg text-center outline-none focus:border-purple-400 transition-colors"
                    value={statsData.vision_score} onChange={e => setStatsData({...statsData, vision_score: Number(e.target.value)})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-ls-bg border border-ls-gold text-ls-gold text-sm sm:text-base font-bold py-2.5 sm:py-3 rounded-lg hover:bg-ls-gold/10 transition mt-6">
                Guardar Stats del Jugador
              </button>
            </form>
          </div>

          {/* FORMULARIO FINALIZAR PARTIDA */}
          <div className="rounded-xl border border-ls-danger/30 bg-ls-surface p-5 sm:p-6 shadow-xl h-fit relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-5 sm:mb-6 flex items-center gap-2 border-b border-gray-800 pb-3">
              <Flag size={20} className="text-ls-danger" /> Destrucción del Nexo
            </h3>
            <form onSubmit={handleFinishMatch} className="space-y-6">
              <div>
                <label className="text-[10px] sm:text-xs text-gray-400 mb-2.5 block font-bold uppercase tracking-wider">Selecciona al Equipo Ganador</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <label className={`cursor-pointer rounded-lg border p-4 sm:p-5 text-center transition-all ${finishData.id_equipo_ganador === String(match.id_equipo_azul) ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-gray-700 bg-ls-bg hover:border-blue-500/50'}`}>
                    <input type="radio" name="ganador" value={match.id_equipo_azul} className="hidden"
                      onChange={e => setFinishData({...finishData, id_equipo_ganador: e.target.value})} />
                    <span className="font-bold text-blue-400 text-sm sm:text-base block truncate">{match.equipo_azul_nombre}</span>
                  </label>
                  <label className={`cursor-pointer rounded-lg border p-4 sm:p-5 text-center transition-all ${finishData.id_equipo_ganador === String(match.id_equipo_rojo) ? 'border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-gray-700 bg-ls-bg hover:border-red-500/50'}`}>
                    <input type="radio" name="ganador" value={match.id_equipo_rojo} className="hidden"
                      onChange={e => setFinishData({...finishData, id_equipo_ganador: e.target.value})} />
                    <span className="font-bold text-red-400 text-sm sm:text-base block truncate">{match.equipo_rojo_nombre}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] sm:text-xs text-gray-400 mb-1.5 block font-bold uppercase tracking-wider">Duración (Minutos)</label>
                <input type="number" min="1" required placeholder="Ej. 35" className="w-full bg-ls-bg border border-gray-700 p-3 sm:p-4 text-white rounded-lg text-center focus:border-ls-danger outline-none text-xl sm:text-2xl transition-colors"
                  value={finishData.duracion_minutos || ''} onChange={e => setFinishData({...finishData, duracion_minutos: Number(e.target.value)})} />
              </div>

              <button type="submit" disabled={!finishData.id_equipo_ganador || finishData.duracion_minutos <= 0}
                className="w-full bg-ls-danger text-white font-bold py-3.5 sm:py-4 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg tracking-widest uppercase shadow-lg shadow-ls-danger/30 mt-2">
                Finalizar Partida
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}