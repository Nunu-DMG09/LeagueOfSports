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
    <div className="space-y-6 lg:space-y-8 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c8aa6e]/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
            <Shield className="text-[#c8aa6e] drop-shadow-[0_0_8px_rgba(200,170,110,0.5)]" size={32} /> Equipos Oficiales
          </h1>
          <p className="text-xs sm:text-sm font-bold tracking-widest text-[#a0aec0] mt-2 uppercase">Facciones listas para la gloria</p>
        </div>
        {canManageTeams && (
          <button onClick={() => navigate('/teams/new')} className="group relative w-full sm:w-auto overflow-hidden rounded-lg bg-gradient-to-r from-[#c8aa6e] to-[#a88a4e] px-6 py-3 sm:py-2.5 text-sm font-black uppercase tracking-widest text-[#0a0a0c] transition-all hover:shadow-[0_0_20px_rgba(200,170,110,0.4)] hover:-translate-y-1 block">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Shield size={16} /> Registrar Escuadra
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover:scale-100"></div>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="text-sm sm:text-base text-[#c8aa6e] animate-pulse font-black uppercase tracking-widest flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-[#c8aa6e] shadow-[0_0_10px_#c8aa6e] animate-ping"></div> Cargando estandartes...
          </div>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center text-[#a0aec0] font-bold uppercase tracking-widest py-14 sm:py-20 border border-dashed border-gray-700/50 rounded-xl bg-[#0a0a0c]/40 shadow-lg text-sm sm:text-base mx-4 sm:mx-0">
          Ninguna orden se ha fundado aún. ¡Muestra tu bandera!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <div 
              key={team.id_equipo} 
              onClick={() => navigate(`/teams/${team.id_equipo}`)}
              className="group cursor-pointer relative overflow-hidden rounded-xl border border-gray-800/60 bg-[#121418]/90 backdrop-blur-md transition-all duration-300 hover:border-[#c8aa6e]/50 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(200,170,110,0.15)] flex flex-col"
            >
              
              {/* BOTONES DE ADMINISTRACIÓN */}
              {canManageTeams && (
                <div className="absolute top-3 right-3 z-30 flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-[#0a0a0c]/80 p-1.5 rounded-lg backdrop-blur border border-gray-700/50 shadow-lg">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditModal({ isOpen: true, team }); }} 
                    className="p-1.5 bg-[#0bc6e3]/10 text-[#0bc6e3] hover:bg-[#0bc6e3] hover:text-[#0a0a0c] rounded transition-colors" 
                    title="Editar Equipo"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, id: team.id_equipo, name: team.nombre }); }} 
                    className="p-1.5 bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444] hover:text-white rounded transition-colors" 
                    title="Disolver Equipo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* IMAGEN FABULOSA */}
              <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-[#0a0a0c] shrink-0 flex items-center justify-center">
                {/* Overlay degradado negro abajo para fusionar imagen con el resto de la card */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121418] via-transparent to-transparent z-20 pointer-events-none"></div>
                {team.logo_url ? (
                  <>
                    <div className="absolute inset-0 bg-[#c8aa6e]/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${team.logo_url}`} 
                      alt={team.nombre} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                    />
                  </>
                ) : (
                  <Shield size={64} className="text-[#c8aa6e] opacity-20 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-40 group-hover:drop-shadow-[0_0_15px_rgba(200,170,110,0.5)] z-0" />
                )}
              </div>

              {/* CONTENIDO DE LA TARJETA */}
              <div className="relative z-30 p-5 text-center flex-1 flex flex-col justify-start -mt-6">
                <h3 className="text-lg sm:text-xl font-black text-white truncate px-2 transition-colors group-hover:text-[#c8aa6e] drop-shadow-md uppercase tracking-wider" title={team.nombre}>{team.nombre}</h3>
                <div className="mt-3">
                  <span className={`inline-block border px-3.5 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${
                    team.estado === 'activo' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] rounded' : 
                    team.estado === 'campeon' ? 'bg-gradient-to-r from-[#c8aa6e] to-[#a88a4e] text-[#0a0a0c] border-[#c8aa6e] shadow-[0_0_15px_rgba(200,170,110,0.5)] rounded' :
                    team.estado === 'descalificado' ? 'bg-gray-800/80 text-gray-500 border-gray-700 rounded' : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30 rounded'
                  }`}>
                    {team.estado}
                  </span>
                </div>
              </div>

              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-30"></div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={deleteModal.isOpen} title="Disolver Orden"
        message={`¿Estás seguro de disolver a la escuadra ${deleteModal.name}? Se perderán sus miembros, pero no podrás eliminarlo si ya hay batallas en su historial.`}
        onCancel={() => setDeleteModal({ isOpen: false, id: 0, name: '' })}
        onConfirm={() => { confirmDelete(deleteModal.id); setDeleteModal({ isOpen: false, id: 0, name: '' }); }}
      />
      
      <TeamEditModal 
        isOpen={editModal.isOpen} team={editModal.team} 
        onClose={() => setEditModal({ isOpen: false, team: null })}
        onSuccess={() => { setEditModal({ isOpen: false, team: null }); fetchTeams(); }}
      />
    </div>
  );
}