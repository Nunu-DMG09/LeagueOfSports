import { useEffect, useState } from 'react';
import { Trophy, Star, Medal } from 'lucide-react';
import { api } from '../../../shared/services/api';
import { toast } from 'sonner';

export default function HallOfFameView() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const { data } = await api.get('/matches/stats/ranking');
        setRanking(data);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar el Salón de la Fama');
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-ls-gold animate-pulse text-lg sm:text-xl font-bold">Recopilando leyendas...</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter text-ls-gold uppercase drop-shadow-md">Salón de la Fama</h1>
        <p className="text-ls-primary font-medium tracking-widest uppercase text-xs sm:text-sm mt-2">Los mejores invocadores de la temporada</p>
      </div>

      {/* CONTENEDOR DE TABLA RESPONSIVO */}
      <div className="overflow-x-auto rounded-xl border border-ls-gold/30 bg-ls-surface shadow-2xl mx-1 sm:mx-0">
        <div className="min-w-[600px]">
          <table className="w-full text-left">
            <thead className="bg-ls-gold/10 text-ls-gold uppercase text-[10px] sm:text-xs font-bold tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Rango</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Invocador</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">K / D / A</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">Elo</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Puntos Totales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm sm:text-base">
              {ranking.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500 italic">El salón aguarda a sus primeras leyendas.</td></tr>
              ) : (
                ranking.map((player, index) => (
                  <tr key={player.id_usuario} className={`transition hover:bg-ls-primary/10 ${index < 3 ? 'bg-ls-gold/5' : ''}`}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="shrink-0 w-6 flex justify-center">
                          {index === 0 && <Trophy className="text-ls-gold" size={20} />}
                          {index === 1 && <Medal className="text-gray-300" size={20} />}
                          {index === 2 && <Medal className="text-orange-500" size={20} />}
                        </div>
                        <span className={`text-lg sm:text-xl font-black ${index < 3 ? 'text-ls-gold' : 'text-gray-500 pl-1'}`}>
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-white text-base sm:text-lg">
                      {player.nickname}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center font-mono text-xs sm:text-sm">
                      <span className="text-ls-success font-bold">{player.total_kills}</span> / 
                      <span className="text-ls-danger font-bold"> {player.total_deaths}</span> / 
                      <span className="text-ls-primary font-bold"> {player.total_assists}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="rounded bg-gray-900 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold border border-gray-700 uppercase tracking-wider">{player.elo}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-xl sm:text-2xl font-black text-ls-gold">
                        {player.puntos_totales}
                        <Star size={18} fill="currentColor" className="sm:w-[20px] sm:h-[20px] mb-0.5" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest italic px-4">
        * Las estadísticas se actualizan al finalizar cada partida oficial *
      </div>
    </div>
  );
}