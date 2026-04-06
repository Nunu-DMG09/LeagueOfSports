import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userService } from '../services/user.service';
import { ArrowLeft } from 'lucide-react';

export default function UserCreateView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_rol: 1, nickname: '', elo: 'Unranked', password: '', confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }

    try {
      await userService.create({
        id_rol: Number(formData.id_rol),
        nickname: formData.nickname,
        elo: formData.elo,
        password: formData.password
      });
      toast.success('Invocador registrado exitosamente');
      navigate('/users');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al registrar invocador');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      {/* HEADER RESPONSIVO */}
      <div className="flex items-center gap-3 sm:gap-4 border-b border-ls-gold/20 pb-4 sm:pb-6">
        <button onClick={() => navigate('/users')} className="text-gray-400 hover:text-white transition p-1">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px]" />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Registrar Invocador</h1>
      </div>

      <div className="rounded-xl border border-ls-gold/20 bg-ls-surface p-5 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Nickname</label>
              <input type="text" required className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Rol del Sistema</label>
              <select className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                value={formData.id_rol} onChange={e => setFormData({...formData, id_rol: Number(e.target.value)})}>
                <option value={1}>Usuario</option>
                <option value={2}>Administrador</option>
                <option value={3}>Super Admin</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Liga (Elo) Inicial</label>
              <select className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                value={formData.elo} onChange={e => setFormData({...formData, elo: e.target.value})}>
                {['Unranked','Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Master','Gran Master','Challenger'].map(elo => (
                  <option key={elo} value={elo}>{elo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Contraseña</label>
              <input type="password" required className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">Confirmar Contraseña</label>
              <input type="password" required className="w-full rounded-lg border border-gray-700 bg-ls-bg p-3 sm:p-3.5 text-sm sm:text-base text-white focus:border-ls-primary focus:outline-none transition-colors"
                value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-2 border-t border-gray-800">
            <button type="submit" className="w-full sm:w-auto rounded-lg bg-ls-primary px-10 py-3 sm:py-3.5 font-bold text-ls-bg transition hover:bg-ls-primary-hover shadow-lg shadow-ls-primary/20">
              Crear Invocador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}