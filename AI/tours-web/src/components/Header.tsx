import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from './UI/Button';

function ThemeToggle(){
  const [dark, setDark] = useState(() => localStorage.getItem('theme')==='dark');
  useEffect(()=> {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <button
      onClick={()=>setDark(v=>!v)}
      className="p-2 rounded-xl border bg-white/60 dark:bg-white/5 backdrop-blur hover:bg-white/80 dark:hover:bg-white/10 transition"
      title="Tema"
    >
      {dark ? <Sun size={16}/> : <Moon size={16}/>}
    </button>
  );
}

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const doLogout = () => { logout(); navigate('/', { replace: true }); };

  return (
    <header className="h-16 flex items-center justify-between px-5
      backdrop-blur bg-white/70 dark:bg-neutral-900/60 border-b border-white/60 dark:border-white/10">
      <div className="font-semibold tracking-wide">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600">
          Agencia de Tours
        </span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle/>
        <span className="text-sm text-gray-600 dark:text-neutral-300">{user?.email}</span>
        <Button onClick={doLogout} className="!py-2 !px-3 flex items-center gap-2">
          <LogOut size={16}/> Logout
        </Button>
      </div>
    </header>
  );
}
