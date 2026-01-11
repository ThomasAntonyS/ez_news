import { useEffect } from 'react';
import { CheckCircle, AlertOctagon, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-6 right-6 z-20 w-[calc(100%-3rem)] sm:w-auto sm:min-w-[350px] max-w-[400px] animate-in fade-in slide-in-from-right-5 duration-300">
      <div className="bg-white border-2 border-black p-4 flex items-center gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="shrink-0">
          {isSuccess ? (
            <CheckCircle size={24} className="text-black" />
          ) : (
            <AlertOctagon size={24} className="text-black" />
          )}
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
            {isSuccess ? 'Confirmed' : 'System Alert'}
          </p>
          <p className="text-sm font-bold uppercase tracking-tight leading-tight">
            {message}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="shrink-0 p-1 border-2 border-transparent hover:border-black transition-all cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;