import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/teams')} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Fundar Nuevo Equipo</h1>
      </div>

      <div className="rounded-lg border border-ls-gold/20 bg-ls-surface p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Nombre del Equipo</label>
            <input 
              type="text" 
              required 
              className="w-full rounded border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary focus:outline-none"
              value={formData.nombre} 
              onChange={e => setFormData({...formData, nombre: e.target.value})} 
              placeholder="Ej. T1 Esports"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">URL del Logo (Opcional)</label>
            <input 
              type="url" 
              className="w-full rounded border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary focus:outline-none"
              value={formData.logo_url} 
              onChange={e => setFormData({...formData, logo_url: e.target.value})} 
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>

          {/* Vista previa del logo si existe */}
          {formData.logo_url && (
            <div className="mt-4 flex flex-col items-center justify-center rounded border border-dashed border-gray-700 bg-ls-bg p-4">
              <span className="mb-2 text-xs text-gray-500">Vista Previa:</span>
              <img src={formData.logo_url} alt="Preview" className="max-h-32 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-800">
            <button type="submit" className="rounded bg-ls-primary px-8 py-3 font-bold text-ls-bg transition hover:bg-ls-primary-hover">
              Crear Equipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}