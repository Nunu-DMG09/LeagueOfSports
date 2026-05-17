import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../services/user.service';
import { X, Settings } from 'lucide-react';

interface UserEditModalProps { isOpen: boolean; user: any; onClose: () => void; onSuccess: () => void; }

export default function UserEditModal({ isOpen, user, onClose, onSuccess }: UserEditModalProps) {
  const [formData, setFormData] = useState({ id_rol: 1, nickname: '', elo: 'Unranked', estado: 'activo', password: '', confirmPassword: '' });

  useEffect(() => {
    if (user) {
      setFormData({ id_rol: user.id_rol || 1, nickname: user.nickname || '', elo: user.elo || 'Unranked', estado: user.estado || 'activo', password: '', confirmPassword: '' });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) return toast.error('Las contraseñas destellan en caos (No coinciden)');
    try {
      const dataToUpdate: any = { id_rol: Number(formData.id_rol), nickname: formData.nickname, elo: formData.elo, estado: formData.estado };
      if (formData.password) dataToUpdate.password = formData.password;
      await userService.update(user.id_usuario, dataToUpdate);
      toast.success('Líneas de código reescritas con éxito');
      onSuccess();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Fallo en la manipulación'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0c]/90 p-4 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-xl border border-[#0bc6e3]/30 bg-[#121418] shadow-[0_0_40px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0bc6e3] to-transparent"></div>
        
        {/* HEADER MODAL */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-800/80 p-5 lg:p-6 bg-gradient-to-b from-[#1a1c23] to-transparent">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <Settings className="text-[#0bc6e3]" /> Código de <span className="text-[#0bc6e3]">{user.nickname}</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white bg-gray-800/50 hover:bg-[#ef4444]/80 p-2 rounded-lg transition-all"><X size={20} /></button>
        </div>

        {/* BODY MODAL */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay">
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6 sm:space-y-8 relative z-10">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">Identidad Pública</label>
                <input type="text" className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/80 p-3.5 sm:p-4 text-sm font-bold text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} required />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">Permisos (Rol)</label>
                <select className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/80 p-3.5 sm:p-4 text-sm font-bold text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all appearance-none uppercase" value={formData.id_rol} onChange={e => setFormData({...formData, id_rol: Number(e.target.value)})}>
                  <option className="bg-gray-900" value={1}>Humano (Usuario)</option>
                  <option className="bg-gray-900 text-[#a855f7]" value={2}>Moderador (Admin)</option>
                  <option className="bg-gray-900 text-[#c8aa6e]" value={3}>Arquitecto (Super Admin)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">MMR Configurado</label>
                <select className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/80 p-3.5 sm:p-4 text-sm font-black text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all appearance-none uppercase tracking-wider" value={formData.elo} onChange={e => setFormData({...formData, elo: e.target.value})}>
                  {['Unranked','Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Master','Gran Master','Challenger'].map(e => <option className="bg-gray-900" key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">Estado Vital</label>
                <select className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/80 p-3.5 sm:p-4 text-sm font-black text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all appearance-none uppercase tracking-wider" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                  <option className="bg-gray-900 text-[#10b981]" value="activo">En Línea (Activo)</option>
                  <option className="bg-gray-900 text-[#ef4444]" value="inactivo">Desterrado (Inactivo)</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-6 border-t border-gray-800/80">
                <div className="flex items-center gap-3 bg-[#0bc6e3]/5 border border-[#0bc6e3]/20 p-4 rounded-lg shadow-inner">
                  <div className="w-2 h-2 bg-[#0bc6e3] rounded-full animate-pulse shadow-[0_0_5px_#0bc6e3]"></div>
                  <p className="text-[11px] sm:text-xs font-bold text-[#a0aec0] uppercase tracking-widest">Escribe en las runas inferiores <span className="text-white">solo si deseas sobreescribir</span> la palabra secreta.</p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">Nueva Runa</label>
                <input type="password" placeholder="Mantener intacto" className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/80 p-3.5 sm:p-4 text-sm text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all tracking-widest font-bold placeholder-gray-600" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#a0aec0]">Replicar Runa</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/80 p-3.5 sm:p-4 text-sm text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all tracking-widest font-bold placeholder-gray-600" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
            </div>

            {/* FOOTER MODAL */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-800/80">
              <button type="button" onClick={onClose} className="w-full sm:w-auto rounded-lg border border-gray-700 bg-[#0a0a0c] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-800 hover:text-white transition">Cancelar</button>
              <button type="submit" className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-[#0bc6e3] to-[#0ba6c3] px-10 py-3.5 text-xs font-black uppercase tracking-widest text-[#0a0a0c] hover:shadow-[0_0_20px_rgba(11,198,227,0.4)] hover:-translate-y-0.5 transition-all">Sellar Destino</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}