import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../services/user.service';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import UserEditModal from './UserEditModal';

interface User {
  id_usuario: number;
  nickname: string;
  elo: string;
  puntos_totales: number;
  estado: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: 0, nickname: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar los invocadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = async () => {
    try {
      await userService.delete(deleteModal.userId);
      toast.success(`Invocador ${deleteModal.nickname} eliminado de la grieta`);
      setDeleteModal({ isOpen: false, userId: 0, nickname: '' });
      fetchUsers();
    } catch (error) {
      toast.error('Error al eliminar invocador');
    }
  };

  const eloColors: Record<string, string> = {
    'Challenger': 'text-yellow-300', 'Gran Master': 'text-red-400', 'Master': 'text-purple-400',
    'Diamante': 'text-blue-400', 'Esmeralda': 'text-green-400', 'Platino': 'text-teal-400',
    'Oro': 'text-yellow-500', 'Plata': 'text-gray-300', 'Bronce': 'text-orange-700',
    'Hierro': 'text-gray-500', 'Unranked': 'text-gray-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Directorio de Invocadores</h1>
        <button 
          onClick={() => navigate('/users/new')}
          className="rounded bg-ls-primary px-4 py-2 text-sm font-bold text-ls-bg transition hover:bg-ls-primary-hover"
        >
          + Nuevo Invocador
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ls-gold/20 bg-ls-surface shadow-lg">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="border-b border-ls-gold/20 bg-ls-bg/50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">Nickname</th>
              <th className="px-6 py-4">Liga (Elo)</th>
              <th className="px-6 py-4">Puntos</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center">Cargando datos...</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id_usuario} className="border-b border-gray-800 transition hover:bg-ls-bg/30">
                  <td className="px-6 py-4 font-medium text-white">{user.nickname}</td>
                  <td className={`px-6 py-4 font-bold ${eloColors[user.elo] || 'text-white'}`}>{user.elo}</td>
                  <td className="px-6 py-4 text-ls-gold font-mono">{user.puntos_totales}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      user.estado === 'activo' ? 'bg-ls-success/10 text-ls-success' : 'bg-ls-danger/10 text-ls-danger'
                    }`}>
                      {user.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => setEditModal({ isOpen: true, user: user as any })}
                        className="text-gray-400 hover:text-ls-primary transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setDeleteModal({ isOpen: true, userId: user.id_usuario, nickname: user.nickname })}
                        className="text-gray-400 hover:text-ls-danger transition" 
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALES */}
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Eliminar Invocador"
        message={`¿Estás seguro de que deseas eliminar permanentemente a ${deleteModal.nickname}? Esta acción no se puede deshacer y borrará sus estadísticas.`}
        onCancel={() => setDeleteModal({ isOpen: false, userId: 0, nickname: '' })}
        onConfirm={confirmDelete}
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