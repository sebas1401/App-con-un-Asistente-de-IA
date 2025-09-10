import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import Card from '../components/UI/card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';

type Tour = { id:string; destino:string; precio:number; fecha_inicio:string };

const COLORS = ["#6366F1","#A855F7","#EC4899","#06B6D4","#22C55E","#F59E0B","#EF4444"];

export default function Reports(){
  const [tours, setTours] = useState<Tour[]>([]);
  useEffect(()=>{ (async()=>{
    const { data } = await api.get('/tours');
    setTours(data);
  })(); },[]);

  const porMes = useMemo(()=>{
    const map: Record<string, number> = {};
    tours.forEach(t=>{
      const d = new Date(t.fecha_inicio);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      map[key] = (map[key]||0) + Number(t.precio||0);
    });
    return Object.entries(map).sort(([a],[b])=> a.localeCompare(b))
      .map(([mes, total]) => ({ mes, total }));
  },[tours]);

  const porDestino = useMemo(()=>{
    const map: Record<string, number> = {};
    tours.forEach(t=>{
      map[t.destino] = (map[t.destino]||0) + 1;
    });
    return Object.entries(map).map(([destino, count]) => ({ destino, count }));
  },[tours]);

  const ingresoTotal = porMes.reduce((s,x)=> s + x.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Reportes</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Ingresos por mes</h3>
            <div className="text-sm text-gray-600 dark:text-neutral-300">
              Total: <b>Q {ingresoTotal.toFixed(2)}</b>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porMes}>
                <CartesianGrid vertical={false} stroke="#eee" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Tours por destino</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porDestino} dataKey="count" nameKey="destino" outerRadius={110} label>
                  {porDestino.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
