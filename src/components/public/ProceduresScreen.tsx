import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DataScope, DocumentItem } from '../../types';

export const ProceduresScreen: React.FC = () => {
  const { currentRole, getVisibleDocuments, navigateTo } = useApp();

  const allVisibleProcedures = getVisibleDocuments().filter((d) => d.category === 'procedure');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'all' | 'content' | 'title' | 'number'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fieldFilter, setFieldFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProcedures = allVisibleProcedures.filter((proc) => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (searchField === 'number' && !proc.docNumber.toLowerCase().includes(term)) return false;
      if (searchField === 'title' && !proc.title.toLowerCase().includes(term)) return false;
      if (searchField === 'content' && !proc.content.toLowerCase().includes(term)) return false;
      if (
        searchField === 'all' &&
        !proc.title.toLowerCase().includes(term) &&
        !proc.docNumber.toLowerCase().includes(term) &&
        !proc.content.toLowerCase().includes(term)
      ) {
        return false;
      }
    }

    if (fieldFilter && proc.field !== fieldFilter) return false;

    if (sourceFilter !== 'all') {
      if (sourceFilter === 'shared' && proc.scope !== 'shared') return false;
      if (sourceFilter === 'commune_public' && proc.scope !== 'commune_public') return false;
      if (sourceFilter === 'commune_internal' && proc.scope !== 'commune_internal') return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProcedures.length / itemsPerPage) || 1;
  const paginatedProcedures = filteredProcedures.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getScopeBadge = (scope: DataScope) => {
    switch (scope) {
      case 'shared':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Dùng chung
          </span>
        );
      case 'commune_public':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Của xã
          </span>
        );
      case 'commune_internal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Lock className="w-3 h-3 text-amber-600" />
            Nội bộ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
          <ClipboardList className="w-4 h-4" />
          <span>Dịch vụ công & Một cửa cấp xã (Màn 6)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Danh Mục Thủ Tục Hành Chính
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Hướng dẫn chi tiết thành phần hồ sơ, trình tự các bước và thời hạn giải quyết tại UBND cấp xã
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Nhập tên thủ tục, mã thủ tục (ví dụ: khai sinh, kết hôn, chứng thực...)"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Tìm kiếm nâng cao</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Radio Search Scope */}
        <div className="flex items-center gap-6 text-xs text-slate-600 font-medium pt-1">
          <span className="font-bold text-slate-700">Tìm theo:</span>
          {[
            { label: 'Tất cả', value: 'all' },
            { label: 'Tên thủ tục', value: 'title' },
            { label: 'Mã số TTHC', value: 'number' },
            { label: 'Nội dung', value: 'content' },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="searchFieldProc"
                value={item.value}
                checked={searchField === item.value}
                onChange={() => setSearchField(item.value as any)}
                className="text-red-600 focus:ring-red-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Lĩnh vực</label>
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-red-500"
              >
                <option value="">Tất cả lĩnh vực</option>
                <option value="Hộ tịch - Tư pháp">Hộ tịch - Tư pháp</option>
                <option value="Chứng thực - Tư pháp">Chứng thực - Tư pháp</option>
                <option value="Địa chính - Xây dựng">Địa chính - Xây dựng</option>
                <option value="Lao động - Thương binh & Xã hội">Lao động - Thương binh & Xã hội</option>
              </select>
            </div>

            {currentRole !== 'guest' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nguồn thủ tục</label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-red-500"
                >
                  <option value="all">Tất cả nguồn</option>
                  <option value="shared">Dùng chung (Quốc gia)</option>
                  <option value="commune_public">Của xã (Công khai)</option>
                  {(currentRole === 'officer' || currentRole === 'commune_admin') && (
                    <option value="commune_internal">Nội bộ (Cán bộ)</option>
                  )}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid: Table & Recent List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Mã số TTHC</th>
                  <th className="px-4 py-3.5">Tên thủ tục</th>
                  <th className="px-4 py-3.5">Lĩnh vực</th>
                  <th className="px-4 py-3.5">Cơ quan thực hiện</th>
                  <th className="px-4 py-3.5">Nguồn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProcedures.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-500">
                      <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="font-semibold text-sm text-slate-700">
                        Không tìm thấy thủ tục phù hợp
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedProcedures.map((proc) => (
                    <tr
                      key={proc.id}
                      onClick={() => navigateTo(7, proc.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5 font-mono font-semibold text-red-600 whitespace-nowrap">
                        {proc.docNumber}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 max-w-sm">
                          {proc.title}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {proc.field || 'Hành chính'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {proc.implementingAgency || 'UBND cấp xã'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getScopeBadge(proc.scope)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Hiển thị {paginatedProcedures.length} trên tổng số {filteredProcedures.length} thủ tục
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-900">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Recent */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <span>Thủ tục xem gần đây</span>
            </h3>

            <div className="space-y-3">
              {allVisibleProcedures.slice(0, 3).map((proc) => (
                <div
                  key={proc.id}
                  onClick={() => navigateTo(7, proc.id)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-red-600 font-semibold">{proc.docNumber}</span>
                    {getScopeBadge(proc.scope)}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 line-clamp-2">
                    {proc.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
