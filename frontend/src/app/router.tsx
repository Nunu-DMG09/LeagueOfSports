import { createBrowserRouter } from 'react-router-dom';
import LoginView from '../features/auth/components/LoginView';
import DashboardView from '../features/dashboard/components/DashboardView';
import AppLayout from '../shared/components/layout/AppLayout';
import UsersList from '../features/users/components/UsersList';
import UserCreateView from '../features/users/components/UserCreateView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginView />,
  },
  {
    path: '/',
    element: <AppLayout />, // El Layout envuelve estas rutas
    children: [
      {
        path: 'dashboard',
        element: <DashboardView />,
      },
      {
        path: 'users', // <--- NUEVA RUTA
        element: <UsersList />,
      },
      { path: 'users/new',
        element: <UserCreateView /> 
      },
      // Aquí iremos agregando:
      // { path: 'tournaments', element: <TournamentsList /> },
      // { path: 'teams', element: <TeamsList /> },
    ],
  },
]);