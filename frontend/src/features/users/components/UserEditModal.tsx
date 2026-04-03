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
    id_rol: 1,
    nickname: '',
    elo: 'Unranked',
    estado: 'activo',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id_rol: user.id_rol || 1,
        nickname: user.nickname || '',
        elo: user.elo || 'Unranked',
        estado: user.estado || 'activo',
        password: '',
        confirmPassword: ''
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
      // Preparamos la data. Si el password está vacío, no lo enviamos para no sobrescribirlo
      const dataToUpdate: any = {
        id_rol: Number(formData.id_rol),
        nickname: formData.nickname,
        elo: formData.elo,
        estado: formData.estado,
      };

      if (formData.password) {
        dataToUpdate.password = formData.password;
      }

      await userService.update(user.id_usuario, dataToUpdate);
      toast.success('Invocador actualizado correctamente');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border border-ls-gold/20 bg-ls-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-ls-gold/20 p-4">
          <h2 className="text-xl font-bold text-ls-gold">Editar Invocador: {user.nickname}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Nickname</label>
              <input type="text" className="w-full rounded border border-gray-700 bg-ls-bg p-2 text-white focus:border-ls-primary focus:outline-none"
                value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} required />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Rol del Sistema</label>
              <select className="w-full rounded border border-gray-700 bg-ls-bg p-2 text-white focus:border-ls-primary focus:outline-none"
                value={formData.id_rol} onChange={e => setFormData({...formData, id_rol: Number(e.target.value)})}>
                <option value={1}>Usuario Regular</option>
                <option value={2}>Administrador</option>
                <option value={3}>Super Admin</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Liga (Elo)</label>
              <select className="w-full rounded border border-gray-700 bg-ls-bg p-2 text-white focus:border-ls-primary focus:outline-none"
                value={formData.elo} onChange={e => setFormData({...formData, elo: e.target.value})}>
                {['Unranked','Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Master','Gran Master','Challenger'].map(elo => (
                  <option key={elo} value={elo}>{elo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Estado</label>
              <select className="w-full rounded border border-gray-700 bg-ls-bg p-2 text-white focus:border-ls-primary focus:outline-none"
                value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-gray-800">
              <p className="text-sm text-ls-primary mb-4">Solo llena estos campos si deseas cambiar la contraseña:</p>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Nueva Contraseña</label>
              <input type="password" placeholder="Dejar en blanco para mantener actual" className="w-full rounded border border-gray-700 bg-ls-bg p-2 text-white focus:border-ls-primary focus:outline-none"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Confirmar Nueva Contraseña</label>
              <input type="password" placeholder="Confirmar contraseña" className="w-full rounded border border-gray-700 bg-ls-bg p-2 text-white focus:border-ls-primary focus:outline-none"
                value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="rounded border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-800">Cancelar</button>
            <button type="submit" className="rounded bg-ls-primary px-4 py-2 font-bold text-ls-bg hover:bg-ls-primary-hover">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}