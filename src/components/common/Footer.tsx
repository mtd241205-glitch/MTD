import React from 'react';
import { useApp } from '../../context/AppContext';
import { Landmark, Shield, FileText, Phone, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-blue-200/80 text-slate-800 text-sm border-t border-blue-300">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Landmark className="w-4 h-4" />
              </div>
              <span>AI CẤP XÃ</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-md">
              Hệ thống trí tuệ nhân tạo và kho tri thức số hóa chuyên biệt cho chính quyền cấp xã. Hỗ trợ người dân tra cứu thủ tục hành chính, giải đáp chính sách 24/7 và hỗ trợ cán bộ công chức cơ sở xử lý văn bản nghiệp vụ chính xác, an toàn, bảo mật dữ liệu.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-800">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Cam kết bảo mật dữ liệu: Đội phát triển không truy cập nội dung tài liệu của xã.</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Dịch Vụ & Tra Cứu
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo(4)}
                  className="hover:text-blue-700 transition-colors"
                >
                  Văn bản & Chính sách
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo(6)}
                  className="hover:text-blue-700 transition-colors"
                >
                  Thủ tục hành chính cấp xã
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo(22)}
                  className="hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <span>Chatbot AI hỏi đáp</span>
                  <Sparkles className="w-3 h-3 text-blue-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo(2)}
                  className="hover:text-blue-700 transition-colors"
                >
                  Giới thiệu sản phẩm
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo(8)}
                  className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Điều khoản sử dụng (8)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo(9)}
                  className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Chính sách bảo mật (9)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo(3)}
                  className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Liên hệ & Góp ý (3)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-blue-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 AI Cấp Xã. Bản quyền thuộc về Đội ngũ Phát triển Trí tuệ Nhân tạo Chính quyền số.</p>
          <div className="flex items-center gap-4 text-slate-800">
            <span>Tiêu chuẩn an toàn thông tin ISO/IEC 27001</span>
            <span>•</span>
            <span>Hạ tầng điện toán đám mây riêng biệt</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
