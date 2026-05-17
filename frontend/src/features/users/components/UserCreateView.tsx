import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userService } from '../services/user.service';
import { ArrowLeft, Users } from 'lucide-react';

export default function UserCreateView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id_rol: 1, nickname: '', elo: 'Unranked', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Las runas (contraseñas) no coinciden');

    try {
      await userService.create({
        id_rol: Number(formData.id_rol), nickname: formData.nickname,
        elo: formData.elo, password: formData.password
      });
      toast.success('Alma registrada en la Grieta');
      navigate('/users');
    } catch (error: any) { toast.error(error.response?.data?.error || 'Fracaso en la Invocación'); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0bc6e3]/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* HEADER RESPONSIVO */}
      <div className="flex items-center gap-4 border-b border-gray-800/60 pb-5">
        <button onClick={() => navigate('/users')} className="group rounded-full bg-[#121418] border border-gray-800 p-2 text-gray-400 hover:text-[#0bc6e3] hover:border-[#0bc6e3]/50 hover:bg-[#0bc6e3]/10 transition-all">
          <ArrowLeft size={24} className="sm:w-[28px] sm:h-[28px] group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Forjar <span className="text-[#0bc6e3] drop-shadow-[0_0_10px_rgba(11,198,227,0.3)]">Invocador</span>
        </h1>
      </div>

      <div className="rounded-xl border border-[#0bc6e3]/20 bg-[#121418]/80 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#0bc6e3] to-transparent opacity-70"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Apodo Legendario</label>
              <input type="text" required placeholder="Ej. Faker" className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base font-bold text-white focus:border-[#0bc6e3] focus:bg-[#0a0a0c] focus:outline-none focus:ring-1 focus:ring-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] transition-all"
                value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} />
            </div>

            <div>
              <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Jerarquía en el Nexo</label>
              <select className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base font-bold text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all uppercase tracking-wide appearance-none"
                value={formData.id_rol} onChange={e => setFormData({...formData, id_rol: Number(e.target.value)})}>
                <option className="bg-gray-900" value={1}>Guerrero Base (Usuario)</option>
                <option className="bg-gray-900 text-[#a855f7]" value={2}>Vigía Supremo (Administrador)</option>
                <option className="bg-gray-900 text-[#c8aa6e]" value={3}>Deidad (Super Admin)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Rango de Combate (MMR)</label>
              <select className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base font-black text-white focus:border-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] outline-none transition-all uppercase tracking-widest appearance-none"
                value={formData.elo} onChange={e => setFormData({...formData, elo: e.target.value})}>
                {['Unranked','Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Master','Gran Master','Challenger'].map(elo => (
                  <option className="bg-gray-900" key={elo} value={elo}>{elo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Palabra Sagrada (Contraseña)</label>
              <input type="password" required placeholder="••••••••" className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base text-white focus:border-[#0bc6e3] focus:bg-[#0a0a0c] focus:outline-none focus:ring-1 focus:ring-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] transition-all font-bold tracking-widest"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div>
              <label className="mb-2 block text-xs sm:text-sm font-black uppercase tracking-widest text-[#a0aec0]">Confirmar Palabra Sagrada</label>
              <input type="password" required placeholder="••••••••" className="w-full rounded-lg border border-gray-700/50 bg-[#0a0a0c]/60 p-4 text-sm sm:text-base text-white focus:border-[#0bc6e3] focus:bg-[#0a0a0c] focus:outline-none focus:ring-1 focus:ring-[#0bc6e3] focus:shadow-[0_0_15px_rgba(11,198,227,0.2)] transition-all font-bold tracking-widest"
                value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-end pt-8 mt-4 border-t border-gray-800/60">
            <button type="submit" className="group/btn relative w-full sm:w-auto overflow-hidden rounded-lg bg-gradient-to-r from-[#0bc6e3] to-[#0ba6c3] px-12 py-4 text-sm sm:text-base font-black uppercase tracking-widest text-[#0a0a0c] transition-all hover:shadow-[0_0_25px_rgba(11,198,227,0.4)] hover:-translate-y-1 block">
              <span className="relative z-10 flex items-center justify-center gap-2"><Users size={18}/> Otorgar Vida</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover/btn:scale-100"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}