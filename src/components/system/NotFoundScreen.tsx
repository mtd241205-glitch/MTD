import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  const { currentRole, navigateTo } = useApp();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-7xl font-black text-red-600 tracking-tighter">404</div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Không Tìm Thấy Trang (Màn 54)</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ khác trong hệ thống.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigateTo(currentRole === 'system_admin' ? 47 : 1)}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
