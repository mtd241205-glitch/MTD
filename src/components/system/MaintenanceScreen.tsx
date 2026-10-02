import React from 'react';
import { useApp } from '../../context/AppContext';
import { Server, RefreshCw } from 'lucide-react';

export const MaintenanceScreen: React.FC = () => {
  const { setIsMaintenance, navigateTo } = useApp();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto animate-pulse">
          <Server className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
            SYSTEM MAINTENANCE (MÀN 56)
          </span>
          <h2 className="text-2xl font-black text-white mt-2">
            Hệ Thống Đang Nâng Cấp Bảo Trì
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hệ thống AI Cấp Xã đang thực hiện cập nhật hạ tầng định kỳ và tối ưu hóa cụm máy chủ vector hóa.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-white">Thời gian dự kiến hoạt động trở lại:</p>
          <p className="font-mono text-amber-400 font-bold">22:00, ngày 29/09/2026</p>
        </div>

        <button
          onClick={() => {
            setIsMaintenance(false);
            navigateTo(1);
          }}
          className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tải lại trang</span>
        </button>
      </div>
    </div>
  );
};
