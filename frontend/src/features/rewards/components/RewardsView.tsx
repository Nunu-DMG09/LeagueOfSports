import { Gift, Star, PlusCircle, AlertCircle } from 'lucide-react';
import { useRewards } from '../hooks/useRewards';

export default function RewardsView() {
  const { 
    rewards, loading, currentUser, canManageRewards, 
    newReward, setNewReward, handleCreateReward, handleRedeem 
  } = useRewards();

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ls-gold/20 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black italic tracking-tighter text-ls-gold uppercase">Tienda Hextech</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Canjea tus puntos competitivos por premios exclusivos.</p>
        </div>
        {currentUser && (
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4 bg-gray-900/80 rounded-xl p-3 sm:p-4 border border-gray-700 shadow-xl">
            <span className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wider">Tus Puntos:</span>
            <span className="text-xl sm:text-2xl font-black text-ls-primary flex items-center gap-1.5">
              {currentUser.puntos_totales} <Star size={20} fill="currentColor" className="sm:w-[24px] sm:h-[24px]" />
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* CATÁLOGO DE PREMIOS */}
        <div className={canManageRewards ? "lg:col-span-2" : "lg:col-span-3"}>
          {loading ? (
            <div className="text-center py-10 sm:py-20 animate-pulse text-ls-primary font-bold text-sm sm:text-base">Abriendo la bóveda...</div>
          ) : rewards.length === 0 ? (
            <div className="text-center py-10 sm:py-20 text-gray-500 italic border border-gray-800 rounded-xl bg-ls-surface text-sm sm:text-base">La tienda está vacía por ahora.</div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${!canManageRewards && 'md:grid-cols-3'}`}>
              {rewards.map(r => (
                <div key={r.id_recompensa} className="relative overflow-hidden rounded-xl border border-ls-gold/20 bg-ls-surface p-1 sm:p-1.5 transition hover:border-ls-primary hover:shadow-[0_0_15px_rgba(11,198,227,0.2)] flex flex-col">
                  <div className="h-28 sm:h-32 bg-gradient-to-tr from-gray-900 to-gray-800 flex items-center justify-center rounded-t-lg shrink-0">
                    <Gift size={40} className={`sm:w-[48px] sm:h-[48px] ${r.stock > 0 ? "text-ls-primary" : "text-gray-600"}`} />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-base sm:text-lg text-white mb-1 truncate" title={r.nombre_recompensa}>{r.nombre_recompensa}</h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 h-10 line-clamp-2">{r.descripcion}</p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-gray-800 pt-3 sm:pt-4 mb-4 sm:mb-5">
                      <div>
                        <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest">Costo</div>
                        <div className="text-ls-gold font-bold flex items-center gap-1 text-sm sm:text-base">
                          {r.costo_puntos} <Star size={12} className="sm:w-[14px] sm:h-[14px]" />
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold text-right tracking-widest">Stock</div>
                        <div className={`text-right font-bold text-sm sm:text-base ${r.stock > 0 ? 'text-white' : 'text-ls-danger'}`}>
                          {r.stock > 0 ? `${r.stock} disp.` : 'Agotado'}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRedeem(r.id_recompensa, r.nombre_recompensa)}
                      disabled={r.stock <= 0 || currentUser?.puntos_totales < r.costo_puntos}
                      className={`w-full py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-lg ${
                        r.stock > 0 && currentUser?.puntos_totales >= r.costo_puntos
                          ? 'bg-ls-primary text-ls-bg hover:bg-ls-primary-hover shadow-ls-primary/20' 
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700 shadow-none'
                      }`}
                    >
                      {r.stock <= 0 ? 'Sin Existencias' : currentUser?.puntos_totales < r.costo_puntos ? 'Puntos Insuficientes' : 'Canjear Premio'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANEL ADMINISTRADOR: CREAR PREMIO */}
        {canManageRewards && (
          <div className="rounded-xl border border-dashed border-ls-gold/50 bg-ls-surface p-5 sm:p-6 h-fit shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-ls-gold flex items-center gap-2 mb-5 sm:mb-6">
              <PlusCircle size={20} /> Inventario Admin
            </h3>
            <form onSubmit={handleCreateReward} className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-[10px] sm:text-xs text-gray-400 mb-1.5 block uppercase font-bold tracking-wider">Nombre del Premio</label>
                <input type="text" required placeholder="Ej. 1380 RP" className="w-full bg-ls-bg border border-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white rounded-lg focus:border-ls-primary outline-none transition-colors"
                  value={newReward.nombre_recompensa} onChange={e => setNewReward({...newReward, nombre_recompensa: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-gray-400 mb-1.5 block uppercase font-bold tracking-wider">Descripción</label>
                <textarea rows={2} className="w-full bg-ls-bg border border-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white rounded-lg focus:border-ls-primary outline-none transition-colors"
                  value={newReward.descripcion} onChange={e => setNewReward({...newReward, descripcion: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[10px] sm:text-xs text-ls-gold mb-1.5 block font-bold uppercase tracking-wider">Precio (Pts)</label>
                  <input type="number" min="1" required className="w-full bg-ls-bg border border-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white rounded-lg text-center focus:border-ls-gold outline-none transition-colors"
                    value={newReward.costo_puntos} onChange={e => setNewReward({...newReward, costo_puntos: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 mb-1.5 block font-bold uppercase tracking-wider">Stock Inicial</label>
                  <input type="number" min="1" required className="w-full bg-ls-bg border border-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white rounded-lg text-center focus:border-ls-primary outline-none transition-colors"
                    value={newReward.stock} onChange={e => setNewReward({...newReward, stock: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-ls-gold text-ls-bg text-sm sm:text-base font-bold py-2.5 sm:py-3 rounded-lg hover:bg-ls-gold-hover transition mt-2 shadow-lg shadow-ls-gold/20">
                Generar en Tienda
              </button>
            </form>
            <div className="mt-5 sm:mt-6 flex items-start gap-2 p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-800 text-[10px] sm:text-xs text-gray-400">
              <AlertCircle size={16} className="text-ls-primary shrink-0" />
              <p>Los usuarios verán este premio inmediatamente. El canje y resta de stock es automático.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}