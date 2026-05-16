import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Swords, PlayCircle, Trash2, X, Users, User, Trophy } from 'lucide-react';
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

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-sm sm:text-base text-[#0bc6e3] animate-pulse font-black uppercase tracking-widest flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#0bc6e3] border-t-transparent animate-spin shadow-[0_0_15px_#0bc6e3]"></div>
        Sincronizando con la arena...
      </div>
    </div>
  );
  
  if (!tournament) return (
    <div className="text-center py-20 bg-[#121418]/80 backdrop-blur-md rounded-xl border border-[#ef4444]/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
      <p className="text-xl sm:text-2xl font-black mb-4 text-[#ef4444] uppercase tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">Error: Dominio Extraviado</p>
      <button onClick={() => navigate('/tournaments')} className="rounded border border-gray-600 px-6 py-2.5 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white transition uppercase tracking-wider">Volver al Nexo</button>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ls-primary/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER RESPONSIVO */}
      <div className="flex items-start sm:items-center gap-4 border-b border-gray-800/60 pb-5">
        <button onClick={() => navigate('/tournaments')} className="group rounded-full bg-[#121418] border border-gray-800 p-2 text-gray-400 hover:text-[#c8aa6e] hover:border-[#c8aa6e]/50 hover:bg-[#c8aa6e]/10 transition-all mt-1 sm:mt-0">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px] group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#c8aa6e] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(200,170,110,0.4)]">{tournament.nombre}</h1>
          <p className="text-xs sm:text-sm font-bold tracking-widest text-[#a0aec0] mt-2 uppercase flex items-center gap-2">
            Reglas de combate: <span className="text-[#0bc6e3] bg-[#0bc6e3]/10 px-2 py-0.5 rounded border border-[#0bc6e3]/20 shadow-inner">{tournament.modalidad}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={canManageTournaments ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          
          {/* CRONOGRAMA DE PARTIDAS */}
          {canManageTournaments && (
            <div className="rounded-xl border border-gray-800/60 bg-[#121418]/80 backdrop-blur-md p-5 sm:p-7 shadow-[0_0_25px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-4 w-12 h-[2px] bg-[#0bc6e3] rounded-full"></div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-3 text-white mb-6 uppercase tracking-widest border-b border-gray-800/50 pb-3">
                <Swords className="text-[#0bc6e3] drop-shadow-[0_0_8px_rgba(11,198,227,0.5)]" size={24}/> Cronograma de Combates
              </h2>
              
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <div className="flex items-center justify-center py-6 bg-[#0a0a0c]/40 rounded-lg border border-dashed border-gray-700">
                    <p className="text-[#a0aec0] font-bold text-sm tracking-widest uppercase">El campo de batalla espera contiendas.</p>
                  </div>
                ) : (
                  matches.map(m => (
                    <div key={m.id_partida} className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-800/60 bg-gradient-to-r from-[#0a0a0c] to-[#121418] p-4 gap-4 hover:border-gray-600 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 sm:gap-6 w-full">
                        {/* EQUIPO AZUL */}
                        <div className="flex-1 text-right">
                          <span className="font-black text-[#60a5fa] text-sm sm:text-lg block truncate drop-shadow-[0_0_5px_rgba(96,165,250,0.4)]" title={m.equipo_azul_nombre}>{m.equipo_azul_nombre}</span>
                          <span className="text-[9px] uppercase tracking-widest text-[#a0aec0] font-bold">Lado Océano</span>
                        </div>
                        {/* VS Banderte */}
                        <div className="relative px-3 sm:px-4 py-2 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-inner flex items-center justify-center shrink-0 z-10 group-hover:scale-105 transition-transform">
                           <div className="absolute inset-x-0 h-[1px] top-1/2 bg-gray-700 -z-10"></div>
                           <span className="text-[10px] sm:text-xs text-white font-black italic tracking-widest bg-gray-900 px-1 z-10">VS</span>
                        </div>
                        {/* EQUIPO ROJO */}
                        <div className="flex-1 text-left">
                          <span className="font-black text-[#f87171] text-sm sm:text-lg block truncate drop-shadow-[0_0_5px_rgba(248,113,113,0.4)]" title={m.equipo_rojo_nombre}>{m.equipo_rojo_nombre}</span>
                          <span className="text-[9px] uppercase tracking-widest text-[#a0aec0] font-bold">Lado Infernal</span>
                        </div>
                      </div>

                      <div className="flex justify-end shrink-0 w-full sm:w-auto border-t sm:border-0 border-gray-800/50 pt-3 sm:pt-0 gap-3">
                        {m.id_equipo_ganador ? (
                          <span className="flex items-center justify-center text-[10px] sm:text-xs font-black text-[#10b981] uppercase tracking-widest px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/30 rounded shadow-[0_0_10px_rgba(16,185,129,0.15)] w-full sm:w-auto">
                            Completado
                          </span>
                        ) : (
                          <>
                            <button onClick={() => navigate(`/matches/${m.id_partida}/manage`)} className="group flex-1 sm:flex-none flex justify-center items-center gap-2 text-xs font-black text-[#0a0a0c] uppercase tracking-widest bg-gradient-to-r from-[#0bc6e3] to-[#0ba6c3] hover:shadow-[0_0_15px_rgba(11,198,227,0.4)] px-5 py-2.5 rounded transition-all hover:scale-105">
                              <PlayCircle size={16} /> Entrar
                            </button>
                            <button onClick={() => handleRemoveMatch(m.id_partida)} className="flex justify-center items-center gap-2 text-xs text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 hover:bg-[#ef4444] hover:text-white px-3.5 py-2.5 rounded transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]" title="Cancelar Partida">
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

          {/* EQUIPOS PARTICIPANTES */}
          <div className="rounded-xl border border-[#c8aa6e]/20 bg-[#121418]/80 backdrop-blur-md p-5 sm:p-7 shadow-[0_0_25px_rgba(0,0,0,0.5)] relative overflow-hidden group/teams">
            <div className="absolute top-0 left-4 w-12 h-[2px] bg-[#c8aa6e] rounded-full"></div>
            <h2 className="text-base sm:text-lg font-black flex items-center gap-3 text-white mb-6 uppercase tracking-widest border-b border-gray-800/50 pb-3">
              <Shield className="text-[#c8aa6e] drop-shadow-[0_0_8px_rgba(200,170,110,0.5)]" size={24}/> Facciones Registradas
            </h2>
            
            <div className={`grid grid-cols-1 gap-4 ${canManageTournaments ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {registeredTeams.map(t => (
                <div 
                  key={t.id_equipo} 
                  onClick={() => handleViewTeamMembers(t)}
                  className="relative flex items-center gap-4 rounded-xl border border-gray-700/60 bg-[#0a0a0c]/60 p-3 hover:bg-[#0a0a0c]/90 hover:border-[#0bc6e3]/50 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_15px_rgba(11,198,227,0.15)] hover:-translate-y-0.5"
                >
                  <div className="h-14 w-14 sm:h-16 sm:w-16 overflow-hidden shrink-0 border border-[#c8aa6e]/30 bg-[#121418] rounded border-b-2 border-b-[#c8aa6e]/60 flex items-center justify-center p-0.5 relative">
                    <div className="absolute inset-0 bg-[#c8aa6e]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {t.logo_url ? (
                      <img src={`${import.meta.env.VITE_API_URL}${t.logo_url}`} className="h-full w-full object-cover rounded-sm" alt={t.nombre} />
                    ) : (
                      <Shield size={26} className="text-[#c8aa6e] opacity-40 group-hover:opacity-80 transition-opacity" />
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-hidden pr-8">
                    <span className="font-black text-white text-sm sm:text-base truncate block group-hover:text-[#0bc6e3] transition-colors uppercase tracking-wide" title={t.nombre}>{t.nombre}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#a0aec0] mt-1 flex items-center gap-1.5 uppercase group-hover:text-white transition-colors">
                      <Users size={12} className="text-[#0bc6e3]"/> Reclutas
                    </span>
                  </div>
                  
                  {canManageTournaments && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveTeam(t.id_equipo); }} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white hover:bg-[#ef4444]/80 rounded transition-all shadow-sm opacity-0 group-hover:opacity-100"
                      title="Expulsar equipo del torneo"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              {registeredTeams.length === 0 && <div className="col-span-full py-8 text-center bg-[#0a0a0c]/40 rounded-lg border border-dashed border-gray-700/50"><p className="text-[#a0aec0] font-bold text-sm tracking-widest uppercase">Ningún estandarte se ha alzado aún.</p></div>}
            </div>
          </div>
        </div>

        {/* SIDEBAR DE GESTIÓN (Admins) */}
        {canManageTournaments && (
          <div className="space-y-6">
            
            {/* INSCRIBIR EQUIPO */}
            <div className="rounded-xl border border-gray-800/60 bg-[#121418]/80 backdrop-blur-md p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#c8aa6e]"></div>
              <h3 className="mb-4 font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                <Trophy size={16} className="text-[#c8aa6e]" /> Invocar Equipo
              </h3>
              <select className="w-full rounded-lg bg-[#0a0a0c]/80 border border-gray-700/60 p-3.5 text-sm font-bold text-white outline-none focus:border-[#c8aa6e] focus:shadow-[0_0_10px_rgba(200,170,110,0.2)] transition-all uppercase tracking-wide appearance-none" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                <option className="bg-gray-900 text-gray-400" value="">-- Seleccionar Estandarte --</option>
                {allTeams.map(t => <option className="bg-slate-900 text-white font-bold" key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
              </select>
              <button 
                onClick={handleRegisterTeam} 
                disabled={!selectedTeam} 
                className={`group relative mt-5 w-full overflow-hidden rounded-lg py-3.5 text-xs font-black uppercase tracking-widest transition-all ${selectedTeam ? 'bg-gradient-to-r from-[#c8aa6e] to-[#a88a4e] text-[#0a0a0c] shadow-[0_0_15px_rgba(200,170,110,0.3)] hover:-translate-y-0.5' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                <span className="relative z-10">Conceder Pase</span>
                {selectedTeam && <div className="absolute inset-0 h-full w-full scale-0 bg-white opacity-20 transition-all duration-300 group-hover:scale-100 pointer-events-none"></div>}
              </button>
            </div>

            {/* GENERAR PARTIDA VERSUS */}
            <div className="rounded-xl border border-gray-800/60 bg-[#121418]/80 backdrop-blur-md p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#3b82f6] via-purple-500 to-[#ef4444]"></div>
              <h3 className="mb-5 font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                <Swords size={16} className="text-[#a855f7]" /> Forjar Duelo
              </h3>
              
              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3b82f6] to-[#0ea5e9] rounded-r opacity-70"></div>
                  <label className="text-[10px] font-black text-[#60a5fa] block uppercase tracking-widest mb-1.5 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">Lado Océano (Azul)</label>
                  <select className="w-full rounded-lg bg-[#0a0a0c]/80 border border-[#3b82f6]/30 p-3.5 text-sm font-bold text-white focus:border-[#3b82f6] focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] outline-none transition-all appearance-none uppercase" value={newMatch.equipo_azul} onChange={e => setNewMatch({...newMatch, equipo_azul: e.target.value})}>
                    <option className="bg-gray-900 text-gray-500" value="">-- Escoger --</option>
                    {registeredTeams.map(t => <option className="bg-slate-900 text-white block" key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
                  </select>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ef4444] to-[#f43f5e] rounded-r opacity-70"></div>
                  <label className="text-[10px] font-black text-[#f87171] block uppercase tracking-widest mb-1.5 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">Lado Infernal (Rojo)</label>
                  <select className="w-full rounded-lg bg-[#0a0a0c]/80 border border-[#ef4444]/30 p-3.5 text-sm font-bold text-white focus:border-[#ef4444] focus:shadow-[0_0_10px_rgba(239,68,68,0.2)] outline-none transition-all appearance-none uppercase" value={newMatch.equipo_rojo} onChange={e => setNewMatch({...newMatch, equipo_rojo: e.target.value})}>
                    <option className="bg-gray-900 text-gray-500" value="">-- Escoger --</option>
                    {registeredTeams.map(t => <option className="bg-slate-900 text-white block" key={t.id_equipo} value={t.id_equipo}>{t.nombre}</option>)}
                  </select>
                </div>
                
                <button 
                  onClick={handleCreateMatch} 
                  disabled={!newMatch.equipo_azul || !newMatch.equipo_rojo} 
                  className={`relative w-full overflow-hidden rounded-lg py-4 text-xs font-black uppercase tracking-widest transition-all mt-4 ${newMatch.equipo_azul && newMatch.equipo_rojo ? 'bg-white text-[#0a0a0c] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                >
                  Confirmar Enfrentamiento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL HEX TECH - MIEMBROS DE EQUIPO */}
      {teamModalOpen && viewingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0c]/90 backdrop-blur-md p-4" onClick={() => setTeamModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl border border-[#c8aa6e]/40 bg-[#121418] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden scale-100 relative" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent"></div>
            
            <div className="flex items-center justify-between border-b border-gray-800/80 bg-gradient-to-b from-[#1a1c23] to-transparent p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden shrink-0 rounded border border-[#c8aa6e]/30 bg-[#0a0a0c] flex items-center justify-center p-0.5 relative">
                  {viewingTeam.logo_url ? (
                    <img src={`${import.meta.env.VITE_API_URL}${viewingTeam.logo_url}`} className="h-full w-full object-cover rounded-sm" alt={viewingTeam.nombre} />
                  ) : (
                    <Shield size={24} className="text-[#c8aa6e] opacity-50" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">{viewingTeam.nombre}</h3>
                  <p className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-widest mt-0.5">Alineación Registrada</p>
                </div>
              </div>
              <button onClick={() => setTeamModalOpen(false)} className="text-gray-500 hover:text-white bg-gray-800/50 hover:bg-[#ef4444]/80 p-2 rounded-lg transition-all"><X size={20}/></button>
            </div>
            
            <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay">
              {viewingTeamMembers.length === 0 ? (
                <p className="text-center text-[#a0aec0] font-bold uppercase tracking-widest py-8 text-xs bg-[#0a0a0c]/50 rounded-lg border border-dashed border-gray-700">Sin campeones registrados.</p>
              ) : (
                <div className="space-y-3">
                  {viewingTeamMembers.map(member => (
                    <div key={member.id_usuario} className="flex items-center justify-between rounded-lg border border-gray-800/80 bg-[#0a0a0c]/80 p-3 hover:border-gray-600 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full bg-gray-900 border p-2 shrink-0 ${member.rol_en_equipo === 'Capitan' ? 'border-[#c8aa6e] text-[#c8aa6e] shadow-[0_0_8px_rgba(200,170,110,0.3)]' : 'border-gray-700 text-gray-500'}`}>
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-black text-white text-sm tracking-wide">{member.nickname}</p>
                          <p className="text-[10px] font-bold text-[#0bc6e3] uppercase tracking-wider">{member.elo}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shrink-0 border ${
                        member.rol_en_equipo === 'Capitan' ? 'bg-[#c8aa6e]/10 text-[#c8aa6e] border-[#c8aa6e]/30' : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        {member.rol_en_equipo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-gray-800/80 bg-[#0a0a0c] p-4 text-center">
              <button onClick={() => setTeamModalOpen(false)} className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-gray-700 hover:border-gray-500 transition-all">Cerrar Visor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}