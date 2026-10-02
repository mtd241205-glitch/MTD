import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  KeyRound,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Building,
  Calendar,
  Phone,
  Mail,
  CreditCard,
} from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';
import { DeleteAccountModal } from './DeleteAccountModal';
import { OtpModal } from './OtpModal';

export const ProfileScreen: React.FC = () => {
  const { currentUser, currentRole, currentCommune, updateUserProfile } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [dob, setDob] = useState(currentUser?.dob || '1995-10-10');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>(currentUser?.gender || 'Nam');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  if (!currentUser) return null;

  // Masked CCCD: e.g. 0010****7744
  const maskIdCard = (id: string) => {
    if (!id || id.length < 8) return id;
    return `${id.slice(0, 4)}****${id.slice(-4)}`;
  };

  const handleSave = () => {
    // If phone or email changed -> trigger OTP Modal (11) as required by Screen 17 spec
    if (phone !== currentUser.phone || email !== currentUser.email) {
      setShowOtpModal(true);
      return;
    }

    updateUserProfile({
      fullName,
      dob,
      gender,
      phone,
      email,
    });
    setIsEditing(false);
    setSuccessNotice('Thông tin cá nhân đã được cập nhật thành công!');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const handleCancel = () => {
    setFullName(currentUser.fullName);
    setDob(currentUser.dob);
    setGender(currentUser.gender);
    setPhone(currentUser.phone);
    setEmail(currentUser.email);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-700 ring-4 ring-red-500/20 shadow-md">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              currentUser.fullName.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{currentUser.fullName}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                {currentRole === 'commune_admin'
                  ? 'Quản lý xã'
                  : currentRole === 'officer'
                  ? 'Cán bộ xã'
                  : currentRole === 'system_admin'
                  ? 'Đội phát triển'
                  : 'Người dân'}
              </span>
              {currentCommune && (
                <span className="text-xs text-slate-500 font-medium">
                  • {currentCommune.name}
                </span>
              )}
            </div>
            {currentUser.position && (
              <p className="text-xs text-slate-600 mt-1 font-medium">{currentUser.position} - {currentUser.department}</p>
            )}
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Chỉnh sửa thông tin</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span>✓ {successNotice}</span>
        </div>
      )}

      {/* Main Details Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-red-600" />
          <span>Hồ sơ định danh cá nhân (Màn 17)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Họ và tên
            </label>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-medium"
              />
            ) : (
              <div className="font-semibold text-slate-900">{currentUser.fullName}</div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Số Căn cước công dân (Bảo mật)
            </label>
            <div className="font-mono font-semibold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>{maskIdCard(currentUser.idCard)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Ngày sinh
            </label>
            {isEditing ? (
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-medium"
              />
            ) : (
              <div className="font-semibold text-slate-900">{currentUser.dob}</div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Giới tính
            </label>
            {isEditing ? (
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-medium"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <div className="font-semibold text-slate-900">{currentUser.gender}</div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Số điện thoại liên hệ
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-medium"
              />
            ) : (
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{currentUser.phone}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Địa chỉ Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-medium"
              />
            ) : (
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{currentUser.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Xã / Phường cư trú hoặc công tác
            </label>
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{currentCommune ? currentCommune.name : 'Chưa gắn kết'}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * Ô Xã cố định; muốn chuyển xã vui lòng liên hệ Quản lý xã.
            </p>
          </div>
        </div>
      </div>

      {/* Security Actions Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-600" />
          <span>Khu Vực Bảo Mật & Quản Trị Tài Khoản</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="font-bold text-sm text-slate-900">Mật khẩu đăng nhập</h4>
            <p className="text-xs text-slate-500">Định kỳ thay đổi mật khẩu để bảo vệ tài khoản</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <KeyRound className="w-4 h-4" />
            <span>Đổi mật khẩu (18)</span>
          </button>
        </div>

        {/* STRICT SPEC: Commune manager does NOT have delete account button! */}
        {currentRole !== 'commune_admin' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-rose-600">Xóa tài khoản vĩnh viễn</h4>
              <p className="text-xs text-slate-500">
                Hành động này sẽ xóa toàn bộ dữ liệu cá nhân của bạn khỏi hệ thống xã và không thể khôi phục
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-2 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa tài khoản (19)</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals 18 & 19 */}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}

      {/* OTP Modal if phone/email modified */}
      {showOtpModal && (
        <OtpModal
          phone={phone}
          email={email}
          onSuccess={() => {
            setShowOtpModal(false);
            updateUserProfile({
              fullName,
              dob,
              gender,
              phone,
              email,
            });
            setIsEditing(false);
            setSuccessNotice('Thông tin liên hệ đã được xác thực và cập nhật thành công!');
          }}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </div>
  );
};
