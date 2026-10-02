import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const ForceChangePasswordScreen: React.FC = () => {
  const { currentUser, updateUserProfile, navigateTo } = useApp();

  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'Chưa nhập', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, text: 'Yếu', color: 'bg-rose-500' };
      case 2:
        return { score: 50, text: 'Trung bình', color: 'bg-amber-500' };
      case 3:
        return { score: 75, text: 'Khá mạnh', color: 'bg-blue-500' };
      case 4:
        return { score: 100, text: 'Rất mạnh', color: 'bg-emerald-500' };
      default:
        return { score: 10, text: 'Rất yếu', color: 'bg-rose-400' };
    }
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // Success: clear mustChangePasswordFirstLogin
    updateUserProfile({ mustChangePasswordFirstLogin: false });

    if (currentUser?.role === 'system_admin') {
      navigateTo(47);
    } else {
      navigateTo(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
          Bắt buộc bảo mật (Màn 16)
        </span>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2 mb-2">
          Đổi Mật Khẩu Lần Đầu
        </h2>

        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Tài khoản của bạn đang sử dụng mật khẩu tạm do hệ thống cấp. Để bảo đảm an toàn dữ liệu, vui lòng thiết lập mật khẩu mới trước khi tiếp tục.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mật khẩu tạm hiện tại *</label>
            <input
              type="password"
              required
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="Nhập mật khẩu tạm đã nhận"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới *</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-right font-semibold text-slate-500">
                  Độ mạnh: {strength.text}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Xác nhận đổi mật khẩu</span>
          </button>
        </form>
      </div>
    </div>
  );
};
