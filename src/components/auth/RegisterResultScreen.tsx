import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterResultScreen: React.FC = () => {
  const { screenParam, navigateTo } = useApp();
  const isOfficer = screenParam === 'officer';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
        {isOfficer ? (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Kết quả đăng ký cán bộ (Màn 12)
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Hồ Sơ Đang Chờ Xét Duyệt
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Tài khoản Cán bộ công chức của bạn đã được ghi nhận. Quản lý xã sẽ đối chiếu thông tin chức vụ và hồ sơ minh chứng để kích hoạt tài khoản. Kết quả xét duyệt sẽ được thông báo qua Số điện thoại / Email đăng ký.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Kết quả đăng ký người dân (Màn 12)
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Đăng Ký Tài Khoản Thành Công!
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Tài khoản công dân của bạn đã được khởi tạo và liên kết trực tiếp với kho dữ liệu dịch vụ công của xã. Bạn có thể đăng nhập ngay để bắt đầu tra cứu và hỏi đáp cùng Trợ lý AI.
              </p>
            </div>
          </>
        )}

        <div className="pt-2">
          <button
            onClick={() => navigateTo(13)}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Đến trang Đăng nhập</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
