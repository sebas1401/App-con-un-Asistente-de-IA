import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Card from '../components/UI/card';
import Button from '../components/UI/Button';
import { api } from '../api/api';

type SimpleUser = { id:string; email:string; roles: string[] };

export default function Users(){
  const { user, permissions } = useAuthStore();
  const isAdmin = (permissions['User'] as any)?.manage;
  const [list, setList] = useState<SimpleUser[]|null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string|undefined>();

  useEffect(()=>{ (async()=>{
    try{
      setLoading(true);
      // si existe endpoint /users lo usamos
      const { data } = await api.get('/users');
      setList(data.map((u:any)=>({ id: u.id, email: u.email, roles: (u.roles||[]).map((r:any)=>r.name) })));
    }catch{
      setMsg('El endpoint /users no está disponible en tu backend (opcional).');
    }finally{ setLoading(false); }
  })(); },[]);

  const createEditorDemo = async ()=>{
    try{
      await api.post('/auth/register', {
        nombre: 'Editor Demo',
        email: `editor${Math.floor(Math.random()*1e6)}@demo.com`,
        password: 'Editor123!',
        roles: ['editor']
      });
      setMsg('Editor demo creado. (Si implementas /users, aparecerá en la lista)');
    }catch(e:any){
      setMsg(e?.response?.data?.message || 'No se pudo crear el editor demo.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Usuarios</h2>
        {isAdmin && <Button onClick={createEditorDemo}>Crear editor demo</Button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-2">Tu sesión</h3>
          <div className="text-sm text-gray-600 dark:text-neutral-300">
            <div><b>Email:</b> {user?.email}</div>
          </div>
          <div className="mt-3">
            <h4 className="font-medium mb-1">Permisos</h4>
            <ul className="text-sm text-gray-600 dark:text-neutral-300 list-disc pl-5">
              {Object.entries(permissions).map(([subject, rules]: any) => (
                <li key={subject}><b>{subject}</b>: {Object.keys(rules).filter(k=>rules[k]).join(', ') || '—'}</li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Usuarios del sistema</h3>
            {loading && <span className="text-sm text-gray-500">Cargando…</span>}
          </div>

          {!list && (
            <div className="text-sm text-gray-600 dark:text-neutral-300">
              {msg || 'Sin datos.'}
              <div className="mt-3">
                <p className="text-xs opacity-80">
                  Tip: crea un módulo <code>/users</code> en NestJS (lista, asigna roles, etc.). Tu app seguirá funcionando aunque no exista.
                </p>
              </div>
            </div>
          )}

          {list && (
            <div className="rounded-xl overflow-hidden border border-white/60 dark:border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/70 dark:bg-white/5">
                  <tr className="text-left">
                    <th className="p-3">Email</th>
                    <th className="p-3">Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(u=>(
                    <tr key={u.id} className="border-t border-white/60 dark:border-white/10">
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.roles?.join(', ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
