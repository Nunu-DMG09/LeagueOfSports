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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Torneos Activos</h1>
          <p className="text-sm text-gray-400">Gestiona las competencias y enfrentamientos de la liga.</p>
        </div>
        {/* Solo Admins y SuperAdmins pueden ver este botón */}
        {canManageTournaments && (
          <button 
            onClick={() => navigate('/tournaments/new')}
            className="rounded bg-ls-gold px-4 py-2 text-sm font-bold text-ls-bg transition hover:bg-ls-gold-hover"
          >
            + Crear Competencia
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Buscando torneos en la Grieta...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {tournaments.map((t) => (
            <div key={t.id_torneo} className="group flex items-center justify-between rounded-lg border border-ls-gold/10 bg-ls-surface p-5 transition-all hover:border-ls-primary/40">
              <div className="flex items-center gap-5">
                <div className={`rounded-lg border p-3 ${statusStyles[t.estado]}`}>
                  <Trophy size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-ls-primary transition-colors">
                    {t.nombre}
                  </h3>
                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {new Date(t.fecha_inicio).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-ls-gold">
                      <Users size={14} /> {t.modalidad}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`hidden rounded-full border px-3 py-1 text-[10px] font-bold uppercase sm:block ${statusStyles[t.estado]}`}>
                  {t.estado.replace('_', ' ')}
                </span>
                <button 
                  onClick={() => navigate(`/tournaments/${t.id_torneo}`)}
                  className="rounded-full bg-ls-bg p-2 text-gray-400 hover:bg-ls-primary hover:text-ls-bg transition-all"
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