import React, { useState } from 'react';
import { User } from '../../types';
import { X, Check, FileText, Shield, AlertCircle, Eye, Download } from 'lucide-react';

interface PendingOfficerPanelProps {
  user: User;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string, reason: string) => void;
}

export const PendingOfficerPanel: React.FC<PendingOfficerPanelProps> = ({
  user,
  onClose,
  onApprove,
  onReject,
}) => {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      setErrorMsg('Vui lòng nhập lý do từ chối hồ sơ cán bộ.');
      return;
    }
    onReject(user.id, rejectReason.trim());
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200 text-left">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Chi Tiết Cán Bộ Chờ Duyệt (Màn 31)
            </h3>
            <p className="text-[11px] text-slate-500">Đối chiếu thông tin & giấy tờ bổ nhiệm</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
        {/* Profile Details */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Thông tin cá nhân & Đơn vị
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Họ và tên:</span>
              <span className="font-bold text-slate-900 text-sm">{user.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Số CCCD:</span>
              <span className="font-mono font-semibold text-slate-900">{user.idCard}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Ngày sinh:</span>
              <span className="font-medium text-slate-800">{user.dob}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Giới tính:</span>
              <span className="font-medium text-slate-800">{user.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Số điện thoại:</span>
              <span className="font-mono font-semibold text-slate-900">{user.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Email công tác:</span>
              <span className="font-medium text-slate-900 truncate">{user.email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <p>
              <strong>Chức vụ đề nghị:</strong> {user.position}
            </p>
            <p>
              <strong>Bộ phận / Đơn vị:</strong> {user.department}
            </p>
            <p className="text-slate-500 text-[11px]">Đăng ký lúc: {user.registeredAt}</p>
          </div>
        </div>

        {/* Proof Document Preview (Screen 31 spec) */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>Giấy tờ minh chứng đính kèm</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Đã xác thực chữ ký</span>
          </h4>

          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-xs text-slate-900">
                  quyet-dinh-tuyen-dung-can-bo.pdf
                </span>
              </div>
              <button
                onClick={() => alert('Đang mở bản xem trước giấy tờ minh chứng...')}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg"
                title="Tải về"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Document preview iframe/mock */}
            <div className="h-44 bg-white rounded-xl border border-slate-200 p-3 text-center flex flex-col items-center justify-center text-xs text-slate-500">
              <FileText className="w-8 h-8 text-slate-300 mb-2" />
              <p className="font-bold text-slate-800">
                ỦY BAN NHÂN DÂN HUYỆN / XÃ
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Quyết định về việc phân công, tiếp nhận cán bộ công chức cơ sở
              </p>
            </div>
          </div>
        </div>

        {/* Reject reason input box if active */}
        {showRejectBox && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Nhập lý do từ chối (Bắt buộc)</span>
            </div>
            {errorMsg && <p className="text-[11px] text-rose-700 font-semibold">{errorMsg}</p>}
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Ghi rõ lý do từ chối để thông báo cho người đăng ký..."
              className="w-full px-3 py-2 rounded-xl border border-rose-300 text-xs focus:ring-2 focus:ring-rose-500 bg-white"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRejectBox(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-white transition-colors"
        >
          Đóng
        </button>

        {!showRejectBox && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRejectBox(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors"
            >
              Từ chối hồ sơ
            </button>
            <button
              onClick={() => onApprove(user.id)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Phê duyệt tài khoản</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
