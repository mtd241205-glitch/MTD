import React, { useState } from 'react';
import { DataScope } from '../../types';
import { Share2, Lock, Globe, AlertCircle, X, Check } from 'lucide-react';

interface ChangeScopeModalProps {
  selectedCount: number;
  onClose: () => void;
  onConfirm: (newScope: DataScope) => void;
}

export const ChangeScopeModal: React.FC<ChangeScopeModalProps> = ({
  selectedCount,
  onClose,
  onConfirm,
}) => {
  const [targetScope, setTargetScope] = useState<DataScope>('commune_public');
  const [confirmedPublic, setConfirmedPublic] = useState(false);

  const handleSave = () => {
    if (targetScope === 'commune_public' && !confirmedPublic) {
      alert('Vui lòng đánh dấu xác nhận đồng ý mở quyền công khai.');
      return;
    }
    onConfirm(targetScope);
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
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Đổi Phạm Vi Hiển Thị (Màn 39)
            </h3>
            <p className="text-xs text-slate-500">
              Đang chọn <strong>{selectedCount}</strong> tài liệu của xã
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <label className="block font-bold text-slate-700">Chọn phạm vi hiển thị mới *</label>

          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors bg-white hover:bg-slate-50">
              <input
                type="radio"
                name="scopeOption"
                checked={targetScope === 'commune_internal'}
                onChange={() => setTargetScope('commune_internal')}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Nội bộ (Chỉ Cán bộ & Quản lý xã)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Người dân và khách hoàn toàn không thể xem hoặc tra cứu qua chatbot.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors bg-white hover:bg-slate-50">
              <input
                type="radio"
                name="scopeOption"
                checked={targetScope === 'commune_public'}
                onChange={() => setTargetScope('commune_public')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-700" />
                  Công khai (Thêm Người dân của xã)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mọi tài khoản đăng nhập thuộc xã đều xem được và Chatbot AI sẽ dùng để trả lời người dân.
                </p>
              </div>
            </label>
          </div>

          {/* Warning when changing to Public (Screen 39 spec) */}
          {targetScope === 'commune_public' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">
                  Cảnh báo: Người dân sẽ xem được tài liệu này và chatbot AI sẽ trích dẫn nó để trả lời câu hỏi của người dân.
                </p>
              </div>
              <label className="flex items-center gap-2 pt-1 font-bold cursor-pointer text-amber-950">
                <input
                  type="checkbox"
                  checked={confirmedPublic}
                  onChange={(e) => setConfirmedPublic(e.target.checked)}
                  className="rounded text-amber-700 focus:ring-amber-500"
                />
                <span>Tôi xác nhận tài liệu này đủ điều kiện công khai</span>
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lưu thay đổi phạm vi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
