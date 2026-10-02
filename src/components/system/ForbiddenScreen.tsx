import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Home, LogIn } from 'lucide-react';

export const ForbiddenScreen: React.FC = () => {
  const { currentUser, navigateTo } = useApp();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
            HTTP 403 FORBIDDEN (MÀN 55)
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            Không Có Quyền Truy Cập
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bạn không có thẩm quyền truy cập vào tài liệu nội bộ này hoặc tài nguyên này thuộc về xã khác.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={() => navigateTo(1)}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ (1)</span>
          </button>

          {!currentUser && (
            <button
              onClick={() => navigateTo(13)}
              className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập tài khoản có thẩm quyền (13)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
