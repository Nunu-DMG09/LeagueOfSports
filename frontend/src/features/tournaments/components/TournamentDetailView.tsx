import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Swords, PlayCircle } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTournamentDetail } from '../hooks/useTournamentDetail';

export default function TournamentDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { canManageTournaments } = useAuth();

  const { 
    tournament, registeredTeams, allTeams, matches, loading,
    selectedTeam, setSelectedTeam, newMatch, setNewMatch,
    handleRegisterTeam, handleCreateMatch
  } = useTournamentDetail(Number(id));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-ls-primary animate-pulse">Cargando información del torneo...</div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-20 text-ls-danger">
        <p className="text-2xl font-bold mb-4">Error: El torneo no existe</p>
        <button onClick={() => navigate('/tournaments')} className="rounded bg-ls-bg border border-ls-danger px-6 py-2 text-white hover:bg-ls-danger/20 transition">
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-ls-gold/20 pb-4">
        <button onClick={() => navigate('/tournaments')} className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-ls-gold uppercase tracking-wider">{tournament.nombre}</h1>
          <p className="text-sm text-gray-400">Modalidad: <span className="text-ls-primary">{tournament.modalidad}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* COLUMNA IZQUIERDA: Equipos y Partidas */}
        {/* Si no puede gestionar, esta columna ocupa el ancho completo */}
        <div className={canManageTournaments ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          
          {/* SECCIÓN PARTIDAS (Solo la ven quienes pueden gestionarlo) */}
          {canManageTournaments && (
            <div className="rounded-lg border border-ls-gold/10 bg-ls-surface p-6 shadow-lg">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white mb-4">
                <Swords className="text-ls-primary" /> Cronograma de Partidas
              </h2>
              <div className="space-y-3">
                {matches.length === 0 ? (
                  <p className="text-gray-500 italic">No hay partidas programadas.</p>
                ) : (
                  matches.map(m => (
                    <div key={m.id_partida} className="flex items-center justify-between rounded border border-gray-700 bg-ls-bg p-4">
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex-1 text-right font-bold text-blue-400">{m.equipo_azul_nombre}</div>
                        <div className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 font-black">VS</div>
                        <div className="flex-1 text-left font-bold text-red-400">{m.equipo_rojo_nombre}</div>
                      </div>
                      <div className="ml-6 flex-shrink-0">
                        {m.id_equipo_ganador ? (
                          <span className="text-xs font-bold text-ls-success uppercase px-2 py-1 bg-ls-success/10 rounded">Finalizado</span>
                        ) : (
                          <button 
                            onClick={() => navigate(`/matches/${m.id_partida}/manage`)}
                            className="flex items-center gap-2 text-xs font-bold text-ls-bg bg-ls-primary hover:bg-ls-primary-hover px-3 py-2 rounded transition"
                          >
                            <PlayCircle size={16} /> Jugar / Stats
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN EQUIPOS PARTICIPANTES (Visible para todos) */}
          <div className="rounded-lg border border-ls-gold/10 bg-ls-surface p-6 shadow-lg">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white mb-4">
              <Shield className="text-ls-gold" /> Equipos Participantes
            </h2>
            <div className={`grid grid-cols-1 gap-3 ${canManageTournaments ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
              {registeredTeams.map(t => (
                <div key={t.id_equipo} className="flex items-center gap-4 rounded border border-gray-700 bg-ls-bg p-3 hover:border-ls-primary/50 transition">
                  <div className="flex h-12 w-12 items-center justify-center bg-gray-800 rounded p-1">
                    <img 
                      src={t.logo_url || 'https://cdn-icons-png.flaticon.com/512/814/814513.png'} 
                      className="h-full w-full object-contain filter drop-shadow-md" 
                      alt={t.nombre}
                      onError={(e) => { e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/814/814513.png'; }}
                    />
                  </div>
                  <span className="font-bold text-white text-lg">{t.nombre}</span>
                </div>
              ))}
              
              {registeredTeams.length === 0 && (
                <p className="text-gray-500 italic col-span-full">Aún no hay equipos inscritos en este torneo.</p>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formularios de Gestión (Solo visibles para Admins/SuperAdmin) */}
        {canManageTournaments && (
          <div className="space-y-6">
            
            {/* Formulario Inscribir Equipo */}
            <div className="rounded-lg border border-ls-gold/20 bg-ls-surface p-6 shadow-xl">
              <h3 className="mb-4 font-bold text-white uppercase border-b border-gray-700 pb-2">Inscribir Equipo</h3>
              <select 
                className="w-full rounded bg-ls-bg border border-gray-700 p-2 text-white outline-none focus:border-ls-primary"
                value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}
              >
                <option value="">-- Seleccionar Equipo --</option>
                {allTeams.map(t => (
                  <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>
                ))}
              </select>
              <button 
                onClick={handleRegisterTeam}
                disabled={!selectedTeam}
                className={`mt-4 w-full rounded py-2 font-bold transition-all ${
                  selectedTeam ? 'bg-ls-gold text-ls-bg hover:bg-ls-gold-hover' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Añadir al Torneo
              </button>
            </div>

            {/* Formulario Crear Partida */}
            <div className="rounded-lg border border-ls-primary/30 bg-ls-surface p-6 shadow-xl">
              <h3 className="mb-4 font-bold text-white uppercase border-b border-gray-700 pb-2">Generar Partida</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-blue-400 font-bold mb-1 block">Lado Azul</label>
                  <select 
                    className="w-full rounded bg-ls-bg border border-blue-900/50 p-2 text-white focus:border-blue-500 outline-none"
                    value={newMatch.equipo_azul} onChange={e => setNewMatch({...newMatch, equipo_azul: e.target.value})}
                  >
                    <option value="">-- Equipo Azul --</option>
                    {registeredTeams.map(t => <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-red-400 font-bold mb-1 block">Lado Rojo</label>
                  <select 
                    className="w-full rounded bg-ls-bg border border-red-900/50 p-2 text-white focus:border-red-500 outline-none"
                    value={newMatch.equipo_rojo} onChange={e => setNewMatch({...newMatch, equipo_rojo: e.target.value})}
                  >
                    <option value="">-- Equipo Rojo --</option>
                    {registeredTeams.map(t => <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
                  </select>
                </div>
                <button 
                  onClick={handleCreateMatch} 
                  disabled={!newMatch.equipo_azul || !newMatch.equipo_rojo}
                  className="w-full rounded py-2 font-bold bg-ls-primary text-ls-bg hover:bg-ls-primary-hover transition disabled:opacity-50 mt-2"
                >
                  Programar VS
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}