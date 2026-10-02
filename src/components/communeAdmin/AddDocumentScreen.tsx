import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe,
  Bell,
  Sparkles,
  Layers,
} from 'lucide-react';
import { DataScope, DocumentCategory, DocumentStatus } from '../../types';

export const AddDocumentScreen: React.FC = () => {
  const { addDocument, currentCommune, documents, navigateTo } = useApp();

  const [category, setCategory] = useState<DocumentCategory>('policy');
  const [docNumber, setDocNumber] = useState('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Kế hoạch');
  const [issuingAgency, setIssuingAgency] = useState(currentCommune?.name ? `UBND ${currentCommune.name}` : 'UBND Xã');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [validityStatus, setValidityStatus] = useState<'Còn hiệu lực' | 'Hết hiệu lực'>('Còn hiệu lực');
  const [scope, setScope] = useState<DataScope>('commune_internal'); // Default Internal!
  const [status, setStatus] = useState<DocumentStatus>('published');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [notifyUsers, setNotifyUsers] = useState(true);

  // Procedure specific fields
  const [field, setField] = useState('Hộ tịch - Tư pháp');
  const [resolutionDuration, setResolutionDuration] = useState('02 ngày làm việc');
  const [fees, setFees] = useState('Miễn phí');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check duplicate number
    const dup = documents.find(
      (d) => d.docNumber.trim().toLowerCase() === docNumber.trim().toLowerCase()
    );
    if (dup) {
      setErrorMessage(`Số hiệu / Mã số "${docNumber}" đã tồn tại trên hệ thống.`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      addDocument(
        {
          category,
          docNumber,
          title,
          docType: category === 'procedure' ? 'Thủ tục hành chính' : docType,
          issuingAgency,
          issueDate,
          effectiveDate,
          validityStatus,
          scope,
          status,
          summary: summary || title,
          content: content || `Toàn văn văn bản ${title} ban hành ngày ${issueDate}...`,
          field: category === 'procedure' ? field : undefined,
          resolutionDuration: category === 'procedure' ? resolutionDuration : undefined,
          fees: category === 'procedure' ? fees : undefined,
        },
        notifyUsers
      );

      setIsProcessing(false);
      navigateTo(34);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(34)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Thêm Tài Liệu Mới (Màn 35)
            </h1>
            <p className="text-xs text-slate-500">
              Số hóa văn bản, thiết lập phạm vi hiển thị và tự động sinh vector AI cho xã
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo(34)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Hủy
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Choice: Policy vs Procedure */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Chọn loại tài liệu cần thêm *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCategory('policy')}
              className={`p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm text-left flex items-center gap-3 transition-all ${
                category === 'policy'
                  ? 'border-red-600 bg-red-50/50 text-red-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 text-red-600" />
              <div>
                <div>Văn bản chỉ đạo, điều hành</div>
                <div className="text-[11px] font-normal text-slate-500">Quyết định, kế hoạch, thông báo, quy chế</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategory('procedure')}
              className={`p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm text-left flex items-center gap-3 transition-all ${
                category === 'procedure'
                  ? 'border-red-600 bg-red-50/50 text-red-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Layers className="w-5 h-5 text-red-600" />
              <div>
                <div>Thủ tục hành chính (TTHC)</div>
                <div className="text-[11px] font-normal text-slate-500">Quy trình Một cửa, thành phần hồ sơ, lệ phí</div>
              </div>
            </button>
          </div>
        </div>

        {/* 2-Column Form Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {category === 'procedure' ? 'Mã số thủ tục hành chính *' : 'Số hiệu văn bản *'}
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder={category === 'procedure' ? 'TTHC-HL-01' : '12/KH-UBND'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {category === 'procedure' ? 'Tên thủ tục hành chính *' : 'Tên / Trích yếu văn bản *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên tiêu đề đầy đủ..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {category === 'policy' ? (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Loại văn bản *</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Kế hoạch">Kế hoạch</option>
                    <option value="Thông báo">Thông báo</option>
                    <option value="Quyết định">Quyết định</option>
                    <option value="Quy chế">Quy chế</option>
                    <option value="Báo cáo nội bộ">Báo cáo nội bộ</option>
                    <option value="Phương án nội bộ">Phương án nội bộ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Cơ quan ban hành *</label>
                  <input
                    type="text"
                    required
                    value={issuingAgency}
                    onChange={(e) => setIssuingAgency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Lĩnh vực chuyên môn *</label>
                  <select
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Hộ tịch - Tư pháp">Hộ tịch - Tư pháp</option>
                    <option value="Chứng thực - Tư pháp">Chứng thực - Tư pháp</option>
                    <option value="Địa chính - Xây dựng">Địa chính - Xây dựng</option>
                    <option value="Lao động - Thương binh & Xã hội">Lao động - Thương binh & Xã hội</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Thời hạn giải quyết *</label>
                  <input
                    type="text"
                    required
                    value={resolutionDuration}
                    onChange={(e) => setResolutionDuration(e.target.value)}
                    placeholder="Ví dụ: Trong ngày làm việc hoặc 02 ngày"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Ngày ban hành *</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Ngày có hiệu lực *</label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Scope Selection with Mandatory Warning (Screen 35 spec) */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Thiết lập phạm vi hiển thị (Mặc định: Nội bộ) *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs">
                <input
                  type="radio"
                  name="docScope"
                  value="commune_internal"
                  checked={scope === 'commune_internal'}
                  onChange={() => setScope('commune_internal')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="flex items-center gap-1 text-amber-900">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Nội bộ (Chỉ Cán bộ & Quản lý xã)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs">
                <input
                  type="radio"
                  name="docScope"
                  value="commune_public"
                  checked={scope === 'commune_public'}
                  onChange={() => setScope('commune_public')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1 text-emerald-900">
                  <Globe className="w-3.5 h-3.5 text-emerald-700" />
                  Công khai (Mọi tài khoản thuộc xã, gồm Người dân)
                </span>
              </label>
            </div>

            {/* Warning if Public selected */}
            {scope === 'commune_public' && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Cảnh báo:</strong> Mọi người dùng đăng nhập của xã, gồm Người dân, sẽ xem được tài liệu này và chatbot AI sẽ dùng nó để trả lời câu hỏi của người dân.
                </span>
              </div>
            )}
          </div>

          {/* Status & Notification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Trạng thái công bố *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300"
              >
                <option value="published">Đã công bố (Hiển thị ngay cho đối tượng được cấp quyền)</option>
                <option value="draft">Bản nháp (Chỉ Quản lý xã thấy)</option>
              </select>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyUsers}
                  onChange={(e) => setNotifyUsers(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Gửi thông báo tài liệu mới tới người nhận{' '}
                  <span className="text-slate-400 font-normal">
                    ({scope === 'commune_public' ? 'Mọi người dùng của xã' : 'Cán bộ & Quản lý xã'})
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* File Upload drag-and-drop */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Tệp văn bản gốc đính kèm (PDF, DOCX)
            </label>
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-red-400 text-center cursor-pointer bg-slate-50/50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-700 font-semibold">Bấm để tải lên hoặc kéo thả tệp văn bản</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Dung lượng tối đa: 20MB</p>
            </div>
          </div>

          {/* Full content */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Nội dung toàn văn văn bản số hóa (dùng để sinh vector RAG)
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập hoặc dán nội dung điều khoản văn bản..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-serif text-xs leading-relaxed"
            />
          </div>

          {/* Processing progress simulation */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>Đang lưu dữ liệu và bóc tách vector AI theo phân quyền...</span>
                <span>80%</span>
              </div>
              <div className="h-2 w-full bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 animate-pulse w-4/5"></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigateTo(34)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
            >
              {isProcessing ? 'Đang thêm tài liệu...' : 'Thêm tài liệu mới'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
