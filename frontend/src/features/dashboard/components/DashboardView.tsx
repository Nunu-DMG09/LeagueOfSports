import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Trophy, Crosshair, Crown, Star, Shield, 
  PlusCircle, Swords, Clock, TrendingUp, Zap, LayoutDashboard, Gift, Medal
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../../shared/services/api';

export default function DashboardView() {
  const navigate = useNavigate();
  const [data, setData] = useState({ 
    stats: { invocadores: 0, torneos_activos: 0, equipos: 0, kills_totales: 0 }, 
    topPlayer: { nickname: '', puntos_totales: 0, elo: '' },
    pieData: [], weeklyData: [], eloData: [], latestMatchesList: [], topTeamsData: [], recentRewards: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/summary');
      setData(response.data);
    } catch (error) {
      toast.error('Error al cargar métricas del servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="text-lg lg:text-xl text-ls-primary animate-pulse font-bold flex flex-col items-center gap-4"><Zap size={48} className="animate-bounce" /> Cargando Centro de Mando...</div></div>;

  return (
    <div className="space-y-6 lg:space-y-8 pb-10">
      
      {/* HEADER Y ACCIONES RÁPIDAS (Responsive) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <LayoutDashboard className="text-ls-primary shrink-0" size={28} /> Centro de Comando
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">Visión global de League of Sports</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate('/tournaments/new')} className="flex items-center gap-2 rounded bg-ls-gold/10 border border-ls-gold/30 px-3 py-2 text-xs lg:text-sm font-bold text-ls-gold hover:bg-ls-gold/20 transition whitespace-nowrap">
            <Trophy size={16} /> Nuevo Torneo
          </button>
          <button onClick={() => navigate('/users/new')} className="flex items-center gap-2 rounded bg-ls-primary/10 border border-ls-primary/30 px-3 py-2 text-xs lg:text-sm font-bold text-ls-primary hover:bg-ls-primary/20 transition whitespace-nowrap">
            <PlusCircle size={16} /> Invocador
          </button>
          <button onClick={() => fetchDashboardData()} className="flex items-center gap-2 rounded bg-gray-800 border border-gray-700 px-3 py-2 text-xs lg:text-sm font-bold text-white hover:bg-gray-700 transition whitespace-nowrap">
            <Zap size={16} className="text-blue-400" /> Refrescar
          </button>
        </div>
      </div>

      {/* METRICAS PRINCIPALES Y MVP */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 xl:grid-cols-5">
        <div className="lg:col-span-1 xl:col-span-1 rounded-xl border border-ls-gold bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-[0_0_20px_rgba(200,170,110,0.15)] flex flex-col items-center justify-center relative overflow-hidden group">
          <Crown size={120} className="absolute -right-4 -bottom-4 text-ls-gold opacity-5 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-[10px] lg:text-xs text-ls-gold uppercase tracking-widest mb-3 font-bold z-10 flex items-center gap-2 bg-ls-gold/10 px-3 py-1 rounded-full border border-ls-gold/20">
            <Crown size={14} /> MVP Global
          </p>
          <h3 className="text-2xl lg:text-3xl font-black text-white z-10 text-center break-all">{data.topPlayer.nickname || 'N/A'}</h3>
          <p className="text-xs lg:text-sm text-gray-400 z-10 mb-4">{data.topPlayer.elo}</p>
          <div className="bg-black/50 px-4 py-2 rounded-lg border border-gray-700 z-10 flex items-center gap-2 shadow-inner">
            <Star size={16} className="text-ls-gold fill-ls-gold shrink-0" />
            <span className="font-black text-ls-gold text-base lg:text-lg whitespace-nowrap">{data.topPlayer.puntos_totales} Pts</span>
          </div>
        </div>

        <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { title: 'Invocadores', value: data.stats.invocadores, icon: Users, color: 'text-ls-primary', bg: 'bg-ls-primary/10', border: 'border-ls-primary/20' },
            { title: 'Equipos', value: data.stats.equipos, icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            { title: 'Torneos', value: data.stats.torneos_activos, icon: Trophy, color: 'text-ls-gold', bg: 'bg-ls-gold/10', border: 'border-ls-gold/20' },
            { title: 'Bajas (Kills)', value: data.stats.kills_totales, icon: Crosshair, color: 'text-ls-danger', bg: 'bg-ls-danger/10', border: 'border-ls-danger/20' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col justify-center rounded-xl border border-gray-800 bg-ls-surface p-4 lg:p-5 shadow-lg relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${stat.bg} blur-2xl`}></div>
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 border ${stat.bg} ${stat.border} ${stat.color}`}><stat.icon size={24} /></div>
                <div>
                  <p className="text-[10px] lg:text-[11px] text-gray-400 uppercase tracking-wider font-bold">{stat.title}</p>
                  <h3 className="text-2xl lg:text-3xl font-black text-white">{stat.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE GRÁFICOS PRINCIPALES */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-ls-surface p-4 lg:p-5 shadow-lg flex flex-col w-full overflow-hidden">
          <h3 className="mb-4 lg:mb-6 text-base lg:text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-ls-primary shrink-0" size={20} /> Partidas Diarias
          </h3>
          <div className="flex-1 min-h-[250px] lg:min-h-[280px] w-full">
            {data.weeklyData.length === 0 ? (
               <div className="h-full flex items-center justify-center text-gray-600 italic text-sm">Sin datos</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis dataKey="dia" stroke="#a0aec0" tick={{ fill: '#a0aec0', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#a0aec0" allowDecimals={false} tick={{ fill: '#a0aec0', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <RechartsTooltip cursor={{fill: 'rgba(11, 198, 227, 0.1)'}} contentStyle={{ backgroundColor: '#1e2328', borderColor: '#0bc6e3', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="partidas" fill="#0bc6e3" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-ls-surface p-4 lg:p-5 shadow-lg flex flex-col w-full overflow-hidden">
          <h3 className="mb-4 lg:mb-6 text-base lg:text-lg font-bold text-white flex items-center gap-2">
            <Medal className="text-ls-gold shrink-0" size={20} /> Top Equipos (Victorias)
          </h3>
          <div className="flex-1 min-h-[250px] lg:min-h-[280px] w-full">
            {data.topTeamsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-600 italic text-sm">No hay victorias registradas</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topTeamsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis dataKey="nombre" stroke="#a0aec0" tick={{ fill: '#a0aec0', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#a0aec0" allowDecimals={false} tick={{ fill: '#a0aec0', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <RechartsTooltip cursor={{fill: 'rgba(200, 170, 110, 0.1)'}} contentStyle={{ backgroundColor: '#1e2328', borderColor: '#c8aa6e', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="victorias" fill="#c8aa6e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-xl border border-gray-800 bg-ls-surface p-4 lg:p-5 shadow-lg flex flex-col w-full overflow-hidden">
          <h3 className="text-base lg:text-lg font-bold text-white flex items-center gap-2 mb-4 lg:mb-6"><Users className="text-purple-400 shrink-0" size={20} /> Invocadores por Liga</h3>
          <div className="flex-1 min-h-[220px] w-full">
            {data.eloData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-600 italic text-sm">Sin datos</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.eloData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="liga" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a0aec0', fontSize: 10 }} width={70} />
                  <RechartsTooltip cursor={{fill: 'rgba(168, 85, 247, 0.1)'}} contentStyle={{ backgroundColor: '#1e2328', borderColor: '#a855f7', fontSize: '12px' }} />
                  <Bar dataKey="cantidad" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-span-1 rounded-xl border border-gray-800 bg-ls-surface p-4 lg:p-5 shadow-lg flex flex-col justify-between w-full overflow-hidden">
          <h3 className="mb-2 text-base lg:text-lg font-bold text-white flex items-center gap-2"><Trophy className="text-ls-primary shrink-0" size={20} /> Estatus Torneos</h3>
          <div className="h-[180px] w-full flex items-center justify-center mt-2">
            {data.pieData.length === 0 ? (
              <p className="text-gray-600 italic text-sm">Vacío</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pieData} innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                    {data.pieData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e2328', borderColor: '#0bc6e3', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-2 mt-4">
            {data.pieData.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-xs lg:text-sm p-2 rounded bg-ls-bg border border-gray-800">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span><span className="text-gray-300 font-medium truncate">{item.name}</span></div>
                <span className="font-black text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 rounded-xl border border-gray-800 bg-ls-surface p-4 lg:p-5 shadow-lg flex flex-col w-full overflow-hidden">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-3">
            <h3 className="text-base lg:text-lg font-bold text-white flex items-center gap-2"><Gift className="text-green-400 shrink-0" size={20} /> Últimos Canjes</h3>
            <button onClick={() => navigate('/rewards')} className="text-xs text-ls-primary hover:underline whitespace-nowrap ml-2">Ver Tienda</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            {data.recentRewards.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-600 italic text-sm">Nadie ha canjeado premios aún.</div>
            ) : (
              data.recentRewards.map((reward: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-800 hover:border-gray-600 transition">
                  <div className="flex items-center gap-2 lg:gap-3 overflow-hidden">
                    <div className="bg-green-500/10 p-1.5 lg:p-2 rounded-full border border-green-500/20 shrink-0"><Gift size={14} className="text-green-400" /></div>
                    <div className="overflow-hidden">
                      <p className="text-xs lg:text-sm font-bold text-white truncate">{reward.nickname}</p>
                      <p className="text-[10px] lg:text-[11px] text-gray-400 truncate max-w-[100px] sm:max-w-[150px]">{reward.nombre_recompensa}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-[10px] lg:text-xs font-bold text-ls-danger flex items-center gap-1 justify-end">-{reward.cantidad_puntos} <Star size={10} className="fill-ls-danger" /></span>
                    <p className="text-[9px] lg:text-[10px] text-gray-500 mt-1">{new Date(reward.fecha_movimiento).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TABLA: ÚLTIMAS PARTIDAS */}
      <div className="rounded-xl border border-gray-800 bg-ls-surface shadow-lg overflow-hidden mt-6 w-full">
        <div className="p-4 lg:p-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/50">
          <h3 className="text-base lg:text-lg font-bold text-white flex items-center gap-2"><Swords className="text-ls-danger shrink-0" size={20} /> Historial Oficial</h3>
          <button onClick={() => navigate('/tournaments')} className="text-xs text-ls-primary hover:bg-ls-primary/20 border border-ls-primary/30 px-3 py-1.5 rounded bg-ls-primary/10 transition self-start sm:self-auto whitespace-nowrap">Ver Torneos</button>
        </div>
        
        {/* Este overflow-x-auto salva la vida en móviles */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-ls-bg text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-4 lg:px-5 py-3">Fecha y Hora</th>
                <th className="px-4 lg:px-5 py-3 text-right text-blue-400">Lado Azul</th>
                <th className="px-4 lg:px-5 py-3 text-center">Enfrentamiento</th>
                <th className="px-4 lg:px-5 py-3 text-red-400">Lado Rojo</th>
                <th className="px-4 lg:px-5 py-3">Resultado Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.latestMatchesList.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500 font-medium text-sm">No hay registros en el historial de la Grieta.</td></tr>
              ) : (
                data.latestMatchesList.map((m: any) => (
                  <tr key={m.id_partida} className="hover:bg-ls-bg/60 transition cursor-pointer">
                    <td className="px-4 lg:px-5 py-4 text-gray-400 whitespace-nowrap text-xs lg:text-sm">
                      <div className="flex items-center gap-1.5 lg:gap-2"><Clock size={14} className="text-gray-500 shrink-0"/> {new Date(m.fecha_partida).toLocaleString()}</div>
                    </td>
                    <td className={`px-4 lg:px-5 py-4 text-right font-bold text-sm lg:text-base whitespace-nowrap ${m.ganador === m.equipo_azul ? 'text-white' : 'text-gray-500'}`}>{m.equipo_azul}</td>
                    <td className="px-4 lg:px-5 py-4 text-center font-black text-gray-700 text-xs lg:text-sm">VS</td>
                    <td className={`px-4 lg:px-5 py-4 font-bold text-sm lg:text-base whitespace-nowrap ${m.ganador === m.equipo_rojo ? 'text-white' : 'text-gray-500'}`}>{m.equipo_rojo}</td>
                    <td className="px-4 lg:px-5 py-4 whitespace-nowrap">
                      {m.ganador ? <span className="px-2 lg:px-3 py-1 lg:py-1.5 bg-ls-success/10 text-ls-success rounded border border-ls-success/20 text-[10px] lg:text-xs font-bold shadow-sm">{m.ganador} Gana</span> : <span className="px-2 lg:px-3 py-1 lg:py-1.5 bg-gray-800 text-gray-400 rounded text-[10px] lg:text-xs border border-gray-700">En Espera</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}