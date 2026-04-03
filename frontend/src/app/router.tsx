import { createBrowserRouter } from 'react-router-dom';
import LoginView from '../features/auth/components/LoginView';
import DashboardView from '../features/dashboard/components/DashboardView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginView />,
  },
  {
    path: '/dashboard',
    element: <DashboardView />,
  },
  // Más adelante agregaremos /tournaments, /teams, /hall-of-fame
]);