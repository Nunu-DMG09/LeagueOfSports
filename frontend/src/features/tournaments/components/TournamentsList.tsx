import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Users, ChevronRight } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';

export default function TournamentsList() {
  const navigate = useNavigate();
  const { tournaments, loading, canManageTournaments } = useTournaments();

  const statusStyles: any = {
    'pendiente': 'bg-ls-gold/10 text-ls-gold border-ls-gold/20',
    'en_curso': 'bg-ls-primary/10 text-ls-primary border-ls-primary/20',
    'finalizado': 'bg-gray-800 text-gray-400 border-gray-700'
  };

  return (
    <div className="space-y-6">
      {/* HEADER RESPONSIVO: Se apila en móvil, en línea en PC */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">Torneos Activos</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Gestiona las competencias y enfrentamientos de la liga.</p>
        </div>
        {canManageTournaments && (
          <button 
            onClick={() => navigate('/tournaments/new')}
            className="w-full sm:w-auto rounded bg-ls-gold px-5 py-2.5 sm:py-2 text-sm font-bold text-ls-bg transition hover:bg-ls-gold-hover shadow-lg shadow-ls-gold/20"
          >
            + Crear Competencia
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse text-sm sm:text-base">Buscando torneos en la Grieta...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {tournaments.map((t) => (
            <div key={t.id_torneo} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-ls-gold/10 bg-ls-surface p-4 sm:p-5 transition-all hover:border-ls-primary/40 hover:shadow-lg hover:shadow-ls-primary/10">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg border p-3 shrink-0 ${statusStyles[t.estado]}`}>
                  <Trophy size={24} className="sm:w-7 sm:h-7" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-ls-primary transition-colors truncate">
                    {t.nombre}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar size={14} /> {new Date(t.fecha_inicio).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-ls-gold shrink-0">
                      <Users size={14} /> {t.modalidad}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-gray-800 sm:border-0 mt-2 sm:mt-0">
                <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${statusStyles[t.estado]}`}>
                  {t.estado.replace('_', ' ')}
                </span>
                <button 
                  onClick={() => navigate(`/tournaments/${t.id_torneo}`)}
                  className="rounded-full bg-ls-bg p-2 text-gray-400 hover:bg-ls-primary hover:text-ls-bg transition-all shrink-0"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}