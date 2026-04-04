import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { rewardService } from '../services/reward.service';
import { useAuth } from '../../../shared/hooks/useAuth';

export function useRewards() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReward, setNewReward] = useState({ nombre_recompensa: '', descripcion: '', costo_puntos: 100, stock: 10 });

  // Extrayendo el usuario actual y los permisos
  const { user: currentUser, canManageRewards } = useAuth();

  const loadRewards = async () => {
    try {
      setLoading(true);
      const data = await rewardService.getAll();
      setRewards(data);
    } catch (error) {
      toast.error('Error al cargar la tienda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRewards(); }, []);

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageRewards) return toast.error('No tienes permiso para crear premios');
    
    try {
      await rewardService.create(newReward);
      toast.success('Nueva recompensa añadida a la tienda');
      setNewReward({ nombre_recompensa: '', descripcion: '', costo_puntos: 100, stock: 10 });
      loadRewards();
    } catch (error) {
      toast.error('Error al crear recompensa');
    }
  };

  const handleRedeem = async (rewardId: number, rewardName: string) => {
    if (!currentUser) return toast.error('Sesión no encontrada');
    if (!window.confirm(`¿Quieres canjear ${rewardName}?`)) return;

    try {
      await rewardService.redeem(rewardId, currentUser.id_usuario);
      toast.success(`¡Disfruta tu premio: ${rewardName}!`);
      // Reflejamos visualmente la bajada de puntos del usuario actualizando el localStorage temporalmente
      const updatedUser = { ...currentUser, puntos_totales: currentUser.puntos_totales - (rewards.find(r => r.id_recompensa === rewardId)?.costo_puntos || 0) };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Recargamos la página para que el navbar actualice los puntos (hack rápido)
      window.location.reload(); 
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'No se pudo canjear');
    }
  };

  return {
    rewards, loading, currentUser, canManageRewards,
    newReward, setNewReward,
    handleCreateReward, handleRedeem
  };
}