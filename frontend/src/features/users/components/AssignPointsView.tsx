import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Save, Star } from 'lucide-react';
import { api } from '../../../shared/services/api';
import { toast } from 'sonner';

export default function AssignPointsView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsInput, setPointsInput] = useState<Record<number, string>>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try { setLoading(true); const { data } = await api.get('/users'); setUsers(data); } 
    catch (error) { toast.error('Fallo de conexión estelar'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAssignPoints = async (userId: number) => {
    const points = parseInt(pointsInput[userId], 10);
    if (!points || isNaN(points)) return toast.error('Ingresa una reserva válida');
    try {
      await api.put(`/users/${userId}/points`, { puntos: points });
      toast.success('Poder transferido exitosamente');
      setPointsInput(prev => ({ ...prev, [userId]: '' })); fetchUsers();
    } catch (error) { toast.error('Disrupción en la entrega de esencia'); }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm sm:text-base text-[#c8aa6e] animate-pulse font-black uppercase tracking-widest flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-[#c8aa6e] shadow-[0_0_10px_#c8aa6e] animate-ping"></div> Recuperando energía estelar...
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-10 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c8aa6e]/10 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      <div className="text-center px-4 py-4 sm:py-6 relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-32 h-32 bg-[#c8aa6e]/20 blur-[50px] -z-10"></div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-b from-[#f0e6d2] via-[#c8aa6e] to-[#a88a4e] bg-clip-text text-transparent uppercase tracking-wider drop-shadow-[0_0_15px_rgba(200,170,110,0.5)]">
          Reparto de Gloria
        </h1>
        <p className="text-[#a0aec0] font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mt-3 flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#c8aa6e]/50"></span> Funciones de Arquitecto (Nivel Supremo) <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#c8aa6e]/50"></span>
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800/80 bg-[#121418]/80 backdrop-blur-md shadow-2xl mx-1 sm:mx-0 relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent opacity-60"></div>
        <table className="w-full text-left">
          <thead className="bg-[#0a0a0c]/80 text-[#c8aa6e] uppercase text-[10px] sm:text-xs font-black tracking-widest border-b border-gray-800/80">
            <tr>
              <th className="px-5 sm:px-6 py-4 sm:py-5">Seudónimo Legendario</th>
              <th className="px-5 sm:px-6 py-4 sm:py-5 text-center">Esencia Actual</th>
              <th className="px-5 sm:px-6 py-4 sm:py-5 text-center">Infusión Dirigida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 text-sm sm:text-base font-medium">
            {currentItems.map((user) => (
              <tr key={user.id_usuario} className="transition-all duration-300 hover:bg-[#0a0a0c]/80 group">
                <td className="px-5 sm:px-6 py-4 lg:py-5">
                  <span className="font-black text-white group-hover:text-[#c8aa6e] transition-colors">{user.nickname}</span>
                </td>
                <td className="px-5 sm:px-6 py-4 lg:py-5 text-center">
                  <div className="inline-flex items-center justify-center gap-2 bg-[#0a0a0c] px-4 py-1.5 rounded-lg border border-gray-800/80 shadow-inner">
                   <span className="font-black text-[#c8aa6e] text-lg">{user.puntos_totales}</span> <Star size={14} className="fill-[#c8aa6e] text-[#c8aa6e] drop-shadow-[0_0_5px_rgba(200,170,110,0.8)]"/>
                  </div>
                </td>
                <td className="px-5 sm:px-6 py-4 lg:py-5">
                  <div className="flex items-center justify-center gap-3">
                    <input 
                      type="number" placeholder="Bonus"
                      className="w-24 px-3 py-2.5 rounded-lg bg-[#0a0a0c]/60 border border-gray-700 font-bold text-center text-white focus:outline-none focus:border-[#c8aa6e] focus:shadow-[0_0_10px_rgba(200,170,110,0.2)] transition-all placeholder-gray-600"
                      value={pointsInput[user.id_usuario] || ''} onChange={(e) => setPointsInput({...pointsInput, [user.id_usuario]: e.target.value})}
                    />
                    <button 
                      onClick={() => handleAssignPoints(user.id_usuario)}
                      className="bg-gradient-to-b from-[#c8aa6e] to-[#a88a4e] hover:shadow-[0_0_15px_rgba(200,170,110,0.5)] text-[#0a0a0c] p-2.5 flex items-center justify-center rounded-lg transition-all hover:scale-105" title="Transferir"
                    >
                      <Save size={18} className="font-black" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación Tematizada */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="group p-2.5 rounded-full bg-[#121418] border border-gray-700 text-gray-400 disabled:opacity-30 hover:border-[#c8aa6e] hover:text-[#c8aa6e] hover:bg-[#c8aa6e]/10 transition-all">
            <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <span className="text-[#a0aec0] font-black uppercase tracking-widest text-[11px] sm:text-xs bg-[#0a0a0c]/50 px-4 py-2 border border-gray-800 rounded-lg">
            Volumen <span className="text-[#c8aa6e] text-sm">{currentPage}</span> / {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="group p-2.5 rounded-full bg-[#121418] border border-gray-700 text-gray-400 disabled:opacity-30 hover:border-[#c8aa6e] hover:text-[#c8aa6e] hover:bg-[#c8aa6e]/10 transition-all">
            <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}