import { useEffect } from 'react';
import { CheckCircle, AlertOctagon, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-6 right-6 z-100 w-[calc(100%-3rem)] sm:w-auto sm:min-w-80 max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
      <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3.5 shadow-lg rounded-xs">
        
        <div className="shrink-0">
          {isSuccess ? (
            <CheckCircle size={18} strokeWidth={2.5} className="text-emerald-600" />
          ) : (
            <AlertOctagon size={18} strokeWidth={2.5} className="text-red-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`manrope text-[10px] ${isSuccess ? "text-emerald-700" : "text-red-700"} font-bold uppercase tracking-widest leading-none mb-1.5`}>
            {isSuccess ? 'Confirmed' : 'System Alert'}
          </p>
          <p className="manrope text-neutral-800 text-xs font-medium tracking-tight leading-normal">
            {message}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="shrink-0 p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default Toast;