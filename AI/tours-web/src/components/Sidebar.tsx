import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, MapPinned, Users, BarChart3, UserCog } from 'lucide-react';
import clsx from 'clsx';

function Item({ to, icon: Icon, children }: any) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-4 py-2 rounded-xl transition-all",
          isActive
            ? "bg-gradient-to-r from-indigo-600/15 to-fuchsia-600/15 text-indigo-700 dark:text-indigo-300 translate-x-1"
            : "hover:bg-white/70 dark:hover:bg-white/5"
        )
      }
    >
      <Icon size={18} className="opacity-80" />
      <span className="text-[15px]">{children}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const perms = useAuthStore(s => s.permissions);
  const canUsers = (perms['User'] as any)?.manage;

  return (
    <aside className="h-screen sticky top-0 p-4 space-y-2
      border-r border-white/70 dark:border-white/10
      bg-white/60 dark:bg-neutral-900/60 backdrop-blur">
      <div className="px-3 py-3 text-sm font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
        TOURS
      </div>
      <Item to="/app" icon={LayoutDashboard}>Dashboard</Item>
      <Item to="/app/tours" icon={MapPinned}>Tours</Item>
      <Item to="/app/clientes" icon={Users}>Clientes</Item>
      <Item to="/app/reportes" icon={BarChart3}>Reportes</Item>
      {canUsers && <Item to="/app/usuarios" icon={UserCog}>Usuarios</Item>}
    </aside>
  );
}
