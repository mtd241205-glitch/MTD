import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { CitizenFeedback } from '../../types';

export const FeedbackManagementScreen: React.FC = () => {
  const { feedbacks, replyFeedback, updateFeedbackStatus } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'processing' | 'resolved'>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<CitizenFeedback | null>(feedbacks[0] || null);
  const [replyText, setReplyText] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback || !replyText.trim()) return;

    replyFeedback(selectedFeedback.id, replyText.trim());
    setSuccessNotice('Đã gửi phản hồi chính thức tới công dân thành công!');
    setReplyText('');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const getStatusBadge = (status: CitizenFeedback['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            Mới tiếp nhận
          </span>
        );
      case 'processing':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            Đang xử lý
          </span>
        );
      case 'resolved':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Đã trả lời
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Khu vực Quản trị xã (Màn 44)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Quản Lý Phản Ánh & Ý Kiến Công Dân
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tiếp nhận, xử lý và gửi văn bản trả lời công khai tới các kiến nghị của nhân dân trên địa bàn
        </p>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Grid: Feedback Table & Right Detail Frame (Screen 44 spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Feedbacks Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Danh sách phản ánh ({feedbacks.length})
            </h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Mới tiếp nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="resolved">Đã trả lời</option>
            </select>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredFeedbacks.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Không có phản ánh nào trong mục này
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  onClick={() => setSelectedFeedback(fb)}
                  className={`p-3.5 rounded-2xl transition-colors cursor-pointer text-xs space-y-1.5 ${
                    selectedFeedback?.id === fb.id
                      ? 'bg-amber-50/80 border border-amber-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{fb.senderName}</span>
                    {getStatusBadge(fb.status)}
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{fb.content}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{fb.senderContact}</span>
                    <span>{fb.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Detail Frame */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 sticky top-24">
          {selectedFeedback ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Chi tiết phản ánh</h3>
                <select
                  value={selectedFeedback.status}
                  onChange={(e) => updateFeedbackStatus(selectedFeedback.id, e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold"
                >
                  <option value="new">Mới tiếp nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="resolved">Đã trả lời</option>
                </select>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Người gửi:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedFeedback.senderName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Thông tin liên hệ:</span>
                  <span className="font-mono font-medium text-slate-800">{selectedFeedback.senderContact}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Thời gian gửi:</span>
                  <span className="text-slate-600">{selectedFeedback.createdAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Nội dung phản ánh đầy đủ:</span>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                    {selectedFeedback.content}
                  </div>
                </div>
              </div>

              {/* Already replied note */}
              {selectedFeedback.reply && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                  <span className="font-bold text-emerald-900">Nội dung đã trả lời:</span>
                  <p className="text-emerald-800 leading-relaxed">{selectedFeedback.reply}</p>
                  <p className="text-[10px] text-slate-500 pt-1">
                    Người duyệt: {selectedFeedback.repliedBy} • {selectedFeedback.repliedAt}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Soạn câu trả lời gửi tới công dân:
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Ghi rõ phương án giải quyết hoặc lịch làm việc tiếp công dân..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi trả lời & Đổi trạng thái "Đã trả lời"</span>
                </button>
              </form>
            </>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center">
              Chọn một phản ánh ở cột bên trái để xem chi tiết
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
