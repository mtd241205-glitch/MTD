import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Plus,
  Share2,
  Tag,
  ArrowUpDown,
  CheckSquare,
  Square,
  FileText,
  Trash2,
  FileCheck,
  Send,
  Upload,
  Eye,
  Bot,
  Layers,
  Lock,
} from 'lucide-react';
import { PersonalDoc } from '../../types';
import { UploadPersonalDocModal } from './UploadPersonalDocModal';
import { PreviewPersonalDocPanel } from './PreviewPersonalDocPanel';
import { ManageTagsModal } from './ManageTagsModal';
import { ShareChatModal } from './ShareChatModal';

export const AiDocumentsScreen: React.FC = () => {
  const {
    personalDocs,
    deletePersonalDoc,
    chatSessions,
    activeChatSessionId,
    setActiveChatSessionId,
    createNewChatSession,
    sendChatMessage,
    currentRole,
    navigateTo,
  } = useApp();

  // Mode: Only personal docs vs Combine with commune & national knowledge
  const [usePersonalDocsOnly, setUsePersonalDocsOnly] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals & Panels
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewDoc, setShowPreviewDoc] = useState<PersonalDoc | null>(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');

  const activeSession = chatSessions.find((s) => s.id === activeChatSessionId);

  // Toggle select document
  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === personalDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(personalDocs.map((d) => d.id));
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedDocIds.length} tệp đã chọn?`)) {
      selectedDocIds.forEach((id) => deletePersonalDoc(id));
      setSelectedDocIds([]);
    }
  };

  const handleSummarizeSelected = async () => {
    if (selectedDocIds.length === 0) return;
    const selected = personalDocs.filter((d) => selectedDocIds.includes(d.id));
    const prompt = `Hãy tóm tắt nội dung chính và các lưu ý quan trọng trong các tài liệu sau: ${selected
      .map((d) => d.name)
      .join(', ')}`;

    setIsSubmitting(true);
    await sendChatMessage(prompt, true);
    setIsSubmitting(false);
  };

  const handleSend = async () => {
    if (!inputQuestion.trim() || isSubmitting) return;
    const q = inputQuestion;
    setInputQuestion('');
    setIsSubmitting(true);
    await sendChatMessage(q, usePersonalDocsOnly);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden h-[calc(100vh-140px)] min-h-[600px] flex">
        {/* Left Column: Sessions (Screen 26 spec) */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-slate-200 space-y-2">
            <button
              onClick={() => {
                const newId = createNewChatSession('Hội thoại mới với tài liệu');
                setActiveChatSessionId(newId);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Hội thoại mới</span>
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ hội thoại</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setActiveChatSessionId(session.id)}
                className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer truncate ${
                  activeChatSessionId === session.id
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                {session.title}
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Chat Frame */}
        <div className="flex-1 flex flex-col bg-white border-r border-slate-200 min-w-0">
          {/* Top Toggle Bar (Screen 26 spec) */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Tài Liệu Chuyên Môn Cán Bộ (Màn 26)</span>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-600">Phạm vi tra cứu:</span>
              <button
                type="button"
                onClick={() => setUsePersonalDocsOnly(!usePersonalDocsOnly)}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                  usePersonalDocsOnly
                    ? 'bg-indigo-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {usePersonalDocsOnly
                  ? 'Chỉ dùng tệp đã chọn'
                  : 'Kết hợp tri thức xã & quốc gia'}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {!activeSession || activeSession.messages.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <FileCheck className="w-12 h-12 mx-auto text-slate-300" />
                <h4 className="font-bold text-slate-700 text-sm">
                  Không gian làm việc với tài liệu cá nhân
                </h4>
                <p className="text-xs max-w-sm mx-auto">
                  Tải lên tệp tài liệu ở cột bên phải, chọn tệp cần phân tích hoặc đặt câu hỏi trực tiếp để AI tóm tắt và trích xuất.
                </p>
              </div>
            ) : (
              activeSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl p-4 sm:p-5 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {msg.citations.map((c) => (
                          <span
                            key={c.id}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              c.scope === 'commune_internal'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : c.scope === 'commune_public'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300'
                            }`}
                          >
                            {c.docNumber}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isSubmitting && (
              <div className="flex items-center gap-2 p-3 bg-indigo-50/60 rounded-xl text-xs text-indigo-700 w-fit">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                <span>Đang phân tích và tổng hợp từ tài liệu...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Hỏi về tệp tài liệu, yêu cầu tóm tắt hoặc so sánh..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || isSubmitting}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Uploaded Personal Files (Screen 26 spec) */}
        <div className="w-80 bg-slate-50 flex flex-col shrink-0">
          {/* Header Action */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>+ Thêm tài liệu (27)</span>
            </button>

            {/* Tools Bar */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-1 hover:text-slate-900 font-semibold"
              >
                {selectedDocIds.length === personalDocs.length && personalDocs.length > 0 ? (
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Square className="w-3.5 h-3.5" />
                )}
                <span>Chọn tất cả</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTagModal(true)}
                  className="flex items-center gap-1 hover:text-indigo-600"
                  title="Gắn nhãn cho tài liệu"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Gắn nhãn (29)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {personalDocs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>Chưa có tài liệu cá nhân nào</p>
                <p className="text-[11px] mt-1">Bấm "+ Thêm tài liệu" để tải lên</p>
              </div>
            ) : (
              personalDocs.map((doc) => {
                const isSelected = selectedDocIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-2xl bg-white border transition-all text-xs space-y-2 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectDoc(doc.id)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div
                        onClick={() => setShowPreviewDoc(doc)}
                        className="flex-1 min-w-0 cursor-pointer group"
                      >
                        <h5 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {doc.name}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                          <span>•</span>
                          <span className="font-mono">{doc.anonCode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pl-6">
                        {doc.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Action Bar when files selected (Screen 26 spec) */}
          {selectedDocIds.length > 0 && (
            <div className="p-3 bg-indigo-50 border-t border-indigo-200 flex items-center justify-between text-xs animate-in fade-in">
              <span className="font-bold text-indigo-900">
                Đã chọn {selectedDocIds.length} tệp
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSummarizeSelected}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors"
                >
                  Tóm tắt
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                  title="Xóa tệp đã chọn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals 27, 28, 29, 23 */}
      {showUploadModal && <UploadPersonalDocModal onClose={() => setShowUploadModal(false)} />}
      {showPreviewDoc && (
        <PreviewPersonalDocPanel
          doc={showPreviewDoc}
          onClose={() => setShowPreviewDoc(null)}
          onAskAboutDoc={(doc) => {
            setShowPreviewDoc(null);
            sendChatMessage(`Hãy phân tích chi tiết tài liệu: ${doc.name}`, true);
          }}
        />
      )}
      {showTagModal && (
        <ManageTagsModal
          selectedDocIds={selectedDocIds}
          onClose={() => setShowTagModal(false)}
        />
      )}
      {showShareModal && activeSession && (
        <ShareChatModal
          sessionId={activeSession.id}
          hasInternalCitation={!!activeSession.includesInternalDoc}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
