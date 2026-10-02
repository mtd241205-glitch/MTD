import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Clock,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Send,
  CheckCircle2,
  Lock,
  Headphones,
  HardDrive,
  Check,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { SupportRequest } from '../../types';

export const ServiceInfoScreen: React.FC = () => {
  const {
    currentCommune,
    documents,
    reprocessDoc,
    toggleSupportSession,
    submitSupportRequest,
    currentUser,
  } = useApp();

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportDuration, setSupportDuration] = useState<'24h' | '3d' | '7d'>('24h');
  const [actionNotice, setActionNotice] = useState('');

  // Support request form state inside modal
  const [requestType, setRequestType] = useState<SupportRequest['type']>('technical_issue');
  const [selectedErrorDoc, setSelectedErrorDoc] = useState('DOC-3K90');
  const [requestDesc, setRequestDesc] = useState('');
  const [autoEnableSession, setAutoEnableSession] = useState(true);

  if (!currentCommune) return null;

  // Documents with processing errors
  const errorDocs = documents.filter(
    (d) => d.communeId === currentCommune.id && d.status === 'processing_error'
  );

  const handleToggleSession = (active: boolean) => {
    toggleSupportSession(currentCommune.id, supportDuration, active);
    setActionNotice(
      active
        ? `Đã kích hoạt phiên hỗ trợ kỹ thuật (${supportDuration}) cho Đội phát triển!`
        : 'Đã thu hồi ngay quyền hỗ trợ kỹ thuật của Đội phát triển!'
    );
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleSendSupportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestDesc.trim()) return;

    submitSupportRequest({
      type: requestType,
      communeName: currentCommune.name,
      senderName: currentUser?.fullName,
      senderContact: currentUser?.phone,
      anonDocId: requestType === 'technical_issue' ? selectedErrorDoc : undefined,
      errorCode: requestType === 'technical_issue' ? 'ERR_OCR_SCAN_PARSE' : undefined,
      content: requestDesc.trim(),
      techSupportSessionActive: autoEnableSession,
    });

    if (autoEnableSession) {
      toggleSupportSession(currentCommune.id, '24h', true);
    }

    setShowSupportModal(false);
    setRequestDesc('');
    setActionNotice('Yêu cầu hỗ trợ đã được gửi tới Đội phát triển (Màn 51)!');
    setTimeout(() => setActionNotice(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Khu vực Quản trị xã (Màn 45)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Thông Tin Dịch Vụ & Hỗ Trợ Kỹ Thuật
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quản lý thời hạn gói dịch vụ, tình trạng xử lý dữ liệu và kiểm soát quyền hỗ trợ kỹ thuật của đội phát triển
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Card 1: Service Info & Expiration (Screen 45 spec) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Gói dịch vụ AI đang sử dụng
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{currentCommune.servicePlan}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                currentCommune.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentCommune.status === 'expiring'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {currentCommune.status === 'active'
                ? 'Đang hoạt động'
                : currentCommune.status === 'expiring'
                ? 'Sắp hết hạn'
                : 'Đã hết hạn'}
            </span>

            <button
              onClick={() => setShowSupportModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi yêu cầu gia hạn / hỗ trợ</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Ngày kích hoạt:</span>
            <span className="font-semibold text-slate-800">{currentCommune.activatedAt}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Ngày hết hạn dịch vụ:</span>
            <span className="font-bold text-red-600 text-sm font-mono">{currentCommune.expiresAt}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Số tài khoản đăng ký:</span>
            <span className="font-semibold text-slate-800">{currentCommune.userCount} tài khoản</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Dung lượng kho tri thức:</span>
            <span className="font-semibold text-slate-800">
              {currentCommune.storageUsedMb} MB / {currentCommune.storageTotalMb} MB
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Service Health & Error Docs Table (Screen 45 spec) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-red-600" />
          <span>Tình trạng xử lý dữ liệu & Bóc tách văn bản</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-slate-500 font-medium block mb-1">Tài liệu đã số hóa thành công:</span>
            <span className="text-2xl font-black text-emerald-800">
              {currentCommune.processedDocsCount} tệp
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-rose-700 font-medium block mb-1">Tài liệu gặp lỗi xử lý kỹ thuật:</span>
            <span className="text-2xl font-black text-rose-700">
              {errorDocs.length} tệp
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium block mb-1">Lần đồng bộ hóa gần nhất:</span>
            <span className="text-sm font-bold text-slate-800">Hôm nay, 14:20</span>
          </div>
        </div>

        {/* Error docs list with Anonymous Code DOC-xxxx */}
        {errorDocs.length > 0 && (
          <div className="mt-4 border border-rose-200 rounded-2xl overflow-hidden">
            <div className="p-3 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs font-bold text-rose-900">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Danh sách tài liệu lỗi (Hiển thị mã ẩn danh phục vụ khắc phục)</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500">Tên văn bản chi tiết xem tại Quản lý dữ liệu (34)</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Mã tài liệu ẩn danh</th>
                  <th className="px-4 py-3">Chi tiết lỗi kỹ thuật</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {errorDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-rose-700">{doc.anonCode}</td>
                    <td className="px-4 py-3 text-slate-700">{doc.errorDetail || 'Lỗi bóc tách định dạng OCR'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => reprocessDoc(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                      >
                        Xử lý lại
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Card 3: Technical Support Permission (STRICT SPEC: Section 45 & Part I) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Quyền Hỗ Trợ Kỹ Thuật (Ủy Quyền Cho Đội Phát Triển)
              </h3>
              <p className="text-xs text-slate-500">
                Quản lý xã chủ động kích hoạt và thu hồi phiên hỗ trợ bất cứ lúc nào
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentCommune.supportSessionActive ? (
              <button
                onClick={() => handleToggleSession(false)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Thu hồi quyền ngay</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={supportDuration}
                  onChange={(e) => setSupportDuration(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  <option value="24h">Thời hạn 24 giờ</option>
                  <option value="3d">Thời hạn 3 ngày</option>
                  <option value="7d">Thời hạn 7 ngày</option>
                </select>
                <button
                  onClick={() => handleToggleSession(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Bật phiên hỗ trợ</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Current status callout */}
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between ${
            currentCommune.supportSessionActive
              ? 'bg-purple-50 border-purple-300 text-purple-900'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                currentCommune.supportSessionActive ? 'bg-purple-600 animate-ping' : 'bg-slate-400'
              }`}
            ></span>
            <span>
              Trạng thái hiện tại:{' '}
              <strong className="font-bold">
                {currentCommune.supportSessionActive
                  ? `ĐANG BẬT (Còn ${currentCommune.supportSessionHoursRemaining || 24} giờ)`
                  : 'ĐANG TẮT'}
              </strong>
            </span>
          </div>

          <span className="text-xs text-slate-500">
            {currentCommune.supportSessionActive
              ? `Hết hạn lúc: ${currentCommune.supportSessionExpiresAt || '24h sau khi bật'}`
              : 'Đội phát triển không thể truy cập chẩn đoán'}
          </span>
        </div>

        {/* Scope Note (STRICT SPEC: Part I Principle 8 & Screen 45) */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
          <strong>Phạm vi ủy quyền kỹ thuật:</strong> Khi bật phiên hỗ trợ, kỹ sư Đội phát triển chỉ được xem mã lỗi kỹ thuật ẩn danh (mã lỗi OCR, ID tài liệu ẩn danh) và nhật ký lỗi hệ thống để khắc phục sự cố. Đội phát triển <strong>tuyệt đối không xem dữ liệu cá nhân (CCCD, SĐT, danh sách người dân) hay nội dung tài liệu của xã</strong>.
        </div>

        {/* Access History Table (Screen 45 spec) */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Lịch sử truy cập hỗ trợ của Đội phát triển
          </h4>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Thời gian</th>
                  <th className="px-4 py-2.5">Tài khoản kỹ sư</th>
                  <th className="px-4 py-2.5">Hành động chẩn đoán</th>
                  <th className="px-4 py-2.5">Lý do truy cập</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentCommune.supportSessionAccessLog && currentCommune.supportSessionAccessLog.length > 0 ? (
                  currentCommune.supportSessionAccessLog.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{log.adminEmail}</td>
                      <td className="px-4 py-2.5 text-slate-800">{log.action}</td>
                      <td className="px-4 py-2.5 text-slate-600">{log.reason}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Chưa có lượt truy cập hỗ trợ kỹ thuật nào từ Đội phát triển
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Gửi yêu cầu gia hạn / hỗ trợ (Screen 45 spec) */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Gửi Yêu Cầu Hỗ Trợ Tới Đội Phát Triển
                </h3>
                <p className="text-xs text-slate-500">Tiếp nhận tại Bảng điều khiển quản trị hệ thống (Màn 51)</p>
              </div>
            </div>

            <form onSubmit={handleSendSupportRequest} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại yêu cầu *</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                >
                  <option value="technical_issue">Sự cố kỹ thuật (Lỗi xử lý file, lỗi mã hóa)</option>
                  <option value="renewal">Gia hạn thời hạn gói dịch vụ xã</option>
                  <option value="password_reset">Cấp lại mật khẩu Quản lý xã</option>
                  <option value="other">Hỗ trợ nghiệp vụ khác</option>
                </select>
              </div>

              {requestType === 'technical_issue' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã tài liệu ẩn danh bị sự cố</label>
                  <select
                    value={selectedErrorDoc}
                    onChange={(e) => setSelectedErrorDoc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  >
                    <option value="DOC-3K90">DOC-3K90 (Lỗi OCR trang 4)</option>
                    <option value="OTHER_CODE">Mã sự cố hệ thống khác</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả chi tiết yêu cầu *</label>
                <textarea
                  rows={4}
                  required
                  value={requestDesc}
                  onChange={(e) => setRequestDesc(e.target.value)}
                  placeholder="Ghi rõ tình trạng sự cố, nhu cầu gia hạn hoặc đề nghị kỹ thuật..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Auto enable session checkbox (Screen 45 spec) */}
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-purple-900 text-xs">
                  <input
                    type="checkbox"
                    checked={autoEnableSession}
                    onChange={(e) => setAutoEnableSession(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Đồng thời bật Phiên hỗ trợ kỹ thuật 24 giờ cho Đội phát triển</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi yêu cầu tới Đội phát triển (51)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
