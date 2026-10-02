import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const SysAdminLoginScreen: React.FC = () => {
  const { loginAs, navigateTo } = useApp();

  const [account, setAccount] = useState('dev@aicapxa.vn');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (account !== 'dev@aicapxa.vn') {
      setErrorMsg('Tài khoản hoặc mật khẩu quản trị không chính xác.');
      return;
    }

    const res = loginAs(account, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Đăng nhập không thành công.');
      return;
    }

    navigateTo(47); // Dashboard Đội phát triển
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-6 text-left relative">
        <button
          onClick={() => navigateTo(1)}
          className="absolute left-6 top-6 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Cổng Xã (1)</span>
        </button>

        <div className="text-center pt-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-800">
            SYSTEM ADMIN CONSOLE (MÀN 46)
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-2">
            Đăng Nhập Quản Trị Hệ Thống
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Khu vực dành riêng cho Đội ngũ Kỹ thuật & Phát triển nền tảng AI Cấp Xã
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Tài khoản quản trị viên
            </label>
            <input
              type="text"
              required
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Ẩn' : 'Hiện'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>Đăng nhập Bảng điều khiển Quản trị</span>
          </button>
        </form>

        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 leading-relaxed text-center">
          * Không có chức năng đăng ký tự do hay quên mật khẩu tự động. Tài khoản được cấp trực tiếp qua phân quyền an ninh mạng.
        </div>
      </div>
    </div>
  );
};
