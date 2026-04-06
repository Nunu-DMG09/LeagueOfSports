import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Shield } from 'lucide-react';
import { teamService } from '../services/team.service';

export default function TeamCreateView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', logo_url: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teamService.create(formData);
      toast.success('Equipo fundado con éxito');
      navigate('/teams');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear el equipo');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      
      {/* HEADER RESPONSIVO */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button onClick={() => navigate('/teams')} className="text-gray-400 hover:text-white transition p-1">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px]" />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Fundar Nuevo Equipo</h1>
      </div>

      <div className="rounded-xl border border-ls-gold/20 bg-ls-surface p-5 sm:p-8 shadow-2xl">
        <div className="mb-6 sm:mb-8 flex justify-center text-ls-gold opacity-30">
          <Shield size={48} className="sm:w-[64px] sm:h-[64px]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Nombre del Equipo</label>
            <input 
              type="text" 
              required 
              className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
              value={formData.nombre} 
              onChange={e => setFormData({...formData, nombre: e.target.value})} 
              placeholder="Ej. T1 Esports"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">URL del Logo (Opcional)</label>
            <input 
              type="url" 
              className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
              value={formData.logo_url} 
              onChange={e => setFormData({...formData, logo_url: e.target.value})} 
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>

          {/* Vista previa del logo si existe */}
          {formData.logo_url && (
            <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-900/50 p-4 sm:p-6">
              <span className="mb-3 text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold">Vista Previa</span>
              <img src={formData.logo_url} alt="Preview" className="max-h-24 sm:max-h-32 object-contain drop-shadow-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}

          <div className="flex justify-end pt-6 mt-2 border-t border-gray-800">
            <button type="submit" className="w-full sm:w-auto rounded-lg bg-ls-primary px-10 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-ls-bg transition hover:bg-ls-primary-hover shadow-lg shadow-ls-primary/20">
              Crear Equipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}