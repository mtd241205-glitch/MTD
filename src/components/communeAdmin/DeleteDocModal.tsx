import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteDocModalProps {
  docCount: number;
  docTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteDocModal: React.FC<DeleteDocModalProps> = ({
  docCount,
  docTitle,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-rose-200 text-center relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-rose-50">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Xác Nhận Xóa Tài Liệu (Màn 40)
        </h3>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          {docTitle ? (
            <>
              Bạn có chắc chắn muốn xóa văn bản: <br />
              <strong className="text-slate-900 font-bold">{docTitle}</strong>?
            </>
          ) : (
            `Bạn có chắc chắn muốn xóa ${docCount} tài liệu đã chọn?`
          )}
        </p>

        <p className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded-xl font-medium mb-6">
          * Dữ liệu tri thức liên quan trong kho vector AI cũng sẽ bị xóa bỏ hoàn toàn.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
