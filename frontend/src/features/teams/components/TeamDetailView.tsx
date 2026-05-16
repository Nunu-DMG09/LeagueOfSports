import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, ShieldCheck, Star, User, Swords, Clock, UserMinus, Search } from 'lucide-react';
import { useTeamDetail } from '../hooks/useTeamDetail';

export default function TeamDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    team, members, availableUsers, loading, 
    handleAddMember, handleRemoveMember, 
    canManageTeams 
  } = useTeamDetail(Number(id));

  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-sm sm:text-base text-[#c8aa6e] animate-pulse font-black uppercase tracking-widest flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#c8aa6e] border-t-transparent animate-spin shadow-[0_0_15px_#c8aa6e]"></div> Buscando escuadra...
      </div>
    </div>
  );
  if (!team) return <div className="text-center py-20 text-[#ef4444] font-black uppercase tracking-widest text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">Orden de combate no hallada</div>;

  const unassignedUsers = availableUsers.filter(u => !members.some(m => m.id_usuario === u.id_usuario));
  const filteredUsers = unassignedUsers.filter(u => u.nickname.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c8aa6e]/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER DEL EQUIPO RESPONSIVO */}
      <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between border-b border-gray-800/60 pb-6 sm:pb-8">
        <div className="flex items-start sm:items-center gap-5 sm:gap-6">
          <button onClick={() => navigate('/teams')} className="group rounded-full bg-[#121418] border border-gray-800 p-2 text-gray-400 hover:text-[#c8aa6e] hover:border-[#c8aa6e]/50 hover:bg-[#c8aa6e]/10 transition-all mt-2 sm:mt-0">
            <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px] group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          {/* IMAGEN FABULOSA (Detalle) */}
          <div className="relative group/logo h-20 w-20 sm:h-28 sm:w-28 rounded-2xl overflow-hidden shrink-0 shadow-[0_0_25px_rgba(200,170,110,0.4)] border-2 border-[#c8aa6e]/60 bg-[#0a0a0c]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 bg-[#c8aa6e]/20 mix-blend-overlay z-10 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300"></div>
            {team.logo_url ? (
              <img src={`${import.meta.env.VITE_API_URL}${team.logo_url}`} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/logo:scale-110" alt={team.nombre} />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 text-[#c8aa6e] opacity-40 transition-transform duration-700 group-hover/logo:scale-110 group-hover/logo:opacity-70" />
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f0e6d2] to-[#c8aa6e] uppercase tracking-tighter truncate drop-shadow-[0_0_10px_rgba(200,170,110,0.3)]" title={team.nombre}>{team.nombre}</h1>
            <p className="text-[#0bc6e3] text-xs sm:text-sm font-bold tracking-widest mt-2 uppercase flex items-center gap-2">
              Estandarte <span className="text-white px-2 py-0.5 rounded bg-gray-800 border border-gray-700">{team.estado}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        
        {/* LISTA DE MIEMBROS ACTUALES */}
        <div className={canManageTeams ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          <h2 className="text-lg sm:text-xl font-black text-[#c8aa6e] flex items-center gap-3 uppercase tracking-widest mb-6 border-b border-gray-800/60 pb-3">
            <Star className="text-[#c8aa6e]" size={24} /> Alineación Actual
          </h2>
          <div className={`grid grid-cols-1 gap-4 ${canManageTeams ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {members.length === 0 ? (
              <p className="text-[#a0aec0] font-bold uppercase tracking-widest py-10 col-span-full border border-dashed border-gray-700/50 rounded-xl bg-[#0a0a0c]/40 text-center text-xs">
                La fortaleza aguarda por guerreros.
              </p>
            ) : (
              members.map((member) => (
                <div key={member.id_usuario} className="flex items-center justify-between rounded-xl border border-gray-800/80 bg-[#121418]/80 backdrop-blur-md p-4 hover:border-[#c8aa6e]/50 hover:shadow-[0_0_15px_rgba(200,170,110,0.15)] transition-all group overflow-hidden relative">
                  {member.rol_en_equipo === 'Capitan' && <div className="absolute top-0 left-0 w-1 h-full bg-[#c8aa6e]"></div>}
                  
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`rounded-full border p-2 shrink-0 ${member.rol_en_equipo === 'Capitan' ? 'bg-[#c8aa6e]/10 border-[#c8aa6e]/50 text-[#c8aa6e] shadow-[0_0_10px_rgba(200,170,110,0.3)]' : 'bg-[#0a0a0c] border-gray-700 text-gray-500'}`}>
                      <User size={18} className="sm:w-[20px] sm:h-[20px]" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-white text-sm sm:text-base truncate tracking-wide" title={member.nickname}>{member.nickname}</h4>
                      <p className="text-[10px] text-[#0bc6e3] uppercase font-bold tracking-widest mt-0.5">{member.elo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm border ${
                      member.rol_en_equipo === 'Capitan' ? 'bg-[#c8aa6e]/10 text-[#c8aa6e] border-[#c8aa6e]/30' : 'bg-gray-800/80 text-gray-400 border-gray-700'
                    }`}>
                      {member.rol_en_equipo}
                    </span>
                    
                    {canManageTeams && (
                      <button 
                        onClick={() => handleRemoveMember(member.id_usuario)}
                        className="p-1.5 text-gray-500 hover:text-white bg-gray-800 hover:bg-[#ef4444]/90 rounded-lg transition-colors border border-gray-700 opacity-100 lg:opacity-0 group-hover:opacity-100" title="Desterrar campeón"
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL INTERACTIVO DE RECLUTAMIENTO */}
        {canManageTeams && (
          <div className="rounded-xl border border-[#0bc6e3]/20 bg-[#121418]/80 backdrop-blur-md p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col h-[500px] relative overflow-hidden group/recruit">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0bc6e3] to-transparent"></div>
            
            <h3 className="text-base sm:text-lg font-black text-white mb-5 flex items-center gap-3 border-b border-gray-800/60 pb-3 uppercase tracking-widest">
              <UserPlus size={20} className="text-[#0bc6e3] drop-shadow-[0_0_5px_rgba(11,198,227,0.5)]" /> Portal de Invocación
            </h3>
            
            <div className="relative mb-5 shrink-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="BUSCAR LEYENDA..." 
                className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 text-white font-bold tracking-widest text-xs uppercase py-3 pl-11 pr-4 rounded-lg focus:border-[#0bc6e3] focus:shadow-[0_0_10px_rgba(11,198,227,0.2)] outline-none transition-all placeholder-gray-600"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 font-bold uppercase tracking-widest text-xs italic py-10 bg-[#0a0a0c]/40 rounded-lg border border-dashed border-gray-700">
                  {searchTerm ? "Nadie responde a ese nombre." : "El mundo se ha quedado sin espíritus libres."}
                </p>
              ) : (
                filteredUsers.map(u => (
                  <div key={u.id_usuario} className="group flex flex-col xl:flex-row xl:items-center justify-between p-3 rounded-lg bg-[#0a0a0c]/60 border border-transparent hover:bg-[#0bc6e3]/5 hover:border-[#0bc6e3]/30 transition-all gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-gray-900 border border-gray-800 p-2 rounded-full text-gray-500 shrink-0 group-hover:text-[#0bc6e3] transition-colors"><User size={16}/></div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-black text-white truncate tracking-wide group-hover:text-[#0bc6e3] transition-colors drop-shadow-sm" title={u.nickname}>{u.nickname}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wi text-gray-400 mt-0.5">{u.elo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0 justify-end bg-gray-900/50 p-1 rounded-lg border border-gray-800/50">
                      <button onClick={() => handleAddMember(u.id_usuario, 'Titular')} className="p-2 hover:bg-[#3b82f6]/20 text-gray-500 hover:text-[#3b82f6] rounded transition-colors" title="Nombrar Titular"><Swords size={16} /></button>
                      <button onClick={() => handleAddMember(u.id_usuario, 'Capitan')} className="p-2 hover:bg-[#c8aa6e]/20 text-gray-500 hover:text-[#c8aa6e] rounded transition-colors" title="Ascender a Capitán"><Star size={16} /></button>
                      <button onClick={() => handleAddMember(u.id_usuario, 'Suplente')} className="p-2 hover:bg-[#a855f7]/20 text-gray-500 hover:text-[#a855f7] rounded transition-colors" title="Nombrar Suplente"><Clock size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}