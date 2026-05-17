import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Users, ChevronRight } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';

export default function TournamentsList() {
  const navigate = useNavigate();
  const { tournaments, loading, canManageTournaments } = useTournaments();

  const statusStyles: any = {
    'pendiente': {
      bg: 'bg-[#c8aa6e]/10', text: 'text-[#c8aa6e]', border: 'border-[#c8aa6e]/30', shadow: 'shadow-[0_0_10px_rgba(200,170,110,0.2)]'
    },
    'en_curso': {
      bg: 'bg-[#0bc6e3]/10', text: 'text-[#0bc6e3]', border: 'border-[#0bc6e3]/30', shadow: 'shadow-[0_0_10px_rgba(11,198,227,0.2)]'
    },
    'finalizado': {
      bg: 'bg-gray-800/50', text: 'text-gray-400', border: 'border-gray-700', shadow: 'shadow-none'
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c8aa6e]/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
            <Trophy className="text-[#c8aa6e] drop-shadow-[0_0_8px_rgba(200,170,110,0.5)]" size={32} /> Torneos Activos
          </h1>
          <p className="text-xs sm:text-sm font-bold tracking-widest text-[#a0aec0] mt-2 uppercase">Gestiona las competencias y las leyendas de la liga</p>
        </div>
        {canManageTournaments && (
          <button 
            onClick={() => navigate('/tournaments/new')}
            className="group relative w-full sm:w-auto overflow-hidden rounded-lg bg-gradient-to-r from-[#c8aa6e] to-[#a88a4e] px-6 py-3 sm:py-2.5 text-sm font-black uppercase tracking-widest text-[#0a0a0c] transition-all hover:shadow-[0_0_20px_rgba(200,170,110,0.4)] hover:-translate-y-1 block"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Trophy size={16} /> Crear Competencia
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover:scale-100"></div>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="text-sm sm:text-base text-[#0bc6e3] animate-pulse font-black uppercase tracking-widest flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#0bc6e3] shadow-[0_0_10px_#0bc6e3] animate-ping"></div> Buscando torneos en los pergaminos...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {tournaments.map((t) => {
            const style = statusStyles[t.estado];
            return (
              <div key={t.id_torneo} className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-800/60 bg-[#121418]/80 backdrop-blur-md p-5 transition-all duration-300 hover:border-[#0bc6e3]/50 hover:shadow-[0_0_25px_rgba(11,198,227,0.15)] hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-[#0bc6e3]/20 to-transparent group-hover:via-[#0bc6e3] transition-colors"></div>
                
                <div className="flex items-center gap-5 pl-2">
                  <div className={`rounded-lg border p-3.5 shrink-0 ${style.bg} ${style.border} ${style.text} ${style.shadow} transition-transform group-hover:scale-110`}>
                    <Trophy size={26} className="sm:w-8 sm:h-8" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#0bc6e3] transition-colors truncate tracking-wide uppercase">
                      {t.nombre}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#a0aec0] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Calendar size={14} className="text-gray-500" /> {new Date(t.fecha_inicio).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 font-black text-[#c8aa6e] shrink-0 drop-shadow-[0_0_5px_rgba(200,170,110,0.5)]">
                        <Users size={14} /> {t.modalidad}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-4 sm:pt-0 border-t border-gray-800/60 sm:border-0 mt-2 sm:mt-0 relative z-10">
                  <span className={`rounded px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest border ${style.bg} ${style.text} ${style.border} ${style.shadow}`}>
                    {t.estado.replace('_', ' ')}
                  </span>
                  <button 
                    onClick={() => navigate(`/tournaments/${t.id_torneo}`)}
                    className="rounded-full bg-[#0a0a0c] border border-gray-700 p-2.5 text-[#a0aec0] hover:bg-[#0bc6e3] hover:text-[#0a0a0c] hover:border-[#0bc6e3] hover:shadow-[0_0_15px_rgba(11,198,227,0.4)] transition-all shrink-0 group-hover:animate-pulse"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}