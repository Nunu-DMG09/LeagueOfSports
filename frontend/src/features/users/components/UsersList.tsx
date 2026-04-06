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
    'Challenger': 'text-yellow-300', 'Gran Master': 'text-red-400', 'Master': 'text-purple-400',
    'Diamante': 'text-blue-400', 'Esmeralda': 'text-green-400', 'Platino': 'text-teal-400',
    'Oro': 'text-yellow-500', 'Plata': 'text-gray-300', 'Bronce': 'text-orange-700',
    'Hierro': 'text-gray-500', 'Unranked': 'text-gray-600',
  };

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UsersIcon className="text-ls-primary shrink-0" size={28} /> Directorio de Invocadores
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">Consulta los perfiles y rangos de todos los jugadores registrados.</p>
        </div>
        
        {canManageUsers ? (
          <button 
            onClick={() => navigate('/users/new')}
            className="w-full sm:w-auto rounded-lg bg-ls-primary px-5 py-2.5 sm:py-2 text-sm font-bold text-ls-bg transition hover:bg-ls-primary-hover shadow-lg shadow-ls-primary/20 whitespace-nowrap"
          >
            + Nuevo Invocador
          </button>
        ) : (
          <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 sm:px-3 sm:py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-400">
            <ShieldAlert size={16} className="text-ls-gold" /> Solo Lectura
          </div>
        )}
      </div>

      {/* CONTENEDOR DE TABLA (Crucial min-w para celulares) */}
      <div className="overflow-x-auto rounded-xl border border-ls-gold/20 bg-ls-surface shadow-xl">
        <div className="min-w-[700px]">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-ls-gold/20 bg-gray-900/80 text-[10px] sm:text-xs uppercase text-gray-400">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold">Nickname</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Liga (Elo)</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Puntos</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Estado</th>
                {canManageUsers && <th className="px-4 sm:px-6 py-4 text-center font-bold">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan={canManageUsers ? 5 : 4} className="py-10 text-center animate-pulse text-ls-primary font-bold text-sm sm:text-base">Cargando base de datos...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={canManageUsers ? 5 : 4} className="py-10 text-center text-gray-500 italic text-sm sm:text-base">No hay invocadores registrados.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id_usuario} className="transition hover:bg-ls-bg/50">
                    <td className="px-4 sm:px-6 py-4">
                      <span className="font-bold text-white text-sm sm:text-base block">{user.nickname}</span>
                      <span className="text-[10px] text-gray-500 mt-0.5 block uppercase">{user.id_rol === 3 ? 'Super Admin' : user.id_rol === 2 ? 'Admin' : 'Usuario'}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`px-3 py-1 bg-gray-900 border border-gray-700 rounded font-bold text-xs sm:text-sm ${eloColors[user.elo] || 'text-white'}`}>
                        {user.elo}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-black text-white text-base">
                      {user.puntos_totales}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase ${
                        user.estado === 'activo' ? 'bg-ls-success/10 text-ls-success' : 'bg-ls-danger/10 text-ls-danger'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.estado === 'activo' ? 'bg-ls-success' : 'bg-ls-danger'}`}></span>
                        {user.estado}
                      </span>
                    </td>
                    
                    {/* BOTONES PROTEGIDOS */}
                    {canManageUsers && (
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <div className="flex justify-center gap-3 sm:gap-4">
                          <button 
                            onClick={() => setEditModal({ isOpen: true, user: user as any })}
                            className="p-1.5 text-gray-400 hover:text-ls-primary hover:bg-ls-primary/10 rounded transition"
                            title="Editar Invocador"
                          >
                            <Edit size={18} className="sm:w-[20px] sm:h-[20px]" />
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, userId: user.id_usuario, nickname: user.nickname })}
                            className={`p-1.5 transition rounded ${user.id_rol === 3 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-ls-danger hover:bg-ls-danger/10"}`} 
                            disabled={user.id_rol === 3}
                            title={user.id_rol === 3 ? "No puedes desterrar a un Super Admin" : "Desterrar Invocador"}
                          >
                            <Trash2 size={18} className="sm:w-[20px] sm:h-[20px]" />
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
        isOpen={deleteModal.isOpen}
        title="Eliminar Invocador"
        message={`¿Estás seguro de que deseas eliminar permanentemente a ${deleteModal.nickname}? Esta acción no se puede deshacer y borrará sus estadísticas.`}
        onCancel={() => setDeleteModal({ isOpen: false, userId: 0, nickname: '' })}
        onConfirm={() => {
          confirmDelete(deleteModal.userId, deleteModal.nickname);
          setDeleteModal({ isOpen: false, userId: 0, nickname: '' });
        }}
      />

      <UserEditModal 
        isOpen={editModal.isOpen}
        user={editModal.user}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        onSuccess={() => {
          setEditModal({ isOpen: false, user: null });
          fetchUsers();
        }}
      />
    </div>
  );
}