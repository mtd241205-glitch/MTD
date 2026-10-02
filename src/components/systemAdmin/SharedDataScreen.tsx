import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Plus,
  Search,
  Filter,
  FileText,
  Layers,
  Edit2,
  Trash2,
  AlertCircle,
  Bell,
  Check,
  X,
  CheckCircle2,
} from 'lucide-react';
import { DocumentItem, DocumentCategory, DocumentStatus } from '../../types';

export const SharedDataScreen: React.FC = () => {
  const { documents, addSystemSharedDoc, deleteDocument } = useApp();

  const [activeTab, setActiveTab] = useState<'policy' | 'procedure'>('policy');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Add form fields
  const [title, setTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docType, setDocType] = useState('Nghị định');
  const [issuingAgency, setIssuingAgency] = useState('Chính phủ');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [field, setField] = useState('Hành chính');
  const [notifyAll, setNotifyAll] = useState(true);

  // Shared docs
  const sharedDocs = documents.filter(
    (d) => d.scope === 'shared' && d.category === activeTab
  );

  const filteredDocs = sharedDocs.filter((d) => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (!d.title.toLowerCase().includes(term) && !d.docNumber.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSystemSharedDoc(
      {
        title,
        docNumber,
        docType: activeTab === 'procedure' ? 'Thủ tục hành chính' : docType,
        issuingAgency,
        category: activeTab,
        content: content || `Toàn văn văn bản quy phạm pháp luật quốc gia ${title}...`,
        summary: summary || title,
        field: activeTab === 'procedure' ? field : undefined,
      },
      notifyAll
    );

    setShowAddModal(false);
    setTitle('');
    setDocNumber('');
    setContent('');
    setSummary('');
    setActionNotice('Đã thêm dữ liệu dùng chung và đồng bộ tới toàn bộ các xã!');
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (
      confirm(
        `Cảnh báo: Văn bản "${name}" là dữ liệu dùng chung toàn quốc. Việc xóa sẽ ảnh hưởng tới toàn bộ các xã và người dân trên hệ thống. Tiếp tục xóa?`
      )
    ) {
      deleteDocument(id);
      setActionNotice(`Đã xóa dữ liệu dùng chung "${name}"!`);
      setTimeout(() => setActionNotice(''), 3000);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Globe className="w-4 h-4" />
            <span>GLOBAL KNOWLEDGE BASE (MÀN 52)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Quản Lý Dữ Liệu Dùng Chung Toàn Quốc
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Nơi duy nhất thẩm định, ban hành và cập nhật văn bản pháp quy, thủ tục hành chính quốc gia dùng chung cho tất cả các xã
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm dữ liệu dùng chung (52)</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs: Policy vs Procedure */}
      <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setActiveTab('policy')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'policy'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Văn bản pháp luật dùng chung ({documents.filter((d) => d.scope === 'shared' && d.category === 'policy').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('procedure')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'procedure'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Thủ tục hành chính dùng chung ({documents.filter((d) => d.scope === 'shared' && d.category === 'procedure').length})</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo số hiệu, tên văn bản dùng chung..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <span className="text-xs text-slate-400">
          Hiển thị cho mọi người dùng và khách vãng lai
        </span>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Mã ẩn danh</th>
              <th className="px-5 py-3.5">Số hiệu / Mã</th>
              <th className="px-5 py-3.5">Tên văn bản / Thủ tục</th>
              <th className="px-5 py-3.5">Cơ quan ban hành</th>
              <th className="px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-800/60 transition-colors">
                <td className="px-5 py-3.5 font-mono text-purple-400">{doc.anonCode}</td>
                <td className="px-5 py-3.5 font-mono font-bold text-white whitespace-nowrap">
                  {doc.docNumber}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-white line-clamp-2 max-w-md">{doc.title}</div>
                </td>
                <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{doc.issuingAgency}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Đã công bố
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                    title="Xóa dữ liệu dùng chung (ảnh hưởng toàn hệ thống)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Shared Doc (Screen 52 spec) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-left space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Thêm Dữ Liệu Dùng Chung Quốc Gia</h3>
                <p className="text-xs text-slate-400">Tự động đồng bộ tới tất cả các xã và cổng công dân</p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Số hiệu *</label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ví dụ: 31/2024/QH15"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cơ quan ban hành *</label>
                  <input
                    type="text"
                    required
                    value={issuingAgency}
                    onChange={(e) => setIssuingAgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên tài liệu / Tiêu đề *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tên tiêu đề văn bản quy phạm..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tóm tắt trích yếu</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tóm tắt ý nghĩa và phạm vi áp dụng..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              {/* Notify all communes checkbox (Screen 52 spec) */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-purple-200 text-xs">
                  <input
                    type="checkbox"
                    checked={notifyAll}
                    onChange={(e) => setNotifyAll(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Gửi thông báo cập nhật tới tất cả các xã trên hệ thống</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Ban hành dùng chung
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
