import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface UploadPersonalDocModalProps {
  onClose: () => void;
}

export const UploadPersonalDocModal: React.FC<UploadPersonalDocModalProps> = ({ onClose }) => {
  const { addPersonalDoc } = useApp();
  const { showToast, dismissToast } = useToast();

  const [files, setFiles] = useState<
    Array<{ name: string; size: string; content: string; progress: number; error?: string }>
  >([
    {
      name: 'Mau-don-xin-xac-nhan-tinh-trang-hon-nhan-2026.docx',
      size: '340 KB',
      content: 'Mẫu đơn xin cấp Giấy xác nhận tình trạng hôn nhân áp dụng theo Nghị định 123/2015/NĐ-CP và Thông tư 04/2020/TT-BTP...',
      progress: 100,
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateAddFile = () => {
    const sampleFiles = [
      {
        name: 'Phuong-an-phoi-hop-dam-bao-trat-tu-le-hoi-lang.pdf',
        size: '520 KB',
        content: 'Phương án phân luồng giao thông và bố trí chốt an ninh tự quản trong dịp lễ hội truyền thống đầu xuân...',
        progress: 100,
      },
      {
        name: 'Bao-cao-tong-hop-y-kien-nhan-dan-ve-lam-duong-be-tong.docx',
        size: '810 KB',
        content: 'Tổng hợp danh sách các hộ dân tự nguyện hiến đất mở rộng đường ngõ xóm đạt chuẩn 5.5 mét...',
        progress: 100,
      },
    ];

    const pick = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    if (!files.some((f) => f.name === pick.name)) {
      setFiles((prev) => [...prev, pick]);
    }
  };

  const handleUploadSubmit = () => {
    setIsUploading(true);
    const loadingToastId = showToast('loading', 'Đang xử lý tài liệu tải lên...', 0);
    setTimeout(() => {
      files.forEach((f) => {
        addPersonalDoc({
          name: f.name,
          size: f.size,
          uploadDate: new Date().toISOString().split('T')[0],
          content: f.content,
          tags: ['Tài liệu mới', 'Cán bộ'],
          status: 'ready',
          progress: 100,
        });
      });
      setIsUploading(false);
      dismissToast(loadingToastId);
      showToast('success', `Đã xử lý ${files.length} tài liệu thành công.`);
      onClose();
    }, 600);
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
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tải Tài Liệu Cá Nhân Lên AI (Màn 27)
            </h3>
            <p className="text-xs text-slate-500">
              Chỉ lưu trong phiên tài khoản của bạn, không chia sẻ với tài khoản khác
            </p>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onClick={handleSimulateAddFile}
          className="p-8 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-400 transition-all text-center cursor-pointer space-y-2"
        >
          <Upload className="w-8 h-8 text-indigo-600 mx-auto animate-pulse" />
          <h4 className="text-xs font-bold text-slate-900">
            Kéo thả tệp vào đây hoặc bấm để chọn tệp
          </h4>
          <p className="text-[11px] text-slate-500">
            Định dạng hỗ trợ: PDF, DOCX, TXT. Dung lượng tối đa: 25 MB/tệp.
          </p>
        </div>

        {/* File Queue */}
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-400">{file.size}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-emerald-600">Sẵn sàng</span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={files.length === 0 || isUploading}
            onClick={handleUploadSubmit}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
            aria-busy={isUploading}
          >
            {isUploading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Đang bóc tách văn bản...
              </span>
            ) : `Tải lên (${files.length} tệp)`}
          </button>
        </div>
      </div>
    </div>
  );
};
