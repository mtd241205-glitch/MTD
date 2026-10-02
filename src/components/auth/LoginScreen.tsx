import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginAs, navigateTo, screenParam } = useApp();

  const [accountInput, setAccountInput] = useState('dovantuan_hoalac@hanoi.gov.vn');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorBanner, setErrorBanner] = useState<{ type: 'error' | 'warning'; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);

    // Block system admin here as specified in Part IV Screen 13
    if (accountInput === 'dev@aicapxa.vn') {
      setErrorBanner({
        type: 'error',
        message: 'Tài khoản Quản trị hệ thống không đăng nhập tại cổng này. Vui lòng truy cập cổng riêng (Màn 46).',
      });
      return;
    }

    const res = loginAs(accountInput.trim(), passwordInput);
    if (!res.success) {
      if (res.message?.includes('chờ xét duyệt')) {
        setErrorBanner({ type: 'warning', message: res.message });
      } else {
        setErrorBanner({ type: 'error', message: res.message || 'Tài khoản hoặc mật khẩu không chính xác' });
      }
      return;
    }

    // Check redirection targets
    if (res.targetScreen) {
      navigateTo(res.targetScreen);
      return;
    }

    // Check if was redirected from Chatbot or Doc asking
    if (screenParam?.includes('redirect_to_22')) {
      navigateTo(22);
    } else if (screenParam?.includes('redirect_to_26')) {
      navigateTo(26);
    } else {
      navigateTo(1);
    }
  };

  // Quick preset accounts to help reviewer test instantly
  const setQuickAccount = (email: string) => {
    setAccountInput(email);
    setPasswordInput('123456');
    setErrorBanner(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Left Column: Visual & Motto */}
        <div className="lg:col-span-5 bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Landmark className="w-7 h-7 text-white" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-200">
                Chính quyền điện tử & Chuyển đổi số
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                Cổng Đăng Nhập AI Cấp Xã (Màn 13)
              </h2>
              <p className="text-sm text-red-100 leading-relaxed">
                Hệ thống tự động nhận diện vai trò Người dân, Cán bộ hoặc Quản lý xã để cung cấp đúng phạm vi thông tin quy định.
              </p>
            </div>
          </div>

          {/* Quick preset selector for testing convenience */}
          <div className="pt-8 border-t border-white/20 relative z-10">
            <p className="text-xs font-bold text-red-200 uppercase tracking-wider mb-2">
              Tài khoản mẫu thử nghiệm nhanh:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setQuickAccount('dovantuan_hoalac@hanoi.gov.vn')}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium"
              >
                Quản lý xã
              </button>
              <button
                type="button"
                onClick={() => setQuickAccount('nguyenthimai@hoalac.gov.vn')}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium"
              >
                Cán bộ đã duyệt
              </button>
              <button
                type="button"
                onClick={() => setQuickAccount('lehoangnam.vhtt@gmail.com')}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium"
              >
                Cán bộ chờ duyệt
              </button>
              <button
                type="button"
                onClick={() => setQuickAccount('minh.phamvan95@gmail.com')}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium"
              >
                Người dân
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center text-left">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Đăng nhập tài khoản
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Nhập số điện thoại hoặc email đã đăng ký với xã
            </p>
          </div>

          {errorBanner && (
            <div
              className={`mb-6 p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-start gap-3 ${
                errorBanner.type === 'warning'
                  ? 'bg-amber-50 border border-amber-300 text-amber-900'
                  : 'bg-rose-50 border border-rose-300 text-rose-800'
              }`}
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorBanner.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Số điện thoại hoặc Email
              </label>
              <input
                type="text"
                required
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder="0912345678 hoặc email@domain.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => navigateTo(14)}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Quên mật khẩu? (14)
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập hệ thống</span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigateTo(10)}
                className="font-bold text-red-600 hover:underline"
              >
                Đăng ký ngay (10)
              </button>
            </div>

            {/* Sysadmin notice specified in Screen 13 */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => navigateTo(46)}
                className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <Lock className="w-3 h-3" />
                <span>Khu vực Đội phát triển / Quản trị hệ thống (Màn 46) &rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
