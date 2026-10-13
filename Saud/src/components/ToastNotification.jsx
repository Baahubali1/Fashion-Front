import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ToastNotification = () => {
  const { toast, closeToast } = useShop();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 size={16} className="text-[#b8860b]" />,
    error: <AlertCircle size={16} className="text-rose-400" />,
    info: <Info size={16} className="text-white/80" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex items-center gap-3 bg-[#111]/95 text-white border border-white/20 shadow-2xl px-5 py-3.5 backdrop-blur-md max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      {iconMap[toast.type] || iconMap.info}
      <span className="text-xs tracking-wider font-light flex-1 leading-snug">
        {toast.message}
      </span>
      <button
        onClick={closeToast}
        className="text-white/40 hover:text-white transition-colors cursor-pointer ml-2"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ToastNotification;
