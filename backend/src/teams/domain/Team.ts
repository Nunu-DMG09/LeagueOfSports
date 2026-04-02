export interface Team {
  id_equipo?: number;
  nombre: string;
  logo_url?: string;
  estado?: 'activo' | 'disuelto';
  fecha_creacion?: Date;
}

export interface TeamMember {
  id_equipo: number;
  id_usuario: number;
  rol_en_equipo: 'Capitan' | 'Titular' | 'Suplente';
  fecha_ingreso?: Date;
}