import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, Copy, Check, AlertTriangle, X, Lock } from 'lucide-react';

interface ShareChatModalProps {
  sessionId: string;
  hasInternalCitation: boolean;
  onClose: () => void;
}

export const ShareChatModal: React.FC<ShareChatModalProps> = ({
  sessionId,
  hasInternalCitation,
  onClose,
}) => {
  const { shareChatSession, navigateTo } = useApp();
  const [copied, setCopied] = useState(false);

  const shareLink = shareChatSession(sessionId);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Chia Sẻ Hội Thoại (Màn 23)
            </h3>
            <p className="text-xs text-slate-500">Tạo liên kết chỉ đọc cho đồng nghiệp hoặc người dân</p>
          </div>
        </div>

        {/* Warning if internal citations exist (Screen 23 spec) */}
        {hasInternalCitation && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Cảnh báo bảo mật:</strong> Hội thoại có trích dẫn tài liệu nội bộ của xã. Người nhận phải là Cán bộ cùng xã mới xem được đầy đủ căn cứ nội bộ này. Người dân hoặc khách chỉ xem được nội dung tóm tắt công khai.
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Liên kết xem hội thoại
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono text-slate-700 select-all"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            * Người có liên kết chỉ xem được, không chỉnh sửa; các tệp cá nhân bạn tải lên sẽ không được chia sẻ sang tài khoản khác.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                navigateTo(24, sessionId);
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Xem thử giao diện người nhận mở link (Màn 24) &rarr;
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-5 mt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
