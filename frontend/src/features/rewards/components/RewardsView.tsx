import { useEffect, useState } from 'react';
import { Gift, Star, PlusCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { rewardService } from '../services/reward.service';

export default function RewardsView() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Formulario rápido de administrador
  const [newReward, setNewReward] = useState({ nombre_recompensa: '', descripcion: '', costo_puntos: 100, stock: 10 });

  const loadRewards = async () => {
    try {
      const data = await rewardService.getAll();
      setRewards(data);
    } catch (error) {
      toast.error('Error al cargar la tienda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
    // Obtener usuario actual del localStorage (lo guardamos en el login)
    const storedUser = localStorage.getItem('user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await rewardService.create(newReward);
      toast.success('Nueva recompensa añadida a la tienda');
      setNewReward({ nombre_recompensa: '', descripcion: '', costo_puntos: 100, stock: 10 });
      loadRewards();
    } catch (error) {
      toast.error('Error al crear recompensa');
    }
  };

  const handleRedeem = async (rewardId: number, rewardName: string) => {
    if (!currentUser) return toast.error('Sesión no encontrada');
    if (!window.confirm(`¿Quieres canjear ${rewardName}?`)) return;

    try {
      await rewardService.redeem(rewardId, currentUser.id_usuario);
      toast.success(`¡Disfruta tu premio: ${rewardName}!`);
      loadRewards();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'No se pudo canjear');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-ls-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-ls-gold uppercase">Tienda de Puntos</h1>
          <p className="text-sm text-gray-400">Canjea tus puntos competitivos por premios exclusivos.</p>
        </div>
        {currentUser && (
          <div className="mt-4 md:mt-0 flex items-center gap-3 bg-gray-900 rounded-lg p-3 border border-gray-700 shadow-xl">
            <span className="text-sm text-gray-400">Tus Puntos:</span>
            <span className="text-2xl font-black text-ls-primary flex items-center gap-1">
              {currentUser.puntos_totales} <Star size={20} fill="currentColor" />
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* CATÁLOGO DE PREMIOS */}
        <div className="xl:col-span-2">
          {loading ? (
            <div className="text-center py-10 animate-pulse text-ls-primary">Abriendo la bóveda...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rewards.map(r => (
                <div key={r.id_recompensa} className="relative overflow-hidden rounded-xl border border-ls-gold/20 bg-ls-surface p-1 transition hover:border-ls-primary hover:shadow-[0_0_15px_rgba(11,198,227,0.2)]">
                  <div className="h-32 bg-gradient-to-tr from-gray-900 to-gray-800 flex items-center justify-center rounded-t-lg">
                    <Gift size={48} className={r.stock > 0 ? "text-ls-primary" : "text-gray-600"} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white mb-1">{r.nombre_recompensa}</h3>
                    <p className="text-xs text-gray-400 h-10 line-clamp-2">{r.descripcion}</p>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-4">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Costo</div>
                        <div className="text-ls-gold font-bold flex items-center gap-1">
                          {r.costo_puntos} <Star size={14} />
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold text-right">Stock</div>
                        <div className={`text-right font-bold ${r.stock > 0 ? 'text-white' : 'text-ls-danger'}`}>
                          {r.stock > 0 ? `${r.stock} disp.` : 'Agotado'}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRedeem(r.id_recompensa, r.nombre_recompensa)}
                      disabled={r.stock <= 0}
                      className={`w-full mt-4 py-2 rounded font-bold transition-all ${
                        r.stock > 0 
                          ? 'bg-ls-primary text-ls-bg hover:bg-ls-primary-hover' 
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      }`}
                    >
                      {r.stock > 0 ? 'Canjear Premio' : 'Sin Existencias'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANEL ADMINISTRADOR: CREAR PREMIO */}
        {currentUser?.id_rol !== 1 && (
          <div className="rounded-xl border border-dashed border-ls-gold/50 bg-ls-surface p-6 h-fit">
            <h3 className="font-bold text-ls-gold flex items-center gap-2 mb-6">
              <PlusCircle size={20} /> Inventario Admin
            </h3>
            <form onSubmit={handleCreateReward} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nombre del Premio</label>
                <input type="text" required placeholder="Ej. 1380 RP" className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded focus:border-ls-primary outline-none"
                  value={newReward.nombre_recompensa} onChange={e => setNewReward({...newReward, nombre_recompensa: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Descripción</label>
                <textarea rows={2} className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded focus:border-ls-primary outline-none"
                  value={newReward.descripcion} onChange={e => setNewReward({...newReward, descripcion: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-ls-gold mb-1 block font-bold">Precio (Puntos)</label>
                  <input type="number" min="1" required className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded text-center"
                    value={newReward.costo_puntos} onChange={e => setNewReward({...newReward, costo_puntos: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Stock Inicial</label>
                  <input type="number" min="1" required className="w-full bg-ls-bg border border-gray-700 p-2 text-white rounded text-center"
                    value={newReward.stock} onChange={e => setNewReward({...newReward, stock: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-ls-gold text-ls-bg font-bold py-2 rounded hover:bg-ls-gold-hover transition mt-2">
                Generar en Tienda
              </button>
            </form>
            <div className="mt-4 flex items-start gap-2 p-3 bg-gray-900 rounded border border-gray-800 text-xs text-gray-400">
              <AlertCircle size={14} className="text-ls-primary mt-0.5 shrink-0" />
              <p>Solo los administradores pueden añadir premios. El canje es automático y restará puntos de la base de datos.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}