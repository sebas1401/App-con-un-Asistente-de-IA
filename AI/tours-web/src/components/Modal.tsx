export default function Modal({ open, onClose, title, children }:{
  open:boolean; onClose:()=>void; title:string; children:React.ReactNode;
}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur" onClick={onClose}/>
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/85 dark:bg-neutral-900/75 backdrop-blur rounded-2xl shadow-glass">
          <div className="p-4 border-b border-white/60 dark:border-white/10 flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            <button onClick={onClose} className="px-2 py-1 rounded-lg hover:bg-white/70 dark:hover:bg-white/10">✕</button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
