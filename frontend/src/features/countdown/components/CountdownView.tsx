import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Zap, LogIn, Medal, Crown, Star,
  Sun, Moon, AlertCircle, RefreshCw
} from 'lucide-react';
import { api } from '../../../shared/services/api';

// Fecha objetivo: 15 de noviembre de 2026, 00:00:00 hora Lima (UTC-5)
const TARGET_DATE = new Date('2026-11-15T00:00:00-05:00').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

interface TopPlayer {
  id_usuario: number;
  nickname: string;
  elo: string;
  puntos_totales: number;
}

function getTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isOver: false };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      {/* Dígito */}
      <div className="relative group/unit">
        {/* Glow de fondo */}
        <div className="absolute inset-0 bg-[#c8aa6e]/20 blur-xl rounded-xl opacity-0 group-hover/unit:opacity-100 transition-opacity duration-500 -z-10" />
        <div className="
          w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
          flex items-center justify-center
          rounded-xl
          border border-[#c8aa6e]/40
          bg-[#121418]/90
          backdrop-blur-xl
          shadow-[0_0_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(200,170,110,0.1)]
          relative overflow-hidden
        ">
          {/* Línea superior decorativa */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#c8aa6e]/70 to-transparent" />
          <span className="
            font-black tabular-nums text-3xl sm:text-4xl lg:text-5xl
            bg-gradient-to-b from-[#f0e6d2] via-[#c8aa6e] to-[#9a7a3e]
            bg-clip-text text-transparent
            drop-shadow-[0_0_15px_rgba(200,170,110,0.5)]
          ">
            {display}
          </span>
        </div>
      </div>
      {/* Etiqueta */}
      <span className="text-[9px] sm:text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-[#a0aec0]">
        {label}
      </span>
    </div>
  );
}

/** Separador de dos puntos */
function Separator() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center pb-6 sm:pb-7">
      <div className="w-1.5 h-1.5 rounded-full bg-[#c8aa6e]/70 animate-pulse" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#c8aa6e]/40 animate-pulse [animation-delay:0.5s]" />
    </div>
  );
}

export default function CountdownView() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [rankingError, setRankingError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  const navigate = useNavigate();

  // Sincronizar tema con la clase del documento
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove('light-theme');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Tick del contador cada segundo
  useEffect(() => {
    if (timeLeft.isOver) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft.isOver]);

  // Cargar datos reales del ranking para el Top 10
  const fetchRanking = async () => {
    try {
      setLoadingRanking(true);
      setRankingError(false);
      const { data } = await api.get('/matches/stats/ranking');
      if (Array.isArray(data)) {
        // Tomar hasta 10 jugadores respetando el orden oficial
        setTopPlayers(data.slice(0, 10));
      } else {
        setTopPlayers([]);
      }
    } catch {
      setRankingError(true);
    } finally {
      setLoadingRanking(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  return (
    <div className="
      flex min-h-screen w-full flex-col items-center
      overflow-x-hidden relative
      bg-[#0a0a0c]
      px-4 py-8 sm:py-12
      transition-colors duration-300
    ">
      {/* ── Botón flotante selector de tema ────────────────────────── */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30">
        <button
          onClick={toggleTheme}
          className="
            flex items-center gap-2 p-2.5 rounded-full
            bg-[#121418]/80 backdrop-blur-md border border-[#c8aa6e]/30
            text-[#a0aec0] hover:text-[#c8aa6e] hover:border-[#c8aa6e]
            hover:shadow-[0_0_15px_rgba(200,170,110,0.3)]
            transition-all duration-300
          "
          title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          aria-label="Alternar tema"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-[#c8aa6e] drop-shadow-[0_0_6px_rgba(200,170,110,0.6)]" />
          ) : (
            <Moon size={20} className="text-[#0284c7]" />
          )}
        </button>
      </div>

      {/* ── Fondos decorativos ───────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c8aa6e]/12 via-[#0a0a0c] to-[#0a0a0c] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#0bc6e3]/6 via-transparent to-transparent pointer-events-none" />
      {/* Líneas decorativas diagonales */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c8aa6e 0, #c8aa6e 1px, transparent 0, transparent 50%)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* ── Contenedor principal de la pantalla ─────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-8 sm:gap-10">

        {/* Logo / Marca */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#c8aa6e]/30 blur-2xl rounded-full scale-150" />
            <Trophy
              size={52}
              className="relative text-[#c8aa6e] drop-shadow-[0_0_20px_rgba(200,170,110,0.8)] animate-pulse"
            />
          </div>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.35em] text-[#a0aec0]">
            League <span className="text-[#0bc6e3] drop-shadow-[0_0_6px_rgba(11,198,227,0.5)]">Sports</span>
            <span className="mx-3 text-gray-700">•</span>
            Sistema de Torneos
          </h2>
        </div>

        {/* Título principal */}
        <div className="text-center space-y-3 px-2">
          <div className="inline-flex items-center gap-2 bg-[#c8aa6e]/10 border border-[#c8aa6e]/30 rounded-full px-4 py-1.5 mb-1">
            <Zap size={12} className="text-[#c8aa6e] fill-[#c8aa6e]" />
            <span className="text-[#c8aa6e] text-[10px] font-black uppercase tracking-[0.3em]">Evento próximo</span>
            <Zap size={12} className="text-[#c8aa6e] fill-[#c8aa6e]" />
          </div>
          <h1 className="
            text-3xl sm:text-4xl lg:text-5xl xl:text-6xl
            font-black italic uppercase tracking-tighter
            bg-gradient-to-b from-[#f0e6d2] via-[#c8aa6e] to-[#6b5830]
            bg-clip-text text-transparent
            drop-shadow-[0_0_30px_rgba(200,170,110,0.3)]
            leading-none
          ">
            {timeLeft.isOver
              ? '¡El gran día ha llegado!'
              : '¡La cuenta regresiva\nha comenzado!'}
          </h1>
          <p className="text-[#a0aec0] text-sm sm:text-base font-medium leading-relaxed max-w-md mx-auto">
            {timeLeft.isOver
              ? 'El Sistema de Puntos está oficialmente activo. Que comience la batalla por la gloria.'
              : 'El Sistema de Puntos abre sus puertas el\u00a0'}
            {!timeLeft.isOver && (
              <strong className="text-[#c8aa6e] font-black">15 de noviembre de 2026</strong>
            )}
            {!timeLeft.isOver && '. Prepárate para ascender en el ranking.'}
          </p>
        </div>

        {/* ── Contador ──────────────────────────────────────────────── */}
        {!timeLeft.isOver ? (
          <div className="flex items-start gap-3 sm:gap-5 lg:gap-7">
            <CountdownUnit value={timeLeft.days} label="Días" />
            <Separator />
            <CountdownUnit value={timeLeft.hours} label="Horas" />
            <Separator />
            <CountdownUnit value={timeLeft.minutes} label="Minutos" />
            <Separator />
            <CountdownUnit value={timeLeft.seconds} label="Segundos" />
          </div>
        ) : (
          /* Mensaje cuando el contador llegó a cero */
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-6xl animate-bounce">🏆</div>
            <p className="text-[#c8aa6e] font-black uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(200,170,110,0.6)]">
              Sistema Activo
            </p>
          </div>
        )}

        {/* Fecha objetivo */}
        {!timeLeft.isOver && (
          <p className="text-[#a0aec0] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] -mt-2">
            <span className="text-[#0bc6e3] mx-1">◆</span>
            Inicio: 15 · Nov · 2026 — 00:00 hrs (Lima, Perú)
            <span className="text-[#0bc6e3] mx-1">◆</span>
          </p>
        )}

        {/* ── Separador decorativo ─────────────────────────────────── */}
        <div className="flex items-center gap-4 w-full max-w-sm">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#c8aa6e]/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#c8aa6e]/60" />
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#c8aa6e]/40" />
        </div>

        {/* ── Botón Iniciar sesión ──────────────────────────────────── */}
        <button
          onClick={() => navigate('/login')}
          className="
            group/btn relative overflow-hidden
            flex items-center gap-3
            rounded-xl
            bg-gradient-to-r from-[#0ba6c3] to-[#0bc6e3]
            px-8 sm:px-10 py-4 sm:py-4.5
            text-sm sm:text-base font-black uppercase tracking-widest
            text-[#0a0a0c]
            shadow-[0_0_30px_rgba(11,198,227,0.3)]
            transition-all duration-300
            hover:shadow-[0_0_40px_rgba(11,198,227,0.6)]
            hover:-translate-y-1
            active:translate-y-0
          "
        >
          <LogIn size={18} className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          Iniciar sesión
          {/* Shimmer */}
          <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white opacity-20 transition-all duration-300 group-hover/btn:scale-100" />
        </button>

        {/* ── Divisor estelar hacia la sección Top 10 ───────────────── */}
        <div className="flex items-center justify-center gap-3 w-full max-w-xl my-2">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c8aa6e]/30 to-[#c8aa6e]/60" />
          <span className="text-[#c8aa6e] text-xs font-black tracking-widest uppercase px-3 py-1 bg-[#c8aa6e]/10 rounded-full border border-[#c8aa6e]/30">
            ✦ CLASIFICATORIA SUPREMA ✦
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#c8aa6e]/30 to-[#c8aa6e]/60" />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN: TOP 10 — SALÓN DE LA FAMA
            ══════════════════════════════════════════════════════════════ */}
        <div className="w-full space-y-6">
          {/* Encabezado del Top 10 */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black italic uppercase tracking-tight bg-gradient-to-b from-[#f0e6d2] via-[#c8aa6e] to-[#6b5830] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(200,170,110,0.35)]">
              Top 10 — Salón de la Fama
            </h2>
            <p className="text-[#a0aec0] text-xs sm:text-sm font-bold uppercase tracking-widest">
              Las diez leyendas con mayor esencia del reino
            </p>
          </div>

          {/* Estado de carga */}
          {loadingRanking && (
            <div className="rounded-xl border border-[#c8aa6e]/30 bg-[#121418]/80 backdrop-blur-xl p-10 text-center shadow-[0_0_30px_rgba(0,0,0,0.6)]">
              <div className="inline-flex flex-col items-center gap-3 text-[#c8aa6e] animate-pulse">
                <Trophy size={36} className="animate-bounce drop-shadow-[0_0_12px_rgba(200,170,110,0.7)]" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest">
                  Consultando Pergaminos de Honor...
                </span>
              </div>
            </div>
          )}

          {/* Estado de error */}
          {!loadingRanking && rankingError && (
            <div className="rounded-xl border border-[#ef4444]/30 bg-[#121418]/80 backdrop-blur-xl p-8 text-center space-y-3 shadow-lg">
              <AlertCircle size={32} className="mx-auto text-[#ef4444]" />
              <p className="text-sm font-bold text-[#ef4444] uppercase tracking-wider">
                No se pudo conectar con el panteón de invocadores
              </p>
              <button
                onClick={fetchRanking}
                className="inline-flex items-center gap-2 rounded-lg border border-[#c8aa6e]/40 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#c8aa6e] hover:bg-[#c8aa6e]/10 transition-colors"
              >
                <RefreshCw size={14} /> Reintentar
              </button>
            </div>
          )}

          {/* Estado de lista vacía */}
          {!loadingRanking && !rankingError && topPlayers.length === 0 && (
            <div className="rounded-xl border border-gray-800/80 bg-[#121418]/80 backdrop-blur-xl p-10 text-center shadow-lg">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#a0aec0] italic">
                El panteón está en calma. Aún no se han forjado leyendas.
              </p>
            </div>
          )}

          {/* Lista de Ranking del Top 10 */}
          {!loadingRanking && !rankingError && topPlayers.length > 0 && (
            <div className="rounded-xl border border-[#c8aa6e]/30 bg-[#121418]/85 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative">
              {/* Línea dorada superior */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent opacity-70" />

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0a0a0c]/90 text-[#c8aa6e] uppercase text-[10px] sm:text-[11px] font-black tracking-widest border-b border-[#c8aa6e]/20">
                    <tr>
                      <th className="px-4 sm:px-6 py-3.5 text-center w-16 sm:w-20">Rango</th>
                      <th className="px-4 sm:px-6 py-3.5">Invocador</th>
                      <th className="px-4 sm:px-6 py-3.5 text-center hidden sm:table-cell">Clasificatoria</th>
                      <th className="px-4 sm:px-6 py-3.5 text-right">Esencia (Pts)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-sm sm:text-base">
                    {topPlayers.map((player, index) => {
                      const isTop1 = index === 0;
                      const isTop2 = index === 1;
                      const isTop3 = index === 2;

                      return (
                        <tr
                          key={player.id_usuario}
                          className={`
                            transition-all duration-300 hover:bg-[#0a0a0c]/80 group relative
                            ${isTop1 ? 'bg-gradient-to-r from-[#c8aa6e]/15 via-[#c8aa6e]/5 to-transparent' : ''}
                            ${isTop2 ? 'bg-gradient-to-r from-gray-300/10 via-transparent to-transparent' : ''}
                            ${isTop3 ? 'bg-gradient-to-r from-orange-500/10 via-transparent to-transparent' : ''}
                          `}
                        >
                          {/* Rango con medalla / icono */}
                          <td className="px-4 sm:px-6 py-3.5 sm:py-4 text-center relative">
                            {isTop1 && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c8aa6e] shadow-[0_0_10px_#c8aa6e]" />
                            )}
                            <div className="flex items-center justify-center">
                              <div
                                className={`
                                  w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border font-black text-xs sm:text-sm shrink-0 transition-transform group-hover:scale-105
                                  ${isTop1
                                    ? 'bg-[#c8aa6e]/20 border-[#c8aa6e] text-[#c8aa6e] shadow-[0_0_12px_rgba(200,170,110,0.5)]'
                                    : isTop2
                                      ? 'bg-gray-300/15 border-gray-400 text-gray-200'
                                      : isTop3
                                        ? 'bg-orange-500/15 border-orange-500/60 text-orange-400'
                                        : 'bg-[#0a0a0c]/80 border-gray-800 text-gray-500'
                                  }
                                `}
                              >
                                {isTop1 && <Crown size={18} className="text-[#c8aa6e] animate-pulse" />}
                                {isTop2 && <Medal size={18} className="text-gray-300" />}
                                {isTop3 && <Medal size={18} className="text-orange-400" />}
                                {!isTop1 && !isTop2 && !isTop3 && `#${index + 1}`}
                              </div>
                            </div>
                          </td>

                          {/* Invocador */}
                          <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`
                                  font-black tracking-wide block truncate
                                  ${isTop1
                                    ? 'text-[#c8aa6e] text-base sm:text-lg drop-shadow-[0_0_8px_rgba(200,170,110,0.6)]'
                                    : isTop2
                                      ? 'text-gray-200 text-sm sm:text-base'
                                      : isTop3
                                        ? 'text-orange-300 text-sm sm:text-base'
                                        : 'text-white text-sm sm:text-base group-hover:text-[#0bc6e3] transition-colors'
                                  }
                                `}
                              >
                                {player.nickname}
                              </span>
                              {isTop1 && (
                                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[#c8aa6e]/20 text-[#c8aa6e] border border-[#c8aa6e]/40">
                                  Líder
                                </span>
                              )}
                            </div>
                            {/* Versión móvil del ELO */}
                            <span className="sm:hidden text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider block mt-0.5">
                              {player.elo}
                            </span>
                          </td>

                          {/* Clasificatoria (ELO) */}
                          <td className="px-4 sm:px-6 py-3.5 sm:py-4 text-center hidden sm:table-cell">
                            <span
                              className={`
                                rounded px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-inner inline-block border
                                ${isTop1
                                  ? 'bg-[#0a0a0c] text-[#c8aa6e] border-[#c8aa6e]/40'
                                  : 'bg-[#0a0a0c] text-gray-300 border-gray-800'
                                }
                              `}
                            >
                              {player.elo}
                            </span>
                          </td>

                          {/* Puntos (Esencia) */}
                          <td className="px-4 sm:px-6 py-3.5 sm:py-4 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5 font-black tabular-nums text-base sm:text-xl">
                              <span
                                className={
                                  isTop1
                                    ? 'text-[#c8aa6e] drop-shadow-[0_0_8px_rgba(200,170,110,0.8)] text-lg sm:text-2xl'
                                    : 'text-white group-hover:text-[#c8aa6e] transition-colors'
                                }
                              >
                                {player.puntos_totales}
                              </span>
                              <Star
                                size={isTop1 ? 20 : 16}
                                className={`
                                  ${isTop1
                                    ? 'fill-[#c8aa6e] text-[#c8aa6e] drop-shadow-[0_0_6px_rgba(200,170,110,0.6)]'
                                    : 'fill-gray-600 text-gray-600 group-hover:fill-[#c8aa6e] group-hover:text-[#c8aa6e] transition-colors'
                                  }
                                  mb-0.5
                                `}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pie de tabla con mensaje y botón */}
              <div className="p-4 sm:p-5 bg-[#0a0a0c]/60 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <span className="text-[10px] sm:text-xs text-[#a0aec0] font-bold uppercase tracking-widest">
                  ✦ Mostrando los <span className="text-[#c8aa6e]">{topPlayers.length}</span> mejores del reino ✦
                </span>

              </div>
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <p className="text-[#3a3a4a] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-center pt-4">
          © 2026 League Sports — Sistema de Torneos Centrales
        </p>
      </div>
    </div>
  );
}
