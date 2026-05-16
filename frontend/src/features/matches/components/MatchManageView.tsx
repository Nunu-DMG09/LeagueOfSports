import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Flag, Shield, Activity, Swords } from 'lucide-react';
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
        const matchData = await matchService.getById(Number(id)); setMatch(matchData);
        const blue = await teamService.getMembers(matchData.id_equipo_azul); const red = await teamService.getMembers(matchData.id_equipo_rojo);
        setBlueTeam(blue); setRedTeam(red);
      } catch (error) { toast.error('Ruptura de red con la Grieta'); } finally { setLoading(false); }
    }; loadMatchData();
  }, [id]);

  const handleRegisterStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statsData.id_usuario) return toast.error('Apunta un arma a un campeón');
    try {
      await matchService.registerStats(Number(id), { ...statsData, id_usuario: Number(statsData.id_usuario) });
      toast.success('Grabado en la piedra eterna.');
      setStatsData({ ...statsData, id_usuario: '', kills: 0, deaths: 0, assists: 0, minions_asesinados: 0, oro_total: 0, vision_score: 0 });
    } catch (error: any) { toast.error(error.response?.data?.error || 'Magia interrumpida'); }
  };

  const handleFinishMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishData.id_equipo_ganador) return toast.error('Alza la bandera del ganador');
    if (finishData.duracion_minutos <= 0) return toast.error('El tiempo no fluye hacia atrás');
    if (!window.confirm('¿Destruir el Nexo enemigo? No hay marcha atrás y la cúpula grabará la gesta.')) return;
    try {
      await matchService.finish(Number(id), { id_equipo_ganador: Number(finishData.id_equipo_ganador), duracion_minutos: Number(finishData.duracion_minutos) });
      toast.success('¡Nexo pulverizado!'); navigate(`/tournaments/${match.id_torneo}`);
    } catch (error: any) { toast.error(error.response?.data?.error || 'La estructura resiste el ataque'); }
  };

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="text-sm sm:text-base text-[#0bc6e3] animate-pulse font-black uppercase tracking-widest flex items-center gap-3">
        <Swords size={32} className="animate-bounce drop-shadow-[0_0_10px_#0bc6e3]" /> Conectando cámara de espectador...
      </div>
    </div>
  );
  if (!match) return <div className="text-center py-20 text-[#ef4444] font-black uppercase tracking-widest text-xl border border-dashed border-[#ef4444]/40 bg-[#121418] rounded-xl mx-4">Conexión Caída</div>;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-gray-800/80 pb-5">
        <button onClick={() => navigate(`/tournaments/${match.id_torneo}`)} className="group rounded-full bg-[#121418] border border-gray-800 p-2 text-gray-400 hover:text-white hover:border-gray-500 transition-all">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px] group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">Panel de Espectador Activo</h1>
      </div>

      {/* MARCADOR SUPERIOR HEX TECH */}
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-gray-800/80 bg-[#121418] relative isolate">
        <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-[#3b82f6] via-gray-600 to-[#ef4444] z-10"></div>
        
        {/* AZUL */}
        <div className="flex-1 relative bg-gradient-to-br from-[#0a0a0c] to-[#1e3a8a]/20 p-5 sm:p-8 text-center flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-800/80 overflow-hidden group">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#3b82f6]/10 blur-3xl rounded-full"></div>
          <Shield className="mb-3 text-[#3b82f6] drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform duration-500" size={40} />
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase truncate w-full px-2 tracking-wide drop-shadow-sm relative z-10" title={match.equipo_azul_nombre}>{match.equipo_azul_nombre}</h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-[#3b82f6]/50"></span>
            <p className="text-[10px] sm:text-xs text-[#60a5fa] font-black uppercase tracking-widest relative z-10">Facciones Océano</p>
            <span className="w-6 h-[1px] bg-[#3b82f6]/50"></span>
          </div>
        </div>
        
        {/* VS MUNDIAL */}
        <div className="flex flex-col items-center justify-center bg-[#0a0a0c] px-6 py-4 md:py-0 md:px-10 border-y md:border-y-0 border-gray-800/80 z-10 relative shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 bottom-0 w-[1px] bg-gray-800"></div>
          <div className="bg-[#121418] border border-gray-700/80 rounded-lg p-2.5 transform rotate-3">
             <span className="font-black text-2xl sm:text-3xl bg-gradient-to-b from-gray-200 to-gray-500 bg-clip-text text-transparent italic leading-none block">VS</span>
          </div>
        </div>
        
        {/* ROJO */}
        <div className="flex-1 relative bg-gradient-to-bl from-[#0a0a0c] to-[#991b1b]/20 p-5 sm:p-8 text-center flex flex-col items-center justify-center md:border-l border-gray-800/80 overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#ef4444]/10 blur-3xl rounded-full"></div>
          <Shield className="mb-3 text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform duration-500" size={40} />
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase truncate w-full px-2 tracking-wide drop-shadow-sm relative z-10" title={match.equipo_rojo_nombre}>{match.equipo_rojo_nombre}</h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-[#ef4444]/50"></span>
            <p className="text-[10px] sm:text-xs text-[#f87171] font-black uppercase tracking-widest relative z-10">Facciones Infernal</p>
            <span className="w-6 h-[1px] bg-[#ef4444]/50"></span>
          </div>
        </div>
      </div>

      {match.id_equipo_ganador ? (
        <div className="rounded-xl border border-[#10b981]/40 bg-[#121418]/80 backdrop-blur-md p-8 sm:p-10 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#10b981]/5 mix-blend-overlay"></div>
          <Activity size={48} className="mx-auto text-[#10b981] mb-5 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)] group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white mb-2">Combate Clausurado</h2>
          <p className="text-xs sm:text-sm text-[#10b981] font-bold uppercase tracking-widest drop-shadow-sm mt-3">Las hazañas han sido inmortalizadas en piedra estelar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* GRABAR ESTADISTICAS INDIVIDUALES */}
          <div className="rounded-xl border border-[#c8aa6e]/30 bg-[#121418]/80 backdrop-blur-md p-6 sm:p-7 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group/stats">
            <div className="absolute top-0 left-4 w-12 h-[2px] bg-[#c8aa6e] rounded-full"></div>
            <h3 className="text-base sm:text-lg font-black text-[#c8aa6e] mb-6 sm:mb-8 flex items-center gap-3 border-b border-gray-800/80 pb-4 uppercase tracking-widest">
              <Activity size={22} className="drop-shadow-[0_0_5px_rgba(200,170,110,0.5)]" /> Sellar Rendimiento Base
            </h3>
            
            <form onSubmit={handleRegisterStats} className="space-y-5 sm:space-y-6 relative z-10">
              <div>
                <label className="text-[10px] sm:text-xs text-[#a0aec0] mb-2 block uppercase tracking-widest font-black">Guerrero en Campo</label>
                <select className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3.5 sm:p-4 text-sm font-bold text-white rounded-lg focus:border-[#c8aa6e] focus:shadow-[0_0_15px_rgba(200,170,110,0.2)] outline-none transition-all appearance-none uppercase" value={statsData.id_usuario} onChange={e => setStatsData({...statsData, id_usuario: e.target.value})}>
                  <option className="bg-gray-900" value="">-- Ficha al Tirador --</option>
                  <optgroup className="font-black text-[#60a5fa] bg-gray-900" label={`OCÉANO - ${match.equipo_azul_nombre}`}>
                    {blueTeam.map(p => <option className="text-white font-medium" key={p.id_usuario} value={p.id_usuario}>{p.nickname}</option>)}
                  </optgroup>
                  <optgroup className="font-black text-[#f87171] bg-gray-900" label={`INFERNAL - ${match.equipo_rojo_nombre}`}>
                    {redTeam.map(p => <option className="text-white font-medium" key={p.id_usuario} value={p.id_usuario}>{p.nickname}</option>)}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-[10px] sm:text-xs text-[#a0aec0] mb-2 block uppercase tracking-widest font-black">Avatar Elegido (Campeón)</label>
                <input type="text" required placeholder="Ej. Yasuo" className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3.5 sm:p-4 text-sm font-black tracking-wider text-white rounded-lg focus:border-[#c8aa6e] outline-none transition-all placeholder-gray-600" value={statsData.campeon_jugado} onChange={e => setStatsData({...statsData, campeon_jugado: e.target.value})} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-[#10b981] mb-2 block font-black uppercase tracking-widest text-center">Bajas</label>
                  <input type="number" min="0" required className="w-full bg-[#0a0a0c] border border-gray-700/60 p-3 text-lg sm:text-xl font-black text-white rounded-lg text-center outline-none focus:border-[#10b981] focus:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all tabular-nums" value={statsData.kills} onChange={e => setStatsData({...statsData, kills: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] text-[#ef4444] mb-2 block font-black uppercase tracking-widest text-center">Caídas</label>
                  <input type="number" min="0" required className="w-full bg-[#0a0a0c] border border-gray-700/60 p-3 text-lg sm:text-xl font-black text-white rounded-lg text-center outline-none focus:border-[#ef4444] focus:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all tabular-nums" value={statsData.deaths} onChange={e => setStatsData({...statsData, deaths: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] text-[#0bc6e3] mb-2 block font-black uppercase tracking-widest text-center">Apoyos</label>
                  <input type="number" min="0" required className="w-full bg-[#0a0a0c] border border-gray-700/60 p-3 text-lg sm:text-xl font-black text-white rounded-lg text-center outline-none focus:border-[#0bc6e3] focus:shadow-[0_0_10px_rgba(11,198,227,0.3)] transition-all tabular-nums" value={statsData.assists} onChange={e => setStatsData({...statsData, assists: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] text-[#a0aec0] mb-2 block uppercase tracking-widest font-black text-center">Vasallos (CS)</label>
                  <input type="number" min="0" className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3 text-sm font-black text-white rounded-lg text-center outline-none focus:border-white transition-all tabular-nums" value={statsData.minions_asesinados} onChange={e => setStatsData({...statsData, minions_asesinados: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[9px] text-yellow-500 mb-2 block uppercase tracking-widest font-black text-center">Oro Absoluto</label>
                  <input type="number" min="0" step="100" className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3 text-sm font-black text-white rounded-lg text-center outline-none focus:border-yellow-500 transition-all tabular-nums" value={statsData.oro_total} onChange={e => setStatsData({...statsData, oro_total: Number(e.target.value)})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[9px] text-[#a855f7] mb-2 block uppercase tracking-widest font-black text-center">Luz Guía</label>
                  <input type="number" min="0" className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3 text-sm font-black text-white rounded-lg text-center outline-none focus:border-[#a855f7] transition-all tabular-nums" value={statsData.vision_score} onChange={e => setStatsData({...statsData, vision_score: Number(e.target.value)})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-transparent border border-[#c8aa6e]/50 text-[#c8aa6e] text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 sm:py-4 rounded-lg hover:bg-[#c8aa6e]/10 hover:border-[#c8aa6e] transition-all mt-6 shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(200,170,110,0.2)] block truncate px-2">
                Inscribir Maniobra a la Piedra
              </button>
            </form>
          </div>

          {/* DERRUMBE DE NEXO */}
          <div className="rounded-xl border border-[#ef4444]/40 bg-[#121418]/80 backdrop-blur-md p-6 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.6)] h-fit relative overflow-hidden group/finish">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-orange-600 to-red-900"></div>
            <h3 className="text-base sm:text-lg font-black text-white mb-6 sm:mb-8 flex items-center gap-3 border-b border-gray-800/80 pb-4 uppercase tracking-widest">
              <Flag size={22} className="text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> Consolidar Conquista
            </h3>
            
            <form onSubmit={handleFinishMatch} className="space-y-6 sm:space-y-8 relative z-10">
              <div>
                <label className="text-[10px] sm:text-xs text-[#a0aec0] mb-3 block font-black uppercase tracking-widest text-center">Bando Victorioso</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`cursor-pointer rounded-xl border p-4 sm:p-5 text-center transition-all duration-300 relative overflow-hidden ${finishData.id_equipo_ganador === String(match.id_equipo_azul) ? 'border-[#3b82f6] bg-[#3b82f6]/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]' : 'border-gray-700/60 bg-[#0a0a0c]/80 hover:border-[#3b82f6]/50'}`}>
                    <input type="radio" name="ganador" value={match.id_equipo_azul} className="hidden" onChange={e => setFinishData({...finishData, id_equipo_ganador: e.target.value})} />
                    <span className={`font-black uppercase tracking-wider text-sm sm:text-base block truncate transition-colors ${finishData.id_equipo_ganador === String(match.id_equipo_azul) ? 'text-white' : 'text-[#60a5fa]'}`}>{match.equipo_azul_nombre}</span>
                    {finishData.id_equipo_ganador === String(match.id_equipo_azul) && <div className="absolute inset-x-0 bottom-0 h-1 bg-[#3b82f6]"></div>}
                  </label>
                  
                  <label className={`cursor-pointer rounded-xl border p-4 sm:p-5 text-center transition-all duration-300 relative overflow-hidden ${finishData.id_equipo_ganador === String(match.id_equipo_rojo) ? 'border-[#ef4444] bg-[#ef4444]/10 shadow-[0_0_20px_rgba(239,68,68,0.3)] scale-[1.02]' : 'border-gray-700/60 bg-[#0a0a0c]/80 hover:border-[#ef4444]/50'}`}>
                    <input type="radio" name="ganador" value={match.id_equipo_rojo} className="hidden" onChange={e => setFinishData({...finishData, id_equipo_ganador: e.target.value})} />
                    <span className={`font-black uppercase tracking-wider text-sm sm:text-base block truncate transition-colors ${finishData.id_equipo_ganador === String(match.id_equipo_rojo) ? 'text-white' : 'text-[#f87171]'}`}>{match.equipo_rojo_nombre}</span>
                    {finishData.id_equipo_ganador === String(match.id_equipo_rojo) && <div className="absolute inset-x-0 bottom-0 h-1 bg-[#ef4444]"></div>}
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] sm:text-xs text-[#a0aec0] mb-2.5 block font-black uppercase tracking-widest text-center">Fases de la Escala (Minutos)</label>
                <input type="number" min="1" required placeholder="00" className="w-full max-w-[200px] mx-auto block bg-[#0a0a0c] border border-gray-700/60 p-4 font-black text-white rounded-lg text-center focus:border-[#c8aa6e] focus:shadow-[0_0_15px_rgba(200,170,110,0.2)] outline-none text-2xl sm:text-3xl transition-all tabular-nums" value={finishData.duracion_minutos || ''} onChange={e => setFinishData({...finishData, duracion_minutos: Number(e.target.value)})} />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={!finishData.id_equipo_ganador || finishData.duracion_minutos <= 0} className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white font-black py-4 sm:py-4 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base tracking-widest uppercase hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] group/nexo disabled:hover:shadow-none hover:-translate-y-1 block mt-2 border border-[#ef4444]/50">
                  <span className="relative z-10 flex items-center justify-center gap-2">Hacer Caer el Nexo Opositor</span>
                  {finishData.id_equipo_ganador && finishData.duracion_minutos > 0 && <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover/nexo:scale-100"></div>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}