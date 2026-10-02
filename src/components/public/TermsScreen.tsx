import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const TermsScreen: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Văn bản pháp lý (Màn 8)
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Điều Khoản Sử Dụng Dịch Vụ</h1>
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

      <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-6">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-medium">
          <p className="font-bold text-slate-900 mb-2">Mục lục điều khoản:</p>
          <ul className="list-decimal pl-5 space-y-1 text-xs">
            <li>Điều 1. Phạm vi điều chỉnh và đối tượng áp dụng</li>
            <li>Điều 2. Tài khoản người dùng và trách nhiệm bảo mật</li>
            <li>Điều 3. Quyền và nghĩa vụ của người dân và cán bộ công chức</li>
            <li>Điều 4. Cơ chế hoạt động của Trợ lý AI và tính chất khuyến nghị</li>
            <li>Điều 5. Tạm ngừng và chấm dứt dịch vụ</li>
          </ul>
        </div>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Điều 1. Phạm vi điều chỉnh và đối tượng áp dụng
          </h3>
          <p>
            Hệ thống <strong>AI Cấp Xã</strong> cung cấp giải pháp tra cứu pháp luật, quy trình giải quyết thủ tục hành chính và số hóa kho tri thức cho Ủy ban nhân dân cấp xã, người dân cư trú tại địa phương và cán bộ công chức trực thuộc.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Điều 2. Tài khoản người dùng và trách nhiệm bảo mật
          </h3>
          <p>
            1. Mỗi công dân hoặc cán bộ đăng ký bằng Số Căn cước công dân và Số điện thoại chính chủ. Tài khoản cán bộ cần được Quản lý xã phê duyệt trước khi kích hoạt phân quyền nghiệp vụ.
          </p>
          <p>
            2. Người dùng có trách nhiệm tự bảo quản thông tin mật khẩu, mã xác thực OTP. Không chia sẻ tài khoản cho bên thứ ba.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Điều 3. Cơ chế hoạt động của Trợ lý AI và tính chất khuyến nghị
          </h3>
          <p>
            1. Câu trả lời của Trợ lý AI được tổng hợp tự động từ kho dữ liệu số hóa theo vai trò người dùng (dữ liệu dùng chung, dữ liệu công khai của xã hoặc dữ liệu nội bộ).
          </p>
          <p>
            2. Mọi câu trả lời của AI chỉ mang tính chất hướng dẫn, tham khảo và khuyến nghị quy trình. Kết quả giải quyết thủ tục hành chính chính thức căn cứ trên hồ sơ thực tế và quyết định của cơ quan nhà nước có thẩm quyền theo quy định pháp luật.
          </p>
        </section>
      </div>
    </div>
  );
};
