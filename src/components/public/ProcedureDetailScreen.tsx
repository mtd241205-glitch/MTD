import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Bot,
  ClipboardList,
  CheckSquare,
  Clock,
  Coins,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lock,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { DataScope } from '../../types';

export const ProcedureDetailScreen: React.FC = () => {
  const {
    screenParam,
    documents,
    currentRole,
    currentUser,
    navigateTo,
    goBack,
    createNewChatSession,
  } = useApp();

  const proc = documents.find((d) => d.id === screenParam) || documents.find((d) => d.category === 'procedure') || documents[0];

  // Collapsible sections state
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    steps: true,
    methods: true,
    dossier: true,
    duration: true,
    fees: true,
    result: true,
    legal: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAskChatbot = () => {
    if (currentRole === 'guest') {
      navigateTo(13, `redirect_to_22_with_proc_${proc.id}`);
      return;
    }
    const sessionId = createNewChatSession(
      `Hướng dẫn tôi các bước và hồ sơ cần chuẩn bị để thực hiện: ${proc.title} (${proc.docNumber})`,
      proc.id
    );
    navigateTo(22, sessionId);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            Nội bộ UBND xã
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigateTo(1)} className="hover:text-red-600">
            Trang chủ
          </button>
          <span>/</span>
          <button onClick={() => navigateTo(6)} className="hover:text-red-600">
            Thủ tục hành chính
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{proc.docNumber}</span>
        </div>

        <button
          onClick={goBack}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Main Grid: Content Column & Sticky TOC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                Mã TTHC: {proc.docNumber}
              </span>
              {getScopeBadge(proc.scope)}
              <span className="text-xs text-slate-400 font-mono">Mã ẩn danh: {proc.anonCode}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {proc.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{proc.summary}</p>

            {/* Quick overview card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Lĩnh vực:</span>
                <span className="font-bold text-slate-800">{proc.field || 'Hộ tịch - Tư pháp'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Cấp thực hiện:</span>
                <span className="font-bold text-slate-800">{proc.implementationLevel || 'Cấp xã'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Thời hạn giải quyết:</span>
                <span className="font-bold text-emerald-700">{proc.resolutionDuration || 'Trong ngày'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Cơ quan thực hiện:</span>
                <span className="font-bold text-slate-800">{proc.implementingAgency || 'UBND cấp xã'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Phí / Lệ phí:</span>
                <span className="font-bold text-slate-800">{proc.fees || 'Miễn phí'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Đối tượng thực hiện:</span>
                <span className="font-bold text-slate-800">{proc.targetAudience || 'Công dân'}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Trình tự thực hiện (Numbered steps) */}
          <div id="sec-steps" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('steps')}
              className="w-full p-6 text-left flex items-center justify-between font-bold text-base text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-sm font-black">
                  1
                </div>
                <span>Trình tự thực hiện các bước</span>
              </div>
              {openSections.steps ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            {openSections.steps && (
              <div className="px-6 pb-6 pt-1 space-y-4 border-t border-slate-100">
                {proc.steps && proc.steps.length > 0 ? (
                  proc.steps.map((st) => (
                    <div key={st.step} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                        {st.step}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">{st.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{st.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Người nộp hồ sơ tại Bộ phận Một cửa cấp xã hoặc Cổng Dịch vụ công Quốc gia.</p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Cách thức thực hiện */}
          <div id="sec-methods" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('methods')}
              className="w-full p-6 text-left flex items-center justify-between font-bold text-base text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-black">
                  2
                </div>
                <span>Cách thức nộp hồ sơ</span>
              </div>
              {openSections.methods ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            {openSections.methods && (
              <div className="px-6 pb-6 pt-1 space-y-3 text-xs text-slate-700 leading-relaxed border-t border-slate-100">
                <p>• <strong>Trực tiếp:</strong> Tại Bộ phận Tiếp nhận và Trả kết quả (Một cửa) của UBND xã vào giờ hành chính các ngày làm việc.</p>
                <p>• <strong>Trực tuyến:</strong> Qua Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn) hoặc Hệ thống thông tin giải quyết TTHC cấp tỉnh.</p>
                <p>• <strong>Qua dịch vụ bưu chính công ích:</strong> Gửi hồ sơ qua bưu điện về địa chỉ UBND cấp xã.</p>
              </div>
            )}
          </div>

          {/* Section 3: Thành phần hồ sơ (Checklist) */}
          <div id="sec-dossier" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('dossier')}
              className="w-full p-6 text-left flex items-center justify-between font-bold text-base text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-black">
                  3
                </div>
                <span>Thành phần hồ sơ (Danh sách kiểm tra)</span>
              </div>
              {openSections.dossier ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            {openSections.dossier && (
              <div className="px-6 pb-6 pt-1 space-y-3 border-t border-slate-100">
                {proc.dossierChecklist && proc.dossierChecklist.length > 0 ? (
                  proc.dossierChecklist.map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-0.5 rounded text-red-600 focus:ring-red-500" />
                      <span className="text-xs text-slate-800 font-medium leading-relaxed">{item}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Giấy tờ tùy thân và đơn theo mẫu.</p>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Thời hạn & Phí */}
          <div id="sec-duration" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Thời hạn giải quyết & Phí / Lệ phí</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <span className="text-slate-500 font-medium block mb-1">Thời hạn quy định:</span>
                <span className="font-bold text-slate-900 text-sm">{proc.resolutionDuration || 'Trong ngày'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <span className="text-slate-500 font-medium block mb-1">Mức phí / lệ phí:</span>
                <span className="font-bold text-slate-900 text-sm">{proc.fees || 'Miễn lệ phí'}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Căn cứ pháp lý */}
          <div id="sec-legal" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Căn cứ pháp lý áp dụng</span>
            </h3>
            <div className="space-y-2">
              {proc.legalBasis && proc.legalBasis.length > 0 ? (
                proc.legalBasis.map((lb, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-slate-800 font-medium">{lb}</span>
                    <button
                      onClick={() => navigateTo(4)}
                      className="text-red-600 font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>Tra cứu văn bản</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Quy định theo văn bản pháp luật hiện hành.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Table of Contents (TOC) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-red-600" />
              <span>Mục lục thủ tục</span>
            </h3>

            <nav className="space-y-1 text-xs">
              <button
                onClick={() => scrollToSection('sec-steps')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Trình tự thực hiện</span>
              </button>
              <button
                onClick={() => scrollToSection('sec-methods')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Cách thức nộp hồ sơ</span>
              </button>
              <button
                onClick={() => scrollToSection('sec-dossier')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Thành phần hồ sơ (Checklist)</span>
              </button>
              <button
                onClick={() => scrollToSection('sec-duration')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Thời hạn giải quyết & Phí</span>
              </button>
              <button
                onClick={() => scrollToSection('sec-legal')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">5</span>
                <span>Căn cứ pháp lý áp dụng</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Floating CTA Button: "Hỏi chatbot về thủ tục này" (Screen 7 spec) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={handleAskChatbot}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center gap-2.5 transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span>Hỏi Chatbot về thủ tục này</span>
        </button>
      </div>
    </div>
  );
};
