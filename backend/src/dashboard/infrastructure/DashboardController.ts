import { Request, Response } from 'express';
import db from '../../shared/infrastructure/database';

export class DashboardController {
  async getSummary(req: Request, res: Response) {
    try {
      // 1. Tarjetas Estadísticas
      const [usersCount] = await db('usuarios').count('* as total');
      const [tournamentsCount] = await db('torneos').where('estado', 'en_curso').count('* as total');
      const [teamsCount] = await db('equipos').count('* as total');
      const [killsData] = await db('estadisticas_partida').sum('kills as total_kills');
      
      // 2. MVP
      const topPlayer = await db('usuarios').select('nickname', 'puntos_totales', 'elo').orderBy('puntos_totales', 'desc').first();

      // 3. Gráfico Circular (Estado de Torneos)
      const tournamentsStatus = await db('torneos').select('estado').count('* as value').groupBy('estado');
      const colorMap: any = { 'en_curso': '#c8aa6e', 'finalizado': '#12b279', 'pendiente': '#0bc6e3' };
      const pieData = tournamentsStatus.map(t => ({
        name: String(t.estado).replace('_', ' ').toUpperCase(), 
        value: Number(t.value), color: colorMap[String(t.estado)] || '#ffffff'
      }));

      // 4. Actividad Semanal (Últimos 7 días)
      const recentMatches = await db('partidas').select(db.raw('DATE(fecha_partida) as fecha'), db.raw('COUNT(*) as cantidad'))
        .groupByRaw('DATE(fecha_partida)').orderBy('fecha', 'desc').limit(7);
      const weeklyData = recentMatches.reverse().map(m => ({
        dia: new Date(m.fecha).toLocaleDateString('es-ES', { weekday: 'short', timeZone: 'UTC' }), partidas: Number(m.cantidad)
      }));

      // 5. Distribución de Ligas (Elo)
      const eloDistribution = await db('usuarios').select('elo').count('* as cantidad').groupBy('elo');
      const eloData = eloDistribution.map(e => ({
        liga: e.elo, cantidad: Number(e.cantidad)
      }));

      // 6. Últimos 5 Enfrentamientos
      const latestMatchesList = await db('partidas as p')
        .join('equipos as ea', 'p.id_equipo_azul', 'ea.id_equipo')
        .join('equipos as er', 'p.id_equipo_rojo', 'er.id_equipo')
        .leftJoin('equipos as eg', 'p.id_equipo_ganador', 'eg.id_equipo')
        .select('p.id_partida', 'p.fecha_partida', 'p.duracion_minutos', 'ea.nombre as equipo_azul', 'er.nombre as equipo_rojo', 'eg.nombre as ganador')
        .orderBy('p.fecha_partida', 'desc')
        .limit(5);

      // 7. NUEVO: Top 5 Equipos (Victorias Totales)
      const topTeams = await db('partidas')
        .join('equipos', 'partidas.id_equipo_ganador', 'equipos.id_equipo')
        .select('equipos.nombre')
        .count('* as victorias')
        .whereNotNull('partidas.id_equipo_ganador')
        .groupBy('equipos.id_equipo', 'equipos.nombre')
        .orderBy('victorias', 'desc')
        .limit(5);
        
      const topTeamsData = topTeams.map(t => ({
         nombre: t.nombre, victorias: Number(t.victorias)
      }));

      // 8. NUEVO: Últimos canjes en la Tienda (Historial)
      const recentRewards = await db('historial_puntos as hp')
        .join('usuarios as u', 'hp.id_usuario', 'u.id_usuario')
        .join('recompensas as r', 'hp.id_referencia', 'r.id_recompensa')
        .select('u.nickname', 'r.nombre_recompensa', 'hp.cantidad_puntos', 'hp.fecha_movimiento')
        .where('hp.tipo_movimiento', 'egreso')
        .orderBy('hp.fecha_movimiento', 'desc')
        .limit(5);

      res.json({
        stats: {
          invocadores: Number(usersCount?.total || 0), torneos_activos: Number(tournamentsCount?.total || 0),
          equipos: Number(teamsCount?.total || 0), kills_totales: Number(killsData?.total_kills || 0)
        },
        topPlayer: topPlayer || { nickname: 'Sin registros', puntos_totales: 0, elo: 'Unranked' },
        pieData, weeklyData, eloData, latestMatchesList,
        topTeamsData, recentRewards // Enviamos los datos nuevos
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}