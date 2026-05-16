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

  if (loading) return (
    <div className="flex h-full items-center justify-center bg-[#0a0a0c]">
      <div className="text-lg lg:text-xl text-ls-cyan animate-pulse font-bold flex flex-col items-center gap-4">
        <Zap size={48} className="animate-bounce text-[#0bc6e3] drop-shadow-[0_0_15px_rgba(11,198,227,0.8)]" /> 
        Cargando Núcleo Hextech...
      </div>
    </div>
  );

  return (
    <div className="space-y-6 lg:space-y-8 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ls-primary/5 via-[#0a0a0c]/0 to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER Y ACCIONES RÁPIDAS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/60 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-ls-primary/20 to-transparent rounded-lg border border-ls-primary/30 shadow-[0_0_15px_rgba(11,198,227,0.15)]">
              <LayoutDashboard className="text-[#0bc6e3] shrink-0" size={24} />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent drop-shadow-sm">
              Centro de Comando
            </span>
          </h1>
          <p className="text-[#a0aec0] text-xs md:text-sm mt-2 font-medium tracking-wide">Visión global e inteligencia de League of Sports</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/tournaments/new')} className="group flex items-center gap-2 rounded bg-gradient-to-b from-[#c8aa6e]/10 to-transparent border border-[#c8aa6e]/40 px-4 py-2 text-xs lg:text-sm font-bold text-[#c8aa6e] hover:bg-[#c8aa6e]/20 hover:border-[#c8aa6e] hover:shadow-[0_0_15px_rgba(200,170,110,0.3)] transition-all duration-300 whitespace-nowrap">
            <Trophy size={16} className="group-hover:scale-110 transition-transform" /> Nuevo Torneo
          </button>
          <button onClick={() => navigate('/users/new')} className="group flex items-center gap-2 rounded bg-gradient-to-b from-ls-primary/10 to-transparent border border-ls-primary/40 px-4 py-2 text-xs lg:text-sm font-bold text-ls-primary hover:bg-ls-primary/20 hover:border-ls-primary hover:shadow-[0_0_15px_rgba(11,198,227,0.3)] transition-all duration-300 whitespace-nowrap">
            <PlusCircle size={16} className="group-hover:scale-110 transition-transform" /> Invocador
          </button>
          <button onClick={() => fetchDashboardData()} className="group flex items-center gap-2 rounded bg-gray-800/50 border border-gray-700/50 px-4 py-2 text-xs lg:text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 whitespace-nowrap shadow-sm">
            <Zap size={16} className="text-[#0bc6e3] group-hover:rotate-12 transition-transform" /> Refrescar
          </button>
        </div>
      </div>

      {/* METRICAS PRINCIPALES Y MVP */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {/* TARJETA MVP - Estilo Challenger/Hextech */}
        <div className="lg:col-span-1 xl:col-span-1 rounded-xl border border-[#c8aa6e]/50 bg-gradient-to-b from-[#1a1c23] to-[#0a0a0c] p-6 shadow-[0_0_30px_rgba(200,170,110,0.15)] flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-[0_0_40px_rgba(200,170,110,0.25)] transition-all duration-500">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <Crown size={140} className="absolute -right-6 -bottom-6 text-[#c8aa6e] opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700" />
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent opacity-50"></div>
          
          <p className="text-[10px] lg:text-xs text-[#c8aa6e] uppercase tracking-widest mb-4 font-black z-10 flex items-center gap-2 bg-[#c8aa6e]/10 px-4 py-1.5 rounded-full border border-[#c8aa6e]/30 shadow-inner backdrop-blur-sm">
            <Crown size={14} className="animate-pulse" /> MVP GLOBAL
          </p>
          <h3 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent z-10 text-center break-all drop-shadow-md">
            {data.topPlayer.nickname || 'N/A'}
          </h3>
          <p className="text-xs lg:text-sm font-bold text-[#a0aec0] uppercase tracking-widest z-10 my-3">{data.topPlayer.elo}</p>
          <div className="bg-[#0a0a0c]/80 backdrop-blur-md px-5 py-2.5 rounded-lg border border-[#c8aa6e]/30 z-10 flex items-center gap-3 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
            <Star size={18} className="text-[#c8aa6e] fill-[#c8aa6e] shrink-0 drop-shadow-[0_0_5px_rgba(200,170,110,0.8)]" />
            <span className="font-black text-[#c8aa6e] text-lg lg:text-xl whitespace-nowrap tracking-tight">{data.topPlayer.puntos_totales} Pts</span>
          </div>
        </div>

        {/* STATS RAPIDAS */}
        <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            { title: 'Invocadores', value: data.stats.invocadores, icon: Users, color: 'text-[#0bc6e3]', borderColor: 'border-[#0bc6e3]', shadow: 'shadow-[#0bc6e3]/10', glow: 'from-[#0bc6e3]/10' },
            { title: 'Equipos', value: data.stats.equipos, icon: Shield, color: 'text-[#a855f7]', borderColor: 'border-[#a855f7]', shadow: 'shadow-[#a855f7]/10', glow: 'from-[#a855f7]/10' },
            { title: 'Torneos', value: data.stats.torneos_activos, icon: Trophy, color: 'text-[#c8aa6e]', borderColor: 'border-[#c8aa6e]', shadow: 'shadow-[#c8aa6e]/10', glow: 'from-[#c8aa6e]/10' },
            { title: 'Bajas (Kills)', value: data.stats.kills_totales, icon: Crosshair, color: 'text-[#ef4444]', borderColor: 'border-[#ef4444]', shadow: 'shadow-[#ef4444]/10', glow: 'from-[#ef4444]/10' },
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col justify-center rounded-xl border-y border-r border-gray-800/50 border-l-4 ${stat.borderColor} bg-gradient-to-br from-[#121418] to-[#0a0a0c] p-5 shadow-lg ${stat.shadow} relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
              <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.glow} to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 border border-gray-800 bg-[#0a0a0c]/50 backdrop-blur-sm ${stat.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={26} className="drop-shadow-md" />
                </div>
                <div>
                  <p className="text-[10px] lg:text-[11px] text-gray-400 uppercase tracking-widest font-bold">{stat.title}</p>
                  <h3 className="text-2xl lg:text-3xl font-black text-white drop-shadow-sm">{stat.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE GRÁFICOS PRINCIPALES - Slick Style */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-[#121418]/80 backdrop-blur-md p-4 lg:p-6 shadow-2xl flex flex-col w-full relative">
          <div className="absolute top-0 left-4 w-12 h-[2px] bg-[#0bc6e3] rounded-full"></div>
          <h3 className="mb-6 text-base lg:text-lg font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp className="text-[#0bc6e3] shrink-0 drop-shadow-[0_0_8px_rgba(11,198,227,0.5)]" size={20} /> 
            Actividad de la Grieta
          </h3>
          <div className="flex-1 min-h-[250px] lg:min-h-[280px] w-full">
            {data.weeklyData.length === 0 ? (
               <div className="h-full flex items-center justify-center text-[#a0aec0] italic text-sm font-medium">Sin datos detectados en los radares</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} opacity={0.4} />
                  <XAxis dataKey="dia" stroke="#718096" tick={{ fill: '#a0aec0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#718096" allowDecimals={false} tick={{ fill: '#a0aec0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                  <RechartsTooltip cursor={{fill: 'rgba(11,198,227,0.05)'}} contentStyle={{ backgroundColor: 'rgba(10,10,12,0.95)', borderColor: '#0bc6e3', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', backdropFilter: 'blur(4px)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }} />
                  <Bar dataKey="partidas" fill="#0bc6e3" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-[#121418]/80 backdrop-blur-md p-4 lg:p-6 shadow-2xl flex flex-col w-full relative">
          <div className="absolute top-0 left-4 w-12 h-[2px] bg-[#c8aa6e] rounded-full"></div>
          <h3 className="mb-6 text-base lg:text-lg font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <Medal className="text-[#c8aa6e] shrink-0 drop-shadow-[0_0_8px_rgba(200,170,110,0.5)]" size={20} /> 
            Top Equipos (Victorias)
          </h3>
          <div className="flex-1 min-h-[250px] lg:min-h-[280px] w-full">
            {data.topTeamsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#a0aec0] italic text-sm font-medium">Buscando leyendas... sin victorias registradas</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topTeamsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} opacity={0.4} />
                  <XAxis dataKey="nombre" stroke="#718096" tick={{ fill: '#a0aec0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#718096" allowDecimals={false} tick={{ fill: '#a0aec0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                  <RechartsTooltip cursor={{fill: 'rgba(200,170,110,0.05)'}} contentStyle={{ backgroundColor: 'rgba(10,10,12,0.95)', borderColor: '#c8aa6e', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', backdropFilter: 'blur(4px)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }} />
                  <Bar dataKey="victorias" fill="#c8aa6e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-xl border border-gray-800 bg-[#121418]/80 backdrop-blur-md p-4 lg:p-6 shadow-xl flex flex-col w-full relative group">
          <div className="absolute top-0 left-4 w-8 h-[2px] bg-[#a855f7] rounded-full transition-all group-hover:w-16 duration-300"></div>
          <h3 className="text-base lg:text-lg font-black text-white flex items-center gap-2 mb-6 uppercase tracking-wide">
            <Users className="text-[#a855f7] shrink-0" size={20} /> Distribución de Ligas
          </h3>
          <div className="flex-1 min-h-[220px] w-full">
            {data.eloData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">Sin datos</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.eloData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="liga" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a0aec0', fontSize: 11, fontWeight: 600 }} width={70} />
                  <RechartsTooltip cursor={{fill: 'rgba(168,85,247,0.05)'}} contentStyle={{ backgroundColor: 'rgba(10,10,12,0.95)', borderColor: '#a855f7', fontSize: '12px', fontWeight: 'bold', borderRadius: '8px' }} />
                  <Bar dataKey="cantidad" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-span-1 rounded-xl border border-gray-800 bg-[#121418]/80 backdrop-blur-md p-4 lg:p-6 shadow-xl flex flex-col justify-between w-full relative group">
          <div className="absolute top-0 left-4 w-8 h-[2px] bg-[#0bc6e3] rounded-full transition-all group-hover:w-16 duration-300"></div>
          <h3 className="mb-2 text-base lg:text-lg font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <Trophy className="text-[#0bc6e3] shrink-0" size={20} /> Estatus Torneos
          </h3>
          <div className="h-[180px] w-full flex items-center justify-center mt-2">
            {data.pieData.length === 0 ? (
              <p className="text-gray-500 italic text-sm">Vacío</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pieData} innerRadius={55} outerRadius={75} paddingAngle={6} dataKey="value" stroke="none">
                    {data.pieData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 5px ${entry.color}50)` }} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(10,10,12,0.95)', borderColor: '#0bc6e3', fontSize: '12px', borderRadius: '8px', fontWeight: 'bold', border: '1px solid rgba(11,198,227,0.3)' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-2 mt-4 relative z-10">
            {data.pieData.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-xs lg:text-sm p-2.5 rounded-lg bg-[#0a0a0c]/60 border border-gray-800/80 hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}></span>
                  <span className="text-gray-300 font-medium truncate">{item.name}</span>
                </div>
                <span className="font-black text-white bg-gray-800 px-2 py-0.5 rounded">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 rounded-xl border border-gray-800 bg-[#121418]/80 backdrop-blur-md p-4 lg:p-6 shadow-xl flex flex-col w-full relative">
          <div className="absolute top-0 left-4 w-8 h-[2px] bg-[#10b981] rounded-full"></div>
          <div className="flex justify-between items-center pb-4 mb-2">
            <h3 className="text-base lg:text-lg font-black text-white flex items-center gap-2 uppercase tracking-wide">
              <Gift className="text-[#10b981] shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" size={20} /> Últimos Canjes
            </h3>
            <button onClick={() => navigate('/rewards')} className="text-xs font-bold text-[#0bc6e3] hover:text-white hover:underline whitespace-nowrap ml-2 transition-colors">Ver Tienda</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {data.recentRewards.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 italic text-sm font-medium">Arca de artesanía vacía.</div>
            ) : (
              data.recentRewards.map((reward: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-[#0a0a0c]/60 p-3 lg:p-3.5 rounded-lg border border-gray-800 hover:border-[#10b981]/40 hover:bg-[#10b981]/5 transition-all duration-300 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-[#10b981]/10 p-2 rounded-lg border border-[#10b981]/30 shrink-0 group-hover:scale-110 transition-transform"><Gift size={16} className="text-[#10b981]" /></div>
                    <div className="overflow-hidden">
                      <p className="text-xs lg:text-sm font-black text-white truncate">{reward.nickname}</p>
                      <p className="text-[10px] lg:text-[11px] font-medium text-[#a0aec0] truncate max-w-[120px] sm:max-w-[150px]">{reward.nombre_recompensa}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-[11px] lg:text-xs font-black text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded border border-[#ef4444]/20 flex items-center gap-1 justify-end">
                      -{reward.cantidad_puntos} <Star size={10} className="fill-[#ef4444]" />
                    </span>
                    <p className="text-[9px] lg:text-[10px] font-bold text-gray-500 mt-1.5">{new Date(reward.fecha_movimiento).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TABLA: ÚLTIMAS PARTIDAS - Glassmorphism Table */}
      <div className="rounded-xl border border-gray-800 bg-[#121418]/80 backdrop-blur-md shadow-2xl overflow-hidden mt-8 w-full relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-50"></div>
        <div className="p-5 lg:p-6 border-b border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0a0c]/50">
          <h3 className="text-lg lg:text-xl font-black text-white flex items-center gap-2 uppercase tracking-wider">
            <Swords className="text-[#ef4444] shrink-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" size={24} /> Historial de la Grieta
          </h3>
          <button onClick={() => navigate('/tournaments')} className="group text-xs font-bold text-white hover:text-white border border-[#ef4444]/40 px-4 py-2 rounded bg-gradient-to-b from-[#ef4444]/20 to-transparent hover:from-[#ef4444]/30 hover:border-[#ef4444] transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.1)] self-start sm:self-auto whitespace-nowrap">
            Ver Registro en Torneos
          </button>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[600px] border-collapse">
            <thead className="bg-[#0a0a0c] text-[#a0aec0] text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-5 lg:px-6 py-4 border-b border-gray-800">Fecha y Hora</th>
                <th className="px-5 lg:px-6 py-4 text-right text-[#0bc6e3] border-b border-gray-800">Lado Océano</th>
                <th className="px-5 lg:px-6 py-4 text-center border-b border-gray-800">Enfrentamiento</th>
                <th className="px-5 lg:px-6 py-4 text-[#ef4444] border-b border-gray-800">Lado Infernal</th>
                <th className="px-5 lg:px-6 py-4 border-b border-gray-800">Resolución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium">
              {data.latestMatchesList.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500 font-bold tracking-wide text-sm bg-[#0a0a0c]/40">Mundo en paz. Aún no se derrama primera sangre.</td></tr>
              ) : (
                data.latestMatchesList.map((m: any) => (
                  <tr key={m.id_partida} className="hover:bg-gray-800/40 transition-colors duration-200 cursor-pointer group">
                    <td className="px-5 lg:px-6 py-4.5 text-gray-400 whitespace-nowrap text-xs lg:text-sm">
                      <div className="flex items-center gap-2"><Clock size={14} className="text-gray-500 shrink-0 group-hover:text-white transition-colors"/> {new Date(m.fecha_partida).toLocaleString()}</div>
                    </td>
                    <td className={`px-5 lg:px-6 py-4.5 text-right font-black text-sm lg:text-base whitespace-nowrap ${m.ganador === m.equipo_azul ? 'text-white drop-shadow-[0_0_8px_rgba(11,198,227,0.4)]' : 'text-gray-500'}`}>{m.equipo_azul}</td>
                    <td className="px-5 lg:px-6 py-4.5 text-center font-black text-gray-700 text-xs lg:text-sm tracking-widest">VS</td>
                    <td className={`px-5 lg:px-6 py-4.5 font-black text-sm lg:text-base whitespace-nowrap ${m.ganador === m.equipo_rojo ? 'text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-gray-500'}`}>{m.equipo_rojo}</td>
                    <td className="px-5 lg:px-6 py-4.5 whitespace-nowrap">
                      {m.ganador ? 
                        <span className="px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] rounded border border-[#10b981]/30 text-[10px] lg:text-xs font-black shadow-[0_0_10px_rgba(16,185,129,0.15)] uppercase tracking-wider">
                          VICTORIA {m.ganador}
                        </span> 
                        : 
                        <span className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded text-[10px] lg:text-xs border border-gray-700 font-bold uppercase tracking-wider">
                          En Progreso
                        </span>
                      }
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