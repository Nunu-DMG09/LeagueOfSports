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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const { user: currentUser, canManageTournaments, canManageTeams } = useAuth();

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

  const isAdminOrSuperAdmin = currentUser?.id_rol === 2 || currentUser?.id_rol === 3;

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
        { name: 'Salón de la Fama', path: '/hall-of-fame' },
        ...(isAdminOrSuperAdmin ? [{ name: 'Puntos Invocadores', path: '/summoner-points' }] : [])
      ]
    },
    { name: 'Tienda de Puntos', icon: Gift, path: '/rewards' },
  ];

  const roleNames: Record<number, string> = { 1: 'Usuario', 2: 'Admin', 3: 'Super Admin' };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 relative ${isDarkMode ? 'bg-[#0a0a0c] text-white' : 'bg-[#f0e6d2] text-[#121418]'}`}>
   
      {isDarkMode && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ls-primary/5 via-transparent to-transparent pointer-events-none z-0"></div>}
      
      <Toaster theme={isDarkMode ? "dark" : "light"} richColors position="bottom-right" />
      
   
      <div 
        className={`fixed inset-0 z-30 bg-[#0a0a0c]/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

     
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-all duration-300 ease-in-out lg:relative ${isDarkMode ? 'bg-[#121418]/90 backdrop-blur-2xl border-gray-800/60 shadow-[5px_0_30px_rgba(0,0,0,0.5)]' : 'bg-white shadow-xl border-gray-200'} ${
        isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0 lg:w-24'
      }`}>
        
      
        <div className={`relative flex h-20 lg:h-24 w-full items-center border-b overflow-hidden shrink-0 ${isDarkMode ? 'border-gray-800/60' : 'border-gray-200'}`}>
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isSidebarOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <button onClick={() => setIsSidebarOpen(true)} className="outline-none focus:outline-none group">
              <Shield className="text-[#c8aa6e] drop-shadow-[0_0_8px_rgba(200,170,110,0.5)] group-hover:text-ls-primary group-hover:drop-shadow-[0_0_12px_rgba(11,198,227,0.6)] group-hover:scale-110 transition-all duration-300" size={34} />
            </button>
          </div>

          <div className={`absolute inset-0 flex items-center justify-between px-5 lg:px-6 transition-all duration-300 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
            <h1 className="font-black tracking-widest text-[#c8aa6e] whitespace-nowrap text-xl lg:text-2xl drop-shadow-[0_0_8px_rgba(200,170,110,0.4)] uppercase">
              League <span className="text-[#0bc6e3] drop-shadow-[0_0_8px_rgba(11,198,227,0.4)]">Sports</span>
            </h1>
            <button onClick={() => setIsSidebarOpen(false)} className="text-[#a0aec0] hover:text-[#0bc6e3] transition-colors shrink-0 outline-none">
              <ChevronLeft size={28} className="hidden lg:block hover:-translate-x-1 transition-transform" />
              <X size={28} className="block lg:hidden hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 lg:py-8 custom-scrollbar">
          <ul className="space-y-4 px-4 pb-12">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => {
                        if (!isSidebarOpen) setIsSidebarOpen(true);
                        toggleMenu(item.name);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 lg:px-4 py-3.5 transition-all duration-300 font-bold uppercase tracking-wide text-[13px] border border-transparent ${
                        isDarkMode ? 'text-gray-400 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent hover:text-white hover:border-gray-700/50' : 'text-gray-600 hover:bg-gray-50'
                      } ${!isSidebarOpen && 'justify-center'}`}
                      title={!isSidebarOpen ? item.name : ''}
                    >
                      <div className="flex items-center">
                        <item.icon size={22} className="shrink-0" />
                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 max-w-[200px] ml-4' : 'opacity-0 max-w-0 ml-0 text-[0px]'}`}>
                          {item.name}
                        </span>
                      </div>
                      <div className={`transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                         {openMenus[item.name] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen && openMenus[item.name] ? 'max-h-[500px] opacity-100 mt-2 lg:mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
                      <ul className="space-y-2 pl-4 ml-7 border-l-2 border-gray-800/60 lg:ml-8">
                        {item.subItems.map(sub => {
                          const isActive = location.pathname === sub.path;
                          return (
                            <li key={sub.name}>
                              <Link 
                                to={sub.path} 
                                className={`block py-2 px-4 text-xs font-bold uppercase tracking-wide transition-all duration-300 whitespace-nowrap rounded-r-lg relative before:absolute before:left-[-2px] before:top-0 before:h-full before:w-[2px] before:bg-transparent before:transition-colors ${
                                  isActive 
                                    ? 'text-[#0bc6e3] bg-gradient-to-r from-[#0bc6e3]/10 to-transparent before:bg-[#0bc6e3] drop-shadow-[0_0_8px_rgba(11,198,227,0.5)] scale-[1.02]' 
                                    : 'text-gray-500 hover:text-white hover:bg-white/5 hover:translate-x-1'
                                }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    title={!isSidebarOpen ? item.name : ''}
                    className={`flex items-center rounded-xl px-3 lg:px-4 py-3.5 transition-all duration-300 font-bold uppercase tracking-wide text-[13px] border ${
                      location.pathname === item.path 
                        ? 'bg-gradient-to-r from-[#0bc6e3] to-[#0ba6c3] text-[#0a0a0c] border-[#0bc6e3] shadow-[0_0_15px_rgba(11,198,227,0.3)]' 
                        : (isDarkMode ? 'border-transparent text-gray-400 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent hover:text-white hover:border-gray-700/50' : 'border-transparent text-gray-600 hover:bg-gray-50')
                    } ${!isSidebarOpen && 'justify-center'}`}
                  >
                    <item.icon size={22} className="shrink-0" />
                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 max-w-[200px] ml-4' : 'opacity-0 max-w-0 ml-0 text-[0px]'}`}>
                      {item.name}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

  
      <main className="flex flex-1 flex-col overflow-hidden w-full relative z-10">
        
       
        <header className={`flex h-20 lg:h-24 shrink-0 items-center justify-between border-b px-4 lg:px-8 transition-colors z-20 shadow-md ${isDarkMode ? 'bg-[#121418]/80 backdrop-blur-xl border-gray-800/60' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[#a0aec0] hover:text-[#0bc6e3] p-1 transition-colors">
              <Menu size={28} />
            </button>
            
            <div className="flex flex-col justify-center">
              <h2 className="text-lg lg:text-xl font-black uppercase tracking-widest text-[#c8aa6e] drop-shadow-[0_0_5px_rgba(200,170,110,0.5)]">
                Panel de Mando
              </h2>
              <p className="hidden sm:inline-flex text-xs lg:text-sm font-bold uppercase tracking-widest text-[#a0aec0] mt-1 items-center gap-2">
                Bienvenido invocador <span className="text-white text-sm lg:text-base drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{currentUser?.nickname || 'Desconocido'}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <button onClick={toggleTheme} className="text-[#a0aec0] hover:text-[#c8aa6e] transition-colors p-2 rounded-full hover:bg-gray-800/50">
              {isDarkMode ? <Sun size={22} className="drop-shadow-[0_0_5px_rgba(200,170,110,0.5)]" /> : <Moon size={22} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="group h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 focus:outline-none transition-all duration-300 flex items-center justify-center font-black text-lg lg:text-xl relative overflow-hidden bg-[#0bc6e3]/10 border-[#0bc6e3] text-[#0bc6e3] shadow-[0_0_15px_rgba(11,198,227,0.3)] hover:shadow-[0_0_20px_rgba(11,198,227,0.6)]"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <span className="relative z-10">{currentUser?.nickname?.charAt(0).toUpperCase() || 'U'}</span>
              </button>

              <div className={`absolute right-0 mt-5 w-72 lg:w-80 rounded-xl border shadow-2xl z-50 overflow-hidden transition-all duration-300 origin-top-right ${
                isDarkMode ? 'bg-[#121418]/95 backdrop-blur-xl border-[#c8aa6e]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)]' : 'bg-white border-gray-200'
              } ${isProfileOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                <div className="p-5 border-b border-gray-800/60 bg-gradient-to-br from-gray-800/40 to-transparent relative">
                  <p className="font-black text-xl lg:text-2xl text-white uppercase tracking-wider drop-shadow-sm">{currentUser?.nickname}</p>
                  <p className="text-xs lg:text-sm text-[#c8aa6e] font-black uppercase tracking-widest mt-1.5">{roleNames[currentUser?.id_rol] || 'Usuario'}</p>
                </div>
                <div className="p-5 space-y-4 text-sm lg:text-base font-bold tracking-wide">
                  <div className="flex justify-between items-center rounded-lg bg-[#0a0a0c]/60 p-3 border border-gray-800/50">
                    <span className="text-[#a0aec0] uppercase text-xs">Liga Actual</span> 
                    <span className="font-black text-[#0bc6e3] uppercase">{currentUser?.elo}</span>
                  </div>
                  <div className="flex justify-between items-center rounded-lg bg-[#0a0a0c]/60 p-3 border border-gray-800/50">
                    <span className="text-[#a0aec0] uppercase text-xs">Esencia Azul</span> 
                    <span className="font-black text-white text-base lg:text-lg flex items-center gap-1">
                      {currentUser?.puntos_totales} <Gift size={14} className="text-[#c8aa6e]" />
                    </span>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-800/60 flex flex-col gap-2 bg-[#0a0a0c]/80">
                  <button className="flex items-center gap-3 w-full text-left p-2.5 hover:bg-white/5 hover:text-white text-gray-400 rounded-lg transition-colors text-sm lg:text-base font-bold uppercase tracking-wide">
                    <Settings size={18} className="text-[#a0aec0]" /> Editar Perfil
                  </button>
                  <button onClick={handleLogout} className="group flex items-center gap-3 w-full text-left p-2.5 hover:bg-[#ef4444]/10 text-[#ef4444] rounded-lg transition-colors text-sm lg:text-base font-black uppercase tracking-wide">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Abandonar Partida
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

      
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-0 custom-scrollbar" onClick={() => isProfileOpen && setIsProfileOpen(false)}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}