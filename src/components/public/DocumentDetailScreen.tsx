import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Download,
  Bot,
  FileText,
  Calendar,
  Building,
  CheckCircle,
  Lock,
  Share2,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { DataScope } from '../../types';

export const DocumentDetailScreen: React.FC = () => {
  const {
    screenParam,
    documents,
    currentRole,
    currentUser,
    navigateTo,
    goBack,
    createNewChatSession,
  } = useApp();

  const doc = documents.find((d) => d.id === screenParam) || documents[0];

  // RBAC Access Control Check (Screen 5 spec)
  useEffect(() => {
    if (!doc) return;

    // Check if doc is internal: Only Officer and Commune Admin can view!
    if (doc.scope === 'commune_internal') {
      if (currentRole === 'guest' || currentRole === 'citizen') {
        navigateTo(55); // 403 Forbidden!
        return;
      }
    }

    // Check if doc belongs to another commune
    if (doc.scope !== 'shared' && doc.communeId) {
      if (!currentUser || currentUser.communeId !== doc.communeId) {
        navigateTo(55); // 403 Forbidden!
        return;
      }
    }
  }, [doc, currentRole, currentUser, navigateTo]);

  if (!doc) return null;

  const handleAskChatbot = () => {
    if (currentRole === 'guest') {
      navigateTo(13, `redirect_to_22_with_doc_${doc.id}`);
      return;
    }
    const sessionId = createNewChatSession(
      `Tóm tắt nội dung chính và giải thích các điểm quan trọng trong văn bản ${doc.docNumber}: ${doc.title}`,
      doc.id
    );
    navigateTo(22, sessionId);
  };

  const getScopeBadge = (scope: DataScope) => {
    switch (scope) {
      case 'shared':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Dùng chung toàn quốc
          </span>
        );
      case 'commune_public':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Của xã (Công khai)
          </span>
        );
      case 'commune_internal':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Nội bộ UBND Xã
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigateTo(1)} className="hover:text-red-600">
            Trang chủ
          </button>
          <span>/</span>
          <button onClick={() => navigateTo(4)} className="hover:text-red-600">
            Văn bản, chính sách
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{doc.docNumber}</span>
        </div>

        <button
          onClick={goBack}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Document File Preview */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-red-600 px-2 py-0.5 rounded-md bg-red-50 border border-red-200">
                {doc.docNumber}
              </span>
              {getScopeBadge(doc.scope)}
              <span className="text-xs text-slate-400 font-mono">Mã ẩn danh: {doc.anonCode}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {doc.title}
            </h1>
          </div>

          {/* Abstract / Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Trích yếu nội dung
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">{doc.summary}</p>
          </div>

          {/* Full Content Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Toàn văn văn bản số hóa
              </h3>
              <span className="text-xs text-slate-400 font-mono">Dung lượng: {doc.fileSize}</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-sm font-serif leading-relaxed text-slate-800 whitespace-pre-line max-h-[500px] overflow-y-auto shadow-inner">
              {doc.content}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Lượt xem: {doc.viewCount + 1} lần</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => alert(`Đang tải tệp đính kèm văn bản ${doc.docNumber} (${doc.fileSize})`)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Tải văn bản gốc ({doc.fileSize})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              <span>Thuộc tính văn bản</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Số hiệu văn bản:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{doc.docNumber}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Loại văn bản:</span>
                <span className="font-semibold text-slate-800">{doc.docType}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Cơ quan ban hành:</span>
                <span className="font-semibold text-slate-800">{doc.issuingAgency}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Ngày ban hành:</span>
                <span className="font-semibold text-slate-800">{doc.issueDate}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Ngày có hiệu lực:</span>
                <span className="font-semibold text-slate-800">{doc.effectiveDate}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Tình trạng hiệu lực:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  {doc.validityStatus}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Nguồn dữ liệu:</span>
                <div>{getScopeBadge(doc.scope)}</div>
              </div>

              {/* STRICT SPEC: "Phạm vi: Nội bộ / Công khai" line is ONLY visible to Officer and Commune Admin */}
              {(currentRole === 'officer' || currentRole === 'commune_admin') && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block mb-0.5 font-bold">Phạm vi áp dụng (Dành cho cán bộ):</span>
                  <span className="font-mono font-bold text-slate-800 uppercase">
                    {doc.scope === 'commune_internal' ? 'NỘI BỘ XÃ' : 'CÔNG KHAI'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA Button (Screen 5 spec) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={handleAskChatbot}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center gap-2.5 transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span>Hỏi Chatbot về văn bản này</span>
        </button>
      </div>
    </div>
  );
};
