import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Users,
  Database,
  BarChart3,
  MessageSquare,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AccountMenuProps {
  onClose: () => void;
  onLogoutRequest: () => void;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ onClose, onLogoutRequest }) => {
  const { currentUser, currentRole, currentCommune, navigateTo } = useApp();

  if (!currentUser) return null;

  const roleName =
    currentRole === 'commune_admin'
      ? 'Quản lý xã'
      : currentRole === 'officer'
      ? 'Cán bộ xã'
      : currentRole === 'system_admin'
      ? 'Quản trị hệ thống (Đội phát triển)'
      : 'Người dân';

  const roleColor =
    currentRole === 'commune_admin'
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : currentRole === 'officer'
      ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
      : currentRole === 'system_admin'
      ? 'bg-purple-100 text-purple-800 border-purple-300'
      : 'bg-emerald-100 text-emerald-800 border-emerald-300';

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
      {/* Header Info */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 ring-2 ring-red-500/20 shrink-0">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              currentUser.fullName.charAt(0)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.fullName}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleColor}`}>
                {roleName}
              </span>
            </div>
            {currentCommune && (
              <p className="text-xs text-slate-600 truncate mt-1">
                {currentCommune.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="py-1">
        <button
          onClick={() => {
            navigateTo(17);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
            <span>Thông tin cá nhân</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
        </button>

        {/* Cán bộ / Quản lý xã specific links */}
        {(currentRole === 'officer' || currentRole === 'commune_admin') && (
          <button
            onClick={() => {
              navigateTo(26);
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
              <span>AI tài liệu chuyên môn</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
          </button>
        )}

        {/* Commune Manager Admin Section */}
        {currentRole === 'commune_admin' && (
          <div className="pt-1 mt-1 border-t border-slate-100">
            <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Khu Vực Quản Lý Xã
            </div>

            <button
              onClick={() => {
                navigateTo(30);
                onClose();
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                <span>Quản lý người dùng</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
            </button>

            <button
              onClick={() => {
                navigateTo(34);
                onClose();
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                <span>Quản lý dữ liệu</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
            </button>

            <button
              onClick={() => {
                navigateTo(41);
                onClose();
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                <span>Quản lý sử dụng</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
            </button>

            <button
              onClick={() => {
                navigateTo(44);
                onClose();
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                <span>Quản lý phản ánh</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
            </button>

            <button
              onClick={() => {
                navigateTo(45);
                onClose();
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                <span>Thông tin dịch vụ & Hỗ trợ</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
            </button>
          </div>
        )}

        {/* System Admin Link if SysAdmin is testing */}
        {currentRole === 'system_admin' && (
          <div className="pt-1 mt-1 border-t border-slate-100">
            <button
              onClick={() => {
                navigateTo(47);
                onClose();
              }}
              className="w-full px-4 py-2 text-left text-sm text-purple-700 hover:bg-purple-50 font-semibold flex items-center justify-between"
            >
              <span>Vào Bảng điều khiển Quản trị</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="pt-1 mt-1 border-t border-slate-100">
        <button
          onClick={onLogoutRequest}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};
