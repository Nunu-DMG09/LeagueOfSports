import { useState } from 'react';

export function useAuth() {

  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Definición de Roles según tu base de datos
  const isUser = user?.id_rol === 1;
  const isAdmin = user?.id_rol === 2;
  const isSuperAdmin = user?.id_rol === 3;

  // Permisos específicos
  const canManageTournaments = isAdmin || isSuperAdmin;
  const canManageTeams = isAdmin || isSuperAdmin;
  const canManageRewards = isAdmin || isSuperAdmin;
  
  // ¡Solo el SuperAdmin puede con los usuarios!
  const canManageUsers = isSuperAdmin; 

  return { 
    user, 
    isUser, 
    isAdmin, 
    isSuperAdmin, 
    canManageTournaments, 
    canManageTeams, 
    canManageRewards, 
    canManageUsers 
  };
}