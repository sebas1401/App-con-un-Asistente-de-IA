import { useEffect, useState } from 'react';
import { api } from '../api/api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useAuthStore } from '../store/authStore';
import Card from '../components/UI/card';
import Button from '../components/UI/Button';
import { useLocation } from 'react-router-dom';

type Tour = { id:string; nombre:string; destino:string; descripcion:string; precio:number; fecha_inicio:string }

function RowSkeleton(){
  return (
    <tr className="animate-pulse">
      <td className="p-3"><div className="h-4 w-28 bg-black/10 dark:bg-white/10 rounded"/></td>
      <td className="p-3"><div className="h-4 w-20 bg-black/10 dark:bg-white/10 rounded"/></td>
      <td className="p-3"><div className="h-4 w-16 bg-black/10 dark:bg-white/10 rounded"/></td>
      <td className="p-3"><div className="h-4 w-40 bg-black/10 dark:bg-white/10 rounded"/></td>
      <td className="p-3 text-right"><div className="h-8 w-40 ml-auto bg-black/10 dark:bg-white/10 rounded-xl"/></td>
    </tr>
  );
}

export default function ToursPage(){
  const [tours, setTours] = useState<Tour[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tour|null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{open:boolean;text:string;type?:"ok"|"err"}>({open:false,text:''});
  const perms = useAuthStore(s => s.permissions);
  const canCreate = perms?.Tour?.create;
  const canUpdate = perms?.Tour?.update;
  const canDelete = perms?.Tour?.delete;
  const location = useLocation();

  async function load(){
    setLoading(true);
    try { const { data } = await api.get('/tours'); setTours(data); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ load() }, []);

  // abrir modal si viene ?new=1
  useEffect(()=>{
    const q = new URLSearchParams(location.search);
    if (q.get('new') === '1' && canCreate) {
      setTimeout(()=>openCreate(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, canCreate]);

  const [form, setForm] = useState({ nombre:'', destino:'', descripcion:'', precio:0, fecha_inicio:'' });

  function openCreate(){
    setEditing(null);
    setForm({ nombre:'', destino:'', descripcion:'', precio:0, fecha_inicio:'' });
    setOpen(true);
  }
  function openEdit(t: Tour){
    setEditing(t);
    setForm({
      nombre:t.nombre, destino:t.destino, descripcion:t.descripcion,
      precio:Number(t.precio),
      fecha_inicio: new Date(t.fecha_inicio).toISOString().slice(0,16)
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent){
    e.preventDefault();
    try{
      const payload: any = {
        nombre: form.nombre, destino: form.destino,
        descripcion: form.descripcion, precio: Number(form.precio),
      };
      if(!editing) { payload.fecha_inicio = new Date(form.fecha_inicio).toISOString(); await api.post('/tours', payload); }
      else { if(form.fecha_inicio) payload.fecha_inicio = new Date(form.fecha_inicio).toISOString(); await api.patch(`/tours/${editing.id}`, payload); }
      setOpen(false); setToast({open:true,text: editing ? 'Tour actualizado' : 'Tour creado', type:'ok'}); await load();
    }catch(err:any){
      const msg = err?.response?.data?.message;
      setToast({open:true,text: Array.isArray(msg)? msg.join(', ') : (msg || 'Error'), type:'err'});
    }
  }

  async function del(id:string){
    try{ await api.delete(`/tours/${id}`); setToast({open:true,text:'Tour eliminado', type:'ok'}); await load(); }
    catch(err:any){ setToast({open:true,text:String(err?.response?.data?.message || 'No autorizado'), type:'err'}); }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tours</h2>
        {canCreate && <Button onClick={openCreate}>Crear Tour</Button>}
      </div>

      <Card>
        <table className="min-w-full text-[15px]">
          <thead className="bg-white/70 dark:bg-white/5">
            <tr className="text-left">
              <th className="p-3">Nombre</th>
              <th className="p-3">Destino</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Fecha inicio</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && <>
              <RowSkeleton/><RowSkeleton/><RowSkeleton/>
            </>}
            {!loading && tours.map((t, i)=>(
              <tr key={t.id} className={(i%2 ? "bg-white/50 dark:bg-white/5 " : "") + "hover:bg-indigo-50/40 dark:hover:bg-white/10 transition"}>
                <td className="p-3">{t.nombre}</td>
                <td className="p-3">{t.destino}</td>
                <td className="p-3">Q {Number(t.precio).toFixed(2)}</td>
                <td className="p-3">{new Date(t.fecha_inicio).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    {canUpdate && (
                      <button onClick={()=>openEdit(t)} className="px-3 py-1.5 rounded-xl border hover:bg-white/70 dark:hover:bg-white/10 transition">
                        Editar
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={()=>del(t.id)} className="px-3 py-1.5 rounded-xl border border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && tours.length===0 && (
              <tr><td className="p-6 text-gray-500" colSpan={5}>Sin datos. ¡Crea el primero!</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title={editing?'Editar Tour':'Crear Tour'}>
        <form onSubmit={save} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">Nombre
              <input required className="w-full border rounded-xl px-3 py-2 bg-white/80 dark:bg-white/5" value={form.nombre} onChange={e=>setForm(f=>({...f, nombre:e.target.value}))} />
            </label>
            <label className="text-sm">Destino
              <input required className="w-full border rounded-xl px-3 py-2 bg-white/80 dark:bg-white/5" value={form.destino} onChange={e=>setForm(f=>({...f, destino:e.target.value}))} />
            </label>
            <label className="text-sm">Precio
              <input required type="number" step="0.01" className="w-full border rounded-xl px-3 py-2 bg-white/80 dark:bg-white/5" value={form.precio} onChange={e=>setForm(f=>({...f, precio:Number(e.target.value)}))} />
            </label>
            <label className="text-sm">Fecha inicio
              <input required={!editing} type="datetime-local" className="w-full border rounded-xl px-3 py-2 bg-white/80 dark:bg-white/5" value={form.fecha_inicio} onChange={e=>setForm(f=>({...f, fecha_inicio:e.target.value}))} />
            </label>
          </div>
          <label className="text-sm block">Descripción
            <textarea required rows={3} className="w-full border rounded-xl px-3 py-2 bg-white/80 dark:bg-white/5" value={form.descripcion} onChange={e=>setForm(f=>({...f, descripcion:e.target.value}))}/>
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-xl border">Cancelar</button>
            <Button>{editing?'Guardar cambios':'Crear'}</Button>
          </div>
        </form>
      </Modal>

      <Toast open={toast.open} onClose={()=>setToast(s=>({...s,open:false}))} text={toast.text} type={toast.type}/>
    </div>
  );
}
