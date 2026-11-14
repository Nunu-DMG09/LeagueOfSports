import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, LogIn } from 'lucide-react';

// Fecha objetivo: 15 de noviembre de 2026, 00:00:00 hora Lima (UTC-5)
const TARGET_DATE = new Date('2026-11-15T00:00:00-05:00').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

function getTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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

export default function CountdownView() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
  const navigate = useNavigate();

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Tick cada segundo
  useEffect(() => {
    if (timeLeft.isOver) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft.isOver]);

  return (
    <div className="
      flex min-h-screen w-full flex-col items-center justify-center
      overflow-hidden relative
      bg-[#0a0a0c]
      px-4 py-10
    ">
      {/* ── Fondos decorativos ───────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c8aa6e]/12 via-[#0a0a0c] to-[#0a0a0c] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0bc6e3]/6 via-transparent to-transparent pointer-events-none" />
      {/* Líneas decorativas diagonales */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c8aa6e 0, #c8aa6e 1px, transparent 0, transparent 50%)', backgroundSize: '28px 28px' }}
      />

      {/* ── Tarjeta principal ────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-8 sm:gap-10">

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
            <CountdownUnit value={timeLeft.days}    label="Días" />
            <Separator />
            <CountdownUnit value={timeLeft.hours}   label="Horas" />
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

        {/* Footer */}
        <p className="text-[#3a3a4a] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-center">
          © 2026 League Sports — Sistema de Torneos Centrales
        </p>
      </div>
    </div>
  );
}

/** Dos puntos separadores animados entre unidades */
function Separator() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center pb-6 sm:pb-7">
      <div className="w-1.5 h-1.5 rounded-full bg-[#c8aa6e]/70 animate-pulse" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#c8aa6e]/40 animate-pulse [animation-delay:0.5s]" />
    </div>
  );
}
