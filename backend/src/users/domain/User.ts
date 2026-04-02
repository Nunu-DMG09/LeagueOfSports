export interface User {
  id_usuario: number;
  id_rol: number;
  nickname: string;
  password?: string; // Opcional porque no siempre queremos devolverla
  elo: string;
  puntos_totales: number;
  estado: string;
}