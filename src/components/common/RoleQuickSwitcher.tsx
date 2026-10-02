import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  UserCheck,
  Users,
  Eye,
  Settings,
  AlertTriangle,
  WifiOff,
  Clock,
  Server,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types';

export const RoleQuickSwitcher: React.FC = () => {
  const {
    currentRole,
    currentUser,
    switchRole,
    communes,
    isMaintenance,
    setIsMaintenance,
    isSessionExpired,
    setIsSessionExpired,
    isConnectionError,
    setIsConnectionError,
    navigateTo,
    currentScreen,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans print:hidden">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700/80 backdrop-blur-md transition-all hover:scale-105 cursor-pointer group"
          title="Chuyển đổi vai trò người dùng để thử nghiệm 59 màn hình"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 group-hover:text-white">
            Vai trò:
            <strong className="text-white ml-1 font-bold">
              {currentRole === 'guest'
                ? 'Khách'
                : currentRole === 'citizen'
                ? 'Người dân'
                : currentRole === 'officer'
                ? 'Cán bộ'
                : currentRole === 'commune_admin'
                ? 'Quản lý xã'
                : 'SysAdmin'}
            </strong>
          </span>
          <span className="text-[10px] text-amber-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
            Màn {currentScreen}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* Expanded Floating Control Card */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-slate-900/98 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                Trình Giả Lập Vai Trò (59 Màn)
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            <div>
              <div className="text-[11px] text-slate-400 mb-1.5 font-medium">Chọn vai trò kiểm thử:</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => switchRole('guest')}
                  className={`p-2 rounded-xl transition-all flex items-center gap-2 text-left ${
                    currentRole === 'guest'
                      ? 'bg-blue-600 text-white font-bold ring-1 ring-white/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Eye className="w-4 h-4 shrink-0 text-blue-400" />
                  <span className="truncate">Khách vãng lai</span>
                </button>

                <button
                  onClick={() => switchRole('citizen', 'user-hl-citizen')}
                  className={`p-2 rounded-xl transition-all flex items-center gap-2 text-left ${
                    currentRole === 'citizen'
                      ? 'bg-emerald-600 text-white font-bold ring-1 ring-white/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span className="truncate">Người dân (Hòa Lạc)</span>
                </button>

                <button
                  onClick={() => switchRole('officer', 'user-hl-officer1')}
                  className={`p-2 rounded-xl transition-all flex items-center gap-2 text-left ${
                    currentRole === 'officer'
                      ? 'bg-indigo-600 text-white font-bold ring-1 ring-white/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span className="truncate">Cán bộ Một cửa</span>
                </button>

                <button
                  onClick={() => switchRole('commune_admin', 'user-hl-admin')}
                  className={`p-2 rounded-xl transition-all flex items-center gap-2 text-left ${
                    currentRole === 'commune_admin'
                      ? 'bg-amber-600 text-white font-bold ring-1 ring-white/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="truncate">Quản lý xã (Hòa Lạc)</span>
                </button>
              </div>

              <button
                onClick={() => switchRole('system_admin', 'user-sysadmin')}
                className={`w-full mt-1.5 p-2 rounded-xl transition-all flex items-center justify-between text-left ${
                  currentRole === 'system_admin'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span>Quản trị hệ thống (Đội phát triển - Màn 47)</span>
                </span>
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded">SysAdmin</span>
              </button>
            </div>

            {/* Simulation states */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1.5 font-medium">Mô phỏng lỗi hệ thống:</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setIsMaintenance(!isMaintenance)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    isMaintenance ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Bảo trì (56)
                </button>
                <button
                  onClick={() => setIsSessionExpired(!isSessionExpired)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    isSessionExpired ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Hết phiên (57)
                </button>
                <button
                  onClick={() => setIsConnectionError(!isConnectionError)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    isConnectionError ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Mất mạng (58)
                </button>
              </div>
            </div>

            {/* Quick jump to screen */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Màn hiện tại: <strong className="text-amber-400 font-mono">#{currentScreen}</strong></span>
              <button
                onClick={() => {
                  navigateTo(1);
                  setIsOpen(false);
                }}
                className="text-white hover:underline font-semibold"
              >
                Về Trang chủ (1)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
