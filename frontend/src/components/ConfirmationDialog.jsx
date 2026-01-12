import { AlertTriangle, X } from 'lucide-react';

const ConfirmationDialog = ({ isOpen, type, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const content = {
    newsDelete: {
      title: "DELETE ARTICLE?",
      message: "This action is permanent. The news entry will be purged from the database.",
      confirmText: "DELETE_NOW",
      confirmColor: "bg-red-600 hover:bg-white hover:text-black",
    },
    accountDelete: {
      title: "TERMINATE ACCOUNT?",
      message: "All user data, preferences, and saved articles will be deleted. This cannot be undone.",
      confirmText: "TERMINATE_ACCOUNt",
      confirmColor: "bg-red-600 hover:bg-white hover:text-black",
    },
    signOut: {
      title: "END SESSION?",
      message: "You will be logged out of your current session. Do you wish to proceed?",
      confirmText: "LOGOUT",
      confirmColor: "bg-red-600 hover:bg-white hover:text-black",
    }
  };

  const { title, message, confirmText, confirmColor } = content[type];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-none">
      <div className="bg-white border-4 border-black w-full max-w-md relative animate-in zoom-in-95 duration-200">
        
        <div className="border-b-4 border-black p-4 flex justify-between items-center bg-zinc-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} strokeWidth={3} />
            <h2 className="font-black uppercase tracking-tighter text-xl">{title}</h2>
          </div>
          <button onClick={onCancel} className="hover:rotate-90 cursor-pointer transition-transform">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-6">
          <p className="font-bold uppercase tracking-tight text-sm leading-snug mb-8">
            {message}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onCancel}
              className="py-3 font-black uppercase cursor-pointer tracking-wide text-xs border-2 border-black hover:bg-zinc-100 transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              className={`py-3 font-black uppercase cursor-pointer tracking-wide text-xs border-2 border-black text-white transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${confirmColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>

        <div className="absolute -top-3 -left-3 bg-white border-2 border-black px-2 py-0.5 font-black text-[10px] uppercase">
          Priority_Alert
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;