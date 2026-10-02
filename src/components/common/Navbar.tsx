import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Landmark,
  Bot,
  FileText,
  BookOpen,
  ClipboardList,
  PhoneCall,
  Home,
  Info,
  Bell,
  LogIn,
  UserPlus,
  AlertCircle,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { AccountMenu } from './AccountMenu';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    currentUser,
    currentRole,
    currentCommune,
    getUnreadNotificationCount,
  } = useApp();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadNotificationCount();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Trang chủ', screen: 1, icon: Home, visible: true },
    { label: 'Giới thiệu', screen: 2, icon: Info, visible: true },
    {
      label: 'Chatbot AI',
      screen: 22,
      icon: Bot,
      visible: true,
      onClick: () => {
        if (currentRole === 'guest') {
          navigateTo(13, 'redirect_to_22');
        } else {
          navigateTo(22);
        }
      },
    },
    {
      label: 'AI tài liệu',
      screen: 26,
      icon: Sparkles,
      // Only Officer and Commune Admin see AI tài liệu
      visible: currentRole === 'officer' || currentRole === 'commune_admin',
      onClick: () => {
        if (currentRole === 'guest') {
          navigateTo(13, 'redirect_to_26');
        } else {
          navigateTo(26);
        }
      },
    },
    { label: 'Văn bản chính sách', screen: 4, icon: BookOpen, visible: true },
    { label: 'Thủ tục hành chính', screen: 6, icon: ClipboardList, visible: true },
    { label: 'Liên hệ', screen: 3, icon: PhoneCall, visible: true },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      {/* Expiry Warning Banner for Commune Manager if service is expiring */}
      {currentRole === 'commune_admin' && currentCommune?.status === 'expiring' && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 shrink-0 text-slate-950" />
            <span>
              <strong>Cảnh báo thời hạn:</strong> Dịch vụ AI Cấp Xã của {currentCommune.name} sẽ hết hạn vào ngày{' '}
              {currentCommune.expiresAt} (còn dưới 7 ngày). Vui lòng gửi yêu cầu gia hạn để tránh gián đoạn dịch vụ.
            </span>
            <button
              onClick={() => navigateTo(45)}
              className="ml-auto underline font-bold hover:text-black shrink-0"
            >
              Xem chi tiết dịch vụ &rarr;
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Commune Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo(1)}
              className="flex items-center gap-2.5 text-left group transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-all">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">AI CẤP XÃ</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                    Chính quyền số
                  </span>
                </div>
                {currentUser && currentCommune ? (
                  <p className="text-xs font-semibold text-emerald-700 truncate max-w-[200px] sm:max-w-xs">
                    {currentCommune.name} • {currentCommune.province}
                  </p>
                ) : (
                  <p className="text-xs text-slate-600 truncate">Hệ thống trợ lý hành chính & công dân</p>
                )}
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems
              .filter((item) => item.visible)
              .map((item) => {
                const isActive = currentScreen === item.screen;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => (item.onClick ? item.onClick() : navigateTo(item.screen))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-bold border-b-2 border-red-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-600'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                {/* Notification Bell (Screen 20) */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowAccountMenu(false);
                    }}
                    className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Thông báo"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Panel (20) Dropdown */}
                  {showNotifications && (
                    <NotificationDropdown onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                {/* Avatar & Account Dropdown (Screen 0.2) */}
                <div className="relative" ref={accountMenuRef}>
                  <button
                    onClick={() => {
                      setShowAccountMenu(!showAccountMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 ring-2 ring-red-500/20">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.fullName.charAt(0)
                      )}
                    </div>
                    <div className="hidden md:block text-left text-xs">
                      <div className="font-semibold text-slate-900 truncate max-w-[110px]">{currentUser.fullName}</div>
                      <div className="text-[11px] text-slate-600">
                        {currentRole === 'commune_admin'
                          ? 'Quản lý xã'
                          : currentRole === 'officer'
                          ? 'Cán bộ xã'
                          : currentRole === 'system_admin'
                          ? 'Đội phát triển'
                          : 'Người dân'}
                      </div>
                    </div>
                  </button>

                  {/* Panel (0.2) */}
                  {showAccountMenu && (
                    <AccountMenu
                      onClose={() => setShowAccountMenu(false)}
                      onLogoutRequest={() => {
                        setShowAccountMenu(false);
                        setShowLogoutConfirmModal(true);
                      }}
                    />
                  )}
                </div>
              </>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigateTo(13)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 border border-slate-300 shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Đăng nhập</span>
                </button>
                <button
                  onClick={() => navigateTo(10)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-300" />
                  <span>Đăng ký</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-1">
            {navItems
              .filter((item) => item.visible)
              .map((item) => {
                const isActive = currentScreen === item.screen;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item.onClick) item.onClick();
                      else navigateTo(item.screen);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận đăng xuất</h3>
            <p className="text-sm text-slate-600 mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không? Các phiên làm việc sẽ được lưu lại.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirmModal(false);
                  useApp().logout();
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
