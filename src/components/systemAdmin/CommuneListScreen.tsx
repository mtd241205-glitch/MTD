import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { CommuneStatus } from '../../types';

export const CommuneListScreen: React.FC = () => {
  const { communes, navigateTo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredCommunes = communes.filter((c) => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (!c.name.toLowerCase().includes(term) && !c.communeCode.toLowerCase().includes(term)) {
        return false;
      }
    }
    if (provinceFilter !== 'all' && c.province !== provinceFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredCommunes.length / itemsPerPage) || 1;
  const paginatedCommunes = filteredCommunes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: CommuneStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            Hoạt động
          </span>
        );
      case 'expiring':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            Sắp hết hạn
          </span>
        );
      case 'expired':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
            Hết hạn
          </span>
        );
      case 'suspended':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Tạm khóa
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Building2 className="w-4 h-4" />
            <span>COMMUNE MANAGEMENT (MÀN 48)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Danh Sách Xã Sử Dụng Dịch Vụ
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý thông tin đơn vị hành chính cấp xã, gói dịch vụ và thời hạn bản quyền
          </p>
        </div>

        <button
          onClick={() => navigateTo(49)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Khởi tạo xã mới (49)</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên xã, mã xã (ví dụ: Hòa Lạc, XA-01284)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300"
          >
            <option value="all">Tất cả tỉnh / thành</option>
            <option value="TP. Hà Nội">TP. Hà Nội</option>
            <option value="Tỉnh Hà Giang">Tỉnh Hà Giang</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="expiring">Sắp hết hạn</option>
            <option value="suspended">Tạm khóa</option>
          </select>
        </div>
      </div>

      {/* Communes Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Mã xã</th>
                <th className="px-5 py-3.5">Tên xã / Phường</th>
                <th className="px-5 py-3.5">Tỉnh / Thành phố</th>
                <th className="px-5 py-3.5">Ngày kích hoạt</th>
                <th className="px-5 py-3.5">Ngày hết hạn</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5">Người dùng</th>
                <th className="px-5 py-3.5 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {paginatedCommunes.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigateTo(50, c.id)}
                  className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 font-mono text-slate-400">{c.communeCode}</td>
                  <td className="px-5 py-3.5 font-bold text-white group-hover:text-purple-400">
                    {c.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{c.province}</td>
                  <td className="px-5 py-3.5 text-slate-400">{c.activatedAt}</td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-200">{c.expiresAt}</td>
                  <td className="px-5 py-3.5">{getStatusBadge(c.status)}</td>
                  <td className="px-5 py-3.5 font-semibold text-white">
                    {c.userCount} tài khoản
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-purple-400 font-bold hover:underline flex items-center gap-1 ml-auto">
                      <span>Xem (50)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Hiển thị {paginatedCommunes.length} trên tổng số {filteredCommunes.length} xã</span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-700 disabled:opacity-30 hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-200">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-700 disabled:opacity-30 hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
