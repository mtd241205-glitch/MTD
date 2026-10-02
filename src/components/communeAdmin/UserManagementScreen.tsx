import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Check,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Eye,
  Lock,
} from 'lucide-react';
import { User } from '../../types';
import { PendingOfficerPanel } from './PendingOfficerPanel';

export const UserManagementScreen: React.FC = () => {
  const {
    users,
    currentUser,
    approveOfficer,
    rejectOfficer,
    deleteUser,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'commune_users'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'officer' | 'citizen'>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [viewingPendingUser, setViewingPendingUser] = useState<User | null>(null);

  // Commune users (excluding the manager themself)
  const communeUsers = users.filter(
    (u) => u.communeId === currentUser?.communeId && u.id !== currentUser?.id
  );

  const pendingOfficers = communeUsers.filter(
    (u) => u.role === 'officer' && u.status === 'pending'
  );

  const activeOrLockedUsers = communeUsers.filter((u) => u.status !== 'pending');

  const filteredUsers = activeOrLockedUsers.filter((u) => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (!u.fullName.toLowerCase().includes(term) && !u.phone.includes(term) && !u.email.toLowerCase().includes(term)) {
        return false;
      }
    }
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedUserIds.length} người dùng đã chọn?`)) {
      selectedUserIds.forEach((id) => deleteUser(id));
      setSelectedUserIds([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Khu vực Quản trị xã (Màn 30)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Quản Lý Người Dùng Của Xã
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Xét duyệt hồ sơ cán bộ công chức cơ sở và quản lý danh sách công dân trực thuộc xã
          </p>
        </div>

        {/* Tab Switcher (Screen 30 spec) */}
        <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Cán bộ chờ duyệt</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                pendingOfficers.length > 0 ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {pendingOfficers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('commune_users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'commune_users'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Người dùng của xã ({activeOrLockedUsers.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Cán bộ Chờ duyệt */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Danh sách tài khoản cán bộ mới đăng ký cần xét duyệt ({pendingOfficers.length})
            </span>
            <span className="text-slate-500 text-[11px]">Bấm vào dòng để xem chi tiết hồ sơ & giấy tờ minh chứng</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Họ và tên</th>
                  <th className="px-4 py-3.5">Chức vụ đề nghị</th>
                  <th className="px-4 py-3.5">Đơn vị công tác</th>
                  <th className="px-4 py-3.5">Số điện thoại</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Ngày đăng ký</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingOfficers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="font-medium text-sm text-slate-700">Không có hồ sơ nào đang chờ duyệt</p>
                      <p className="text-xs text-slate-400 mt-1">Khi có cán bộ mới đăng ký, thông tin sẽ xuất hiện tại đây</p>
                    </td>
                  </tr>
                ) : (
                  pendingOfficers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setViewingPendingUser(user)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5 font-bold text-slate-900 group-hover:text-red-600">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">{user.position}</td>
                      <td className="px-4 py-3.5 text-slate-600">{user.department}</td>
                      <td className="px-4 py-3.5 text-slate-600 font-mono">{user.phone}</td>
                      <td className="px-4 py-3.5 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{user.registeredAt}</td>
                      <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => approveOfficer(user.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Nhập lý do từ chối hồ sơ cán bộ:') || 'Thông tin chức vụ chưa chính xác';
                            rejectOfficer(user.id, reason);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-rose-300 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors"
                        >
                          Từ chối
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Người dùng của xã */}
      {activeTab === 'commune_users' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo họ tên, số điện thoại, email..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="officer">Cán bộ xã</option>
                <option value="citizen">Người dân</option>
              </select>

              {selectedUserIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa ({selectedUserIds.length}) người dùng</span>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3.5">Họ và tên</th>
                    <th className="px-4 py-3.5">Loại tài khoản</th>
                    <th className="px-4 py-3.5">Số điện thoại</th>
                    <th className="px-4 py-3.5">Giới tính</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Ngày đăng ký</th>
                    <th className="px-4 py-3.5">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => navigateTo(32, user.id)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => toggleSelectUser(user.id)}
                            className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 group-hover:text-amber-700">
                          {user.fullName}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              user.role === 'officer'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {user.role === 'officer' ? 'Cán bộ' : 'Người dân'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 font-mono whitespace-nowrap">{user.phone}</td>
                        <td className="px-4 py-3.5 text-slate-600">{user.gender}</td>
                        <td className="px-4 py-3.5 text-slate-600">{user.email}</td>
                        <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{user.registeredAt}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                              user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : user.status === 'locked'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {user.status === 'active'
                              ? 'Hoạt động'
                              : user.status === 'locked'
                              ? 'Tạm khóa'
                              : 'Từ chối'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Screen 31: Pending Officer Detail Panel */}
      {viewingPendingUser && (
        <PendingOfficerPanel
          user={viewingPendingUser}
          onClose={() => setViewingPendingUser(null)}
          onApprove={(id) => {
            approveOfficer(id);
            setViewingPendingUser(null);
          }}
          onReject={(id, reason) => {
            rejectOfficer(id, reason);
            setViewingPendingUser(null);
          }}
        />
      )}
    </div>
  );
};
