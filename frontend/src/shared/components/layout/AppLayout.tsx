import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Shield, 
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu
} from 'lucide-react';

export default function AppLayout() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { 
      name: 'Torneos', icon: Trophy, 
      subItems: [
        { name: 'Ver Torneos', path: '/tournaments' },
        { name: 'Crear Torneo', path: '/tournaments/new' }
      ]
    },
    { 
      name: 'Equipos', icon: Shield, 
      subItems: [
        { name: 'Lista de Equipos', path: '/teams' },
        { name: 'Registrar Equipo', path: '/teams/new' }
      ]
    },
    { 
      name: 'Invocadores', icon: Users, 
      subItems: [
        { name: 'Ver invocadores', path: '/users' },
        { name: 'Salón de la Fama', path: '/hall-of-fame' }
      ]
    },
  ];

  return (
    <div className="flex h-screen w-full bg-ls-bg text-white">
      <Toaster theme="dark" richColors position="bottom-right" />
      
      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col border-r border-ls-gold/20 bg-ls-surface transition-all">
        <div className="flex h-16 items-center justify-center border-b border-ls-gold/20">
          <h1 className="text-xl font-bold tracking-wider text-ls-gold">
            LEAGUE <span className="text-ls-primary">SPORTS</span>
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="flex w-full items-center justify-between rounded p-2 text-gray-300 transition-colors hover:bg-ls-primary/10 hover:text-ls-primary"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} />
                        <span>{item.name}</span>
                      </div>
                      {openMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {openMenus[item.name] && (
                      <ul className="mt-1 space-y-1 pl-9">
                        {item.subItems.map(sub => (
                          <li key={sub.name}>
                            <Link
                              to={sub.path}
                              className={`block rounded py-1.5 px-2 text-sm transition-colors ${
                                location.pathname === sub.path 
                                ? 'bg-ls-primary/20 text-ls-primary font-medium' 
                                : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 rounded p-2 transition-colors ${
                      location.pathname === item.path
                      ? 'bg-ls-primary text-ls-bg font-bold'
                      : 'text-gray-300 hover:bg-ls-primary/10 hover:text-ls-primary'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-ls-gold/20 p-4">
          <button className="flex w-full items-center gap-3 rounded p-2 text-ls-danger transition-colors hover:bg-ls-danger/10">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-ls-gold/20 bg-ls-surface px-6">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white lg:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-200">Panel de Administración</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-ls-primary/20 border border-ls-primary flex items-center justify-center text-ls-primary font-bold">
              N
            </div>
          </div>
        </header>

        {/* Dynamic View (Dashboard, Torneos, etc) */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}