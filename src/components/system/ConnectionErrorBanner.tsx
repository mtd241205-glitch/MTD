import React from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff, RefreshCw, X } from 'lucide-react';

export const ConnectionErrorBanner: React.FC = () => {
  const { isConnectionError, setIsConnectionError } = useApp();

  if (!isConnectionError) return null;

  return (
    <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-semibold shadow-md flex items-center justify-between sticky top-[33px] z-50 animate-in slide-in-from-top">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
        <span>Mất kết nối máy chủ, vui lòng kiểm tra đường truyền mạng của bạn (Màn 58).</span>
        <button
          onClick={() => {
            // Simulate reconnect
            setTimeout(() => setIsConnectionError(false), 500);
          }}
          className="ml-auto underline font-bold hover:text-rose-100 flex items-center gap-1 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Thử lại</span>
        </button>
        <button
          onClick={() => setIsConnectionError(false)}
          className="p-1 hover:bg-rose-700 rounded-md"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
