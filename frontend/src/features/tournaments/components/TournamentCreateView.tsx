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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tournaments')} className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Configurar Nueva Competencia</h1>
      </div>

      <div className="rounded-lg border border-ls-gold/20 bg-ls-surface p-8 shadow-2xl">
        <div className="mb-8 flex justify-center text-ls-gold opacity-50">
          <Trophy size={64} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Nombre del Torneo</label>
            <input 
              type="text" required placeholder="Ej. Torneo de Apertura 2026"
              className="w-full rounded border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary outline-none"
              value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Modalidad</label>
              <select 
                className="w-full rounded border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary outline-none"
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
              <label className="mb-1 block text-sm text-gray-400">Fecha de Inicio</label>
              <input 
                type="date" required
                className="w-full rounded border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary outline-none"
                value={formData.fecha_inicio} onChange={e => setFormData({...formData, fecha_inicio: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-800">
            <button type="submit" className="rounded bg-ls-primary px-10 py-3 font-bold text-ls-bg transition hover:bg-ls-primary-hover">
              Publicar Torneo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}