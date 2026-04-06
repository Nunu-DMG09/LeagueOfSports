import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';

export default function TeamsList() {
  const navigate = useNavigate();
  const { teams, loading, canManageTeams } = useTeams();

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER RESPONSIVO: Se apila en móvil, se alinea en PC */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-tight">Equipos Competitivos</h1>
        
        {/* Validamos el permiso para ocultar el botón */}
        {canManageTeams && (
          <button 
            onClick={() => navigate('/teams/new')}
            className="w-full sm:w-auto rounded-lg bg-ls-primary px-5 py-3 sm:py-2.5 text-sm font-bold text-ls-bg transition hover:bg-ls-primary-hover shadow-lg shadow-ls-primary/20"
          >
            + Registrar Equipo
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10 sm:py-20 animate-pulse text-sm sm:text-base">Cargando escuadras...</div>
      ) : teams.length === 0 ? (
        <div className="text-center text-gray-400 py-10 sm:py-16 border border-ls-gold/20 rounded-xl bg-ls-surface shadow-lg text-sm sm:text-base mx-4 sm:mx-0">
          No hay equipos fundados aún. ¡Crea el primero!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <div 
              key={team.id_equipo} 
              className="group relative overflow-hidden rounded-xl border border-ls-gold/20 bg-ls-surface transition-all hover:border-ls-primary hover:shadow-lg hover:shadow-ls-primary/20 flex flex-col"
            >
              <div className="flex h-28 sm:h-32 items-center justify-center bg-gradient-to-b from-gray-800 to-ls-surface p-4 shrink-0">
                {team.logo_url ? (
                  <img src={team.logo_url} alt={team.nombre} className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-lg transition-transform group-hover:scale-110" />
                ) : (
                  <Shield size={56} className="text-ls-gold opacity-50 transition-transform group-hover:scale-110 group-hover:opacity-100 sm:w-[64px] sm:h-[64px]" />
                )}
              </div>
              <div className="border-t border-ls-gold/10 p-4 text-center flex-1 flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-bold text-white truncate px-2" title={team.nombre}>{team.nombre}</h3>
                <div className="mt-2">
                  <span className={`inline-block rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    team.estado === 'activo' ? 'bg-ls-success/10 text-ls-success' : 'bg-ls-danger/10 text-ls-danger'
                  }`}>
                    {team.estado}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/teams/${team.id_equipo}`)}
                className="w-full bg-ls-bg/50 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-gray-400 transition-colors hover:bg-ls-primary hover:text-ls-bg uppercase tracking-widest mt-auto shrink-0"
              >
                Ver Miembros
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}