import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Edit, Trash2 } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import TeamEditModal from './TeamEditModal';

export default function TeamsList() {
  const navigate = useNavigate();
  const { teams, loading, canManageTeams, fetchTeams, confirmDelete } = useTeams();

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: 0, name: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, team: null });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-tight">Equipos Competitivos</h1>
        {canManageTeams && (
          <button onClick={() => navigate('/teams/new')} className="w-full sm:w-auto rounded-lg bg-ls-primary px-5 py-3 sm:py-2.5 text-sm font-bold text-ls-bg transition hover:bg-ls-primary-hover shadow-lg shadow-ls-primary/20">
            + Registrar Equipo
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10 sm:py-20 animate-pulse text-sm sm:text-base">Cargando escuadras...</div>
      ) : teams.length === 0 ? (
        <div className="text-center text-gray-400 py-10 sm:py-16 border border-ls-gold/20 rounded-xl bg-ls-surface shadow-lg text-sm sm:text-base mx-4 sm:mx-0">
          No hay equipos fundados aún. ¡Crea el primero!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <div 
              key={team.id_equipo} 
              onClick={() => navigate(`/teams/${team.id_equipo}`)}
              className="group cursor-pointer relative overflow-hidden rounded-xl border border-ls-gold/20 bg-ls-surface transition-all duration-300 hover:border-ls-primary hover:-translate-y-1 hover:shadow-xl hover:shadow-ls-primary/20 flex flex-col"
            >
              
              {/* BOTONES DE ADMINISTRACIÓN (Visibles al pasar el mouse o en móvil) */}
              {canManageTeams && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/60 p-1.5 rounded-lg backdrop-blur-sm">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditModal({ isOpen: true, team }); }} 
                    className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition" 
                    title="Editar Equipo"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, id: team.id_equipo, name: team.nombre }); }} 
                    className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition" 
                    title="Eliminar Equipo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* IMAGEN A PANTALLA COMPLETA DENTRO DEL RECUADRO SUPERIOR */}
              <div className="h-32 sm:h-40 w-full overflow-hidden bg-gray-900 shrink-0 flex items-center justify-center">
                {team.logo_url ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL}${team.logo_url}`} 
                    alt={team.nombre} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <Shield size={56} className="text-ls-gold opacity-30 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-50" />
                )}
              </div>

              {/* CONTENIDO DE LA TARJETA */}
              <div className="border-t border-ls-gold/10 p-4 text-center flex-1 flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-bold text-white truncate px-2 transition-colors group-hover:text-ls-primary" title={team.nombre}>{team.nombre}</h3>
                <div className="mt-2">
                  <span className={`inline-block rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    team.estado === 'activo' ? 'bg-ls-success/10 text-ls-success' : 
                    team.estado === 'campeon' ? 'bg-ls-gold text-ls-bg shadow-[0_0_10px_rgba(200,170,110,0.5)]' :
                    team.estado === 'descalificado' ? 'bg-gray-800 text-gray-500' : 'bg-ls-danger/10 text-ls-danger'
                  }`}>
                    {team.estado}
                  </span>
                </div>
              </div>

              {/* BOTÓN INFERIOR (Ahora reacciona al hover de toda la tarjeta) */}
              <div className="w-full bg-ls-bg/50 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-gray-400 transition-colors group-hover:bg-ls-primary group-hover:text-ls-bg uppercase tracking-widest mt-auto shrink-0 text-center">
                Ver Miembros
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Disolver Equipo"
        message={`¿Estás seguro de disolver a la escuadra ${deleteModal.name}? Se perderán sus miembros, pero no podrás eliminarlo si ya tiene partidas en su historial.`}
        onCancel={() => setDeleteModal({ isOpen: false, id: 0, name: '' })}
        onConfirm={() => { confirmDelete(deleteModal.id); setDeleteModal({ isOpen: false, id: 0, name: '' }); }}
      />

      <TeamEditModal 
        isOpen={editModal.isOpen} 
        team={editModal.team} 
        onClose={() => setEditModal({ isOpen: false, team: null })}
        onSuccess={() => { setEditModal({ isOpen: false, team: null }); fetchTeams(); }}
      />
    </div>
  );
}