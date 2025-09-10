import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | undefined>();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true); setErr(undefined);
      await login(email, password);
      navigate('/app', { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Error al iniciar sesión');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      {/* halo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-200/30 via-transparent to-fuchsia-200/30 dark:from-indigo-400/10 dark:to-fuchsia-400/10"/>
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .25 }}
        className="w-full max-w-sm space-y-4 p-6 rounded-2xl
          backdrop-blur bg-white/80 dark:bg-neutral-900/70 shadow-glass"
      >
        <div className="text-2xl font-semibold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600">
            Iniciar sesión
          </span>
        </div>
        <input
          className="w-full border rounded-xl px-3 py-3 bg-white/80 dark:bg-white/5 focus:outline-none focus:ring-2 ring-indigo-500"
          placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-xl px-3 py-3 bg-white/80 dark:bg-white/5 focus:outline-none focus:ring-2 ring-indigo-500"
          placeholder="Contraseña" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
        />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-medium
          bg-gradient-to-r from-indigo-600 to-fuchsia-600 shadow-soft hover:opacity-95 transition"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </motion.form>
    </div>
  );
}
