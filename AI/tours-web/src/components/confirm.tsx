export default function Confirm({
  open, onCancel, onOk, text='¿Seguro?'
}:{open:boolean; onCancel:()=>void; onOk:()=>void; text?:string}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-4 space-y-3">
        <div className="font-semibold">Confirmar</div>
        <div className="text-sm text-gray-600">{text}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-md border">Cancelar</button>
          <button onClick={onOk} className="px-3 py-1.5 rounded-md bg-red-600 text-white">Eliminar</button>
        </div>
      </div>
    </div>
  );
}
