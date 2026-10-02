import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  Share2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  RotateCcw,
  Send,
  Mic,
  Lock,
  MoreVertical,
  Bot,
  Sparkles,
  BookOpen,
  ClipboardList,
  AlertCircle,
  ExternalLink,
  PhoneCall,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { ShareChatModal } from './ShareChatModal';
import { DislikeFeedbackModal } from './DislikeFeedbackModal';
import { useToast } from '../../context/ToastContext';

export const ChatbotScreen: React.FC = () => {
  const {
    chatSessions,
    activeChatSessionId,
    setActiveChatSessionId,
    createNewChatSession,
    sendChatMessage,
    pinChatSession,
    deleteChatSession,
    renameChatSession,
    reactToMessage,
    currentRole,
    currentUser,
    currentCommune,
    navigateTo,
  } = useApp();
  const { showToast, dismissToast } = useToast();

  const [inputQuestion, setInputQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDislikeModal, setShowDislikeModal] = useState(false);
  const [dislikeMessageId, setDislikeMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [deleteConfirmSessionId, setDeleteConfirmSessionId] = useState<string | null>(null);

  const activeSession = chatSessions.find((s) => s.id === activeChatSessionId);

  // Filter sessions
  const filteredSessions = chatSessions.filter((s) =>
    s.title.toLowerCase().includes(historySearch.toLowerCase())
  );

  const promptSuggestions = [
    {
      title: 'Đăng ký khai sinh cho trẻ mới sinh',
      desc: 'Cần giấy tờ gì, nơi nộp và thời hạn bao lâu?',
      prompt: 'Thủ tục đăng ký khai sinh cho trẻ mới sinh gồm những giấy tờ gì và nộp ở đâu?',
    },
    {
      title: 'Đăng ký kết hôn tại UBND xã',
      desc: 'Điều kiện độ tuổi và các bước thực hiện',
      prompt: 'Điều kiện và hồ sơ đăng ký kết hôn tại Ủy ban nhân dân cấp xã như thế nào?',
    },
    {
      title: 'Lịch tiếp công dân của Chủ tịch xã',
      desc: 'Thời gian, địa điểm và quy trình tiếp dân',
      prompt: 'Lịch tiếp công dân định kỳ của Chủ tịch UBND xã vào ngày nào?',
    },
    {
      title: 'Chính sách bỏ sổ hộ khẩu giấy',
      desc: 'Cách xuất trình cư trú qua VNeID và CCCD',
      prompt: 'Nghị định 104 quy định việc bỏ sổ hộ khẩu giấy và dùng VNeID như thế nào?',
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputQuestion;
    if (!text.trim() || isSubmitting) return;

    setInputQuestion('');
    setIsSubmitting(true);
    const loadingToastId = showToast('loading', 'Trợ lý AI đang tra cứu tài liệu...', 0);

    try {
      const targetSessionId = activeChatSessionId;
      if (!targetSessionId || !activeSession) {
        createNewChatSession(text);
      } else {
        await sendChatMessage(text);
      }
      dismissToast(loadingToastId);
      showToast('success', 'Đã nhận câu hỏi và cập nhật câu trả lời.');
    } catch {
      dismissToast(loadingToastId);
      showToast('error', 'Chưa gửi được câu hỏi. Vui lòng thử lại.');
      setInputQuestion(text);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      showToast('success', 'Đã sao chép câu trả lời.');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      showToast('error', 'Không thể sao chép câu trả lời. Vui lòng thử lại.');
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*_-]/g, ''));
      utterance.lang = 'vi-VN';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn chưa hỗ trợ đọc văn bản tự động.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden h-[calc(100vh-140px)] min-h-[600px] flex">
        {/* Left Column: Chat History */}
        <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 hidden md:flex">
          {/* Header Action */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <button
              onClick={() => {
                const newId = createNewChatSession();
                setActiveChatSessionId(newId);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Cuộc hội thoại mới</span>
            </button>

            {/* Search sessions */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Tìm kiếm lịch sử..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setActiveChatSessionId(session.id)}
                className={`p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                  activeChatSessionId === session.id
                    ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {session.isPinned && <Pin className="w-3 h-3 text-blue-600 shrink-0 fill-blue-600" />}
                  {editingSessionId === session.id ? (
                    <input
                      type="text"
                      value={editingTitle}
                      autoFocus
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => {
                        renameChatSession(session.id, editingTitle || session.title);
                        setEditingSessionId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          renameChatSession(session.id, editingTitle || session.title);
                          setEditingSessionId(null);
                        }
                      }}
                      className="w-full bg-white px-1.5 py-0.5 rounded border border-slate-300 text-xs font-normal"
                    />
                  ) : (
                    <span className="truncate">{session.title}</span>
                  )}
                </div>

                {/* Session Actions */}
                <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      pinChatSession(session.id);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    title={session.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSessionId(session.id);
                      setEditingTitle(session.title);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    title="Đổi tên"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmSessionId(session.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Xóa hội thoại"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Chat Conversation */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Top Bar of Active Chat */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-sm">
                  {activeSession?.title || 'Trợ Lý AI Cấp Xã'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {currentRole === 'citizen'
                    ? 'Chế độ công dân: Tra cứu Dùng chung & Dữ liệu công khai xã'
                    : 'Chế độ cán bộ: Tra cứu toàn diện (gồm tài liệu nội bộ xã)'}
                </p>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2">
              {activeSession && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  title="Chia sẻ hội thoại"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chia sẻ (23)</span>
                </button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {!activeSession || activeSession.messages.length === 0 ? (
              /* Empty state with greeting & 4 suggestion cards (Screen 22 spec) */
              <div className="max-w-2xl mx-auto py-10 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-md">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Xin chào! Tôi là Trợ Lý AI Cấp Xã
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    Tôi có thể hỗ trợ bạn tra cứu trình tự thủ tục hành chính, giải đáp căn cứ pháp luật và các chính sách ban hành tại địa phương.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {promptSuggestions.map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(card.prompt)}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all text-left group"
                    >
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">{card.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message List */
              activeSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-blue-700 text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>

                    {/* Citations Chip Section (Screen 22 spec) */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Nguồn tham khảo:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cite) => {
                            const isInternal = cite.scope === 'commune_internal';
                            return (
                              <button
                                key={cite.id}
                                onClick={() => navigateTo(cite.category === 'procedure' ? 7 : 5, cite.id)}
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                                  isInternal
                                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                    : cite.scope === 'commune_public'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                                }`}
                              >
                                {isInternal && <Lock className="w-3 h-3 text-amber-600" />}
                                <span>{cite.docNumber}</span>
                                <span className="opacity-75">
                                  ({isInternal ? 'Nội bộ' : cite.scope === 'commune_public' ? 'Của xã' : 'Dùng chung'})
                                </span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions under Assistant Message (Screen 22 spec) */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-3 mt-1.5 px-2 text-slate-400 text-xs">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-slate-700 flex items-center gap-1"
                        title="Sao chép câu trả lời"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedMessageId === msg.id ? 'Đã chép' : 'Sao chép'}</span>
                      </button>

                      <button
                        onClick={() => reactToMessage(msg.id, 'like')}
                        className={`hover:text-emerald-600 flex items-center gap-1 ${
                          msg.reaction === 'like' ? 'text-emerald-600 font-bold' : ''
                        }`}
                        title="Hữu ích"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Thích</span>
                      </button>

                      <button
                        onClick={() => {
                          setDislikeMessageId(msg.id);
                          setShowDislikeModal(true);
                        }}
                        className={`hover:text-rose-600 flex items-center gap-1 ${
                          msg.reaction === 'dislike' ? 'text-rose-600 font-bold' : ''
                        }`}
                        title="Không hài lòng"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Không thích</span>
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-slate-700 flex items-center gap-1"
                        title="Đọc thành tiếng"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Đọc</span>
                      </button>

                      <button
                        onClick={() => handleSend('Tạo lại câu trả lời này chi tiết hơn')}
                        className="hover:text-slate-700 flex items-center gap-1"
                        title="Tạo lại câu trả lời"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Tạo lại</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}

            {isSubmitting && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl w-fit border border-slate-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-xs text-slate-500 font-medium">Trợ lý AI đang tra cứu văn bản...</span>
              </div>
            )}
          </div>

          {/* Bottom Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => alert('Đang kích hoạt micro thu âm giọng nói (Chức năng Voice Input)...')}
                className="p-3 rounded-2xl bg-white border border-slate-300 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-xs"
                title="Hỏi bằng giọng nói"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Nhập câu hỏi về thủ tục, văn bản pháp luật hoặc chính sách cấp xã..."
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-xs"
              />

              <button
                type="submit"
                disabled={!inputQuestion.trim() || isSubmitting}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-blue-600/20"
                title="Gửi câu hỏi"
                aria-label={isSubmitting ? 'Đang gửi câu hỏi' : 'Gửi câu hỏi'}
              >
                {isSubmitting
                  ? <span className="block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  : <Send className="w-4 h-4" />}
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>AI có thể sai, cần kiểm tra kỹ các thông tin quan trọng</span>
              <button
                type="button"
                onClick={() => navigateTo(3)}
                className="text-blue-600 hover:underline font-semibold"
              >
                Cần hỗ trợ chuyên sâu? Liên hệ cán bộ xã (3)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Table of Contents (TOC) */}
        <div className="w-64 bg-slate-50 border-l border-slate-200 p-4 shrink-0 hidden xl:flex flex-col">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
            <span>Mục lục câu hỏi</span>
          </h4>

          <div className="flex-1 overflow-y-auto space-y-1.5 text-xs">
            {activeSession && activeSession.messages.filter((m) => m.role === 'user').length > 0 ? (
              activeSession.messages
                .filter((m) => m.role === 'user')
                .map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-blue-600 mr-1.5">#{idx + 1}</span>
                    <span className="line-clamp-2">{q.content}</span>
                  </div>
                ))
            ) : (
              <p className="text-slate-400 text-xs">Chưa có câu hỏi nào trong phiên hội thoại này.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals 23 & 25 */}
      {showShareModal && activeSession && (
        <ShareChatModal
          sessionId={activeSession.id}
          hasInternalCitation={!!activeSession.includesInternalDoc}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showDislikeModal && dislikeMessageId && (
        <DislikeFeedbackModal
          onClose={() => {
            setShowDislikeModal(false);
            setDislikeMessageId(null);
          }}
          onSubmit={(reason, feedback) => {
            if (activeChatSessionId) {
              reactToMessage(dislikeMessageId, 'dislike', reason, feedback);
            }
            setShowDislikeModal(false);
            setDislikeMessageId(null);
          }}
        />
      )}

      {/* Delete session confirmation modal */}
      {deleteConfirmSessionId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <Trash2 className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-900 mb-1">Xóa cuộc hội thoại này?</h3>
            <p className="text-xs text-slate-500 mb-6">
              Toàn bộ nội dung hỏi đáp trong phiên này sẽ bị xóa khỏi lịch sử.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmSessionId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  deleteChatSession(deleteConfirmSessionId);
                  setDeleteConfirmSessionId(null);
                  showToast('success', 'Đã xóa cuộc hội thoại.');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-sm hover:bg-rose-700"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
