import { useEffect, useState } from 'react';
import { Trophy, Star, Medal, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../../shared/services/api';
import { toast } from 'sonner';

export default function HallOfFameView() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const { data } = await api.get('/matches/stats/ranking');
        setRanking(data);
      } catch (error) { toast.error('Error al cargar el Salón de la Fama'); } 
      finally { setLoading(false); }
    };
    fetchRanking();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ranking.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ranking.length / itemsPerPage);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-sm sm:text-base text-[#c8aa6e] animate-pulse font-black uppercase tracking-widest flex flex-col items-center gap-4">
        <Trophy size={48} className="animate-bounce drop-shadow-[0_0_15px_rgba(200,170,110,0.8)]" />
        Desempolvando Pergaminos Antiguos...
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-10 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c8aa6e]/10 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER DE SALÓN DE LA FAMA */}
      <div className="text-center px-4 py-6 sm:py-8 relative group">
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-48 h-48 bg-[#c8aa6e]/20 blur-[60px] -z-10 rounded-full"></div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-[#f0e6d2] via-[#c8aa6e] to-[#6b5830] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(200,170,110,0.4)]">
          Salón de la Meta
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="w-12 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-[#c8aa6e]/50"></div>
          <p className="text-[#0bc6e3] font-bold tracking-[0.3em] uppercase text-[10px] sm:text-[11px] drop-shadow-[0_0_5px_rgba(11,198,227,0.5)]">Las máximas leyendas del reino</p>
          <div className="w-12 sm:w-24 h-[1px] bg-gradient-to-l from-transparent to-[#c8aa6e]/50"></div>
        </div>
      </div>

      {/* TABLA ESTILO HEX TECH GOLD */}
      <div className="overflow-x-auto rounded-xl border border-[#c8aa6e]/30 bg-[#121418]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] mx-1 sm:mx-0 relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent opacity-70"></div>
        
        <div className="min-w-[700px]">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a0c]/80 text-[#c8aa6e] uppercase text-[10px] sm:text-[11px] font-black tracking-widest border-b border-[#c8aa6e]/20">
              <tr>
                <th className="px-5 sm:px-6 py-4 lg:py-5">Rango</th>
                <th className="px-5 sm:px-6 py-4 lg:py-5">Invocador</th>
                <th className="px-5 sm:px-6 py-4 lg:py-5 text-center bg-[#0a0a0c]/40 text-[#a0aec0]">K / D / A</th>
                <th className="px-5 sm:px-6 py-4 lg:py-5 text-center">Clasificatoria</th>
                <th className="px-5 sm:px-6 py-4 lg:py-5 text-right">Esencia (Pts)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm sm:text-base">
              {ranking.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-[#a0aec0] font-bold uppercase tracking-widest text-xs italic bg-[#0a0a0c]/20">El panteón está vacío.</td></tr>
              ) : (
                currentItems.map((player, index) => {
                  const globalIndex = indexOfFirstItem + index;
                  const isTop1 = globalIndex === 0;
                  const isTop2 = globalIndex === 1;
                  const isTop3 = globalIndex === 2;

                  return (
                    <tr key={player.id_usuario} className={`transition-all duration-300 hover:bg-[#0a0a0c]/80 group relative ${globalIndex < 3 ? 'bg-gradient-to-r from-[#c8aa6e]/10 to-transparent' : ''}`}>
                      <td className="px-5 sm:px-6 py-4 lg:py-5 relative">
                        {isTop1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c8aa6e] shadow-[0_0_10px_#c8aa6e]"></div>}
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border ${
                            isTop1 ? 'bg-[#c8aa6e]/20 border-[#c8aa6e] text-[#c8aa6e] shadow-[0_0_15px_rgba(200,170,110,0.4)]' : 
                            isTop2 ? 'bg-gray-300/10 border-gray-400 text-gray-300' :
                            isTop3 ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-gray-900 border-gray-700 text-gray-500'
                          }`}>
                            {isTop1 && <Trophy size={20} />}
                            {isTop2 && <Medal size={20} />}
                            {isTop3 && <Medal size={20} />}
                            {globalIndex > 2 && <span className="font-black text-sm">#{globalIndex + 1}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 lg:py-5">
                        <span className={`font-black text-base sm:text-lg block tracking-wide group-hover:scale-[1.02] transition-transform origin-left ${
                          isTop1 ? 'text-[#c8aa6e] drop-shadow-[0_0_8px_rgba(200,170,110,0.6)] text-xl sm:text-2xl' :
                          isTop2 ? 'text-gray-200 text-lg sm:text-xl' :
                          isTop3 ? 'text-orange-300 text-base sm:text-lg' : 'text-white group-hover:text-[#0bc6e3]'
                        }`}>{player.nickname}</span>
                      </td>
                      <td className="px-5 sm:px-6 py-4 lg:py-5 text-center font-black bg-[#0a0a0c]/20 rounded-lg">
                        <div className="inline-flex gap-2.5 items-center justify-center bg-[#0a0a0c] px-4 py-1.5 rounded border border-gray-800 shadow-inner">
                          <span className="text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">{player.total_kills}</span> 
                          <span className="text-gray-600 font-normal">/</span> 
                          <span className="text-[#ef4444] drop-shadow-[0_0_5px_rgba(239,68,68,0.3)]">{player.total_deaths}</span> 
                          <span className="text-gray-600 font-normal">/</span> 
                          <span className="text-[#0bc6e3] drop-shadow-[0_0_5px_rgba(11,198,227,0.3)]">{player.total_assists}</span>
                        </div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 lg:py-5 text-center">
                        <span className={`rounded-sm bg-[#0a0a0c] border border-gray-700/50 px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-inner inline-block ${
                          isTop1 ? 'text-[#c8aa6e] border-[#c8aa6e]/30' : 'text-gray-300'
                        }`}>{player.elo}</span>
                      </td>
                      <td className="px-5 sm:px-6 py-4 lg:py-5 text-right">
                        <div className="inline-flex items-center justify-end gap-2 text-xl sm:text-2xl lg:text-3xl font-black tabular-nums">
                          <span className={isTop1 ? 'text-[#c8aa6e] drop-shadow-[0_0_10px_rgba(200,170,110,0.8)]' : 'text-white group-hover:text-[#c8aa6e] transition-colors'}>
                            {player.puntos_totales}
                          </span>
                          <Star size={isTop1 ? 26 : 20} className={`${isTop1 ? 'fill-[#c8aa6e] text-[#c8aa6e] drop-shadow-[0_0_8px_rgba(200,170,110,0.5)]' : 'fill-gray-600 text-gray-600 group-hover:fill-[#c8aa6e] group-hover:text-[#c8aa6e] transition-colors'} mb-1`} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-[#a0aec0] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold py-2">
        <span className="text-[#0bc6e3] mx-2">✦</span> La esencia se canaliza tras la caída de cada nexo <span className="text-[#0bc6e3] mx-2">✦</span>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="group p-2.5 rounded border border-gray-700 bg-[#121418] text-gray-400 disabled:opacity-30 hover:border-[#c8aa6e] hover:text-[#c8aa6e] hover:shadow-[0_0_10px_rgba(200,170,110,0.2)] transition-all">
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <span className="text-[#a0aec0] font-black uppercase tracking-widest text-[11px] sm:text-xs">
            Tomos <span className="text-[#c8aa6e] mx-1 text-sm">{currentPage}</span> / {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="group p-2.5 rounded border border-gray-700 bg-[#121418] text-gray-400 disabled:opacity-30 hover:border-[#c8aa6e] hover:text-[#c8aa6e] hover:shadow-[0_0_10px_rgba(200,170,110,0.2)] transition-all">
            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}