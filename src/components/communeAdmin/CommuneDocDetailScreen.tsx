import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Edit2,
  RefreshCw,
  Share2,
  Trash2,
  FileText,
  Lock,
  Globe,
  Download,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { ChangeScopeModal } from './ChangeScopeModal';
import { DeleteDocModal } from './DeleteDocModal';
import { NewVersionDocumentModal } from './NewVersionDocumentModal';

export const CommuneDocDetailScreen: React.FC = () => {
  const {
    screenParam,
    documents,
    changeDocScope,
    deleteDocument,
    navigateTo,
  } = useApp();

  const doc = documents.find((d) => d.id === screenParam) || documents[0];

  const [showScopeModal, setShowScopeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);

  if (!doc) return null;

  const isShared = doc.scope === 'shared';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-left">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(34)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Chi Tiết Tài Liệu (Màn 36)
            </h1>
            <p className="text-xs text-slate-500">
              Quản lý thuộc tính và kiểm soát quyền truy cập tài liệu số hóa
            </p>
          </div>
        </div>

        {/* Action Buttons (Screen 36 spec) */}
        <div className="flex items-center gap-2 flex-wrap">
          {isShared ? (
            <button
              onClick={() => navigateTo(34)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Quay lại (34)
            </button>
          ) : (
            <>
              <button
                onClick={() => navigateTo(37, doc.id)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Sửa (37)</span>
              </button>

              <button
                onClick={() => setShowVersionModal(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thay phiên bản (38)</span>
              </button>

              <button
                onClick={() => setShowScopeModal(true)}
                className="px-3.5 py-2 rounded-xl border border-amber-300 hover:bg-amber-50 text-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Đổi phạm vi (39)</span>
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3.5 py-2 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa (40)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 flex-wrap pb-4 border-b border-slate-100">
          <span className="font-mono text-xs font-bold text-red-600 px-2 py-0.5 rounded-md bg-red-50 border border-red-200">
            {doc.docNumber}
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">Mã ẩn danh: {doc.anonCode}</span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              doc.scope === 'commune_internal'
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : doc.scope === 'commune_public'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            {doc.scope === 'commune_internal' && <Lock className="w-3 h-3" />}
            {doc.scope === 'commune_internal'
              ? 'Phạm vi: Nội bộ (Cán bộ)'
              : doc.scope === 'commune_public'
              ? 'Phạm vi: Công khai xã'
              : 'Dùng chung quốc gia'}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            Trạng thái: {doc.status === 'published' ? 'Đã công bố' : doc.status === 'draft' ? 'Bản nháp' : doc.status}
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">{doc.title}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="text-slate-400 block mb-0.5">Loại văn bản:</span>
            <span className="font-bold text-slate-800">{doc.docType}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Cơ quan ban hành:</span>
            <span className="font-bold text-slate-800">{doc.issuingAgency}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Ngày ban hành:</span>
            <span className="font-semibold text-slate-800">{doc.issueDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Hiệu lực:</span>
            <span className="font-semibold text-emerald-700">{doc.validityStatus}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Nội dung chi tiết trong kho tri thức
          </h4>
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-line max-h-96 overflow-y-auto">
            {doc.content}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showScopeModal && (
        <ChangeScopeModal
          selectedCount={1}
          onClose={() => setShowScopeModal(false)}
          onConfirm={(newScope) => {
            changeDocScope(doc.id, newScope);
            setShowScopeModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteDocModal
          docCount={1}
          docTitle={doc.title}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deleteDocument(doc.id);
            setShowDeleteModal(false);
            navigateTo(34);
          }}
        />
      )}

      {showVersionModal && (
        <NewVersionDocumentModal
          doc={doc}
          onClose={() => setShowVersionModal(false)}
        />
      )}
    </div>
  );
};
