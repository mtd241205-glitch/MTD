import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  FileText,
  UserCheck,
  MessageSquare,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const {
    notifications,
    currentUser,
    currentRole,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
  } = useApp();

  // Filter notifications visible to this user
  const visibleNotifs = notifications.filter((n) => {
    if (n.targetUserId && currentUser && n.targetUserId !== currentUser.id) return false;
    if (n.communeId && currentUser?.communeId && n.communeId !== currentUser.communeId) return false;
    if (n.targetRole && n.targetRole !== 'all') {
      if (!currentUser) return false;
      if (n.targetRole === 'commune_admin' && currentUser.role !== 'commune_admin') return false;
      if (n.targetRole === 'officer' && currentUser.role !== 'officer' && currentUser.role !== 'commune_admin') return false;
    }
    return true;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    onClose();
    if (notif.targetScreen) {
      navigateTo(notif.targetScreen, notif.targetParam);
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'approval':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'feedback':
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
      case 'service':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <h3 className="font-bold text-sm text-slate-900">Thông báo</h3>
          <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
            {visibleNotifs.filter((n) => !n.read).length} mới
          </span>
        </div>
        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Đã đọc tất cả
        </button>
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {visibleNotifs.length === 0 ? (
          <div className="py-10 text-center px-4">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">Bạn chưa có thông báo nào</p>
          </div>
        ) : (
          visibleNotifs.map((notif) => (
            <button
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                !notif.read ? 'bg-red-50/40' : 'bg-white'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                <div className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-1">
                  <span>{notif.createdAt}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <button
          onClick={() => {
            onClose();
            navigateTo(21);
          }}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center justify-center gap-1 mx-auto"
        >
          <span>Xem tất cả thông báo</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
