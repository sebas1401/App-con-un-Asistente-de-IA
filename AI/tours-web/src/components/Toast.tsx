import { useEffect } from 'react';

export default function Toast({
  open, onClose, text, type='ok'
}:{open:boolean;onClose:()=>void;text:string;type?:'ok'|'err'}) {
  useEffect(()=>{
    if(!open) return;
    const t = setTimeout(onClose, 2500);
    return ()=>clearTimeout(t);
  },[open,onClose]);
  if(!open) return null;
  return (
    <div className="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white z-50 animate-[fadein_.2s_ease-out]"
         style={{background: type==='ok' ? '#16a34a' : '#dc2626'}}>
      {text}
    </div>
  );
}
