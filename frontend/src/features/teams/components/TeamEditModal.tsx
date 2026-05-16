import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, UploadCloud } from 'lucide-react';
import { teamService } from '../services/team.service';

interface TeamEditModalProps { isOpen: boolean; team: any; onClose: () => void; onSuccess: () => void; }

export default function TeamEditModal({ isOpen, team, onClose, onSuccess }: TeamEditModalProps) {
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('activo');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (team) {
      setNombre(team.nombre); setEstado(team.estado); setLogoFile(null);
      setPreviewUrl(team.logo_url ? `${import.meta.env.VITE_API_URL}${team.logo_url}` : null);
    }
  }, [team]);

  if (!isOpen || !team) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) return toast.error('Formatos mágicos (imágenes o GIFs) solamente');
      setLogoFile(file); setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre); formData.append('estado', estado);
    if (logoFile) formData.append('logo', logoFile);
    try {
      await teamService.update(team.id_equipo, formData); toast.success('Estandarte modificado'); onSuccess();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Error al sellar'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0c]/90 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-xl border border-[#0bc6e3]/30 bg-[#121418] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative">
        <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0bc6e3] to-transparent"></div>
        
        <div className="flex items-center justify-between border-b border-gray-800/80 bg-gradient-to-b from-[#1a1c23] to-transparent p-5">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">Reescribir <span className="text-[#0bc6e3]">Leyenda</span></h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white bg-gray-800/50 hover:bg-[#ef4444]/80 p-2 rounded-lg transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">Grito de Guerra (Nombre)</label>
            <input type="text" required className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/80 p-3.5 text-sm font-bold text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">Estatus en la Liga</label>
            <select className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/80 p-3.5 text-sm font-bold text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all uppercase tracking-wide appearance-none" value={estado} onChange={e => setEstado(e.target.value)}>
              <option className="bg-gray-900 text-white" value="activo">En Activo</option>
              <option className="bg-gray-900 text-white" value="inactivo">Letargo (Inactivo)</option>
              <option className="bg-gray-900 text-white" value="descalificado">Exiliado (Descalificado)</option>
              <option className="bg-gray-900 text-[#c8aa6e] font-black" value="campeon">Coronado (Campeón)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">Forjar Nuevo Emblema</label>
            {!previewUrl ? (
              <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700/60 rounded-xl cursor-pointer bg-[#0a0a0c]/40 hover:bg-[#0bc6e3]/5 hover:border-[#0bc6e3]/50 transition-all duration-300">
                <UploadCloud className="w-8 h-8 mb-2 text-[#a0aec0] group-hover:text-[#0bc6e3] group-hover:scale-110 transition-all drop-shadow-sm" />
                <span className="text-[11px] text-[#a0aec0] font-bold uppercase tracking-widest">Invocar imagen</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative flex flex-col items-center justify-center rounded-xl border border-[#0bc6e3]/30 bg-[#0a0a0c] p-4 shadow-[0_0_20px_rgba(11,198,227,0.1)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0bc6e3]/10 via-transparent to-transparent pointer-events-none"></div>
                <button type="button" onClick={() => {setLogoFile(null); setPreviewUrl(null);}} className="absolute top-2 right-2 bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/50 hover:bg-[#ef4444] hover:text-white p-1.5 rounded-lg transition-all z-20"><X size={14} /></button>
                <img src={previewUrl} className="h-24 w-24 object-cover border border-gray-700 rounded drop-shadow-[0_0_10px_rgba(11,198,227,0.2)] relative z-10" alt="Preview" />
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-800/80 flex gap-4">
            <button type="button" onClick={onClose} className="w-full rounded-lg border border-gray-700 bg-[#0a0a0c] py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-800 hover:text-white transition-all">Descartar</button>
            <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-[#0bc6e3] to-[#0ba6c3] py-3 text-xs font-black text-[#0a0a0c] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(11,198,227,0.4)] hover:-translate-y-0.5 transition-all">Sellar Destino</button>
          </div>
        </form>
      </div>
    </div>
  );
}