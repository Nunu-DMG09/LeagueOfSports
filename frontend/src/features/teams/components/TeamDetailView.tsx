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

  if (loading) return <div className="text-center py-10 text-gray-400 animate-pulse">Cargando Equipos...</div>;
  if (!team) return <div className="text-center py-10 text-ls-danger">Equipo no encontrado</div>;

  return (
    <div className="space-y-8">
      {/* HEADER DEL EQUIPO */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-ls-gold/20 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/teams')} className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={28} />
          </button>
          <div className="h-16 w-16 rounded border border-ls-gold/30 bg-ls-surface p-2">
            {team.logo_url ? <img src={team.logo_url} className="h-full w-full object-contain" alt={team.nombre} /> : <ShieldCheck className="h-full w-full text-ls-gold" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">{team.nombre}</h1>
            <p className="text-ls-primary text-sm font-medium">Escuadra Oficial - {team.estado}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LISTA DE MIEMBROS (ROSTER) */}
        {/* Si no puede gestionar, la lista ocupa todo el ancho */}
        <div className={canManageTeams ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
          <h2 className="text-xl font-bold text-ls-gold flex items-center gap-2">
            <Star size={20} /> MIEMBROS ACTUALES
          </h2>
          <div className={`grid grid-cols-1 gap-4 ${canManageTeams ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
            {members.length === 0 ? (
              <p className="text-gray-500 col-span-full italic">No hay jugadores asignados a este equipo aún.</p>
            ) : (
              members.map((member) => (
                <div key={member.id_usuario} className="flex items-center justify-between rounded-lg border border-ls-gold/10 bg-ls-surface p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-ls-bg p-2 text-ls-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{member.nickname}</h4>
                      <p className="text-xs text-gray-400">{member.elo}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
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
          <div className="rounded-lg border border-ls-gold/20 bg-ls-surface p-6 h-fit shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-ls-primary" /> Asignar Invocador
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Seleccionar Invocador</label>
                <select 
                  className="w-full bg-ls-bg border border-gray-700 text-white p-2 rounded focus:border-ls-primary outline-none"
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
                <label className="text-xs text-gray-400 block mb-1">Rol en el Equipo</label>
                <select 
                  className="w-full bg-ls-bg border border-gray-700 text-white p-2 rounded focus:border-ls-primary outline-none"
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
                className="w-full bg-ls-primary text-ls-bg font-bold py-2 rounded hover:bg-ls-primary-hover transition-colors mt-2"
              >
                Añadir al Equipo
              </button>
            </form>
            <p className="mt-4 text-[10px] text-gray-500 text-center uppercase tracking-widest">
              League of Sports Management
            </p>
          </div>
        )}
      </div>
    </div>
  );
}