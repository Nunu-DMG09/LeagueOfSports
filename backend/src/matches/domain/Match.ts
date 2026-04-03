export interface Match {
  id_partida?: number;
  id_torneo: number;
  id_equipo_azul: number;
  id_equipo_rojo: number;
  id_equipo_ganador?: number | null;
  duracion_minutos?: number;
  fecha_partida?: Date;
}

export interface PlayerStats {
  id_estadistica?: number;
  id_partida: number;
  id_usuario: number;
  campeon_jugado: string;
  kills: number;
  deaths: number;
  assists: number;
  minions_asesinados: number;
  oro_total: number;
  vision_score: number;
}