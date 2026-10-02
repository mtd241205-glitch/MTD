import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Cpu,
  Clock,
  ArrowRight,
  Shield,
  X,
} from 'lucide-react';
import { SupportRequest } from '../../types';

export const SupportRequestsScreen: React.FC = () => {
  const {
    supportRequests,
    resolveSupportRequest,
    resetCommuneAdminPassword,
    communes,
    navigateTo,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    supportRequests[0] || null
  );
  const [replyNotes, setReplyNotes] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const filteredRequests = supportRequests.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const selectedCommune = selectedRequest
    ? communes.find((c) => c.id === selectedRequest.communeId)
    : null;

  const handleMarkDone = () => {
    if (!selectedRequest) return;
    resolveSupportRequest(selectedRequest.id, replyNotes);
    setActionNotice('Đã đánh dấu hoàn tất xử lý yêu cầu hỗ trợ!');
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleResetPassword = () => {
    if (!selectedRequest) return;
    const temp = resetCommuneAdminPassword(selectedRequest.communeId);
    resolveSupportRequest(
      selectedRequest.id,
      `Đã cấp mật khẩu tạm: ${temp} và gửi qua SMS tới người quản lý.`
    );
    setActionNotice(`Đã cấp mật khẩu tạm: ${temp} cho Quản lý xã!`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
          <HelpCircle className="w-4 h-4" />
          <span>SUPPORT TICKET SYSTEM (MÀN 51)</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">
          Yêu Cầu Hỗ Trợ Từ Các Xã
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tiếp nhận yêu cầu sự cố kỹ thuật, gia hạn bản quyền và xác minh cấp lại mật khẩu Quản lý xã
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Grid: Requests Table & Right Detail Frame (Screen 51 spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Table */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2 text-xs">
            <span className="font-bold text-slate-300">
              Danh sách yêu cầu ({supportRequests.length})
            </span>

            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold"
              >
                <option value="all">Tất cả loại</option>
                <option value="technical_issue">Sự cố kỹ thuật</option>
                <option value="renewal">Gia hạn dịch vụ</option>
                <option value="password_reset">Cấp lại mật khẩu</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="new">Mới gửi</option>
                <option value="processing">Đang xử lý</option>
                <option value="done">Đã xử lý xong</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-3.5 rounded-2xl transition-colors cursor-pointer text-xs space-y-1.5 border ${
                  selectedRequest?.id === req.id
                    ? 'bg-purple-950/40 border-purple-500/50'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{req.communeName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      req.status === 'done'
                        ? 'bg-emerald-950 text-emerald-300'
                        : req.status === 'processing'
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-rose-950 text-rose-300'
                    }`}
                  >
                    {req.status === 'done'
                      ? 'Đã xong'
                      : req.status === 'processing'
                      ? 'Đang xử lý'
                      : 'Mới gửi'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-semibold text-purple-400">
                    {req.type === 'technical_issue'
                      ? 'Sự cố kỹ thuật'
                      : req.type === 'renewal'
                      ? 'Gia hạn'
                      : 'Cấp lại MK'}
                  </span>
                  <span>•</span>
                  <span>{req.senderName} ({req.senderContact})</span>
                </div>

                <p className="text-slate-300 line-clamp-1">{req.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ticket Detail Pane (Screen 51 spec) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 sticky top-24 text-xs">
          {selectedRequest ? (
            <>
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Chi tiết yêu cầu hỗ trợ</h3>
                  <button
                    onClick={() => navigateTo(50, selectedRequest.communeId)}
                    className="text-[11px] text-purple-400 hover:underline"
                  >
                    Đơn vị: {selectedRequest.communeName} &rarr;
                  </button>
                </div>
                <span className="font-mono text-slate-400">{selectedRequest.createdAt}</span>
              </div>

              <div className="space-y-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block mb-0.5">Người gửi yêu cầu:</span>
                  <span className="font-bold text-white text-sm">{selectedRequest.senderName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Thông tin liên hệ:</span>
                  <span className="font-mono text-white">{selectedRequest.senderContact}</span>
                </div>

                {selectedRequest.anonDocId && (
                  <div>
                    <span className="text-slate-500 block mb-0.5">Mã tài liệu gặp sự cố:</span>
                    <span className="font-mono font-bold text-purple-400 text-sm">
                      {selectedRequest.anonDocId}
                    </span>
                  </div>
                )}

                {selectedRequest.verificationInfo && (
                  <div>
                    <span className="text-slate-500 block mb-0.5">Thông tin xác minh đại diện xã:</span>
                    <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 font-mono text-slate-300">
                      {selectedRequest.verificationInfo}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 block mb-0.5">Nội dung chi tiết yêu cầu:</span>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 leading-relaxed text-slate-200 whitespace-pre-line">
                    {selectedRequest.content}
                  </div>
                </div>

                {/* Support Session state for this commune */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
                  <span>Trạng thái Phiên hỗ trợ của xã:</span>
                  <span
                    className={`font-bold ${
                      selectedCommune?.supportSessionActive
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {selectedCommune?.supportSessionActive ? 'Đang mở' : 'Đang tắt'}
                  </span>
                </div>
              </div>

              {/* Action Buttons based on type */}
              <div className="pt-2 space-y-2">
                {selectedRequest.type === 'technical_issue' && (
                  <button
                    disabled={!selectedCommune?.supportSessionActive}
                    onClick={() => navigateTo(50, selectedRequest.communeId)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>
                      {selectedCommune?.supportSessionActive
                        ? 'Xem chẩn đoán kỹ thuật ẩn danh (Màn 50)'
                        : 'Xã chưa bật phiên hỗ trợ'}
                    </span>
                  </button>
                )}

                {selectedRequest.type === 'password_reset' && (
                  <button
                    onClick={handleResetPassword}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Cấp mật khẩu tạm thời cho Quản lý xã</span>
                  </button>
                )}

                {/* Processing note & mark done */}
                <div className="pt-2 space-y-2">
                  <textarea
                    rows={2}
                    value={replyNotes}
                    onChange={(e) => setReplyNotes(e.target.value)}
                    placeholder="Ghi chú kết quả xử lý kỹ thuật của kỹ sư..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                  <button
                    onClick={handleMarkDone}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đánh dấu đã hoàn thành yêu cầu</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-center py-12">
              Chọn một yêu cầu để xem thông tin chi tiết
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
