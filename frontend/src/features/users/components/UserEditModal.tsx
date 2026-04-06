import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../services/user.service';
import { X } from 'lucide-react';

interface UserEditModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserEditModal({ isOpen, user, onClose, onSuccess }: UserEditModalProps) {
  const [formData, setFormData] = useState({
    id_rol: 1, nickname: '', elo: 'Unranked', estado: 'activo', password: '', confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id_rol: user.id_rol || 1, nickname: user.nickname || '', elo: user.elo || 'Unranked',
        estado: user.estado || 'activo', password: '', confirmPassword: ''
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }

    try {
      const dataToUpdate: any = {
        id_rol: Number(formData.id_rol), nickname: formData.nickname,
        elo: formData.elo, estado: formData.estado,
      };
      if (formData.password) dataToUpdate.password = formData.password;

      await userService.update(user.id_usuario, dataToUpdate);
      toast.success('Invocador actualizado correctamente');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm">
      {/* max-h-[90vh] y overflow-y-auto evitan que el modal se rompa en celulares pequeños */}
      <div className="w-full max-w-2xl rounded-xl border border-ls-gold/20 bg-ls-surface shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="flex shrink-0 items-center justify-between border-b border-ls-gold/20 p-4 sm:p-5 bg-gradient-to-br from-gray-800/50 to-transparent">
          <h2 className="text-lg sm:text-xl font-bold text-ls-gold truncate pr-4">Editar Invocador: <span className="text-white">{user.nickname}</span></h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={24} /></button>
        </div>

        {/* BODY MODAL SCROLLABLE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Nickname</label>
                <input type="text" className="w-full rounded-lg border border-gray-700 bg-ls-bg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                  value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} required />
              </div>

              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Rol del Sistema</label>
                <select className="w-full rounded-lg border border-gray-700 bg-ls-bg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                  value={formData.id_rol} onChange={e => setFormData({...formData, id_rol: Number(e.target.value)})}>
                  <option value={1}>Usuario Regular</option>
                  <option value={2}>Administrador</option>
                  <option value={3}>Super Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Liga (Elo)</label>
                <select className="w-full rounded-lg border border-gray-700 bg-ls-bg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                  value={formData.elo} onChange={e => setFormData({...formData, elo: e.target.value})}>
                  {['Unranked','Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Master','Gran Master','Challenger'].map(elo => (
                    <option key={elo} value={elo}>{elo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Estado</label>
                <select className="w-full rounded-lg border border-gray-700 bg-ls-bg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                  value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-5 border-t border-gray-800">
                <p className="text-xs sm:text-sm font-medium text-ls-primary mb-4 bg-ls-primary/10 p-3 rounded border border-ls-primary/20">Solo llena estos campos si deseas cambiar la contraseña:</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Nueva Contraseña</label>
                <input type="password" placeholder="Dejar en blanco para mantener" className="w-full rounded-lg border border-gray-700 bg-ls-bg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Confirmar Nueva Contraseña</label>
                <input type="password" placeholder="Confirmar contraseña" className="w-full rounded-lg border border-gray-700 bg-ls-bg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                  value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
            </div>

            {/* FOOTER MODAL (Botones) */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-800">
              <button type="button" onClick={onClose} className="w-full sm:w-auto rounded-lg border border-gray-600 px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-gray-300 hover:bg-gray-800 transition">Cancelar</button>
              <button type="submit" className="w-full sm:w-auto rounded-lg bg-ls-primary px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-ls-bg hover:bg-ls-primary-hover shadow-lg shadow-ls-primary/20 transition">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}