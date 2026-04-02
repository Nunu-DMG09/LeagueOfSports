export interface Tournament {
  id_torneo?: number;
  nombre: string;
  modalidad: '1v1' | '2v2' | '3v3' | '4v4' | '5v5';
  fecha_inicio: string | Date;
  estado?: 'pendiente' | 'en_curso' | 'finalizado';
}

export interface TournamentTeam {
  id_torneo_equipo?: number;
  id_torneo: number;
  id_equipo: number;
  estado_inscripcion?: 'registrado' | 'descalificado' | 'campeon';
}