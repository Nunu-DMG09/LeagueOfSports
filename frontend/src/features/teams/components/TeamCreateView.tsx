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
      if (!file.type.startsWith('image/')) return toast.error('Solo se permiten imágenes o GIFs');
      setLogoFile(file); setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => { setLogoFile(null); setPreviewUrl(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    if (logoFile) formData.append('logo', logoFile);

    try {
      await teamService.create(formData);
      toast.success('Equipo fundado con éxito');
      navigate('/teams');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear el equipo');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c8aa6e]/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER RESPONSIVO */}
      <div className="flex items-center gap-4 border-b border-gray-800/60 pb-5">
        <button onClick={() => navigate('/teams')} className="group rounded-full bg-[#121418] border border-gray-800 p-2 text-gray-400 hover:text-[#c8aa6e] hover:border-[#c8aa6e]/50 hover:bg-[#c8aa6e]/10 transition-all">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px] group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Forjar <span className="text-[#c8aa6e] drop-shadow-[0_0_10px_rgba(200,170,110,0.3)]">Estandarte</span>
        </h1>
      </div>

      <div className="rounded-xl border border-[#c8aa6e]/20 bg-[#121418]/80 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent opacity-70"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#0bc6e3]/20 blur-xl"></div>
            <Shield size={64} className="text-[#0bc6e3] drop-shadow-[0_0_15px_rgba(11,198,227,0.5)] sm:w-[80px] sm:h-[80px] relative z-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
          <div>
            <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Nombre del Gremio</label>
            <input 
              type="text" required placeholder="Ej. T1 Esports"
              className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base text-white transition-all duration-300 focus:border-[#0bc6e3] focus:bg-[#0a0a0c] focus:outline-none focus:ring-1 focus:ring-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] placeholder-gray-600 font-bold"
              value={nombre} onChange={e => setNombre(e.target.value)} 
            />
          </div>

          <div>
            <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Emblema del Equipo</label>
            
            {!previewUrl ? (
              <label className="group flex flex-col items-center justify-center w-full h-36 sm:h-48 border-2 border-dashed border-gray-700/60 rounded-xl cursor-pointer bg-[#0a0a0c]/40 hover:bg-[#0bc6e3]/5 hover:border-[#0bc6e3]/50 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-4 text-[#a0aec0] group-hover:text-[#0bc6e3] group-hover:scale-110 transition-all drop-shadow-sm" />
                  <p className="mb-2 text-sm text-[#a0aec0] font-bold"><span className="text-[#0bc6e3]">Conjurá la imagen</span> o arrástrala</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold">PNG, JPG, GIF (Max. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative mt-2 flex flex-col items-center justify-center rounded-xl border border-[#c8aa6e]/30 bg-[#0a0a0c] p-6 shadow-[0_0_20px_rgba(200,170,110,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c8aa6e]/10 via-transparent to-transparent pointer-events-none"></div>
                <button 
                  type="button" onClick={removeImage}
                  className="absolute top-3 right-3 bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/50 hover:bg-[#ef4444] hover:text-white p-2 rounded-lg transition-all z-20"
                  title="Purificar imagen"
                >
                  <X size={16} />
                </button>
                <span className="mb-4 text-[10px] sm:text-xs text-[#c8aa6e] uppercase tracking-widest font-black absolute top-4 left-4">Estandarte</span>
                <img src={previewUrl} alt="Preview" className="max-h-32 sm:max-h-40 object-contain drop-shadow-[0_0_15px_rgba(200,170,110,0.4)] rounded relative z-10" />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-8 mt-4 border-t border-gray-800/60">
            <button type="submit" disabled={!nombre} className="group/btn relative w-full sm:w-auto overflow-hidden rounded-lg bg-gradient-to-r from-[#c8aa6e] to-[#a88a4e] px-12 py-4 text-sm sm:text-base font-black uppercase tracking-widest text-[#0a0a0c] transition-all hover:shadow-[0_0_25px_rgba(200,170,110,0.4)] hover:-translate-y-1 block disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="relative z-10 flex items-center justify-center gap-2">Pintar Bandera</span>
              {!(!nombre) && <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover/btn:scale-100"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}