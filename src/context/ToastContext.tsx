import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, LoaderCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'loading';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  dismissing: boolean;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => number;
  dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_EXIT_DURATION = 180;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);

    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, dismissing: true } : toast))
    );
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_EXIT_DURATION);
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 3200) => {
      const id = ++nextId.current;
      setToasts((current) => [...current.slice(-3), { id, type, message, dismissing: false }]);
      if (duration > 0) {
        timers.current.set(id, setTimeout(() => dismissToast(id), duration));
      }
      return id;
    },
    [dismissToast]
  );

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    },
    []
  );

  const iconFor = (type: ToastType) => {
    if (type === 'success') return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    if (type === 'error') return <AlertCircle className="h-5 w-5 text-rose-600" />;
    if (type === 'warning') return <AlertCircle className="h-5 w-5 text-amber-600" />;
    if (type === 'loading') return <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />;
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div
        className="toast-region"
        aria-live="polite"
        aria-relevant="additions removals"
        aria-label="Thông báo"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item ${toast.dismissing ? 'toast-item-leaving' : ''}`}
            role={toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'}
          >
            {iconFor(toast.type)}
            <p className="min-w-0 flex-1 text-sm font-medium text-slate-800">{toast.message}</p>
            <button
              type="button"
              className="toast-dismiss"
              onClick={() => dismissToast(toast.id)}
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
