import Card from '../components/UI/card';
import Button from '../components/UI/Button';
import { motion } from 'framer-motion';

export default function Clients(){
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Clientes</h2>
      </div>

      <Card className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="max-w-2xl"
        >
          <h3 className="text-xl font-semibold mb-2">Aún no tienes clientes</h3>
          <p className="text-gray-600 dark:text-neutral-300 mb-6">
            Próximamente podrás registrar clientes, vincularlos a tours y ver su historial de reservas.
          </p>

          <ul className="space-y-2 text-sm text-gray-600 dark:text-neutral-300 mb-6">
            <li>• Entidad sugerida <code className="px-1 rounded bg-black/10 dark:bg-white/10">Client</code> con: <em>id, nombre, email, teléfono</em>.</li>
            <li>• Relación <em>Client</em> ↔ <em>Tour</em> (reservas) con campos: <em>estado, personas, total</em>.</li>
            <li>• Endpoints: <code>POST /clients</code>, <code>GET /clients</code>, <code>PATCH /clients/:id</code>, <code>DELETE /clients/:id</code>.</li>
          </ul>

          <Button onClick={() => alert('Aquí abrirías el modal de “Crear cliente”.')}
                  className="inline-flex">Diseñar formulario</Button>
        </motion.div>
      </Card>
    </div>
  );
}
