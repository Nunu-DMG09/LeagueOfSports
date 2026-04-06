import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, ShieldCheck, Star, User } from 'lucide-react';
import { useTeamDetail } from '../hooks/useTeamDetail';

export default function TeamDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    team, members, allUsers, loading, 
    newMember, setNewMember, handleAddMember, 
    canManageTeams 
  } = useTeamDetail(Number(id));

  if (loading) return <div className="text-center py-10 sm:py-20 text-ls-primary animate-pulse text-sm sm:text-base font-bold">Cargando Escuadra...</div>;
  if (!team) return <div className="text-center py-10 sm:py-20 text-ls-danger font-bold text-lg sm:text-xl">Equipo no encontrado</div>;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* HEADER DEL EQUIPO RESPONSIVO */}
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between border-b border-ls-gold/20 pb-4 sm:pb-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <button onClick={() => navigate('/teams')} className="text-gray-400 hover:text-white transition mt-2 sm:mt-0 p-1">
            <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px]" />
          </button>
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl border border-ls-gold/30 bg-ls-surface p-2 shrink-0 shadow-lg shadow-ls-gold/10">
            {team.logo_url ? <img src={team.logo_url} className="h-full w-full object-contain" alt={team.nombre} /> : <ShieldCheck className="h-full w-full text-ls-gold" />}
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter truncate" title={team.nombre}>{team.nombre}</h1>
            <p className="text-ls-primary text-xs sm:text-sm font-medium mt-0.5">Escuadra Oficial - <span className="uppercase">{team.estado}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {/* LISTA DE MIEMBROS (ROSTER) */}
        <div className={canManageTeams ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
          <h2 className="text-lg sm:text-xl font-bold text-ls-gold flex items-center gap-2">
            <Star size={20} /> MIEMBROS ACTUALES
          </h2>
          <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${canManageTeams ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {members.length === 0 ? (
              <p className="text-gray-500 col-span-full italic text-sm">No hay jugadores asignados a este equipo aún.</p>
            ) : (
              members.map((member) => (
                <div key={member.id_usuario} className="flex items-center justify-between rounded-xl border border-ls-gold/10 bg-ls-surface p-3 sm:p-4 hover:border-ls-gold/30 transition-colors shadow-md">
                  <div className="flex items-center gap-3 overflow-hidden pr-2">
                    <div className="rounded-full bg-gray-800 p-2 sm:p-2.5 text-ls-primary shrink-0 border border-gray-700">
                      <User size={18} className="sm:w-[20px] sm:h-[20px]" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm sm:text-base truncate" title={member.nickname}>{member.nickname}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{member.elo}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0 shadow-sm ${
                    member.rol_en_equipo === 'Capitan' ? 'bg-ls-gold text-ls-bg' : 'bg-ls-bg text-ls-primary border border-ls-primary/30'
                  }`}>
                    {member.rol_en_equipo}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FORMULARIO PARA AÑADIR MIEMBRO (Protegido) */}
        {canManageTeams && (
          <div className="rounded-xl border border-ls-gold/20 bg-ls-surface p-5 sm:p-6 h-fit shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-white mb-5 sm:mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-ls-primary" /> Asignar Invocador
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-[10px] sm:text-xs text-gray-400 block mb-1.5 uppercase font-bold tracking-wider">Seleccionar Invocador</label>
                <select 
                  className="w-full bg-ls-bg border border-gray-700 text-white p-2.5 sm:p-3 rounded-lg focus:border-ls-primary outline-none text-sm sm:text-base transition-colors"
                  value={newMember.id_usuario}
                  onChange={(e) => setNewMember({...newMember, id_usuario: e.target.value})}
                >
                  <option value="">-- Buscar Jugador --</option>
                  {allUsers.map(u => (
                    <option key={u.id_usuario} value={u.id_usuario}>{u.nickname} ({u.elo})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] sm:text-xs text-gray-400 block mb-1.5 uppercase font-bold tracking-wider">Rol en el Equipo</label>
                <select 
                  className="w-full bg-ls-bg border border-gray-700 text-white p-2.5 sm:p-3 rounded-lg focus:border-ls-primary outline-none text-sm sm:text-base transition-colors"
                  value={newMember.rol_en_equipo}
                  onChange={(e) => setNewMember({...newMember, rol_en_equipo: e.target.value})}
                >
                  <option value="Titular">Titular</option>
                  <option value="Capitan">Capitán</option>
                  <option value="Suplente">Suplente</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-ls-primary text-ls-bg font-bold py-2.5 sm:py-3 rounded-lg hover:bg-ls-primary-hover transition-colors mt-2 text-sm sm:text-base shadow-lg shadow-ls-primary/20"
              >
                Añadir al Equipo
              </button>
            </form>
            <p className="mt-5 text-[9px] sm:text-[10px] text-gray-500 text-center uppercase tracking-widest border-t border-gray-800 pt-4">
              League of Sports Management
            </p>
          </div>
        )}
      </div>
    </div>
  );
}