import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Lock, LogIn, ExternalLink, ArrowLeft, ShieldAlert } from 'lucide-react';

export const SharedChatScreen: React.FC = () => {
  const {
    screenParam,
    chatSessions,
    currentRole,
    currentUser,
    navigateTo,
  } = useApp();

  const session = chatSessions.find((s) => s.id === screenParam) || chatSessions[0];

  const canViewInternal =
    (currentRole === 'officer' || currentRole === 'commune_admin') &&
    currentUser?.communeId === session?.communeId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Read-Only Shared Banner (Screen 24 spec) */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Bot className="w-5 h-5 text-blue-600 shrink-0" />
          <span>Bạn đang xem hội thoại được chia sẻ (Chỉ đọc) - Màn 24</span>
        </div>
        <button
          onClick={() => navigateTo(13, 'redirect_to_22')}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập để hỏi thêm</span>
        </button>
      </div>

      {/* Main Conversation Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl font-black text-slate-900">{session?.title || 'Hội thoại chia sẻ'}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Thời gian tạo: {session?.createdAt} • Chế độ xem công khai an toàn
          </p>
        </div>

        {/* Messages */}
        <div className="space-y-6">
          {session?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-4 sm:p-5 ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white rounded-tr-xs'
                    : 'bg-slate-50 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Citations: STRICT PERMISSION MASKING (Screen 24 spec) */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Nguồn tham khảo:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite) => {
                        const isInternal = cite.scope === 'commune_internal';

                        if (isInternal && !canViewInternal) {
                          /* STRICT SPEC: "Người nhận không có quyền thấy chip nguồn Nội bộ dưới dạng
                             'Tài liệu nội bộ, không có quyền xem', không mở được và không lộ tiêu đề" */
                          return (
                            <span
                              key={cite.id}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-200 text-slate-600 border border-slate-300 flex items-center gap-1.5 cursor-not-allowed select-none"
                              title="Tài liệu nội bộ, chỉ Cán bộ xã mới xem được chi tiết"
                            >
                              <Lock className="w-3 h-3 text-slate-500" />
                              <span>Tài liệu nội bộ, không có quyền xem</span>
                            </span>
                          );
                        }

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
