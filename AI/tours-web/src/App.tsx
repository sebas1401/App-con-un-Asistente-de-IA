import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import PrivateLayout from './layouts/PrivateLayout';

import Dashboard from './pages/Dashboard';
import ToursPage from './pages/ToursPage';
import Clients from './pages/Clients';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Login from './pages/Login';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pública */}
        <Route path="/" element={<Login />} />

        {/* privadas */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="tours" element={<ToursPage />} />
          <Route path="clientes" element={<Clients />} />
          <Route path="reportes" element={<Reports />} />
          <Route path="usuarios" element={<Users />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
