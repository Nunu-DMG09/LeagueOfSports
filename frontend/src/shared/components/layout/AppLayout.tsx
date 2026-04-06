import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard, Trophy, Users, Shield, ChevronDown, ChevronRight, 
  LogOut, Menu, Gift, ChevronLeft, Sun, Moon, Settings, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AppLayout() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  // Inicializamos el menú cerrado en móviles y abierto en computadoras
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const { user: currentUser, canManageTournaments, canManageTeams } = useAuth();

  // Cerramos el menú en móviles cuando cambian de ruta
  useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleMenu = (menu: string) => setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-theme');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { 
      name: 'Torneos', icon: Trophy, 
      subItems: [
        { name: 'Ver Torneos', path: '/tournaments' },
        ...(canManageTournaments ? [{ name: 'Crear Torneo', path: '/tournaments/new' }] : [])
      ]
    },
    { 
      name: 'Equipos', icon: Shield, 
      subItems: [
        { name: 'Lista de Equipos', path: '/teams' },
        ...(canManageTeams ? [{ name: 'Registrar Equipo', path: '/teams/new' }] : [])
      ]
    },
    { 
      name: 'Invocadores', icon: Users, 
      subItems: [
        { name: 'Invocadores', path: '/users' },
        { name: 'Salón de la Fama', path: '/hall-of-fame' }
      ]
    },
    { name: 'Tienda de Puntos', icon: Gift, path: '/rewards' },
  ];

  const roleNames: Record<number, string> = { 1: 'Usuario', 2: 'Admin', 3: 'Super Admin' };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-ls-bg text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Toaster theme={isDarkMode ? "dark" : "light"} richColors position="bottom-right" />
      
      {/* FONDO OSCURO PARA MÓVILES CUANDO EL MENÚ ESTÁ ABIERTO */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR RESPONSIVO */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-ls-gold/20 transition-transform duration-300 ease-in-out lg:relative ${isDarkMode ? 'bg-ls-surface' : 'bg-white shadow-xl'} ${
        isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0 lg:w-24'
      }`}>
        
        {/* HEADER DEL SIDEBAR */}
        <div className="flex h-20 lg:h-24 items-center justify-between border-b border-ls-gold/20 px-6">
          {isSidebarOpen ? (
            <h1 className="text-xl lg:text-2xl font-black tracking-wider text-ls-gold whitespace-nowrap overflow-hidden">
              LEAGUE <span className="text-ls-primary">SPORTS</span>
            </h1>
          ) : (
            <Shield className="text-ls-gold mx-auto" size={32} />
          )}
          
          {/* Botón para cerrar menú en móviles o colapsar en PC */}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-ls-primary transition-colors">
            {isSidebarOpen ? (
              <span className="hidden lg:block"><ChevronLeft size={28} /></span>
            ) : (
              <ChevronRight size={28} className="mx-auto hidden lg:block" />
            )}
            <span className="block lg:hidden"><X size={28} /></span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 lg:py-8 custom-scrollbar">
          <ul className="space-y-4 lg:space-y-5 px-4 pb-12">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => {
                        if (!isSidebarOpen) setIsSidebarOpen(true);
                        toggleMenu(item.name);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 lg:px-4 py-3 transition-all duration-200 font-medium ${
                        isDarkMode ? 'text-gray-300 hover:bg-ls-primary/10 hover:text-ls-primary' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      } ${!isSidebarOpen && 'justify-center'}`}
                      title={!isSidebarOpen ? item.name : ''}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={24} className={!isSidebarOpen ? 'mx-auto' : ''} />
                        {isSidebarOpen && <span className="text-sm lg:text-base tracking-wide">{item.name}</span>}
                      </div>
                      {isSidebarOpen && (openMenus[item.name] ? <ChevronDown size={20} /> : <ChevronRight size={20} />)}
                    </button>
                    
                    {isSidebarOpen && openMenus[item.name] && (
                      <ul className="mt-2 lg:mt-3 space-y-2 lg:space-y-3 pl-10 lg:pl-12">
                        {item.subItems.map(sub => (
                          <li key={sub.name}>
                            <Link 
                              to={sub.path} 
                              className={`block rounded-lg py-2 lg:py-2.5 px-3 lg:px-4 text-sm lg:text-base transition-all duration-200 ${
                                location.pathname === sub.path 
                                  ? 'bg-ls-primary/20 text-ls-primary font-bold shadow-sm' 
                                  : 'text-gray-400 hover:text-white hover:translate-x-1'
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
                    title={!isSidebarOpen ? item.name : ''}
                    className={`flex items-center gap-4 rounded-xl px-3 lg:px-4 py-3 transition-all duration-200 font-medium ${
                      location.pathname === item.path 
                        ? 'bg-ls-primary text-ls-bg font-black shadow-lg shadow-ls-primary/20' 
                        : (isDarkMode ? 'text-gray-300 hover:bg-ls-primary/10 hover:text-ls-primary' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600')
                    } ${!isSidebarOpen && 'justify-center'}`}
                  >
                    <item.icon size={24} className={!isSidebarOpen ? 'mx-auto' : ''} />
                    {isSidebarOpen && <span className="text-sm lg:text-base tracking-wide">{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 flex-col overflow-hidden w-full relative z-10">
        
        {/* TOP HEADER */}
        <header className={`flex h-20 lg:h-24 shrink-0 items-center justify-between border-b border-ls-gold/20 px-4 lg:px-8 transition-colors z-20 shadow-sm ${isDarkMode ? 'bg-ls-surface' : 'bg-white'}`}>
          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-ls-primary p-1">
              <Menu size={28} />
            </button>
            
            <div className="flex flex-col justify-center">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-300">
                Panel de Administración
              </h2>
              <p className="hidden sm:block text-sm lg:text-base text-ls-primary font-medium mt-0 lg:mt-1">
                Bienvenido invocador <span className="text-white font-black text-base lg:text-xl ml-1">{currentUser?.nickname || 'Desconocido'}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={toggleTheme} className="text-gray-400 hover:text-ls-gold transition-colors p-2 rounded-full hover:bg-gray-800">
              {isDarkMode ? <Sun size={22} className="lg:w-[26px] lg:h-[26px]" /> : <Moon size={22} className="lg:w-[26px] lg:h-[26px]" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-10 w-10 lg:h-14 lg:w-14 rounded-full bg-ls-primary/20 border-2 border-ls-primary flex items-center justify-center text-ls-primary font-black text-lg lg:text-2xl hover:bg-ls-primary/40 transition shadow-lg shadow-ls-primary/20"
              >
                {currentUser?.nickname?.charAt(0).toUpperCase() || 'U'}
              </button>

              {isProfileOpen && (
                <div className={`absolute right-0 mt-4 w-64 lg:w-72 rounded-xl border shadow-2xl z-50 overflow-hidden ${isDarkMode ? 'bg-ls-surface border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="p-4 lg:p-5 border-b border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-transparent">
                    <p className="font-black text-lg lg:text-xl text-white">{currentUser?.nickname}</p>
                    <p className="text-xs lg:text-sm text-ls-primary font-bold uppercase tracking-widest mt-1">{roleNames[currentUser?.id_rol] || 'Usuario'}</p>
                  </div>
                  <div className="p-4 lg:p-5 space-y-2 lg:space-y-3 text-sm lg:text-base">
                    <div className="flex justify-between items-center"><span className="text-gray-400">Liga:</span> <span className="font-black text-ls-gold px-2 py-1 bg-gray-900 rounded">{currentUser?.elo}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-400">Puntos:</span> <span className="font-black text-white text-base lg:text-lg">{currentUser?.puntos_totales}</span></div>
                  </div>
                  <div className="p-2 lg:p-3 border-t border-gray-700/50 flex flex-col gap-1 bg-gray-900/30">
                    <button className="flex items-center gap-3 w-full text-left p-2 lg:p-3 hover:bg-ls-primary/10 hover:text-ls-primary rounded-lg transition text-sm lg:text-base font-medium">
                      <Settings size={18} className="lg:w-5 lg:h-5" /> Editar Perfil
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left p-2 lg:p-3 hover:bg-ls-danger/10 text-ls-danger rounded-lg transition text-sm lg:text-base font-bold">
                      <LogOut size={18} className="lg:w-5 lg:h-5" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic View (Contenido) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8" onClick={() => isProfileOpen && setIsProfileOpen(false)}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}