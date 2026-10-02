import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  KeyRound,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  CreditCard,
  Building,
} from 'lucide-react';
import { DeleteUserModal } from './DeleteUserModal';

export const UserDetailScreen: React.FC = () => {
  const {
    screenParam,
    users,
    lockUnlockUser,
    resetUserPassword,
    deleteUser,
    navigateTo,
  } = useApp();

  const user = users.find((u) => u.id === screenParam);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 text-sm">Không tìm thấy thông tin người dùng</p>
        <button
          onClick={() => navigateTo(30)}
          className="mt-3 text-red-600 font-bold text-xs hover:underline"
        >
          Quay lại danh sách (30)
        </button>
      </div>
    );
  }

  const handleResetPassword = () => {
    resetUserPassword(user.id);
    setActionNotice(
      `Đã tạo liên kết đặt lại mật khẩu và gửi mã xác thực tới SĐT ${user.phone} của người dùng!`
    );
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleToggleLock = () => {
    lockUnlockUser(user.id);
    setActionNotice(
      user.status === 'locked'
        ? `Đã mở khóa tài khoản cho ${user.fullName}!`
        : `Đã khóa tạm thời tài khoản của ${user.fullName}!`
    );
    setTimeout(() => setActionNotice(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(30)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Chi Tiết Người Dùng (Màn 32)
            </h1>
            <p className="text-xs text-slate-500">Góc nhìn quản lý nhân sự & tài khoản cấp xã</p>
          </div>
        </div>

        <button
          onClick={() => navigateTo(30)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Quay lại danh sách
        </button>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-xl text-slate-700 ring-4 ring-amber-500/20">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                user.fullName.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {user.role === 'officer' ? 'Cán bộ xã' : 'Người dân'}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    user.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : user.status === 'locked'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {user.status === 'active'
                    ? 'Đang hoạt động'
                    : user.status === 'locked'
                    ? 'Đã bị khóa'
                    : 'Chờ duyệt'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400 block mb-0.5 uppercase tracking-wider text-xs font-bold">
              Số Căn cước công dân
            </span>
            <span className="font-mono font-bold text-slate-900 text-base">{user.idCard}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 uppercase tracking-wider text-xs font-bold">
              Ngày sinh
            </span>
            <span className="font-semibold text-slate-800">{user.dob}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 uppercase tracking-wider text-xs font-bold">
              Giới tính
            </span>
            <span className="font-semibold text-slate-800">{user.gender}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 uppercase tracking-wider text-xs font-bold">
              Số điện thoại
            </span>
            <span className="font-mono font-semibold text-slate-900">{user.phone}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 uppercase tracking-wider text-xs font-bold">
              Địa chỉ Email
            </span>
            <span className="font-medium text-slate-900">{user.email}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 uppercase tracking-wider text-xs font-bold">
              Ngày đăng ký tài khoản
            </span>
            <span className="font-medium text-slate-700">{user.registeredAt}</span>
          </div>

          {user.position && (
            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Chức vụ & Đơn vị công tác:</span>
              <p className="font-bold text-slate-900">
                {user.position} - {user.department}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Action Control Box (Screen 32 spec) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Thao Tác Quản Trị Tài Khoản
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetPassword}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-slate-600" />
            <span>Đặt lại mật khẩu</span>
          </button>

          <button
            onClick={handleToggleLock}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
              user.status === 'locked'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'border border-amber-300 hover:bg-amber-50 text-amber-800'
            }`}
          >
            {user.status === 'locked' ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Mở khóa tài khoản</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Khóa tài khoản</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa người dùng (33)</span>
          </button>
        </div>
      </div>

      {/* Modal 33 */}
      {showDeleteModal && (
        <DeleteUserModal
          userCount={1}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deleteUser(user.id);
            setShowDeleteModal(false);
            navigateTo(30);
          }}
        />
      )}
    </div>
  );
};
