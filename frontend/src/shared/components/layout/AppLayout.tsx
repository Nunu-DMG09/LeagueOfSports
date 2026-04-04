import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard, Trophy, Users, Shield, ChevronDown, ChevronRight, 
  LogOut, Menu, Gift, ChevronLeft, Sun, Moon, UserCircle, Settings
} from 'lucide-react';

export default function AppLayout() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  const toggleMenu = (menu: string) => setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Aquí podrías inyectar una clase 'light' al tag <html> si configuras los colores en CSS
    document.documentElement.classList.toggle('light-theme');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { 
      name: 'Torneos', icon: Trophy, 
      subItems: [{ name: 'Ver Torneos', path: '/tournaments' }, { name: 'Crear Torneo', path: '/tournaments/new' }]
    },
    { 
      name: 'Equipos', icon: Shield, 
      subItems: [{ name: 'Lista de Equipos', path: '/teams' }, { name: 'Registrar Equipo', path: '/teams/new' }]
    },
    { 
      name: 'Invocadores', icon: Users, 
      subItems: [{ name: 'Ver invocadores', path: '/users' }, { name: 'Salón de la Fama', path: '/hall-of-fame' }]
    },
    { name: 'Tienda de Puntos', icon: Gift, path: '/rewards' },
  ];

  const roleNames: Record<number, string> = { 1: 'Usuario', 2: 'Admin', 3: 'Super Admin' };

  return (
    <div className={`flex h-screen w-full transition-colors duration-300 ${isDarkMode ? 'bg-ls-bg text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Toaster theme={isDarkMode ? "dark" : "light"} richColors position="bottom-right" />
      
      {/* SIDEBAR */}
      <aside className={`flex flex-col border-r border-ls-gold/20 transition-all duration-300 ${isDarkMode ? 'bg-ls-surface' : 'bg-white shadow-lg'} ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex h-16 items-center justify-between border-b border-ls-gold/20 px-4">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold tracking-wider text-ls-gold whitespace-nowrap overflow-hidden">
              LEAGUE <span className="text-ls-primary">SPORTS</span>
            </h1>
          ) : (
            <Shield className="text-ls-gold mx-auto" size={28} />
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-ls-primary transition-colors">
            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => isSidebarOpen && toggleMenu(item.name)}
                      className={`flex w-full items-center justify-between rounded p-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-ls-primary/10 hover:text-ls-primary' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'} ${!isSidebarOpen && 'justify-center'}`}
                      title={!isSidebarOpen ? item.name : ''}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={22} className={!isSidebarOpen ? 'mx-auto' : ''} />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </div>
                      {isSidebarOpen && (openMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>
                    {isSidebarOpen && openMenus[item.name] && (
                      <ul className="mt-1 space-y-1 pl-9">
                        {item.subItems.map(sub => (
                          <li key={sub.name}>
                            <Link to={sub.path} className={`block rounded py-1.5 px-2 text-sm transition-colors ${location.pathname === sub.path ? 'bg-ls-primary/20 text-ls-primary font-medium' : 'text-gray-400 hover:text-ls-primary'}`}>
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
                    title={!isSidebarOpen ? item.name : ''}
                    className={`flex items-center gap-3 rounded p-2 transition-colors ${location.pathname === item.path ? 'bg-ls-primary text-ls-bg font-bold' : (isDarkMode ? 'text-gray-300 hover:bg-ls-primary/10 hover:text-ls-primary' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600')} ${!isSidebarOpen && 'justify-center'}`}
                  >
                    <item.icon size={22} className={!isSidebarOpen ? 'mx-auto' : ''} />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className={`flex h-16 items-center justify-between border-b border-ls-gold/20 px-6 transition-colors ${isDarkMode ? 'bg-ls-surface' : 'bg-white shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-400 hover:text-ls-primary">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-400">
              Panel de Administración <span className="hidden md:inline">| <span className="text-ls-primary">Hola, {currentUser?.nickname || 'Invocador'}</span></span>
            </h2>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="text-gray-400 hover:text-ls-gold transition-colors">
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-10 w-10 rounded-full bg-ls-primary/20 border-2 border-ls-primary flex items-center justify-center text-ls-primary font-bold hover:bg-ls-primary/40 transition"
              >
                {currentUser?.nickname?.charAt(0).toUpperCase() || 'U'}
              </button>

              {isProfileOpen && (
                <div className={`absolute right-0 mt-3 w-64 rounded-lg border shadow-2xl z-50 ${isDarkMode ? 'bg-ls-surface border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="p-4 border-b border-gray-700/50">
                    <p className="font-bold text-lg">{currentUser?.nickname}</p>
                    <p className="text-xs text-ls-primary font-medium">{roleNames[currentUser?.id_rol] || 'Usuario'}</p>
                  </div>
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Liga:</span> <span className="font-bold text-ls-gold">{currentUser?.elo}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Puntos:</span> <span className="font-bold">{currentUser?.puntos_totales}</span></div>
                  </div>
                  <div className="p-2 border-t border-gray-700/50 flex flex-col">
                    <button className="flex items-center gap-2 w-full text-left p-2 hover:bg-ls-primary/10 rounded transition text-sm">
                      <Settings size={16} /> Editar Perfil
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left p-2 hover:bg-ls-danger/10 text-ls-danger rounded transition text-sm">
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-6" onClick={() => isProfileOpen && setIsProfileOpen(false)}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}