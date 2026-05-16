import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Trophy } from 'lucide-react';
import { tournamentService } from '../services/tournament.service';

export default function TournamentCreateView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    modalidad: '5v5',
    fecha_inicio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tournamentService.create(formData);
      toast.success('¡Torneo creado exitosamente!');
      navigate('/tournaments');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear el torneo');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0bc6e3]/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER RESPONSIVO */}
      <div className="flex items-center gap-4 border-b border-gray-800/60 pb-5">
        <button onClick={() => navigate('/tournaments')} className="group rounded-full bg-[#121418] border border-gray-800 p-2 text-gray-400 hover:text-[#0bc6e3] hover:border-[#0bc6e3]/50 hover:bg-[#0bc6e3]/10 transition-all">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px] group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Crear Nueva <span className="text-[#0bc6e3] drop-shadow-[0_0_10px_rgba(11,198,227,0.3)]">Competencia</span>
        </h1>
      </div>

      <div className="rounded-xl border border-[#c8aa6e]/20 bg-[#121418]/80 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent opacity-70"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#c8aa6e]/20 blur-xl"></div>
            <Trophy size={64} className="text-[#c8aa6e] drop-shadow-[0_0_15px_rgba(200,170,110,0.5)] sm:w-[80px] sm:h-[80px] relative z-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
          <div>
            <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Título de la Copa</label>
            <input 
              type="text" required placeholder="Ej. Torneo Clasificatorio Hielo 2026"
              className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base text-white transition-all duration-300 focus:border-[#c8aa6e] focus:bg-[#0a0a0c] focus:outline-none focus:ring-1 focus:ring-[#c8aa6e] focus:shadow-[0_0_15px_rgba(200,170,110,0.2)] placeholder-gray-600 font-bold"
              value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Modalidad de Combate</label>
              <select 
                className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base font-bold text-white transition-all duration-300 focus:border-[#0bc6e3] focus:bg-[#0a0a0c] focus:outline-none focus:ring-1 focus:ring-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)]"
                value={formData.modalidad} onChange={e => setFormData({...formData, modalidad: e.target.value})}
              >
                <option value="1v1">Duelo (1 vs 1)</option>
                <option value="2v2">Escaramuza (2 vs 2)</option>
                <option value="3v3">Bosque Retorcido (3 vs 3)</option>
                <option value="4v4">Táctico (4 vs 4)</option>
                <option value="5v5">Grieta del Invocador (5 vs 5)</option>
              </select>
            </div>

           <div>
              <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Día de Invocación</label>
              <input 
                type="date" required
                className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base font-bold text-white transition-all duration-300 focus:border-[#0bc6e3] focus:bg-[#0a0a0c] focus:outline-none focus:ring-1 focus:ring-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] [color-scheme:dark]"
                value={formData.fecha_inicio} onChange={e => setFormData({...formData, fecha_inicio: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end pt-8 mt-4 border-t border-gray-800/60">
            <button type="submit" className="group/btn relative w-full sm:w-auto overflow-hidden rounded-lg bg-gradient-to-r from-[#0bc6e3] to-[#0ba6c3] px-12 py-4 text-sm sm:text-base font-black uppercase tracking-widest text-[#0a0a0c] transition-all hover:shadow-[0_0_25px_rgba(11,198,227,0.4)] hover:-translate-y-1 block">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Crear Torneo
              </span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover/btn:scale-100"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}