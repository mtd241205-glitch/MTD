import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const CommuneAdminResetRequestScreen: React.FC = () => {
  const { communes, submitSupportRequest, navigateTo } = useApp();

  const [communeName, setCommuneName] = useState('Xã Hòa Lạc');
  const [managerName, setManagerName] = useState('Đỗ Văn Tuấn');
  const [contactInfo, setContactInfo] = useState('0988112233');
  const [verificationInfo, setVerificationInfo] = useState('Mã xã XA-01284, Hợp đồng số 2025-HL-01');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSupportRequest({
      type: 'password_reset',
      communeName,
      senderName: managerName,
      senderContact: contactInfo,
      verificationInfo,
      content: `Yêu cầu cấp lại mật khẩu cho tài khoản Quản lý xã ${communeName}. Người yêu cầu: ${managerName}, Liên hệ: ${contactInfo}. Thông tin xác minh: ${verificationInfo}`,
    });
    setIsSent(true);
    setTimeout(() => {
      navigateTo(13);
    }, 2500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Kênh Xác Minh Bảo Mật (Màn 15)
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            Cấp Lại Mật Khẩu Quản Lý Xã
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vì lý do an toàn dữ liệu cơ quan nhà nước, tài khoản Quản lý xã được cấp lại mật khẩu thông qua quy trình xác minh trực tiếp của Đội phát triển.
          </p>
        </div>

        {isSent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">Yêu cầu đã được gửi thành công!</h4>
            <p className="text-xs text-slate-600">
              Đội phát triển (Màn 51) sẽ liên hệ xác minh qua số điện thoại và cung cấp mật khẩu tạm. Đang chuyển về trang Đăng nhập...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên đơn vị xã</label>
              <input
                type="text"
                required
                value={communeName}
                onChange={(e) => setCommuneName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ tên người quản trị</label>
              <input
                type="text"
                required
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Số điện thoại / Email liên hệ</label>
              <input
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Thông tin xác minh (Mã xã, số hợp đồng dịch vụ)
              </label>
              <textarea
                rows={3}
                required
                value={verificationInfo}
                onChange={(e) => setVerificationInfo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-amber-700 font-medium mt-1">
                Lưu ý: Không gửi kèm thông tin cá nhân của người dân hay nội dung tài liệu mật.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Gửi yêu cầu tới Đội phát triển</span>
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
            <span>Quay lại trang Đăng nhập (13)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
