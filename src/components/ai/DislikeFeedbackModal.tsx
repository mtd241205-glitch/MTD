import React, { useState } from 'react';
import { ThumbsDown, X } from 'lucide-react';

interface DislikeFeedbackModalProps {
  onClose: () => void;
  onSubmit: (reason: string, feedback: string) => void;
}

export const DislikeFeedbackModal: React.FC<DislikeFeedbackModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Sai thông tin');
  const [feedbackText, setFeedbackText] = useState('');

  const reasons = ['Sai thông tin', 'Không đầy đủ', 'Khó hiểu', 'Khác'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedReason, feedbackText);
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
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ThumbsDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Đóng Góp Ý Kiến Câu Trả Lời (Màn 25)
            </h3>
            <p className="text-xs text-slate-500">
              Ý kiến của bạn giúp cải thiện chất lượng kho tri thức AI của xã
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-2">Lý do chưa hài lòng:</label>
            <div className="flex flex-wrap gap-2">
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedReason(r)}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-colors ${
                    selectedReason === r
                      ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Ghi chú thêm (không bắt buộc):
            </label>
            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Nội dung cần điều chỉnh hoặc văn bản pháp luật áp dụng thực tế..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Bỏ qua
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm"
            >
              Gửi phản hồi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
