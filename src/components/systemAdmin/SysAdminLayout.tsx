import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Building2,
  HelpCircle,
  Globe,
  Clock,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface SysAdminLayoutProps {
  children: React.ReactNode;
}

export const SysAdminLayout: React.FC<SysAdminLayoutProps> = ({ children }) => {
  const { currentScreen, navigateTo, logout, currentUser } = useApp();

  const menuItems = [
    { label: 'Tổng quan toàn hệ thống', screen: 47, icon: Activity },
    { label: 'Danh sách các xã', screen: 48, icon: Building2 },
    { label: 'Yêu cầu hỗ trợ từ xã', screen: 51, icon: HelpCircle },
    { label: 'Dữ liệu dùng chung', screen: 52, icon: Globe },
    { label: 'Nhật ký hệ thống', screen: 53, icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar for SysAdmin */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-[33px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">AI CẤP XÃ</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Dev Team Console
                </span>
              </div>
              <p className="text-xs text-slate-400">Trung tâm Điều hành & Quản trị Toàn quốc</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo(1)}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <span>Về Cổng Xã (1)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={logout}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-900/60 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Left Sidebar Menu */}
        <aside className="w-64 shrink-0 hidden md:block space-y-2">
          <div className="bg-slate-900 rounded-3xl p-3 border border-slate-800 space-y-1">
            {menuItems.map((item) => {
              const isActive = currentScreen === item.screen;
              const IconComp = item.icon;
              return (
                <button
                  key={item.screen}
                  onClick={() => navigateTo(item.screen)}
                  className={`w-full p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-2 text-left">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo vệ quyền riêng tư</span>
            </div>
            <p className="leading-relaxed">
              Toàn bộ dữ liệu tài liệu và thông tin cá nhân của người dân đã được cách ly hoàn toàn theo chuẩn an toàn quốc gia.
            </p>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
