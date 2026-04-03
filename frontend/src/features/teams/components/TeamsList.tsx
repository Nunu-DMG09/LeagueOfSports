import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { teamService } from '../services/team.service';

interface Team {
  id_equipo: number;
  nombre: string;
  logo_url: string;
  estado: string;
  fecha_creacion: string;
}

export default function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamService.getAll();
        setTeams(data);
      } catch (error) {
        toast.error('Error al cargar los equipos');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Equipos Competitivos</h1>
        <button 
          onClick={() => navigate('/teams/new')}
          className="rounded bg-ls-primary px-4 py-2 text-sm font-bold text-ls-bg transition hover:bg-ls-primary-hover"
        >
          + Fundar Equipo
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">Cargando equipos...</div>
      ) : teams.length === 0 ? (
        <div className="text-center text-gray-400 py-10 border border-ls-gold/20 rounded-lg bg-ls-surface">
          No hay equipos fundados aún. ¡Crea el primero!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <div 
              key={team.id_equipo} 
              className="group relative overflow-hidden rounded-lg border border-ls-gold/20 bg-ls-surface transition-all hover:border-ls-primary hover:shadow-lg hover:shadow-ls-primary/20"
            >
              <div className="flex h-32 items-center justify-center bg-gradient-to-b from-gray-800 to-ls-surface p-4">
                {team.logo_url ? (
                  <img src={team.logo_url} alt={team.nombre} className="h-20 w-20 object-contain drop-shadow-lg transition-transform group-hover:scale-110" />
                ) : (
                  <Shield size={64} className="text-ls-gold opacity-50 transition-transform group-hover:scale-110 group-hover:opacity-100" />
                )}
              </div>
              <div className="border-t border-ls-gold/10 p-4 text-center">
                <h3 className="text-lg font-bold text-white">{team.nombre}</h3>
                <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                  team.estado === 'activo' ? 'bg-ls-success/10 text-ls-success' : 'bg-ls-danger/10 text-ls-danger'
                }`}>
                  {team.estado.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => navigate(`/teams/${team.id_equipo}`)}
                className="w-full bg-ls-bg/50 py-3 text-sm font-bold text-gray-400 transition-colors hover:bg-ls-primary hover:text-ls-bg"
              >
                Ver Roster
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}