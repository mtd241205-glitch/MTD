import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Search, Filter, Download, ArrowRight, Clock } from 'lucide-react';

export const SystemLogsScreen: React.FC = () => {
  const { systemAuditLogs, communes, navigateTo } = useApp();

  const [communeFilter, setCommuneFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = systemAuditLogs.filter((log) => {
    if (communeFilter !== 'all' && log.communeName !== communeFilter) return false;
    if (actionFilter !== 'all' && !log.action.includes(actionFilter)) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (
        !log.action.toLowerCase().includes(term) &&
        !log.target.toLowerCase().includes(term) &&
        !log.userName.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            <span>SYSTEM AUDIT TRAIL (MÀN 53)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Nhật Ký Thao Tác Toàn Hệ Thống
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ghi vết mọi hành vi cấp quản trị: Khởi tạo xã, gia hạn, chuyển giao, cập nhật dữ liệu dùng chung và mở phiên chẩn đoán
          </p>
        </div>

        <button
          onClick={() => alert('Đang xuất tệp nhật ký kiểm toán hệ thống CSV/Audit format...')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Xuất nhật ký (53)</span>
        </button>
      </div>

      {/* Principle callout */}
      <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs">
        <strong>Nguyên tắc ghi vết:</strong> Chỉ ghi thao tác ở cấp hệ thống và dịch vụ xã. Không bao giờ ghi nhận nội dung văn bản hay tên tài liệu riêng tư của xã.
      </div>

      {/* Filters Toolbar */}
      <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo hành vi, đối tượng, người thực hiện..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={communeFilter}
            onChange={(e) => setCommuneFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300"
          >
            <option value="all">Tất cả các xã</option>
            {communes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300"
          >
            <option value="all">Tất cả loại hành vi</option>
            <option value="Khởi tạo">Khởi tạo xã</option>
            <option value="Gia hạn">Gia hạn dịch vụ</option>
            <option value="khóa">Khóa / Mở khóa</option>
            <option value="chẩn đoán">Mở chẩn đoán kỹ thuật</option>
            <option value="hỗ trợ">Quyền hỗ trợ</option>
            <option value="dùng chung">Cập nhật dữ liệu dùng chung</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Thời gian</th>
                <th className="px-5 py-3.5">Người thực hiện</th>
                <th className="px-5 py-3.5">Hành động hệ thống</th>
                <th className="px-5 py-3.5">Đối tượng tác động</th>
                <th className="px-5 py-3.5">Ghi chú chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 font-mono whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-purple-300 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-5 py-3.5 text-slate-200">{log.target}</td>
                  <td className="px-5 py-3.5 text-slate-400">{log.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
