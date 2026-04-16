import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Swords, PlayCircle, Trash2, X, Users, User } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTournamentDetail } from '../hooks/useTournamentDetail';

export default function TournamentDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { canManageTournaments } = useAuth();
  const { 
    tournament, registeredTeams, allTeams, matches, loading,
    selectedTeam, setSelectedTeam, newMatch, setNewMatch,
    handleRegisterTeam, handleCreateMatch,
    handleRemoveTeam, handleRemoveMatch,
    teamModalOpen, setTeamModalOpen, viewingTeam, viewingTeamMembers, handleViewTeamMembers
  } = useTournamentDetail(Number(id));

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="text-base sm:text-lg text-ls-primary animate-pulse">Cargando información del torneo...</div></div>;
  if (!tournament) return <div className="text-center py-20 text-ls-danger"><p className="text-xl sm:text-2xl font-bold mb-4">Error: El torneo no existe</p><button onClick={() => navigate('/tournaments')} className="rounded bg-ls-bg border border-ls-danger px-6 py-2 text-white hover:bg-ls-danger/20 transition">Volver a la lista</button></div>;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      {/* HEADER RESPONSIVO */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 border-b border-ls-gold/20 pb-4">
        <button onClick={() => navigate('/tournaments')} className="text-gray-400 hover:text-white transition mt-1 sm:mt-0 p-1">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px]" />
        </button>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-ls-gold uppercase tracking-wider">{tournament.nombre}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Modalidad: <span className="text-ls-primary font-bold">{tournament.modalidad}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={canManageTournaments ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          
          {canManageTournaments && (
            <div className="rounded-xl border border-ls-gold/10 bg-ls-surface p-4 sm:p-6 shadow-lg">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white mb-4"><Swords className="text-ls-primary" size={20}/> Cronograma de Partidas</h2>
              <div className="space-y-3">
                {matches.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">No hay partidas programadas.</p>
                ) : (
                  matches.map(m => (
                    <div key={m.id_partida} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-4 gap-3 sm:gap-4 hover:border-gray-500 transition-all">
                      <div className="flex items-center gap-2 sm:gap-4 w-full">
                        <div className="flex-1 text-right font-bold text-blue-400 text-sm sm:text-base truncate" title={m.equipo_azul_nombre}>{m.equipo_azul_nombre}</div>
                        <div className="px-2 sm:px-3 py-1 bg-gray-800 rounded text-[10px] sm:text-xs text-gray-400 font-black shrink-0">VS</div>
                        <div className="flex-1 text-left font-bold text-red-400 text-sm sm:text-base truncate" title={m.equipo_rojo_nombre}>{m.equipo_rojo_nombre}</div>
                      </div>
                      <div className="flex justify-end shrink-0 w-full sm:w-auto border-t sm:border-0 border-gray-800 pt-2 sm:pt-0 gap-2">
                        {m.id_equipo_ganador ? (
                          <span className="text-[10px] sm:text-xs font-bold text-ls-success uppercase px-3 py-1.5 bg-ls-success/10 border border-ls-success/20 rounded shadow-sm w-full text-center sm:w-auto">Finalizado</span>
                        ) : (
                          <>
                            {/* Botón Jugar */}
                            <button onClick={() => navigate(`/matches/${m.id_partida}/manage`)} className="flex-1 sm:flex-none flex justify-center items-center gap-2 text-xs font-bold text-ls-bg bg-ls-primary hover:bg-ls-primary-hover px-4 py-2 rounded transition shadow-md shadow-ls-primary/20">
                              <PlayCircle size={16} /> Jugar
                            </button>
                            {/* Botón Eliminar Partida */}
                            <button onClick={() => handleRemoveMatch(m.id_partida)} className="flex justify-center items-center gap-2 text-xs font-bold text-white bg-red-600/90 hover:bg-red-500 px-3 py-2 rounded transition shadow-md">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-ls-gold/10 bg-ls-surface p-4 sm:p-6 shadow-lg">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white mb-4"><Shield className="text-ls-gold" size={20}/> Equipos Participantes</h2>
            <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${canManageTournaments ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'}`}>
              {registeredTeams.map(t => (
                <div 
                  key={t.id_equipo} 
                  onClick={() => handleViewTeamMembers(t)}
                  className="relative flex items-center gap-3 sm:gap-4 rounded-lg border border-gray-700 bg-ls-bg p-2.5 sm:p-3 hover:border-ls-primary/50 transition cursor-pointer group shadow-sm hover:shadow-ls-primary/10"
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden shrink-0 border border-ls-gold/20 bg-ls-surface rounded-lg">
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${t.logo_url}`} 
                      className="h-full w-full object-cover" 
                      alt={t.nombre} 
                    />
                  </div>
                  <div className="flex-1 overflow-hidden pr-6">
                    <span className="font-bold text-white text-sm sm:text-base truncate block" title={t.nombre}>{t.nombre}</span>
                    <span className="text-[10px] text-ls-primary mt-0.5 flex items-center gap-1"><Users size={10}/> Ver Miembros</span>
                  </div>
                  
                  {/* Botón Eliminar Equipo */}
                  {canManageTournaments && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveTeam(t.id_equipo); }} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      title="Expulsar equipo del torneo"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              {registeredTeams.length === 0 && <p className="text-gray-500 italic col-span-full text-sm">Aún no hay equipos inscritos.</p>}
            </div>
          </div>
        </div>

        {canManageTournaments && (
          <div className="space-y-6">
            <div className="rounded-xl border border-ls-gold/20 bg-ls-surface p-5 sm:p-6 shadow-xl">
              <h3 className="mb-4 font-bold text-white uppercase border-b border-gray-700 pb-2 text-sm sm:text-base">Inscribir Equipo</h3>
              <select className="w-full rounded-lg bg-ls-bg border border-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white outline-none focus:border-ls-primary" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                <option value="">Selecciona los equipos</option>
                {allTeams.map(t => <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
              </select>
              <button onClick={handleRegisterTeam} disabled={!selectedTeam} className={`mt-4 w-full rounded-lg py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-all shadow-lg ${selectedTeam ? 'bg-ls-gold text-ls-bg hover:bg-ls-gold-hover shadow-ls-gold/20' : 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'}`}>Añadir al Torneo</button>
            </div>

            <div className="rounded-xl border border-ls-primary/30 bg-ls-surface p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-red-500"></div>
              <h3 className="mb-4 font-bold text-white uppercase border-b border-gray-700 pb-2 text-sm sm:text-base">Generar Partida</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs text-blue-400 font-bold mb-1 block uppercase tracking-wider">Lado Azul</label>
                  <select className="w-full rounded-lg bg-ls-bg border border-blue-900/50 p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-blue-500 outline-none" value={newMatch.equipo_azul} onChange={e => setNewMatch({...newMatch, equipo_azul: e.target.value})}>
                    <option value="">Equipo Azul</option>
                    {registeredTeams.map(t => <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs text-red-400 font-bold mb-1 block uppercase tracking-wider">Lado Rojo</label>
                  <select className="w-full rounded-lg bg-ls-bg border border-red-900/50 p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-red-500 outline-none" value={newMatch.equipo_rojo} onChange={e => setNewMatch({...newMatch, equipo_rojo: e.target.value})}>
                    <option value="">Equipo Rojo</option>
                    {registeredTeams.map(t => <option key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
                  </select>
                </div>
                <button onClick={handleCreateMatch} disabled={!newMatch.equipo_azul || !newMatch.equipo_rojo} className="w-full rounded-lg py-2.5 sm:py-3 text-sm sm:text-base font-bold bg-ls-primary text-ls-bg hover:bg-ls-primary-hover transition disabled:opacity-50 mt-4 shadow-lg shadow-ls-primary/20">Programar VS</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE MIEMBROS DE EQUIPO */}
      {teamModalOpen && viewingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setTeamModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl border border-ls-gold/30 bg-ls-surface shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 p-4">
              <div className="flex items-center gap-3">
                <img src={viewingTeam.logo_url || 'https://cdn-icons-png.flaticon.com/512/814/814513.png'} className="h-8 w-8 object-contain" alt="Logo" />
                <h3 className="text-lg font-bold text-white uppercase">{viewingTeam.nombre}</h3>
              </div>
              <button onClick={() => setTeamModalOpen(false)} className="text-gray-400 hover:text-white p-1 transition"><X size={20}/></button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {viewingTeamMembers.length === 0 ? (
                <p className="text-center text-gray-500 italic py-6 text-sm">Este equipo no tiene jugadores registrados.</p>
              ) : (
                <div className="space-y-3">
                  {viewingTeamMembers.map(member => (
                    <div key={member.id_usuario} className="flex items-center justify-between rounded-lg border border-gray-700 bg-ls-bg p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray-800 p-2 text-ls-primary shrink-0"><User size={16} /></div>
                        <div>
                          <p className="font-bold text-white text-sm">{member.nickname}</p>
                          <p className="text-[10px] text-gray-400">{member.elo}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded shrink-0 ${
                        member.rol_en_equipo === 'Capitan' ? 'bg-ls-gold text-ls-bg' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {member.rol_en_equipo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-gray-700 bg-gray-900/50 p-3 text-center">
              <button onClick={() => setTeamModalOpen(false)} className="w-full rounded bg-gray-700 px-4 py-2 text-sm font-bold text-white hover:bg-gray-600 transition">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}