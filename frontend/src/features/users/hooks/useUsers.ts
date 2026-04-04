import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../services/user.service';
import { useAuth } from '../../../shared/hooks/useAuth';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { canManageUsers } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar los invocadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = async (userId: number, nickname: string) => {
    if (!canManageUsers) return toast.error('No tienes permisos de Super Administrador');
    
    try {
      await userService.delete(userId);
      toast.success(`Invocador ${nickname} eliminado de la grieta`);
      fetchUsers();
    } catch (error) {
      toast.error('Error al eliminar invocador');
    }
  };

  return {
    users,
    loading,
    canManageUsers,
    fetchUsers,
    confirmDelete
  };
}