import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/services/api';

export default function LoginView() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Llamada real al backend que hiciste en Node
      const response = await api.post('/auth/login', { nickname, password });
      
      // Guardar el token en el almacenamiento local
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirigir al inicio
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-ls-bg">
      <div className="w-full max-w-md rounded-lg border border-ls-gold/20 bg-ls-surface p-8 shadow-2xl shadow-ls-primary/10">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-ls-gold">
            League of Sports
          </h1>
          <p className="mt-2 text-sm text-gray-400">Sistema de Torneos y Salón de la Fama</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="rounded border border-ls-danger/50 bg-ls-danger/10 p-3 text-center text-sm text-ls-danger">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary focus:outline-none focus:ring-1 focus:ring-ls-primary"
              placeholder="Ej. nunupro"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-700 bg-ls-bg p-3 text-white focus:border-ls-primary focus:outline-none focus:ring-1 focus:ring-ls-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded bg-ls-primary py-3 font-bold uppercase tracking-wide text-ls-bg transition-colors hover:bg-ls-primary-hover"
          >
            Entrar a la Grieta
          </button>
        </form>
      </div>
    </div>
  );
}