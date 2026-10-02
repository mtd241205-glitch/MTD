import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Plus,
  Search,
  Filter,
  Layers,
  FileText,
  Lock,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { DocumentItem, DataScope, DocumentStatus } from '../../types';
import { ChangeScopeModal } from './ChangeScopeModal';
import { DeleteDocModal } from './DeleteDocModal';

export const DataManagementScreen: React.FC = () => {
  const {
    documents,
    currentUser,
    currentCommune,
    reprocessDoc,
    deleteDocument,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'shared' | 'commune_policy' | 'commune_proc'>('commune_policy');
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'commune_public' | 'commune_internal'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  // Modals
  const [showScopeModal, setShowScopeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reprocessingId, setReprocessingId] = useState<string | null>(null);

  // Filter documents according to tab
  const getTabDocs = (): DocumentItem[] => {
    if (activeTab === 'shared') {
      return documents.filter((d) => d.scope === 'shared');
    }
    if (activeTab === 'commune_policy') {
      return documents.filter((d) => d.scope !== 'shared' && d.category === 'policy' && d.communeId === currentUser?.communeId);
    }
    return documents.filter((d) => d.scope !== 'shared' && d.category === 'procedure' && d.communeId === currentUser?.communeId);
  };

  const rawDocs = getTabDocs();

  const filteredDocs = rawDocs.filter((doc) => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (!doc.title.toLowerCase().includes(term) && !doc.docNumber.toLowerCase().includes(term) && !doc.anonCode.toLowerCase().includes(term)) {
        return false;
      }
    }
    if (activeTab !== 'shared') {
      if (scopeFilter !== 'all' && doc.scope !== scopeFilter) return false;
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    }
    return true;
  });

  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map((d) => d.id));
    }
  };

  const handleReprocess = (id: string) => {
    setReprocessingId(id);
    setTimeout(() => {
      reprocessDoc(id);
      setReprocessingId(null);
    }, 1500);
  };

  const getScopeBadge = (scope: DataScope) => {
    switch (scope) {
      case 'shared':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Dùng chung
          </span>
        );
      case 'commune_public':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Của xã (Công khai)
          </span>
        );
      case 'commune_internal':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            Nội bộ
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'published':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">Đã công bố</span>;
      case 'draft':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Bản nháp</span>;
      case 'hidden':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">Đang ẩn</span>;
      case 'processing_error':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">Lỗi xử lý</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Khu vực Quản trị xã (Màn 34)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Quản Lý Dữ Liệu & Kho Tri Thức Xã
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý văn bản chỉ đạo, thủ tục hành chính, thiết lập phạm vi hiển thị và đồng bộ hóa vector AI
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== 'shared' && selectedDocIds.length > 0 && (
            <button
              onClick={() => setShowScopeModal(true)}
              className="px-4 py-2 rounded-xl border border-amber-300 hover:bg-amber-50 text-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Đổi phạm vi ({selectedDocIds.length})</span>
            </button>
          )}

          {activeTab !== 'shared' && (
            <button
              onClick={() => navigateTo(35)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm tài liệu mới (35)</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Tabs (Screen 34 spec) */}
      <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('commune_policy');
            setSelectedDocIds([]);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'commune_policy'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Văn bản của xã
        </button>

        <button
          onClick={() => {
            setActiveTab('commune_proc');
            setSelectedDocIds([]);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'commune_proc'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Thủ tục của xã
        </button>

        <button
          onClick={() => {
            setActiveTab('shared');
            setSelectedDocIds([]);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'shared'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Dữ liệu dùng chung (Chỉ xem)</span>
        </button>
      </div>

      {/* Shared Data Note */}
      {activeTab === 'shared' && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Ghi chú:</strong> Dữ liệu dùng chung (Luật, Nghị định, TTHC quốc gia) do Đội phát triển trực tiếp thẩm định và cập nhật định kỳ. Xã chỉ có quyền xem, không được thêm, sửa, xóa hoặc đổi phạm vi.
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, số hiệu hoặc mã ẩn danh DOC-xxxx..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        {activeTab !== 'shared' && (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <option value="all">Tất cả phạm vi</option>
              <option value="commune_internal">Nội bộ (Cán bộ)</option>
              <option value="commune_public">Công khai (Dân & Cán bộ)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã công bố</option>
              <option value="draft">Bản nháp</option>
              <option value="hidden">Đang ẩn</option>
              <option value="processing_error">Lỗi xử lý (OCR/Vector)</option>
            </select>

            {selectedDocIds.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa ({selectedDocIds.length})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                {activeTab !== 'shared' && (
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedDocIds.length === filteredDocs.length && filteredDocs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                  </th>
                )}
                <th className="px-4 py-3.5">Mã ẩn danh</th>
                <th className="px-4 py-3.5">Số hiệu / Mã</th>
                <th className="px-4 py-3.5">Tên tài liệu</th>
                <th className="px-4 py-3.5">Phạm vi</th>
                <th className="px-4 py-3.5">Trạng thái</th>
                {activeTab !== 'shared' && <th className="px-4 py-3.5 text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'shared' ? 5 : 7} className="py-12 text-center text-slate-400">
                    Không tìm thấy tài liệu phù hợp
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isProcessing = reprocessingId === doc.id;
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => navigateTo(36, doc.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {activeTab !== 'shared' && (
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedDocIds.includes(doc.id)}
                            onChange={() => toggleSelectDoc(doc.id)}
                            className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                        {doc.anonCode}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {doc.docNumber}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 group-hover:text-amber-800 line-clamp-2 max-w-sm">
                          {doc.title}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">{getScopeBadge(doc.scope)}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isProcessing ? (
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Đang xử lý lại...
                          </span>
                        ) : (
                          getStatusBadge(doc.status)
                        )}
                      </td>
                      {activeTab !== 'shared' && (
                        <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-2" onClick={(e) => e.stopPropagation()}>
                          {doc.status === 'processing_error' && (
                            <button
                              onClick={() => handleReprocess(doc.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow-xs"
                              title="Xử lý lại file bị lỗi OCR"
                            >
                              Xử lý lại
                            </button>
                          )}
                          <button
                            onClick={() => navigateTo(37, doc.id)}
                            className="p-1.5 text-slate-400 hover:text-amber-700 rounded-lg hover:bg-slate-100"
                            title="Sửa tài liệu"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals 39 & 40 */}
      {showScopeModal && (
        <ChangeScopeModal
          selectedCount={selectedDocIds.length}
          onClose={() => setShowScopeModal(false)}
          onConfirm={(newScope) => {
            selectedDocIds.forEach((id) => useApp().changeDocScope(id, newScope));
            setShowScopeModal(false);
            setSelectedDocIds([]);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteDocModal
          docCount={selectedDocIds.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            selectedDocIds.forEach((id) => deleteDocument(id));
            setShowDeleteModal(false);
            setSelectedDocIds([]);
          }}
        />
      )}
    </div>
  );
};
