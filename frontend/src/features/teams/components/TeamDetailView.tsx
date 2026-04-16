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

  if (loading) return <div className="text-center py-10 sm:py-20 text-ls-primary animate-pulse text-sm sm:text-base font-bold">Cargando Escuadra...</div>;
  if (!team) return <div className="text-center py-10 sm:py-20 text-ls-danger font-bold text-lg sm:text-xl">Equipo no encontrado</div>;

  // 1. MAGIA: Primero filtramos a los usuarios que YA están en el equipo para que desaparezcan de la lista
  const unassignedUsers = availableUsers.filter(u => !members.some(m => m.id_usuario === u.id_usuario));
  
  // 2. Luego aplicamos el filtro del buscador de texto
  const filteredUsers = unassignedUsers.filter(u => u.nickname.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      {/* HEADER DEL EQUIPO RESPONSIVO */}
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between border-b border-ls-gold/20 pb-4 sm:pb-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <button onClick={() => navigate('/teams')} className="text-gray-400 hover:text-white transition mt-2 sm:mt-0 p-1">
            <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px]" />
          </button>
          
          {/* IMAGEN MEJORADA: Ocupa todo el recuadro */}
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-ls-gold/20 border border-ls-gold/30 bg-ls-surface">
            {team.logo_url ? (
              <img src={`${import.meta.env.VITE_API_URL}${team.logo_url}`} className="h-full w-full object-cover" alt={team.nombre} />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-ls-gold opacity-50" />
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter truncate" title={team.nombre}>{team.nombre}</h1>
            <p className="text-ls-primary text-xs sm:text-sm font-medium mt-0.5">Escuadra Oficial - <span className="uppercase">{team.estado}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        
        {/* LISTA DE MIEMBROS ACTUALES */}
        <div className={canManageTeams ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
          <h2 className="text-lg sm:text-xl font-bold text-ls-gold flex items-center gap-2">
            <Star size={20} /> MIEMBROS ACTUALES
          </h2>
          <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${canManageTeams ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {members.length === 0 ? (
              <p className="text-gray-500 col-span-full italic text-sm border border-dashed border-gray-800 rounded-xl p-6 text-center">
                No hay jugadores asignados a este equipo aún.
              </p>
            ) : (
              members.map((member) => (
                <div key={member.id_usuario} className="flex items-center justify-between rounded-xl border border-ls-gold/10 bg-ls-surface p-3 sm:p-4 hover:border-ls-gold/30 transition-colors shadow-md group">
                  <div className="flex items-center gap-3 overflow-hidden pr-2">
                    <div className="rounded-full bg-gray-800/50 p-2 sm:p-2.5 text-ls-primary shrink-0 border border-gray-700/50">
                      <User size={18} className="sm:w-[20px] sm:h-[20px]" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm sm:text-base truncate" title={member.nickname}>{member.nickname}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{member.elo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm ${
                      member.rol_en_equipo === 'Capitan' ? 'bg-ls-gold text-ls-bg' : 'bg-ls-bg text-ls-primary border border-ls-primary/30'
                    }`}>
                      {member.rol_en_equipo}
                    </span>
                    
                    {canManageTeams && (
                      <button 
                        onClick={() => handleRemoveMember(member.id_usuario)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100"
                        title="Expulsar del equipo"
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

        {/* PANEL INTERACTIVO DE RECLUTAMIENTO (Mejorado con Tailwind Scrollbar) */}
        {canManageTeams && (
          <div className="rounded-xl border border-ls-gold/20 bg-ls-surface p-4 sm:p-5 shadow-xl flex flex-col h-[500px]">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 shrink-0">
              <UserPlus size={20} className="text-ls-primary" /> Reclutar Invocadores
            </h3>
            
            <div className="relative mb-4 shrink-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar por nickname..." 
                className="w-full bg-gray-900 border border-gray-800 text-white py-2.5 pl-9 pr-3 text-sm rounded-lg focus:border-ls-primary outline-none transition-colors"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* APLICACIÓN DEL SCROLLBAR DE TAILWIND */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-500 scrollbar-track-transparent">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 text-xs italic py-10">
                  {searchTerm ? "No se encontraron invocadores con ese nombre." : "No hay invocadores libres."}
                </p>
              ) : (
                filteredUsers.map(u => (
                  <div key={u.id_usuario} className="group flex flex-col xl:flex-row xl:items-center justify-between p-2.5 rounded-lg bg-gray-800/30 border border-transparent hover:bg-gray-800/80 hover:border-ls-primary/30 transition-all gap-3">
                    
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-gray-900 p-1.5 rounded-full text-gray-400 shrink-0 border border-gray-800">
                        <User size={14}/>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate" title={u.nickname}>{u.nickname}</p>
                        <p className="text-[10px] text-gray-400">{u.elo}</p>
                      </div>
                    </div>
                    
                    {/* Botones sutiles de reclutamiento */}
                    <div className="flex items-center gap-1 shrink-0 justify-end">
                      <button onClick={() => handleAddMember(u.id_usuario, 'Titular')} className="p-1.5 bg-gray-900 hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 rounded-md transition-colors" title="Asignar Titular">
                        <Swords size={14} />
                      </button>
                      <button onClick={() => handleAddMember(u.id_usuario, 'Capitan')} className="p-1.5 bg-gray-900 hover:bg-ls-gold/20 text-gray-500 hover:text-ls-gold rounded-md transition-colors" title="Asignar Capitán">
                        <Star size={14} />
                      </button>
                      <button onClick={() => handleAddMember(u.id_usuario, 'Suplente')} className="p-1.5 bg-gray-900 hover:bg-purple-500/20 text-gray-500 hover:text-purple-400 rounded-md transition-colors" title="Asignar Suplente">
                        <Clock size={14} />
                      </button>
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