import { createBrowserRouter } from 'react-router-dom';
import LoginView from '../features/auth/components/LoginView';
import DashboardView from '../features/dashboard/components/DashboardView';
import AppLayout from '../shared/components/layout/AppLayout';
import UsersList from '../features/users/components/UsersList';
import UserCreateView from '../features/users/components/UserCreateView';

import TeamsList from '../features/teams/components/TeamsList';
import TeamCreateView from '../features/teams/components/TeamCreateView';
import TeamDetailView from '../features/teams/components/TeamDetailView';

import TournamentsList from '../features/tournaments/components/TournamentsList';
import TournamentCreateView from '../features/tournaments/components/TournamentCreateView';

import TournamentDetailView from '../features/tournaments/components/TournamentDetailView';
import HallOfFameView from '../features/hallOfFame/components/HallOfFameView';

import MatchManageView from '../features/matches/components/MatchManageView';

import RewardsView from '../features/rewards/components/RewardsView';
import RequirePermission from '../shared/components/RequirePermission';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginView />,
  },
  {
    path: '/',
    element: <AppLayout />, 
    children: [
      // === RUTAS PÚBLICAS (Todos los roles pueden ver) ===
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'tournaments', element: <TournamentsList /> },
      { path: 'tournaments/:id', element: <TournamentDetailView /> },
      { path: 'teams', element: <TeamsList /> },
      { path: 'teams/:id', element: <TeamDetailView /> },
      { path: 'users', element: <UsersList /> },
      { path: 'hall-of-fame', element: <HallOfFameView /> },
      { path: 'rewards', element: <RewardsView /> },

      // === RUTAS PROTEGIDAS (Admins y SuperAdmins) ===
      { 
        path: 'tournaments/new', 
        element: <RequirePermission permission="tournaments"><TournamentCreateView /></RequirePermission> 
      },
      { 
        path: 'matches/:id/manage', 
        element: <RequirePermission permission="tournaments"><MatchManageView /></RequirePermission> 
      },
      { 
        path: 'teams/new', 
        element: <RequirePermission permission="teams"><TeamCreateView /></RequirePermission> 
      },

      // === RUTA SÚPER PROTEGIDA (Solo SuperAdmins) ===
      { 
        path: 'users/new', 
        element: <RequirePermission permission="users"><UserCreateView /></RequirePermission> 
      },
      
    ],
  },
]);