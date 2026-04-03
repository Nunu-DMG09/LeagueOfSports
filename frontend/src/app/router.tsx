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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginView />,
  },
  {
    path: '/',
    element: <AppLayout />, 
    children: [
      {
        path: 'dashboard',
        element: <DashboardView />,
      },
      {
        path: 'users', 
        element: <UsersList />,
      },
      { path: 'users/new',
        element: <UserCreateView /> 
      },

      { path: 'teams',
        element: <TeamsList />
      }, 
      { path: 'teams/new',
        element: <TeamCreateView />
      },
      {
        path: 'teams/:id', 
        element: <TeamDetailView />,
      },

      { path: 'tournaments', element: <TournamentsList /> },
      { path: 'tournaments/new', element: <TournamentCreateView /> },
      { path: 'tournaments/:id', element: <TournamentDetailView /> },
      { path: 'hall-of-fame', element: <HallOfFameView /> },
      
    ],
  },
]);