import { Gift, Star, PlusCircle, AlertCircle } from 'lucide-react';
import { useRewards } from '../hooks/useRewards';

export default function RewardsView() {
  const { 
    rewards, loading, currentUser, canManageRewards, 
    newReward, setNewReward, handleCreateReward, handleRedeem 
  } = useRewards();

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none -z-10"></div>
      
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-gray-800/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter bg-gradient-to-b from-white to-[#10b981] bg-clip-text text-transparent uppercase drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Bóveda del Artesano</h1>
          <p className="text-xs sm:text-sm font-bold text-[#a0aec0] uppercase tracking-widest mt-2">Canjea tus trofeos por reliquias exclusivas.</p>
        </div>
        
        {currentUser && (
          <div className="w-full md:w-auto relative group flex items-center justify-between md:justify-start gap-5 bg-gradient-to-r from-[#0a0a0c] to-[#121418] rounded-xl p-4 sm:p-5 border border-gray-700/60 shadow-xl overflow-hidden">
            <div className="absolute top-0 w-full h-[2px] bg-[#c8aa6e]"></div>
            <span className="text-xs sm:text-sm text-[#a0aec0] font-black uppercase tracking-widest">Esencia Vital:</span>
            <span className="text-2xl sm:text-3xl font-black text-[#c8aa6e] flex items-center gap-2 drop-shadow-[0_0_10px_rgba(200,170,110,0.5)]">
              {currentUser.puntos_totales} <Star size={24} fill="currentColor" className="sm:w-[28px] sm:h-[28px] mb-0.5" />
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* CATÁLOGO DE PREMIOS */}
        <div className={canManageRewards ? "lg:col-span-2" : "lg:col-span-3"}>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
               <div className="text-sm sm:text-base text-[#10b981] animate-pulse font-black uppercase tracking-widest flex items-center gap-3">
                  <Gift size={24} className="animate-bounce drop-shadow-[0_0_8px_#10b981]" /> Revelando reliquias...
               </div>
            </div>
          ) : rewards.length === 0 ? (
            <div className="text-center py-16 text-[#a0aec0] font-bold uppercase tracking-widest text-xs italic bg-[#0a0a0c]/40 border border-dashed border-gray-700/60 rounded-xl">La bóveda de botín fue vaciada.</div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 ${!canManageRewards && 'md:grid-cols-3'}`}>
              {rewards.map(r => {
                const canAfford = currentUser?.puntos_totales >= r.costo_puntos;
                const hasStock = r.stock > 0;

                return (
                  <div key={r.id_recompensa} className={`group relative overflow-hidden rounded-xl border transition-all duration-300 flex flex-col ${hasStock ? 'border-[#10b981]/20 bg-[#121418]/80 hover:border-[#10b981]/60 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(16,185,129,0.15)]' : 'border-[#ef4444]/20 bg-gray-900/50 opacity-70 grayscale-[0.5]'}`}>
                    
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
                    
                    <div className="h-32 sm:h-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a0a0c] to-[#121418] flex items-center justify-center shrink-0 border-b border-gray-800 relative z-0">
                      <div className={`absolute inset-0 bg-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                      <Gift size={56} className={`sm:w-[64px] sm:h-[64px] transition-transform duration-500 group-hover:scale-110 ${hasStock ? "text-[#10b981] drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "text-gray-600"}`} />
                    </div>
                    
                    <div className="p-5 sm:p-6 flex-1 flex flex-col bg-gradient-to-b from-[#121418] to-[#0a0a0c] relative z-10 w-full">
                      <h3 className={`font-black text-lg sm:text-xl truncate uppercase tracking-wide mb-1 ${hasStock ? 'text-white' : 'text-gray-400'}`} title={r.nombre_recompensa}>{r.nombre_recompensa}</h3>
                      <p className="text-[11px] sm:text-xs text-[#a0aec0] font-medium h-10 line-clamp-2 leading-relaxed">{r.descripcion}</p>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-gray-800/80 pt-4 sm:pt-5 mb-5 sm:mb-6">
                        <div>
                          <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Tributo</div>
                          <div className="text-[#c8aa6e] font-black flex items-center gap-1.5 text-base sm:text-lg tabular-nums border border-[#c8aa6e]/20 bg-[#c8aa6e]/5 px-2 py-0.5 rounded">
                            {r.costo_puntos} <Star size={14} className="fill-[#c8aa6e] drop-shadow-[0_0_5px_rgba(200,170,110,0.5)]" />
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black text-right tracking-widest mb-0.5">Cofres (Stock)</div>
                          <div className={`text-right font-black text-sm sm:text-base tabular-nums ${hasStock ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                            {hasStock ? `${r.stock} Restantes` : 'EXTINTO'}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleRedeem(r.id_recompensa, r.nombre_recompensa)}
                        disabled={!hasStock || !canAfford}
                        className={`group/btn relative w-full overflow-hidden rounded-lg py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-widest transition-all ${
                          hasStock && canAfford
                            ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-[#0a0a0c] shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                            : 'bg-[#0a0a0c] text-gray-600 cursor-not-allowed border border-gray-800'
                        }`}
                      >
                        <span className="relative z-10 flex justify-center items-center gap-2">
                          {!hasStock ? 'Sin Cofres' : !canAfford ? 'Esencia Insuficiente' : 'Adquirir Botín'}
                        </span>
                        {hasStock && canAfford && <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover/btn:scale-100"></div>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PANEL ADMINISTRADOR: FORJAR PREMIO */}
        {canManageRewards && (
          <div className="rounded-xl border border-[#c8aa6e]/30 bg-[#121418]/80 backdrop-blur-md p-6 h-fit shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group/admin">
            <div className="absolute top-0 left-0 w-3 h-full bg-[#c8aa6e]"></div>
            <h3 className="text-base sm:text-lg font-black text-[#c8aa6e] flex items-center gap-3 mb-6 sm:mb-8 uppercase tracking-widest border-b border-gray-800/60 pb-3">
              <PlusCircle size={22} className="drop-shadow-[0_0_5px_rgba(200,170,110,0.5)]" /> Forja de Artesanía
            </h3>
            
            <form onSubmit={handleCreateReward} className="space-y-5 sm:space-y-6">
              <div>
                <label className="text-[10px] sm:text-xs text-[#a0aec0] mb-2 block uppercase font-black tracking-widest">Reliquia (Título)</label>
                <input type="text" required placeholder="Ej. Cofre Artesano" className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3.5 text-sm font-bold text-white rounded-lg focus:border-[#c8aa6e] focus:shadow-[0_0_10px_rgba(200,170,110,0.2)] outline-none transition-all placeholder-gray-600"
                  value={newReward.nombre_recompensa} onChange={e => setNewReward({...newReward, nombre_recompensa: e.target.value})} />
              </div>
              
              <div>
                <label className="text-[10px] sm:text-xs text-[#a0aec0] mb-2 block uppercase font-black tracking-widest">Leyenda (Descripción)</label>
                <textarea rows={2} className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3.5 text-sm font-medium text-white rounded-lg focus:border-[#c8aa6e] focus:shadow-[0_0_10px_rgba(200,170,110,0.2)] outline-none transition-all resize-none"
                  value={newReward.descripcion} onChange={e => setNewReward({...newReward, descripcion: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-[10px] sm:text-xs text-white mb-2 flex items-center gap-1.5 font-black uppercase tracking-widest">Valor <Star size={10} className="fill-[#c8aa6e] text-[#c8aa6e]"/></label>
                  <input type="number" min="1" required className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3.5 text-sm font-black text-[#c8aa6e] rounded-lg text-center focus:border-[#c8aa6e] outline-none transition-all tabular-nums"
                    value={newReward.costo_puntos} onChange={e => setNewReward({...newReward, costo_puntos: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs text-white mb-2 block font-black uppercase tracking-widest">Volumen Inicial</label>
                  <input type="number" min="1" required className="w-full bg-[#0a0a0c]/80 border border-gray-700/60 p-3.5 text-sm font-black text-[#10b981] rounded-lg text-center focus:border-[#10b981] outline-none transition-all tabular-nums"
                    value={newReward.stock} onChange={e => setNewReward({...newReward, stock: Number(e.target.value)})} />
                </div>
              </div>
              
              <button type="submit" className="group/btn relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#c8aa6e] to-[#a88a4e] py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-[#0a0a0c] transition-all hover:shadow-[0_0_20px_rgba(200,170,110,0.4)] hover:-translate-y-1 block mt-4 border border-[#c8aa6e]/50">
                <span className="relative z-10 flex items-center justify-center gap-2">Ofrecer al Público</span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover/btn:scale-100"></div>
              </button>
            </form>
            
            <div className="mt-6 flex items-start gap-3 p-4 border border-[#c8aa6e]/20 bg-[#c8aa6e]/5 rounded-lg text-[10px] sm:text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider backdrop-blur-sm">
              <AlertCircle size={18} className="text-[#c8aa6e] shrink-0 mt-0.5" />
              <p className="leading-relaxed">Los tributos se cobrarán instantáneamente. Crea responsablemente para no desestabilizar la liga.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}