import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Lock,
  Unlock,
  KeyRound,
  UserCheck,
  Headphones,
  AlertTriangle,
  HardDrive,
  Users,
  Activity,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Edit2,
  X,
} from 'lucide-react';
import { Commune, User } from '../../types';

export const CommuneSysDetailScreen: React.FC = () => {
  const {
    screenParam,
    communes,
    users,
    documents,
    renewCommune,
    lockUnlockCommune,
    resetCommuneAdminPassword,
    transferCommuneAdmin,
    updateCommune,
    navigateTo,
  } = useApp();

  const commune = communes.find((c) => c.id === screenParam) || communes[0];
  const adminUser = users.find(
    (u) => u.communeId === commune?.id && u.role === 'commune_admin'
  );

  const [activeTab, setActiveTab] = useState<'info' | 'diagnostics'>('info');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showResetAdminModal, setShowResetAdminModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Renewal input
  const [newExpiryDate, setNewExpiryDate] = useState('2027-12-31');

  // Transfer input
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');

  if (!commune) return null;

  const handleRenew = () => {
    renewCommune(commune.id, newExpiryDate);
    setShowRenewModal(false);
    setActionNotice(`Đã gia hạn dịch vụ cho ${commune.name} đến ngày ${newExpiryDate}!`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleToggleLock = () => {
    lockUnlockCommune(commune.id);
    setShowLockModal(false);
    setActionNotice(
      commune.status === 'suspended'
        ? `Đã mở khóa dịch vụ cho ${commune.name}!`
        : `Đã tạm khóa dịch vụ cho ${commune.name}!`
    );
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleResetPassword = () => {
    const temp = resetCommuneAdminPassword(commune.id);
    setShowResetAdminModal(false);
    setActionNotice(
      `Đã cấp mật khẩu tạm: ${temp} và gửi thông báo tới quản lý xã!`
    );
    setTimeout(() => setActionNotice(''), 5000);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminPhone || !newAdminEmail) return;

    transferCommuneAdmin(commune.id, {
      fullName: newAdminName,
      phone: newAdminPhone,
      email: newAdminEmail,
    });
    setShowTransferModal(false);
    setActionNotice(
      `Đã chuyển giao quyền Quản lý xã sang đồng chí ${newAdminName} thành công!`
    );
    setTimeout(() => setActionNotice(''), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(48)}
            className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{commune.name}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                {commune.communeCode}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{commune.province}</p>
          </div>
        </div>

        {/* Action Buttons (Screen 50 spec) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowRenewModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
          >
            Gia hạn dịch vụ
          </button>

          <button
            onClick={() => setShowLockModal(true)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-colors ${
              commune.status === 'suspended'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                : 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900'
            }`}
          >
            {commune.status === 'suspended' ? 'Mở khóa xã' : 'Khóa dịch vụ'}
          </button>

          <button
            onClick={() => setShowResetAdminModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
          >
            Đặt lại MK Quản lý
          </button>

          <button
            onClick={() => setShowTransferModal(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Chuyển giao Quản lý (50)
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* STRICT SPEC: Fixed Privacy Notice (Section VII Screen 50) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-3">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Cam kết bảo mật bất biến:</strong> Đội phát triển không truy cập được dữ liệu cá nhân của người dùng (CCCD, SĐT) và nội dung văn bản của xã.
        </span>
      </div>

      {/* 2 Tabs: Thông tin tổng hợp vs Chẩn đoán kỹ thuật */}
      <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'info'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Thông tin dịch vụ & Quản trị
        </button>

        <button
          disabled={!commune.supportSessionActive}
          onClick={() => setActiveTab('diagnostics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            !commune.supportSessionActive
              ? 'opacity-40 cursor-not-allowed text-slate-500'
              : activeTab === 'diagnostics'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>
            Chẩn đoán kỹ thuật ẩn danh{' '}
            {!commune.supportSessionActive && '(Cần xã bật hỗ trợ)'}
          </span>
        </button>
      </div>

      {/* Tab 1: Info & Aggregated Stats */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* Quick Aggregated Numbers (Screen 50 spec: ONLY NUMBERS, NO NAMES!) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Số Cán bộ xã
              </span>
              <div className="text-2xl font-black text-white">{commune.officerCount}</div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Số Người dân đăng ký
              </span>
              <div className="text-2xl font-black text-white">{commune.citizenCount}</div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Văn bản đã xử lý
              </span>
              <div className="text-2xl font-black text-white">{commune.processedDocsCount}</div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Dung lượng kho vector
              </span>
              <div className="text-2xl font-black text-white">{commune.storageUsedMb} MB</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Commune Info */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Thông tin hợp đồng dịch vụ</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Gói bản quyền:</span>
                  <span className="font-semibold text-white">{commune.servicePlan}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Ngày kích hoạt:</span>
                  <span className="font-mono text-white">{commune.activatedAt}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Ngày hết hạn:</span>
                  <span className="font-mono font-bold text-amber-400">{commune.expiresAt}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Trụ sở UBND:</span>
                  <span className="text-white">{commune.address}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Điện thoại cơ quan:</span>
                  <span className="text-white font-mono">{commune.phone}</span>
                </div>
              </div>
            </div>

            {/* Commune Manager Contact Info */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span>Đại diện Quản lý xã (Liên hệ công vụ)</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Họ và tên người quản lý:</span>
                  <span className="font-bold text-white">{adminUser?.fullName || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Số điện thoại liên hệ:</span>
                  <span className="font-mono font-semibold text-white">{adminUser?.phone || commune.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Email nhận thông báo:</span>
                  <span className="font-medium text-white">{adminUser?.email || commune.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Lần đăng nhập gần nhất:</span>
                  <span className="text-slate-300">2026-09-29 14:02:18</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Session Status Card */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-purple-400" />
                <span>Trạng thái Phiên hỗ trợ kỹ thuật từ xã</span>
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  commune.supportSessionActive
                    ? 'bg-purple-950 text-purple-300 border border-purple-700'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {commune.supportSessionActive
                  ? `Đang mở (Còn ${commune.supportSessionHoursRemaining || 24} giờ)`
                  : 'Chưa được cấp quyền'}
              </span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {commune.supportSessionActive
                ? 'Xã đã chủ động bật quyền hỗ trợ. Bạn có thể mở tab "Chẩn đoán kỹ thuật ẩn danh" để kiểm tra mã lỗi và nhật ký hệ thống.'
                : 'Xã đang tắt phiên hỗ trợ. Đội phát triển không thể truy cập bất kỳ dữ liệu chẩn đoán kỹ thuật nào của xã này.'}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Chẩn đoán kỹ thuật ẩn danh (STRICT SPEC: Section VII Screen 50) */}
      {activeTab === 'diagnostics' && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Chẩn Đoán Kỹ Thuật Ẩn Danh (Mã Tài Liệu: DOC-xxxx)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lưu ý: Mọi lượt xem tại màn này được tự động ghi nhận vào Lịch sử truy cập của xã ở Màn 45.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              SESSION ACTIVE
            </span>
          </div>

          {/* Anonymous Error Logs Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Bảng mã lỗi xử lý tệp văn bản (Đã ẩn danh hóa)
            </h4>
            <div className="border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Mã tài liệu ẩn danh</th>
                    <th className="px-4 py-3">Mã lỗi kỹ thuật (Error Stack)</th>
                    <th className="px-4 py-3">Thời gian ghi nhận</th>
                    <th className="px-4 py-3">Trạng thái kho vector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-purple-400">DOC-3K90</td>
                    <td className="px-4 py-3 font-mono text-rose-300">
                      ERR_OCR_CORRUPT_PAGE_4 (Multi-column OCR timeout)
                    </td>
                    <td className="px-4 py-3 text-slate-400">2026-09-25 15:35:12</td>
                    <td className="px-4 py-3 text-amber-400 font-semibold">Chưa sinh vector (Đang chờ)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 leading-relaxed">
            Kỹ sư chẩn đoán: Bộ trích xuất PDF scan trang 4 của DOC-3K90 có độ phân giải thấp. Đã cập nhật tham số module Tesseract OCR 5.4 và giải phóng bộ đệm.
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-left space-y-4">
            <h3 className="text-base font-bold text-white">Gia Hạn Dịch Vụ Cho Xã</h3>
            <p className="text-xs text-slate-400">Chọn thời hạn hết hạn mới cho đơn vị {commune.name}:</p>
            <input
              type="date"
              value={newExpiryDate}
              onChange={(e) => setNewExpiryDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRenewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleRenew}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Xác nhận gia hạn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock/Unlock Modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-left space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-white text-center">
              {commune.status === 'suspended' ? 'Mở Khóa Dịch Vụ' : 'Khóa Tạm Ngưng Dịch Vụ'}
            </h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              {commune.status === 'suspended'
                ? `Sau khi mở khóa, người dùng của ${commune.name} có thể đăng nhập bình thường.`
                : `Cảnh báo: Toàn bộ người dùng thuộc ${commune.name} sẽ không thể đăng nhập (bị chuyển hướng sang Màn 59).`}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLockModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleToggleLock}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Admin Password Modal */}
      {showResetAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-left space-y-4">
            <KeyRound className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-white text-center">
              Đặt Lại Mật Khẩu Quản Lý Xã
            </h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Hệ thống sẽ sinh một mật khẩu tạm mới và gửi qua số điện thoại/email của người quản lý. Người này bắt buộc phải đổi mật khẩu ở lần đăng nhập tới.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetAdminModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Tạo mật khẩu tạm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Admin Modal (Screen 50 spec) */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4">
            <h3 className="text-base font-bold text-white">Chuyển Giao Quyền Quản Lý Xã</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tài khoản quản lý cũ sẽ bị hạ quyền thành cán bộ và vô hiệu hóa. Tài khoản mới sẽ được cấp quyền Quản lý xã và nhận mật khẩu tạm thời.
            </p>

            <form onSubmit={handleTransfer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Họ tên người quản lý mới *</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Ví dụ: Lê Văn Thắng"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  placeholder="0988xxxxxx"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email công tác *</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin_new@xatoi.gov.vn"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Xác nhận chuyển giao
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
