import React, { useState } from 'react';
import { DocumentItem } from '../../types';
import { RefreshCw, X, Upload, Check, AlertCircle } from 'lucide-react';

interface NewVersionDocumentModalProps {
  doc: DocumentItem;
  onClose: () => void;
}

export const NewVersionDocumentModal: React.FC<NewVersionDocumentModalProps> = ({
  doc,
  onClose,
}) => {
  const [newEffectiveDate, setNewEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [changeNotes, setChangeNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Thay Bằng Phiên Bản Mới (Màn 38)
            </h3>
            <p className="text-xs text-slate-500">Tự động xử lý lại vector tri thức cho phiên bản mới</p>
          </div>
        </div>

        {/* Current version info */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 mb-4">
          <p>
            <strong>Văn bản hiện tại:</strong> {doc.title} ({doc.docNumber})
          </p>
          <p className="text-slate-500">Mã tài liệu ẩn danh: {doc.anonCode} • Ngày hiệu lực cũ: {doc.effectiveDate}</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tải lên tệp văn bản phiên bản mới (PDF, DOCX) *
            </label>
            <div
              onClick={() => setFileName(`${doc.docNumber}-phien-ban-moi.pdf`)}
              className="p-5 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 text-center cursor-pointer space-y-1"
            >
              <Upload className="w-6 h-6 text-indigo-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">
                {fileName ? `Đã chọn: ${fileName}` : 'Bấm để chọn tệp tài liệu mới'}
              </p>
              <p className="text-[11px] text-slate-400">Hỗ trợ tối đa 20MB</p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ngày có hiệu lực mới *</label>
            <input
              type="date"
              required
              value={newEffectiveDate}
              onChange={(e) => setNewEffectiveDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Ghi chú nội dung sửa đổi, bổ sung
            </label>
            <textarea
              rows={3}
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="Ví dụ: Bổ sung điều khoản hỗ trợ hộ cận nghèo theo nghị quyết mới..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Đang cập nhật vector...' : 'Cập nhật phiên bản'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
