import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, LogOut, Phone, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

export const CommuneSuspendedScreen: React.FC = () => {
  const { currentCommune, currentRole, logout, navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-rose-50">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
            Dịch vụ tạm ngưng (Màn 59)
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Dịch Vụ Của Xã Hiện Đang Tạm Ngưng
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hợp đồng cung cấp dịch vụ AI Cấp Xã của{' '}
            <strong className="text-slate-900 font-bold">{currentCommune?.name || 'Xã'}</strong> đã{' '}
            <span className="text-rose-600 font-bold">
              {currentCommune?.status === 'suspended' ? 'bị tạm khóa' : 'hết hạn bản quyền'}
            </span>
            . Vui lòng liên hệ đơn vị quản lý xã hoặc Đội phát triển để gia hạn dịch vụ.
          </p>
        </div>

        {/* Contact info dev team */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 text-left">
          <p className="font-bold text-slate-900">Liên hệ hỗ trợ gia hạn:</p>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-purple-600" />
            <span>Hotline kỹ thuật: 1900.88.99.88</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-600" />
            <span>Email hỗ trợ: support@aicapxa.vn</span>
          </div>
        </div>

        {/* Action Buttons (Screen 59 spec) */}
        <div className="space-y-3 pt-2">
          {currentRole === 'commune_admin' && (
            <button
              onClick={() => navigateTo(45)}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Xem thông tin dịch vụ & Gửi gia hạn (Màn 45)</span>
            </button>
          )}

          <button
            onClick={logout}
            className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất về trạng thái Khách vãng lai (1)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
