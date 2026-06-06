import { AlertTriangle, X } from 'lucide-react';

const ConfirmationDialog = ({ isOpen, type, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const content = {
    newsDelete: {
      title: "Delete Article?",
      message: "This action is permanent. The news entry will be completely removed from your library.",
      confirmText: "Delete Article",
      confirmColor: "bg-red-700 hover:bg-red-800 text-white border-red-700 hover:border-red-800",
    },
    accountDelete: {
      title: "Terminate Account?",
      message: "All user data, preferences, and saved articles will be deleted permanently. This cannot be undone.",
      confirmText: "Delete Account",
      confirmColor: "bg-red-700 hover:bg-red-800 text-white border-red-700 hover:border-red-800",
    },
    signOut: {
      title: "End Session?",
      message: "You will be logged out of your current session. Do you wish to proceed?",
      confirmText: "Sign Out",
      confirmColor: "bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-900 hover:border-neutral-800",
    }
  };

  const { title, message, confirmText, confirmColor } = content[type];

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs">
      <div className="bg-white border border-neutral-200 w-full max-w-md relative animate-in zoom-in-98 duration-200 shadow-xl rounded-xs">
        
        <div className="p-6 flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-neutral-50 border border-neutral-100 rounded-full shrink-0 text-neutral-500">
              <AlertTriangle size={16} strokeWidth={2} />
            </div>
            <div className="space-y-1 pt-0.5">
              <h2 className="lora font-medium text-lg text-neutral-950 tracking-tight">{title}</h2>
              <p className="lora text-neutral-600 text-sm leading-relaxed font-normal">
                {message}
              </p>
            </div>
          </div>
          <button 
            onClick={onCancel} 
            className="text-neutral-400 hover:text-neutral-900 cursor-pointer transition-colors pt-1"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="flex sm:justify-end gap-3 flex-col sm:flex-row">
            <button
              onClick={onCancel}
              className="manrope w-full sm:w-max px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-colors cursor-pointer rounded-xs"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`manrope w-full sm:w-max px-5 py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer rounded-xs ${confirmColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfirmationDialog;