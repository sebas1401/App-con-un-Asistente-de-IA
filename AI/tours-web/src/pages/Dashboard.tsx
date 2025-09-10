import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import Card from '../components/UI/card';
import Button from '../components/UI/Button';
import { greetNow, fmtMoney } from '../lib/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinned, PlusCircle } from 'lucide-react';

type Tour = { id:string; nombre:string; destino:string; precio:number; fecha_inicio:string };

export default function Dashboard(){
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{ (async()=>{
    setLoading(true);
    try { const { data } = await api.get('/tours'); setTours(data || []); }
    finally { setLoading(false); }
  })(); },[]);

  // KPIs
  const totalTours   = tours.length;
  const totalIngreso = tours.reduce((s,t)=> s + Number(t.precio||0), 0);
  const destinosUnicos = new Set(tours.map(t=>t.destino)).size;

  // series por mes para tendencia (ordenadas)
  const porMes = useMemo(()=>{
    const m: Record<string, number> = {};
    tours.forEach(t=>{
      const d = new Date(t.fecha_inicio);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      m[key] = (m[key]||0) + Number(t.precio||0);
    });
    return Object.entries(m).sort(([a],[b]) => a.localeCompare(b))
      .map(([mes,total])=>({ mes, total }));
  },[tours]);

  // distribución por destino
  const porDestino = useMemo(()=>{
    const m: Record<string, number> = {};
    tours.forEach(t=>{ m[t.destino] = (m[t.destino]||0) + 1; });
    return Object.entries(m).map(([destino, count]) => ({ destino, count }));
  },[tours]);

  const openCrearTour = () => navigate('/app/tours?new=1');

  // Cargar data demo rápida (3 tours futuros)
  async function seedDemo(){
    const now = new Date();
    const plus = (d:number)=> new Date(now.getFullYear(), now.getMonth(), now.getDate()+d, 10, 0, 0).toISOString();
    const sample = [
      { nombre:'Playa Paraíso', destino:'Playa', descripcion:'Día completo', precio: 800, fecha_inicio: plus(7) },
      { nombre:'Montaña Aventura', destino:'Montaña', descripcion:'Caminata y miradores', precio: 1200, fecha_inicio: plus(12) },
      { nombre:'City Night', destino:'Ciudad', descripcion:'Recorrido nocturno', precio: 600, fecha_inicio: plus(3) },
    ];
    for (const s of sample) await api.post('/tours', s);
    const { data } = await api.get('/tours');
    setTours(data);
  }

  const greeting = greetNow();

  return (
    <div className="space-y-6">
      {/* hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="text-sm text-gray-500 dark:text-neutral-400">{greeting}</div>
          <h2 className="text-2xl font-semibold">Agencia de Tours</h2>
        </div>
        <div className="flex items-center gap-2">
          {tours.length === 0
            ? <Button onClick={seedDemo}>Cargar datos demo</Button>
            : <Button onClick={openCrearTour} className="inline-flex items-center gap-2">
                <PlusCircle size={16}/> Crear tour
              </Button>}
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Tours publicados</div>
          <div className="mt-1 text-3xl font-semibold">{totalTours}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Ingreso estimado</div>
          <div className="mt-1 text-3xl font-semibold">{fmtMoney(totalIngreso)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Destinos únicos</div>
          <div className="mt-1 text-3xl font-semibold">{destinosUnicos}</div>
        </Card>
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Ingresos por mes</h3>
            <div className="text-sm text-gray-600 dark:text-neutral-300">Total: <b>{fmtMoney(totalIngreso)}</b></div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porMes}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eee" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="url(#g1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Tours por destino</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porDestino} dataKey="count" nameKey="destino" outerRadius={110} label>
                  {porDestino.map((_, i) => <Cell key={i} fill={['#6366F1','#A855F7','#EC4899','#06B6D4','#22C55E','#F59E0B','#EF4444'][i%7]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* lista rápida / estado vacío */}
      <Card className="p-4">
        {loading ? (
          <div className="h-16 animate-pulse text-gray-500">Cargando…</div>
        ) : tours.length === 0 ? (
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/10"><MapPinned size={20}/></div>
            <div>
              <div className="font-medium">Aún no tienes tours</div>
              <div className="text-sm text-gray-600 dark:text-neutral-300">Crea tu primer tour o carga datos demo para ver reportes.</div>
            </div>
            <div className="ml-auto">
              <Button onClick={openCrearTour}>Crear tour</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="font-semibold mb-3">Últimos tours</div>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm">
                <thead className="bg-white/70 dark:bg-white/5">
                  <tr className="text-left">
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Destino</th>
                    <th className="p-3">Precio</th>
                    <th className="p-3">Fecha inicio</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.slice(-5).reverse().map(t=>(
                    <tr key={t.id} className="border-t border-white/60 dark:border-white/10">
                      <td className="p-3">{t.nombre}</td>
                      <td className="p-3">{t.destino}</td>
                      <td className="p-3">{fmtMoney(t.precio)}</td>
                      <td className="p-3">{new Date(t.fecha_inicio).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
