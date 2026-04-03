import { useEffect, useState } from 'react';
import { Trophy, Star, Medal } from 'lucide-react';
import { api } from '../../../shared/services/api';

export default function HallOfFameView() {
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data } = await api.get('/matches/ranking'); // Ajusta según tu ruta backend
      setRanking(data);
    };
    fetchRanking();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-ls-gold uppercase">Salón de la Fama</h1>
        <p className="text-ls-primary font-medium tracking-widest uppercase text-sm">Los mejores invocadores de la temporada</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="overflow-hidden rounded-xl border border-ls-gold/30 bg-ls-surface shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-ls-gold/10 text-ls-gold uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Rango</th>
                <th className="px-6 py-4">Invocador</th>
                <th className="px-6 py-4 text-center">K / D / A</th>
                <th className="px-6 py-4 text-center">Elo</th>
                <th className="px-6 py-4 text-right">Puntos Totales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ranking.map((player, index) => (
                <tr key={player.id_usuario} className={`transition hover:bg-ls-primary/5 ${index < 3 ? 'bg-ls-gold/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="text-ls-gold" size={20} />}
                      {index === 1 && <Medal className="text-gray-300" size={20} />}
                      {index === 2 && <Medal className="text-orange-500" size={20} />}
                      <span className={`text-xl font-black ${index < 3 ? 'text-ls-gold' : 'text-gray-500'}`}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-lg">
                    {player.nickname}
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-sm">
                    <span className="text-ls-success">{player.total_kills}</span> / 
                    <span className="text-ls-danger"> {player.total_deaths}</span> / 
                    <span className="text-ls-primary"> {player.total_assists}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="rounded bg-gray-900 px-2 py-1 text-xs font-bold border border-gray-700">{player.elo}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-2xl font-black text-ls-gold">
                      {player.puntos_totales}
                      <Star size={18} fill="currentColor" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-xs uppercase tracking-widest italic">
        * Las estadísticas se actualizan al finalizar cada partida oficial *
      </div>
    </div>
  );
}