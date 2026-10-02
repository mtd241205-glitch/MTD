import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Building2, UserPlus, Shield, AlertCircle, Check } from 'lucide-react';

export const AddCommuneScreen: React.FC = () => {
  const { createCommune, communes, users, navigateTo } = useApp();

  // Commune block fields
  const [name, setName] = useState('');
  const [province, setProvince] = useState('TP. Hà Nội');
  const [communeCode, setCommuneCode] = useState(`XA-${Math.floor(10000 + Math.random() * 90000)}`);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [servicePlan, setServicePlan] = useState('Gói Chuyển Đổi Số Toàn Diện Cấp Xã (Nâng cao)');
  const [activatedAt, setActivatedAt] = useState(new Date().toISOString().split('T')[0]);
  const [expiresAt, setExpiresAt] = useState('2027-12-31');

  // Commune Admin Account fields (STRICT SPEC: Exactly 1 Commune Manager per commune)
  const [adminFullName, setAdminFullName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminIdCard, setAdminIdCard] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check duplicate commune name in same province or duplicate communeCode
    const dupCommune = communes.find(
      (c) =>
        (c.province === province && c.name.toLowerCase() === name.trim().toLowerCase()) ||
        c.communeCode === communeCode.trim()
    );
    if (dupCommune) {
      setErrorMessage(`Xã "${name}" tại ${province} hoặc Mã xã "${communeCode}" đã tồn tại trên hệ thống.`);
      return;
    }

    // Check duplicate admin phone or email
    const dupUser = users.find((u) => u.phone === adminPhone.trim() || u.email === adminEmail.trim());
    if (dupUser) {
      setErrorMessage('Số điện thoại hoặc email của người quản lý đã được sử dụng.');
      return;
    }

    createCommune(
      {
        name: name.trim(),
        province,
        communeCode: communeCode.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        servicePlan,
        activatedAt,
        expiresAt,
      },
      {
        fullName: adminFullName.trim(),
        phone: adminPhone.trim(),
        email: adminEmail.trim(),
        idCard: adminIdCard.trim() || '001090123456',
      }
    );

    navigateTo(48);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(48)}
            className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">
              Khởi Tạo Xã Mới & Tài Khoản Quản Lý (Màn 49)
            </h1>
            <p className="text-xs text-slate-400">
              Cấp phát không gian dữ liệu độc lập và kho vector riêng biệt cho đơn vị cấp xã
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo(48)}
          className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white"
        >
          Hủy
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        {/* Block 1: Thông tin xã */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Khối 1: Thông tin đơn vị hành chính xã</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Tên Xã / Thị trấn *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Xã Thạch Hòa"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Tỉnh / Thành phố *</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="TP. Hà Nội">TP. Hà Nội</option>
                <option value="Tỉnh Hà Giang">Tỉnh Hà Giang</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Tỉnh Bắc Ninh">Tỉnh Bắc Ninh</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Mã đơn vị xã (Hệ thống) *</label>
              <input
                type="text"
                required
                value={communeCode}
                onChange={(e) => setCommuneCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Gói dịch vụ kích hoạt *</label>
              <select
                value={servicePlan}
                onChange={(e) => setServicePlan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option value="Gói Chuyển Đổi Số Toàn Diện Cấp Xã (Nâng cao)">Gói Nâng cao (Toàn diện)</option>
                <option value="Gói Tiêu Chuẩn Cấp Xã">Gói Tiêu Chuẩn</option>
                <option value="Gói Thử Nghiệm Số">Gói Thử Nghiệm (6 tháng)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Địa chỉ trụ sở UBND *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Thôn 1, Xã..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Điện thoại cơ quan *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="024.3368.xxxx"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Ngày kích hoạt *</label>
              <input
                type="date"
                required
                value={activatedAt}
                onChange={(e) => setActivatedAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Ngày hết hạn dịch vụ *</label>
              <input
                type="date"
                required
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Block 2: Tài khoản Quản lý xã (Screen 49 spec: Exactly ONE manager) */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserPlus className="w-4 h-4 text-purple-400" />
            <span>Khối 2: Thiết lập tài khoản Quản lý xã (Duy nhất 01 tài khoản)</span>
          </h3>

          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-purple-200 text-xs">
            Hệ thống sẽ tự động tạo mật khẩu tạm thời và gửi cho Người quản lý xã. Người này bắt buộc phải đổi mật khẩu ở lần đăng nhập đầu tiên (Màn 16).
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Họ và tên người quản lý *</label>
              <input
                type="text"
                required
                value={adminFullName}
                onChange={(e) => setAdminFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn Chủ Tịch"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Số Căn cước công dân (12 số)</label>
              <input
                type="text"
                maxLength={12}
                value={adminIdCard}
                onChange={(e) => setAdminIdCard(e.target.value)}
                placeholder="001085002341"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Số điện thoại liên hệ *</label>
              <input
                type="tel"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="0988112233"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Email công vụ nhận mật khẩu *</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin_xatoi@hanoi.gov.vn"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigateTo(48)}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-800"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Tạo xã và cấp tài khoản Quản lý</span>
          </button>
        </div>
      </form>
    </div>
  );
};
