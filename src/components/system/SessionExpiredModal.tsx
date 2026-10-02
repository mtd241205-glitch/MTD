import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, LogIn, X } from 'lucide-react';

export const SessionExpiredModal: React.FC = () => {
  const { currentRole, currentScreen, setIsSessionExpired, navigateTo } = useApp();

  const handleReLogin = () => {
    setIsSessionExpired(false);
    if (currentRole === 'system_admin') {
      navigateTo(46);
    } else {
      navigateTo(13, `return_to_${currentScreen}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
          <Clock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Phiên Đăng Nhập Đã Hết Hạn (Màn 57)
        </h3>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Để bảo đảm an toàn dữ liệu, phiên làm việc của bạn đã hết hạn sau một khoảng thời gian không thao tác. Vui lòng đăng nhập lại để tiếp tục.
        </p>

        <button
          onClick={handleReLogin}
          className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập lại</span>
        </button>
      </div>
    </div>
  );
};
