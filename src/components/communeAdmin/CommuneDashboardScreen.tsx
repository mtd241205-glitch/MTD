import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Calendar,
  Download,
  Users,
  MessageSquare,
  ThumbsUp,
  FileText,
  AlertTriangle,
  Lock,
  Globe,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const CommuneDashboardScreen: React.FC = () => {
  const {
    currentCommune,
    documents,
    loginHistory,
    communeAuditLogs,
    navigateTo,
  } = useApp();

  const [timeRange, setTimeRange] = useState('30days');
  const [activeBottomTab, setActiveBottomTab] = useState<'login_history' | 'audit_logs'>('login_history');

  // Stats calculation
  const communeDocs = documents.filter((d) => d.communeId === currentCommune?.id);
  const internalDocsCount = communeDocs.filter((d) => d.scope === 'commune_internal').length;
  const publicDocsCount = communeDocs.filter((d) => d.scope === 'commune_public').length;
  const errorDocsCount = communeDocs.filter((d) => d.status === 'processing_error').length;
  const draftDocsCount = communeDocs.filter((d) => d.status === 'draft' || d.status === 'hidden').length;

  // Unanswered questions list (Screen 41 spec: for commune to add missing docs)
  const unansweredQuestions = [
    {
      q: 'Điều kiện hỗ trợ sửa nhà ở cho hộ gia đình người có công năm 2026',
      count: 14,
      suggestion: 'Xã chưa đăng tải Quyết định phân bổ kinh phí hỗ trợ người có công đợt 2',
    },
    {
      q: 'Mức thu phí vệ sinh môi trường thôn 4 áp dụng từ tháng 10',
      count: 9,
      suggestion: 'Cần bổ sung thông báo mức thu gom rác mới ban hành',
    },
    {
      q: 'Hồ sơ xin cấp giấy phép cải tạo công trình nhà ở riêng lẻ nông thôn',
      count: 8,
      suggestion: 'Bổ sung hướng dẫn chi tiết bản vẽ mẫu một cửa',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Khu vực Quản trị xã (Màn 41)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Báo Cáo Quản Lý Sử Dụng & Thống Kê
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi lưu lượng người dùng, tần suất hỏi đáp trợ lý AI và nhật ký vận hành tại địa phương
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white shadow-xs"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm 2026</option>
          </select>

          <button
            onClick={() => alert('Đang xuất báo cáo thống kê sử dụng AI cấp xã dạng Excel...')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigateTo(30)}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Đăng ký mới
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {currentCommune?.userCount || 428}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18 tài khoản tuần này</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Người dùng hoạt động
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">312</div>
          <p className="text-[11px] text-slate-500 mt-1">Chiếm 73% tổng người dùng xã</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Câu hỏi Chatbot AI
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">1.840</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>+24% so với tháng trước</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tỉ lệ hài lòng
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ThumbsUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">96.8%</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Dựa trên 452 lượt phản hồi</p>
        </div>
      </div>

      {/* Document Storage Breakdown Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-red-600" />
          <span>Thống kê kho tài liệu số hóa của xã</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div
            onClick={() => navigateTo(34)}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Tài liệu Nội bộ</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{internalDocsCount}</div>
            <span className="text-[11px] text-slate-400">Chỉ Cán bộ & Quản lý xem</span>
          </div>

          <div
            onClick={() => navigateTo(34)}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tài liệu Công khai</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{publicDocsCount}</div>
            <span className="text-[11px] text-slate-400">Người dân & Chatbot tra cứu</span>
          </div>

          <div
            onClick={() => navigateTo(34)}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
              <span>Bản nháp / Đang ẩn</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{draftDocsCount}</div>
            <span className="text-[11px] text-slate-400">Chưa công bố ra ngoài</span>
          </div>

          <div
            onClick={() => navigateTo(45)}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:border-rose-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-rose-700 font-semibold mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Lỗi xử lý (OCR/Vector)</span>
            </div>
            <div className="text-2xl font-black text-rose-700">{errorDocsCount}</div>
            <span className="text-[11px] text-rose-600 font-medium">Bấm để kiểm tra & khắc phục</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Daily Traffic + Most Viewed Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Daily Visits Simulation */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Lượt truy cập & tương tác theo ngày</span>
            <span className="text-xs text-slate-400 font-normal">Tháng 9/2026</span>
          </h3>

          <div className="h-48 flex items-end justify-between gap-1.5 pt-6 pb-2 border-b border-slate-100">
            {[45, 62, 58, 80, 95, 120, 110, 85, 92, 130, 145, 160, 150, 175].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-lg bg-red-600/80 group-hover:bg-red-600 transition-all"
                  style={{ height: `${(val / 180) * 100}%` }}
                  title={`Ngày ${idx + 15}: ${val} lượt truy cập`}
                ></div>
                <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                  {idx + 15}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Cao điểm: Thứ Ba & Thứ Năm hàng tuần</span>
            <span className="font-semibold text-slate-800">Trung bình 115 lượt/ngày</span>
          </div>
        </div>

        {/* Most Viewed Docs (Dùng chung vs Của xã) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Tài liệu tra cứu nhiều nhất</span>
            <span className="text-xs text-slate-400 font-normal">Theo nguồn</span>
          </h3>

          <div className="space-y-3">
            {[
              {
                title: 'Thủ tục Đăng ký khai sinh liên thông 3 trong 1',
                views: 3200,
                scope: 'shared',
              },
              {
                title: 'Chứng thực bản sao từ bản chính',
                views: 4500,
                scope: 'shared',
              },
              {
                title: 'Kế hoạch Chuyển đổi số và Dịch vụ công xã Hòa Lạc',
                views: 680,
                scope: 'commune_public',
              },
              {
                title: 'Lịch tiếp công dân năm 2026 của Chủ tịch UBND xã',
                views: 520,
                scope: 'commune_public',
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-xs">
                    {item.title}
                  </span>
                  <span className="font-mono text-slate-500 font-bold">
                    {item.views.toLocaleString()} lượt
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      item.scope === 'shared' ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${(item.views / 4500) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unanswered Questions (Screen 41 spec: ONLY Commune Manager sees!) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              Câu Hỏi Chưa Có Căn Cứ Trả Lời (Cần Xã Bổ Sung Tài Liệu)
            </h3>
          </div>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">
            {unansweredQuestions.length} câu hỏi cần bổ sung
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Danh sách câu hỏi của công dân mà hệ thống AI chưa tìm thấy văn bản quy định tại địa phương. Quản lý xã xem danh sách này để bổ sung các quyết định, hướng dẫn còn thiếu vào mục Quản lý dữ liệu.
        </p>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
          {unansweredQuestions.map((q, idx) => (
            <div key={idx} className="p-4 bg-slate-50/50 hover:bg-slate-50 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">"{q.q}"</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    {q.count} lần hỏi
                  </span>
                </div>
                <p className="text-xs text-amber-800 font-medium">💡 Gợi ý bổ sung: {q.suggestion}</p>
              </div>

              <button
                onClick={() => navigateTo(35)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 shadow-xs"
              >
                + Bổ sung tài liệu (35)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs 42 & 43: Login History & Commune Audit Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveBottomTab('login_history')}
            className={`px-6 py-3.5 text-xs font-bold border-b-2 transition-all ${
              activeBottomTab === 'login_history'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Lịch sử đăng nhập của xã (Màn 42)
          </button>
          <button
            onClick={() => setActiveBottomTab('audit_logs')}
            className={`px-6 py-3.5 text-xs font-bold border-b-2 transition-all ${
              activeBottomTab === 'audit_logs'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Nhật ký thao tác vận hành xã (Màn 43)
          </button>
        </div>

        {/* Tab 42: Lịch sử đăng nhập */}
        {activeBottomTab === 'login_history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Thời gian</th>
                  <th className="px-4 py-3.5">Tài khoản / Người dùng</th>
                  <th className="px-4 py-3.5">Địa chỉ IP</th>
                  <th className="px-4 py-3.5">Thiết bị & Trình duyệt</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loginHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{item.timestamp}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{item.userName}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{item.ip}</td>
                    <td className="px-4 py-3.5 text-slate-600">{item.device}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 43: Nhật ký thao tác */}
        {activeBottomTab === 'audit_logs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Thời gian</th>
                  <th className="px-4 py-3.5">Người thực hiện</th>
                  <th className="px-4 py-3.5">Hành động</th>
                  <th className="px-4 py-3.5">Đối tượng tác động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {communeAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {log.userName} <span className="text-slate-400 font-normal">({log.userRole})</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{log.action}</td>
                    <td className="px-4 py-3.5 text-slate-700">{log.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
