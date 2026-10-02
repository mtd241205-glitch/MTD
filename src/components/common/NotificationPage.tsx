import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, FileText, UserCheck, MessageSquare, AlertTriangle, ArrowLeft } from 'lucide-react';
import { AppNotification } from '../../types';

export const NotificationPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
    goBack,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

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

  const filteredNotifs = activeTab === 'all' ? visibleNotifs : visibleNotifs.filter((n) => !n.read);

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'approval':
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'feedback':
        return <MessageSquare className="w-5 h-5 text-amber-600" />;
      case 'service':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.targetScreen) {
      navigateTo(notif.targetScreen, notif.targetParam);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tất cả thông báo (Màn 21)</h1>
            <p className="text-sm text-slate-500">
              Quản lý các cập nhật văn bản, thông tin thủ tục và trạng thái yêu cầu
            </p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 flex items-center gap-1.5 transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Đánh dấu đã đọc tất cả</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Tất cả ({visibleNotifs.length})
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'unread'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Chưa đọc</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
            {visibleNotifs.filter((n) => !n.read).length}
          </span>
        </button>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Không có thông báo nào trong mục này</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 sm:p-5 transition-colors flex items-start gap-4 cursor-pointer hover:bg-slate-50 ${
                !notif.read ? 'bg-red-50/30' : 'bg-white'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                  {!notif.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-2">{notif.message}</p>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>{notif.createdAt}</span>
                  <span>•</span>
                  <span className="text-red-600 font-medium hover:underline">
                    Bấm để xem chi tiết &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
