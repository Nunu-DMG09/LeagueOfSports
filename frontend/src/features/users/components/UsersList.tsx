import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, ShieldAlert, Users as UsersIcon } from 'lucide-react';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import UserEditModal from './UserEditModal';
import { useUsers } from '../hooks/useUsers'; 

export default function UsersList() {
  const navigate = useNavigate();
  const { users, loading, canManageUsers, fetchUsers, confirmDelete } = useUsers();

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: 0, nickname: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });

  const eloColors: Record<string, string> = {
    'Challenger': 'text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]', 
    'Gran Master': 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]', 
    'Master': 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]',
    'Diamante': 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]', 
    'Esmeralda': 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]', 
    'Platino': 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]',
    'Oro': 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]', 
    'Plata': 'text-gray-300', 
    'Bronce': 'text-orange-700',
    'Hierro': 'text-gray-500', 
    'Unranked': 'text-gray-600',
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ls-primary/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
            <UsersIcon className="text-[#0bc6e3] drop-shadow-[0_0_8px_rgba(11,198,227,0.5)]" size={32} /> Padrón de Leyendas
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#a0aec0] uppercase tracking-widest mt-2">Consulta los perfiles y rangos de los invocadores.</p>
        </div>
        
        {canManageUsers ? (
          <button 
            onClick={() => navigate('/users/new')}
            className="group relative w-full sm:w-auto overflow-hidden rounded-lg bg-gradient-to-r from-[#0bc6e3] to-[#0ba6c3] px-6 py-3 sm:py-2.5 text-sm font-black uppercase tracking-widest text-[#0a0a0c] transition-all hover:shadow-[0_0_20px_rgba(11,198,227,0.4)] hover:-translate-y-1 block whitespace-nowrap"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <UsersIcon size={16} /> Invocar Leyenda
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover:scale-100"></div>
          </button>
        ) : (
          <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 sm:px-3 sm:py-1.5 bg-[#0a0a0c]/80 border border-[#c8aa6e]/30 rounded-lg text-xs font-black uppercase tracking-widest text-[#c8aa6e] shadow-[0_0_10px_rgba(200,170,110,0.15)]">
            <ShieldAlert size={16} /> Región Protegida
          </div>
        )}
      </div>

      {/* CONTENEDOR DE TABLA ESTILO HEX TECH */}
      <div className="overflow-x-auto rounded-xl border border-gray-800/60 bg-[#121418]/80 backdrop-blur-md shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0bc6e3] to-transparent opacity-50"></div>
        <div className="min-w-[700px]">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-gray-700/60 bg-[#0a0a0c]/60 text-[10px] sm:text-[11px] uppercase tracking-widest text-[#a0aec0] font-black">
              <tr>
                <th className="px-5 sm:px-6 py-4">Invocador</th>
                <th className="px-5 sm:px-6 py-4">Liga Clasificada</th>
                <th className="px-5 sm:px-6 py-4">Esencia (Pts)</th>
                <th className="px-5 sm:px-6 py-4">Estatus</th>
                {canManageUsers && <th className="px-5 sm:px-6 py-4 text-center">Acciones del Nexo</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr><td colSpan={canManageUsers ? 5 : 4} className="py-12 text-center animate-pulse text-[#0bc6e3] font-black uppercase tracking-widest text-sm">Escaneando base de datos del Nexo...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={canManageUsers ? 5 : 4} className="py-12 text-center text-[#a0aec0] font-bold uppercase tracking-widest text-xs italic bg-[#0a0a0c]/20">No hay invocadores registrados en el reino.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id_usuario} className="transition-all duration-300 hover:bg-[#0a0a0c]/80 group">
                    <td className="px-5 sm:px-6 py-4">
                      <span className="font-black text-white text-sm sm:text-base block truncate tracking-wide group-hover:text-[#0bc6e3] transition-colors">{user.nickname}</span>
                      <span className={`text-[9px] sm:text-[10px] font-bold mt-1 uppercase px-2 py-0.5 rounded-full inline-block border ${user.id_rol === 3 ? 'bg-[#c8aa6e]/10 text-[#c8aa6e] border-[#c8aa6e]/30' : user.id_rol === 2 ? 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30' : 'bg-gray-800/80 text-gray-400 border-gray-700'}`}>
                        {user.id_rol === 3 ? 'Super Entidad' : user.id_rol === 2 ? 'Guardián (Admin)' : 'Invocador Base'}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className={`px-3 py-1.5 bg-[#0a0a0c] border border-gray-700/50 rounded shadow-inner font-black text-xs sm:text-sm uppercase tracking-wider ${eloColors[user.elo] || 'text-white'}`}>
                        {user.elo}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className="font-black text-white text-base lg:text-lg flex items-center gap-2">
                        {user.puntos_totales} <span className="text-[#c8aa6e]">★</span>
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border ${
                        user.estado === 'activo' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20'
                      }`}>
                        {user.estado === 'activo' ? 'OPERATIVO' : 'BANEADO'}
                      </span>
                    </td>
                    
                    {/* ACCIONES */}
                    {canManageUsers && (
                      <td className="px-5 sm:px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => setEditModal({ isOpen: true, user: user as any })}
                            className="p-1.5 text-gray-500 hover:text-[#0bc6e3] bg-[#0a0a0c] border border-transparent hover:border-[#0bc6e3]/30 hover:bg-[#0bc6e3]/10 rounded shadow-sm transition-all"
                            title="Modificar Vínculo"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, userId: user.id_usuario, nickname: user.nickname })}
                            className={`p-1.5 rounded bg-[#0a0a0c] transition-all border border-transparent ${user.id_rol === 3 ? "text-gray-700 cursor-not-allowed" : "text-gray-500 hover:text-white hover:bg-[#ef4444] hover:border-[#ef4444]/50 shadow-sm"}`} 
                            disabled={user.id_rol === 3}
                            title={user.id_rol === 3 ? "Entidad Superior inmutable" : "Borrar Rastro"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALES */}
      <ConfirmModal 
        isOpen={deleteModal.isOpen} title="Desterrar Alma"
        message={`¿Estás seguro de que deseas eliminar permanentemente a la leyenda ${deleteModal.nickname}? Esta acción destruirá su rastro en los archivos de la liga.`}
        onCancel={() => setDeleteModal({ isOpen: false, userId: 0, nickname: '' })}
        onConfirm={() => { confirmDelete(deleteModal.userId, deleteModal.nickname); setDeleteModal({ isOpen: false, userId: 0, nickname: '' }); }}
      />
      <UserEditModal 
        isOpen={editModal.isOpen} user={editModal.user}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        onSuccess={() => { setEditModal({ isOpen: false, user: null }); fetchUsers(); }}
      />
    </div>
  );
}