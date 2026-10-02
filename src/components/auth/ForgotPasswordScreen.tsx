import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, ArrowLeft, CheckCircle2, Clock, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export const ForgotPasswordScreen: React.FC = () => {
  const { users, navigateTo } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accountInput, setAccountInput] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const matchedUser = users.find(
      (u) => u.phone === accountInput.trim() || u.email === accountInput.trim()
    );

    if (!matchedUser) {
      setErrorMessage('Không tìm thấy tài khoản tương ứng với thông tin trên.');
      return;
    }

    // STRICT SPEC: If user is Commune Manager, cannot self reset! Must route to Screen 15!
    if (matchedUser.role === 'commune_admin') {
      navigateTo(15, matchedUser.communeId);
      return;
    }

    // Move to step 2 (OTP)
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      navigateTo(13);
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Quên Mật Khẩu (Màn 14)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình khôi phục mật khẩu 3 bước bảo mật
          </p>
        </div>

        {/* 3 Step Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-4 relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0"></div>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all ${
                step >= s ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">Đặt lại mật khẩu thành công!</h4>
            <p className="text-xs text-slate-600">Đang chuyển hướng về trang Đăng nhập...</p>
          </div>
        ) : step === 1 ? (
          /* Step 1: Input account */
          <form onSubmit={handleStep1Submit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Số điện thoại hoặc Email tài khoản
              </label>
              <input
                type="text"
                required
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder="0912345678 hoặc email@domain.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Lưu ý: Nếu là tài khoản Quản lý xã, hệ thống sẽ tự động chuyển sang trang gửi yêu cầu xác minh đội phát triển.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Gửi mã xác thực</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : step === 2 ? (
          /* Step 2: OTP */
          <form onSubmit={handleStep2Submit} className="space-y-6 text-center">
            <p className="text-xs text-slate-600">
              Nhập mã xác thực 6 số gửi về: <strong>{accountInput}</strong>
            </p>

            <div className="flex justify-center gap-2">
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={d}
                  onChange={(e) => {
                    const next = [...otpDigits];
                    next[i] = e.target.value;
                    setOtpDigits(next);
                  }}
                  className="w-10 h-12 text-center text-xl font-bold rounded-xl border border-slate-300 font-mono"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all"
            >
              Xác nhận mã OTP
            </button>
          </form>
        ) : (
          /* Step 3: New Password */
          <form onSubmit={handleStep3Submit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-100 text-center mt-6">
          <button
            type="button"
            onClick={() => navigateTo(13)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang Đăng nhập</span>
          </button>
        </div>
      </div>
    </div>
  );
};
