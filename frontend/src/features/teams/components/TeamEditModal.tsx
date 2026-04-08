import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, UploadCloud } from 'lucide-react';
import { teamService } from '../services/team.service';

interface TeamEditModalProps {
  isOpen: boolean;
  team: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TeamEditModal({ isOpen, team, onClose, onSuccess }: TeamEditModalProps) {
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('activo');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (team) {
      setNombre(team.nombre);
      setEstado(team.estado);
      setLogoFile(null);
      setPreviewUrl(team.logo_url ? `${import.meta.env.VITE_API_URL}${team.logo_url}` : null);
    }
  }, [team]);

  if (!isOpen || !team) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) return toast.error('Solo imágenes o GIFs');
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('estado', estado);
    if (logoFile) formData.append('logo', logoFile);

    try {
      await teamService.update(team.id_equipo, formData);
      toast.success('Equipo actualizado');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-ls-gold/20 bg-ls-surface shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900/50 p-5">
          <h2 className="text-xl font-bold text-ls-gold">Editar Equipo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Nombre</label>
            <input type="text" required className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary outline-none"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Estado</label>
            <select className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary outline-none"
              value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="descalificado">Descalificado</option>
              <option value="campeon">Campeón</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Actualizar Logo</label>
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-ls-bg hover:border-ls-primary">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-sm text-gray-400">Click para subir nueva imagen</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative flex flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                <button type="button" onClick={() => {setLogoFile(null); setPreviewUrl(null);}} className="absolute top-2 right-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-1.5 rounded-full"><X size={14} /></button>
                <img src={previewUrl} className="max-h-20 object-contain" alt="Preview" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-800 flex gap-3">
            <button type="button" onClick={onClose} className="w-full rounded-lg border border-gray-600 py-3 font-bold text-gray-300 hover:bg-gray-800">Cancelar</button>
            <button type="submit" className="w-full rounded-lg bg-ls-primary py-3 font-bold text-ls-bg hover:bg-ls-primary-hover">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}