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

  const filteredUsers = availableUsers.filter(u => u.nickname.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between border-b border-ls-gold/20 pb-4 sm:pb-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <button onClick={() => navigate('/teams')} className="text-gray-400 hover:text-white transition mt-2 sm:mt-0 p-1">
            <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px]" />
          </button>
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl border border-ls-gold/30 bg-ls-surface p-2 shrink-0 shadow-lg shadow-ls-gold/10">
            {team.logo_url ? <img src={`${import.meta.env.VITE_API_URL}${team.logo_url}`} className="h-full w-full object-contain" alt={team.nombre} /> : <ShieldCheck className="h-full w-full text-ls-gold" />}
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter truncate" title={team.nombre}>{team.nombre}</h1>
            <p className="text-ls-primary text-xs sm:text-sm font-medium mt-0.5">Escuadra Oficial - <span className="uppercase">{team.estado}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        
        <div className={canManageTeams ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
          <h2 className="text-lg sm:text-xl font-bold text-ls-gold flex items-center gap-2">
            <Star size={20} /> MIEMBROS ACTUALES
          </h2>
          <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${canManageTeams ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {members.length === 0 ? (
              <p className="text-gray-500 col-span-full italic text-sm">No hay jugadores asignados a este equipo aún.</p>
            ) : (
              members.map((member) => (
                <div key={member.id_usuario} className="flex items-center justify-between rounded-xl border border-ls-gold/10 bg-ls-surface p-3 sm:p-4 hover:border-ls-gold/30 transition-colors shadow-md group">
                  <div className="flex items-center gap-3 overflow-hidden pr-2">
                    <div className="rounded-full bg-gray-800 p-2 sm:p-2.5 text-ls-primary shrink-0 border border-gray-700">
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
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
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

        {canManageTeams && (
          <div className="rounded-xl border border-ls-gold/20 bg-ls-surface p-4 sm:p-6 shadow-xl flex flex-col max-h-[600px]">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 shrink-0">
              <UserPlus size={20} className="text-ls-primary" /> Reclutar Invocadores
            </h3>
            
            <div className="relative mb-4 shrink-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar por nickname..." 
                className="w-full bg-ls-bg border border-gray-700 text-white py-2 pl-9 pr-3 text-sm rounded-lg focus:border-ls-primary outline-none transition-colors"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-2">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 text-xs italic py-6">No se encontraron invocadores libres.</p>
              ) : (
                filteredUsers.map(u => (
                  <div key={u.id_usuario} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-600 transition-colors gap-3">
                    
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-gray-800 p-1.5 rounded-full text-gray-400 shrink-0 border border-gray-700">
                        <User size={14}/>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate" title={u.nickname}>{u.nickname}</p>
                        <p className="text-[10px] text-gray-400">{u.elo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0 justify-end border-t border-gray-800 sm:border-0 pt-2 sm:pt-0">
                      <button 
                        onClick={() => handleAddMember(u.id_usuario, 'Titular')} 
                        className="flex items-center gap-1 p-1.5 px-2 bg-gray-800 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded transition border border-transparent hover:border-blue-500/30" 
                        title="Asignar Titular"
                      >
                        <Swords size={14} />
                      </button>
                      <button 
                        onClick={() => handleAddMember(u.id_usuario, 'Capitan')} 
                        className="flex items-center gap-1 p-1.5 px-2 bg-gray-800 hover:bg-ls-gold/20 text-gray-400 hover:text-ls-gold rounded transition border border-transparent hover:border-ls-gold/30" 
                        title="Asignar Capitán"
                      >
                        <Star size={14} />
                      </button>
                      <button 
                        onClick={() => handleAddMember(u.id_usuario, 'Suplente')} 
                        className="flex items-center gap-1 p-1.5 px-2 bg-gray-800 hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 rounded transition border border-transparent hover:border-purple-500/30" 
                        title="Asignar Suplente"
                      >
                        <Clock size={14} />
                      </button>
                    </div>
                    
                  </div>
                ))
              )}
            </div>
            <p className="mt-4 shrink-0 text-[9px] sm:text-[10px] text-gray-500 text-center uppercase tracking-widest border-t border-gray-800 pt-3">
              Liga Oficial de Esports
            </p>
          </div>
        )}
      </div>
    </div>
  );
}