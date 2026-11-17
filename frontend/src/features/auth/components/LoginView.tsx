
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { api } from '../../../shared/services/api';

export default function LoginView() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirigir si ya existe una sesión activa.
  // Usar navegación completa evita desmontar un DOM
  // que Chrome Translate pudo haber modificado.
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      window.location.replace('/dashboard');
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', {
        nickname,
        password,
      });

      // Mantener la autenticación existente.
      localStorage.setItem('token', response.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      // Recargar el documento al entrar al dashboard.
      window.location.replace('/dashboard');

    } catch (err: unknown) {
      let message = 'Error al iniciar sesión';

      if (
        err &&
        typeof err === 'object' &&
        'response' in err
      ) {
        const response = (
          err as {
            response?: {
              data?: { error?: string };
            };
          }
        ).response;

        message = response?.data?.error || message;
      }

      setError(message);
    }
  };

  return (
    <div
      translate="no"
      className="
        notranslate
        flex h-screen w-full items-center justify-center
        overflow-hidden relative
      "
    >
      {/* Fondo estilo Hextech Client */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
          from-[#0bc6e3]/10 via-[#0a0a0c] to-[#0a0a0c]
          pointer-events-none
        "
      />

      <div
        className="
          absolute inset-0
          bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]
          opacity-5 mix-blend-overlay pointer-events-none
        "
      />

      {/* Contenedor principal */}
      <div
        className="
          w-full max-w-md mx-4
          rounded-xl
          border border-[#c8aa6e]/30
          bg-[#121418]/80
          backdrop-blur-xl
          p-8 sm:p-10
          shadow-[0_0_50px_rgba(11,198,227,0.15)]
          relative z-10 group
        "
      >
        {/* Línea decorativa superior */}
        <div
          className="
            absolute top-0 left-1/2 -translate-x-1/2
            w-1/3 h-[2px]
            bg-gradient-to-r
            from-transparent via-[#c8aa6e] to-transparent
          "
        />

        {/* Logo y título */}
        <div className="mb-8 text-center">
          <h1
            className="
              text-3xl sm:text-4xl
              font-black uppercase tracking-widest
              bg-gradient-to-b
              from-[#f0e6d2] to-[#c8aa6e]
              bg-clip-text text-transparent
              drop-shadow-[0_0_15px_rgba(200,170,110,0.4)]
            "
          >
            League{' '}
            <span
              className="
                text-[#0bc6e3]
                drop-shadow-[0_0_15px_rgba(11,198,227,0.4)]
              "
            >
              Sports
            </span>
          </h1>

          <p
            className="
              mt-3 text-xs sm:text-sm
              font-bold tracking-widest
              text-[#a0aec0] uppercase
            "
          >
            Sistema de Torneos Centrales
          </p>
        </div>

        {/* Formulario de acceso */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-6"
        >
          {/* Mensaje de error */}
          {error && (
            <div
              className="
                rounded-lg
                border border-[#ef4444]/50
                bg-[#ef4444]/10
                p-3 text-center text-sm font-bold
                text-[#ef4444]
                shadow-[0_0_15px_rgba(239,68,68,0.2)]
              "
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Nickname */}
          <div>
            <label
              htmlFor="login-nickname"
              className="
                mb-1.5 block text-[11px]
                font-black uppercase tracking-widest
                text-[#a0aec0]
              "
            >
              Invoker Nickname
            </label>

            <input
              id="login-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoComplete="username"
              className="
                w-full rounded-lg
                border border-gray-700/50
                bg-[#0a0a0c]/60
                p-3.5 text-white
                transition-all duration-300
                focus:border-[#0bc6e3]
                focus:bg-[#0a0a0c]
                focus:outline-none
                focus:ring-1 focus:ring-[#0bc6e3]
                focus:shadow-[0_0_15px_rgba(11,198,227,0.2)]
                placeholder-gray-600 font-medium
              "
              placeholder="Ej. Faker"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="login-password"
              className="
                mb-1.5 block text-[11px]
                font-black uppercase tracking-widest
                text-[#a0aec0]
              "
            >
              Código de acceso
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="
                w-full rounded-lg
                border border-gray-700/50
                bg-[#0a0a0c]/60
                p-3.5 text-white
                transition-all duration-300
                focus:border-[#0bc6e3]
                focus:bg-[#0a0a0c]
                focus:outline-none
                focus:ring-1 focus:ring-[#0bc6e3]
                placeholder-gray-600
                font-bold tracking-widest
              "
              placeholder="••••••••"
              required
            />
          </div>

          {/* Botón de acceso */}
          <button
            type="submit"
            className="
              group/btn relative mt-4 mx-auto w-full
              overflow-hidden rounded-lg
              bg-gradient-to-r
              from-[#0ba6c3] to-[#0bc6e3]
              py-4
              text-sm font-black uppercase tracking-widest
              text-[#0a0a0c]
              transition-all duration-300
              hover:shadow-[0_0_25px_rgba(11,198,227,0.5)]
              hover:-translate-y-1
              block
            "
          >
            <span
              className="
                relative z-10 flex items-center
                justify-center gap-2
              "
            >
              Entrar a la Grieta
            </span>

            {/* Efecto shimmer */}
            <div
              className="
                absolute inset-0 h-full w-full
                scale-0 rounded-lg
                bg-white opacity-20
                transition-all duration-300
                group-hover/btn:scale-100
              "
            />
          </button>
        </form>
      </div>
    </div>
  );
}
