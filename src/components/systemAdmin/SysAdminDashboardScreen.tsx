import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  MessageSquare,
  HardDrive,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Cpu,
  Activity,
  Shield,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const SysAdminDashboardScreen: React.FC = () => {
  const {
    communes,
    users,
    supportRequests,
    systemAuditLogs,
    navigateTo,
  } = useApp();

  const [provinceFilter, setProvinceFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('30days');

  // Aggregated calculations
  const totalCommunes = communes.length;
  const activeCommunes = communes.filter((c) => c.status === 'active').length;
  const expiringCommunes = communes.filter((c) => c.status === 'expiring');
  const suspendedCommunes = communes.filter((c) => c.status === 'suspended' || c.status === 'expired');

  const totalCitizens = users.filter((u) => u.role === 'citizen').length;
  const totalOfficers = users.filter((u) => u.role === 'officer').length;
  const totalUsersCount = communes.reduce((acc, c) => acc + c.userCount, 0);

  const totalStorageUsed = communes.reduce((acc, c) => acc + c.storageUsedMb, 0);

  // Communes with error docs (anonymous count only, NO names or contents!)
  const communesWithErrorDocs = communes.filter((c) => c.errorDocsCount > 0);

  return (
    <div className="space-y-8 text-left">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Activity className="w-4 h-4" />
            <span>DEV TEAM SYSTEM DASHBOARD (MÀN 47)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight mt-1">
            Tổng Quan Toàn Hệ Thống Đa Xã
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi sức khỏe hạ tầng đám mây, chỉ số hoạt động tổng hợp và chẩn đoán kỹ thuật ẩn danh
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300"
          >
            <option value="all">Toàn quốc (Tất cả tỉnh)</option>
            <option value="TP. Hà Nội">TP. Hà Nội</option>
            <option value="Tỉnh Hà Giang">Tỉnh Hà Giang</option>
          </select>

          <button
            onClick={() => navigateTo(49)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Khởi tạo xã mới (49)</span>
          </button>
        </div>
      </div>

      {/* Security note callout */}
      <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs flex items-center gap-2.5">
        <Shield className="w-4 h-4 text-purple-400 shrink-0" />
        <span>
          <strong>Nguyên tắc bảo mật Phần I:</strong> Khu vực Đội phát triển chỉ hiển thị số liệu tổng hợp và trạng thái kỹ thuật ẩn danh (mã lỗi, DOC-xxxx). Không hiển thị nội dung tài liệu, hội thoại người dân hay danh sách cá nhân của xã.
        </span>
      </div>

      {/* 8 Aggregated Stat Cards (Screen 47 spec) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => navigateTo(48)}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tổng số xã
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-purple-400">
            {totalCommunes}
          </div>
          <span className="text-[10px] text-purple-400 font-semibold mt-1 block">Bấm để quản lý danh sách &rarr;</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Xã đang hoạt động
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {activeCommunes}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Chiếm 67% tổng xã</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Xã sắp hết hạn
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {expiringCommunes.length}
          </div>
          <span className="text-[10px] text-amber-400/80 mt-1 block">Cần liên hệ gia hạn</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Xã tạm khóa / hết hạn
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">
            {suspendedCommunes.length}
          </div>
          <span className="text-[10px] text-rose-400/80 mt-1 block">Dịch vụ đang tạm ngưng</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tổng người dùng hệ thống
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalUsersCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Cán bộ: 39 • Dân: 784
          </span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tổng câu hỏi Chatbot AI
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            4.280
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">+32% tháng này</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tỉ lệ hài lòng trung bình
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-400">
            97.2%
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Trên toàn bộ các xã</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tổng dung lượng lưu trữ
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {(totalStorageUsed / 1024).toFixed(1)} GB
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Kho vector & tệp số</span>
        </div>
      </div>

      {/* Alert Tables Grid (Screen 47 spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table 1: Xã sắp hết hạn */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Xã sắp hết hạn</span>
            </h3>
            <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-800">
              {expiringCommunes.length}
            </span>
          </div>

          <div className="space-y-2">
            {expiringCommunes.map((c) => (
              <div
                key={c.id}
                onClick={() => navigateTo(50, c.id)}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{c.name}</span>
                  <span className="text-[11px] text-slate-400">Hết hạn: {c.expiresAt}</span>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-1 rounded-lg">
                  Còn 6 ngày
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Table 2: Xã có tài liệu lỗi (ANONYMOUS COUNT ONLY) */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Xã có tài liệu lỗi xử lý</span>
            </h3>
            <span className="text-[10px] bg-rose-950 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-800">
              {communesWithErrorDocs.length}
            </span>
          </div>

          <div className="space-y-2">
            {communesWithErrorDocs.map((c) => (
              <div
                key={c.id}
                onClick={() => navigateTo(50, c.id)}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{c.name}</span>
                  <span className="text-[11px] text-rose-300">
                    {c.errorDocsCount} tài liệu gặp lỗi bóc tách
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Table 3: Yêu cầu hỗ trợ mới (Screen 47 spec) */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Yêu cầu hỗ trợ từ xã</span>
            </h3>
            <button
              onClick={() => navigateTo(51)}
              className="text-[11px] text-purple-400 hover:underline font-bold"
            >
              Xem tất cả (51)
            </button>
          </div>

          <div className="space-y-2">
            {supportRequests.slice(0, 3).map((r) => (
              <div
                key={r.id}
                onClick={() => navigateTo(51, r.id)}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{r.communeName}</span>
                  <span className="text-[10px] text-purple-300 font-medium">
                    {r.type === 'technical_issue'
                      ? 'Sự cố kỹ thuật'
                      : r.type === 'renewal'
                      ? 'Gia hạn'
                      : 'Cấp lại mật khẩu'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health Block (Screen 47 spec) */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Sức Khỏe & Tình Trạng Hạ Tầng Kỹ Thuật Hệ Thống</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Tỉ lệ lỗi toàn hệ thống:</span>
            <span className="text-xl font-black text-emerald-400 font-mono">0.08%</span>
            <span className="text-[10px] text-slate-500 block mt-1">Đạt SLA chuẩn chính phủ</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Thời gian phản hồi AI trung bình:</span>
            <span className="text-xl font-black text-emerald-400 font-mono">1.15s</span>
            <span className="text-[10px] text-slate-500 block mt-1">Mô hình Gemini AI 2.0</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Hàng đợi sinh vector:</span>
            <span className="text-xl font-black text-white font-mono">0 tác vụ</span>
            <span className="text-[10px] text-slate-500 block mt-1">Không có tắc nghẽn</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Trạng thái mã hóa RAG:</span>
            <span className="text-xl font-black text-emerald-400 font-mono">BẢO MẬT</span>
            <span className="text-[10px] text-slate-500 block mt-1">Vector cô lập từng xã</span>
          </div>
        </div>
      </div>
    </div>
  );
};
