import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  Calendar,
  Building,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DataScope, DocumentItem } from '../../types';

export const DocumentsScreen: React.FC = () => {
  const { currentRole, getVisibleDocuments, navigateTo } = useApp();

  const allVisibleDocs = getVisibleDocuments().filter((d) => d.category === 'policy');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'all' | 'content' | 'title' | 'number'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [validityFilter, setValidityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredDocs = allVisibleDocs.filter((doc) => {
    // Search keyword
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (searchField === 'number' && !doc.docNumber.toLowerCase().includes(term)) return false;
      if (searchField === 'title' && !doc.title.toLowerCase().includes(term)) return false;
      if (searchField === 'content' && !doc.content.toLowerCase().includes(term)) return false;
      if (
        searchField === 'all' &&
        !doc.title.toLowerCase().includes(term) &&
        !doc.docNumber.toLowerCase().includes(term) &&
        !doc.content.toLowerCase().includes(term)
      ) {
        return false;
      }
    }

    if (docTypeFilter && doc.docType !== docTypeFilter) return false;
    if (agencyFilter && !doc.issuingAgency.toLowerCase().includes(agencyFilter.toLowerCase())) return false;
    if (validityFilter && doc.validityStatus !== validityFilter) return false;

    if (sourceFilter !== 'all') {
      if (sourceFilter === 'shared' && doc.scope !== 'shared') return false;
      if (sourceFilter === 'commune_public' && doc.scope !== 'commune_public') return false;
      if (sourceFilter === 'commune_internal' && doc.scope !== 'commune_internal') return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const getValidityBadge = (status: DocumentItem['validityStatus']) => {
    switch (status) {
      case 'Còn hiệu lực':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Còn hiệu lực
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Tra cứu văn bản, quy phạm & chỉ đạo điều hành (Màn 4)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Hệ Thống Văn Bản, Chính Sách
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tra cứu luật, nghị định, thông tư của trung ương và các quyết định, kế hoạch ban hành tại địa phương
        </p>
      </div>

      {/* Search Bar & Scope Radio */}
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
              placeholder="Nhập từ khóa tìm kiếm, số hiệu, trích yếu văn bản..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
            { label: 'Tiêu đề', value: 'title' },
            { label: 'Số hiệu', value: 'number' },
            { label: 'Nội dung', value: 'content' },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="searchField"
                value={item.value}
                checked={searchField === item.value}
                onChange={() => setSearchField(item.value as any)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        {/* Advanced Filters Expandable */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Loại văn bản</label>
              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-blue-500"
              >
                <option value="">Tất cả loại văn bản</option>
                <option value="Luật">Luật</option>
                <option value="Nghị định">Nghị định</option>
                <option value="Kế hoạch">Kế hoạch</option>
                <option value="Thông báo">Thông báo</option>
                <option value="Quy chế">Quy chế</option>
                <option value="Báo cáo nội bộ">Báo cáo nội bộ</option>
                <option value="Phương án nội bộ">Phương án nội bộ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Cơ quan ban hành</label>
              <input
                type="text"
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                placeholder="Ví dụ: UBND Xã Hòa Lạc, Quốc hội..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tình trạng hiệu lực</label>
              <select
                value={validityFilter}
                onChange={(e) => setValidityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-blue-500"
              >
                <option value="">Tất cả tình trạng</option>
                <option value="Còn hiệu lực">Còn hiệu lực</option>
                <option value="Hết hiệu lực">Hết hiệu lực</option>
              </select>
            </div>

            {/* Source filter: strictly based on user role! */}
            {currentRole !== 'guest' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nguồn dữ liệu</label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-blue-500"
                >
                  <option value="all">Tất cả nguồn</option>
                  <option value="shared">Dùng chung</option>
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

      {/* Main Content: Table & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table of Documents */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Số hiệu</th>
                  <th className="px-4 py-3.5">Ngày ban hành</th>
                  <th className="px-4 py-3.5">Tên văn bản</th>
                  <th className="px-4 py-3.5">Cơ quan</th>
                  <th className="px-4 py-3.5">Hiệu lực</th>
                  <th className="px-4 py-3.5">Nguồn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="font-semibold text-sm text-slate-700">
                        Không tìm thấy văn bản phù hợp
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Thử điều chỉnh lại từ khóa hoặc các bộ lọc nâng cao
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => navigateTo(5, doc.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {doc.docNumber}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {doc.issueDate}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 max-w-sm">
                          {doc.title}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {doc.issuingAgency}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getValidityBadge(doc.validityStatus)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getScopeBadge(doc.scope)}
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
              Hiển thị {paginatedDocs.length} trên tổng số {filteredDocs.length} văn bản
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

        {/* Right Column: Recently Viewed & Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Văn bản xem gần đây</span>
            </h3>

            <div className="space-y-3">
              {allVisibleDocs.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigateTo(5, doc.id)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-slate-500 font-semibold">{doc.docNumber}</span>
                    {getScopeBadge(doc.scope)}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2">
                    {doc.title}
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
