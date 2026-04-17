import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { api } from '../../../shared/services/api';
import { toast } from 'sonner';

export default function AssignPointsView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsInput, setPointsInput] = useState<Record<number, string>>({});
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Asume que tienes un endpoint que lista usuarios
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar invocadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAssignPoints = async (userId: number) => {
    const points = parseInt(pointsInput[userId], 10);
    if (!points || isNaN(points)) {
      toast.error('Ingresa una cantidad de puntos válida');
      return;
    }

    try {
      // Ajusta la URL a tu endpoint del backend que actualiza puntos
      await api.put(`/users/${userId}/points`, { puntos: points });
      toast.success('Puntos asignados correctamente');
      setPointsInput(prev => ({ ...prev, [userId]: '' })); // Limpiar input
      fetchUsers(); // Recargar datos
    } catch (error) {
      toast.error('Error al asignar puntos');
    }
  };

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (loading) return <div className="text-center py-20 text-ls-gold text-xl">Cargando invocadores...</div>;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter text-ls-gold uppercase drop-shadow-md">Asignar Puntos</h1>
        <p className="text-ls-primary font-medium tracking-widest uppercase text-xs sm:text-sm mt-2">Solo administradores</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ls-gold/30 bg-ls-surface shadow-2xl mx-1 sm:mx-0">
        <table className="w-full text-left">
          <thead className="bg-ls-gold/10 text-ls-gold uppercase text-[10px] sm:text-xs font-bold tracking-wider">
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4">Invocador</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">Puntos Actuales</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">Asignar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm sm:text-base">
            {currentItems.map((user) => (
              <tr key={user.id_usuario} className="transition hover:bg-ls-primary/10">
                <td className="px-4 sm:px-6 py-4 font-bold text-white">{user.nickname}</td>
                <td className="px-4 sm:px-6 py-4 text-center font-black text-ls-gold">{user.puntos_totales}</td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <input 
                      type="number" 
                      placeholder="+ Pts"
                      className="w-20 md:w-24 px-2 py-1 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-ls-primary"
                      value={pointsInput[user.id_usuario] || ''}
                      onChange={(e) => setPointsInput({...pointsInput, [user.id_usuario]: e.target.value})}
                    />
                    <button 
                      onClick={() => handleAssignPoints(user.id_usuario)}
                      className="bg-ls-primary hover:bg-ls-primary/80 text-white p-1.5 rounded transition"
                      title="Guardar Puntos"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-2 rounded bg-ls-surface border border-ls-gold/30 text-ls-gold disabled:opacity-50 hover:bg-ls-gold/10"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-ls-primary font-bold">Página {currentPage} de {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-2 rounded bg-ls-surface border border-ls-gold/30 text-ls-gold disabled:opacity-50 hover:bg-ls-gold/10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}