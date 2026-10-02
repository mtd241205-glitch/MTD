import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ArrowLeft, Lock, Database, UserCheck, AlertCircle } from 'lucide-react';

export const PrivacyScreen: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Cam kết an toàn thông tin (Màn 9)
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Chính Sách Bảo Mật Quyền Riêng Tư</h1>
          <p className="text-xs text-slate-500 mt-1">Cập nhật lần cuối: Ngày 15 tháng 01 năm 2026</p>
        </div>
        <button
          onClick={goBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Prominent Commitment Callout (Part I Principle 8) */}
      <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-300 space-y-3">
        <div className="flex items-center gap-3 text-emerald-900 font-extrabold text-base">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>CAM KẾT CỐT LÕI CỦA ĐỘI NGŨ PHÁT TRIỂN HỆ THỐNG</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed font-medium">
          Đội phát triển (Quản trị hệ thống) <strong>tuyệt đối không truy cập dữ liệu cá nhân của người dùng</strong> (Số CCCD, số điện thoại cá nhân, địa chỉ riêng tư) và <strong>nội dung tài liệu của xã</strong> trong mọi trường hợp. Cam kết này được bảo đảm bằng kiến trúc kỹ thuật cô lập cơ sở dữ liệu và kho vector riêng biệt, không chỉ đơn thuần ẩn ở giao diện.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-6">
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-600" />
            <span>1. Cơ chế mã hóa và cô lập dữ liệu theo xã</span>
          </h3>
          <p>
            Mỗi xã sau khi ký hợp đồng dịch vụ sẽ được khởi tạo một không gian lưu trữ và cơ sở dữ liệu vector riêng biệt. Dữ liệu tài liệu nội bộ, kế hoạch chỉ đạo chỉ hiển thị với Cán bộ và Quản lý của đúng xã đó. Người dân và xã khác không thể truy cập.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>2. Giới hạn thẩm quyền của Đội phát triển đối với thông tin xã</span>
          </h3>
          <p>
            Ở trạng thái mặc định, Đội phát triển chỉ được xem số liệu thống kê tổng hợp (tổng số người dùng, tổng dung lượng lưu trữ, số câu hỏi) và thông tin liên hệ đại diện của Quản lý xã để phục vụ hỗ trợ hành chính. Toàn bộ tên tài liệu, nội dung văn bản và hội thoại của người dân đều được bảo vệ nghiêm ngặt.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>3. Quy chế Hỗ trợ kỹ thuật có điều kiện</span>
          </h3>
          <p>
            Khi xảy ra lỗi kỹ thuật (như lỗi trích xuất file scan OCR), Quản lý xã là bên duy nhất có quyền chủ động kích hoạt <strong>"Phiên hỗ trợ kỹ thuật"</strong> với thời hạn xác định (24 giờ, 3 ngày hoặc 7 ngày) và có thể thu hồi bất cứ lúc nào.
          </p>
          <p>
            Trong suốt phiên hỗ trợ, kỹ sư phát triển chỉ được truy cập vào mã lỗi kỹ thuật ẩn danh (ví dụ mã tài liệu: <code>DOC-8F3A</code>) để chẩn đoán hệ thống, hoàn toàn không được mở nội dung văn bản. Mọi lượt truy cập của kỹ sư đều được tự động ghi nhận vào Nhật ký lịch sử để Quản lý xã kiểm tra.
          </p>
        </section>
      </div>
    </div>
  );
};
