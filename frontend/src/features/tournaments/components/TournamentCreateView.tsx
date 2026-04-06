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
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      
      {/* HEADER RESPONSIVO */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button onClick={() => navigate('/tournaments')} className="text-gray-400 hover:text-white transition p-1">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px]" />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Nueva Competencia</h1>
      </div>

      <div className="rounded-xl border border-ls-gold/20 bg-ls-surface p-5 sm:p-8 shadow-2xl">
        <div className="mb-6 sm:mb-8 flex justify-center text-ls-gold opacity-30">
          <Trophy size={48} className="sm:w-[64px] sm:h-[64px]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Nombre del Torneo</label>
            <input 
              type="text" required placeholder="Ej. Torneo de Apertura 2026"
              className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary outline-none transition-colors"
              value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Modalidad</label>
              <select 
                className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary outline-none transition-colors"
                value={formData.modalidad} onChange={e => setFormData({...formData, modalidad: e.target.value})}
              >
                <option value="1v1">1 vs 1</option>
                <option value="2v2">2 vs 2</option>
                <option value="3v3">3 vs 3</option>
                <option value="4v4">4 vs 4</option>
                <option value="5v5">5 vs 5</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Fecha de Inicio</label>
              <input 
                type="date" required
                className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary outline-none transition-colors"
                value={formData.fecha_inicio} onChange={e => setFormData({...formData, fecha_inicio: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-2 border-t border-gray-800">
            <button type="submit" className="w-full sm:w-auto rounded-lg bg-ls-primary px-10 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-ls-bg transition hover:bg-ls-primary-hover shadow-lg shadow-ls-primary/20">
              Publicar Torneo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}