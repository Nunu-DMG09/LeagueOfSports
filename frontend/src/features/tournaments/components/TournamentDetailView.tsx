import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Shield } from 'lucide-react';
import { tournamentService } from '../services/tournament.service';
import { teamService } from '../../teams/services/team.service';

export default function TournamentDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<any>(null);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  
  // 1. AÑADIDO: El estado de carga que faltaba
  const [loading, setLoading] = useState(true); 

  const loadData = async () => {
    try {
      const tournamentData = await tournamentService.getById(Number(id));
      setTournament(tournamentData);

      const teamsIn = await tournamentService.getRegisteredTeams(Number(id));
      setRegisteredTeams(teamsIn);

      const teamsAll = await teamService.getAll();
      setAllTeams(teamsAll);
    } catch (error) {
      console.error(error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, [id]);

  const handleRegister = async () => {
    if (!selectedTeam) return;
    try {
      await tournamentService.registerTeam(Number(id), Number(selectedTeam));
      toast.success('Equipo inscrito correctamente');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al inscribir');
    }
  };

  // 2. AÑADIDO: Interfaz de carga para que no salga pantalla negra
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-ls-primary animate-pulse">Cargando información del torneo...</div>
      </div>
    );
  }

  // 3. AÑADIDO: Interfaz de error si el torneo no existe en lugar de "return null"
  if (!tournament) {
    return (
      <div className="text-center py-20 text-ls-danger">
        <p className="text-2xl font-bold mb-4">Error: El torneo no existe</p>
        <button 
          onClick={() => navigate('/tournaments')} 
          className="rounded bg-ls-bg border border-ls-danger px-6 py-2 text-white hover:bg-ls-danger/20 transition"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tournaments')} className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-ls-gold uppercase tracking-wider">{tournament.nombre}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lista de Inscritos */}
        <div className="lg:col-span-2 space-y-4 rounded-lg border border-ls-gold/10 bg-ls-surface p-6 shadow-lg">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Shield className="text-ls-primary" /> Equipos Participantes
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-4">
            {registeredTeams.length === 0 ? (
              <p className="text-gray-500 italic col-span-2">Aún no hay equipos inscritos en este torneo.</p>
            ) : (
              registeredTeams.map(t => (
                <div key={t.id_equipo} className="flex items-center gap-4 rounded border border-gray-700 bg-ls-bg p-3 hover:border-ls-primary/50 transition">
                  <div className="flex h-12 w-12 items-center justify-center bg-gray-800 rounded p-1">
                    {/* Si no hay logo, muestra un escudo genérico. Usamos onError por si la URL del logo está rota */}
                    <img 
                      src={t.logo_url || 'https://cdn-icons-png.flaticon.com/512/814/814513.png'} 
                      className="h-full w-full object-contain filter drop-shadow-md" 
                      alt={t.nombre}
                      onError={(e) => { e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/814/814513.png'; }}
                    />
                  </div>
                  <span className="font-bold text-white text-lg">{t.nombre}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel de Inscripción */}
        <div className="rounded-lg border border-ls-gold/20 bg-ls-surface p-6 h-fit shadow-xl">
          <h3 className="mb-4 font-bold text-white uppercase tracking-wide border-b border-gray-700 pb-2">Inscribir Equipo</h3>
          <select 
            className="w-full rounded bg-ls-bg border border-gray-700 p-3 text-white outline-none focus:border-ls-primary focus:ring-1 focus:ring-ls-primary transition"
            value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}
          >
            <option value="">-- Seleccionar Equipo --</option>
            {allTeams.map(t => (
              <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>
            ))}
          </select>
          <button 
            onClick={handleRegister}
            disabled={!selectedTeam}
            className={`mt-6 w-full rounded py-3 font-bold transition-all ${
              selectedTeam 
                ? 'bg-ls-primary text-ls-bg hover:bg-ls-primary-hover shadow-[0_0_15px_rgba(11,198,227,0.4)]' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirmar Inscripción
          </button>
        </div>
      </div>
    </div>
  );
}