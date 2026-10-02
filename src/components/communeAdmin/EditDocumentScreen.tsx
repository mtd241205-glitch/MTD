import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';
import { DataScope, DocumentStatus } from '../../types';

export const EditDocumentScreen: React.FC = () => {
  const { screenParam, documents, updateDocument, navigateTo } = useApp();
  const doc = documents.find((d) => d.id === screenParam) || documents[0];

  const [title, setTitle] = useState(doc?.title || '');
  const [docNumber, setDocNumber] = useState(doc?.docNumber || '');
  const [docType, setDocType] = useState(doc?.docType || 'Kế hoạch');
  const [issuingAgency, setIssuingAgency] = useState(doc?.issuingAgency || '');
  const [scope, setScope] = useState<DataScope>(doc?.scope || 'commune_internal');
  const [status, setStatus] = useState<DocumentStatus>(doc?.status || 'published');
  const [content, setContent] = useState(doc?.content || '');

  if (!doc) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDocument(doc.id, {
      title,
      docNumber,
      docType,
      issuingAgency,
      scope,
      status,
      content,
    });
    navigateTo(36, doc.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(36, doc.id)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Sửa Tài Liệu (Màn 37)
            </h1>
            <p className="text-xs text-slate-500">Mã tài liệu: {doc.anonCode}</p>
          </div>
        </div>

        <button
          onClick={() => navigateTo(36, doc.id)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Hủy
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Số hiệu văn bản *</label>
            <input
              type="text"
              required
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Loại văn bản *</label>
            <input
              type="text"
              required
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Tiêu đề văn bản *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Cơ quan ban hành *</label>
            <input
              type="text"
              required
              value={issuingAgency}
              onChange={(e) => setIssuingAgency(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phạm vi hiển thị *</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300"
            >
              <option value="commune_internal">Nội bộ (Cán bộ & Quản lý xã)</option>
              <option value="commune_public">Công khai (Mọi tài khoản xã)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Trạng thái *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300"
            >
              <option value="published">Đã công bố</option>
              <option value="draft">Bản nháp</option>
              <option value="hidden">Đang ẩn</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Nội dung văn bản số hóa</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 font-serif text-xs leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigateTo(36, doc.id)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};
