import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Shield, UploadCloud, X } from 'lucide-react';
import { teamService } from '../services/team.service';

export default function TeamCreateView() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return toast.error('Solo se permiten imágenes o GIFs');
      }
      
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setLogoFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nombre', nombre);
    
    if (logoFile) {
      formData.append('logo', logoFile);
    }

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
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              placeholder="Ej. T1 Esports"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Logo del Equipo (Imagen o GIF)</label>
            
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-ls-bg hover:bg-gray-800/50 hover:border-ls-primary transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400"><span className="font-bold text-ls-primary">Haz clic para subir</span> o arrastra y suelta</p>
                  <p className="text-xs text-gray-500">PNG, JPG o GIF (Max. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative mt-2 flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-gray-900/50 p-4 sm:p-6">
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-1.5 rounded-full transition-colors"
                  title="Quitar imagen"
                >
                  <X size={16} />
                </button>
                <span className="mb-3 text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold">Vista Previa</span>
                <img src={previewUrl} alt="Preview" className="max-h-24 sm:max-h-32 object-contain drop-shadow-lg rounded" />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 mt-2 border-t border-gray-800">
            <button type="submit" disabled={!nombre} className="w-full sm:w-auto rounded-lg bg-ls-primary px-10 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-ls-bg transition hover:bg-ls-primary-hover shadow-lg shadow-ls-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
              Crear Equipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}