import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserPlus,
  Building,
  Shield,
  Upload,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Lock,
} from 'lucide-react';
import { OtpModal } from './OtpModal';

export const RegisterScreen: React.FC = () => {
  const { communes, users, navigateTo } = useApp();

  const [accountType, setAccountType] = useState<'citizen' | 'officer'>('citizen');
  const [fullName, setFullName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [dob, setDob] = useState('1995-01-01');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [selectedProvince, setSelectedProvince] = useState('TP. Hà Nội');
  const [selectedCommuneId, setSelectedCommuneId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Officer specific fields
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [proofFileName, setProofFileName] = useState('');

  // Agreement
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Filter communes: ONLY active and valid communes can be registered (Part I Principle 4)
  const validCommunes = communes.filter(
    (c) => c.province === selectedProvince && (c.status === 'active' || c.status === 'expiring')
  );

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'Chưa nhập', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, text: 'Yếu', color: 'bg-rose-500' };
      case 2:
        return { score: 50, text: 'Trung bình', color: 'bg-amber-500' };
      case 3:
        return { score: 75, text: 'Khá mạnh', color: 'bg-blue-500' };
      case 4:
        return { score: 100, text: 'Rất mạnh', color: 'bg-emerald-500' };
      default:
        return { score: 10, text: 'Rất yếu', color: 'bg-rose-400' };
    }
  };

  const pwdStrength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProvince) {
      setErrorMessage('Vui lòng chọn Tỉnh/Thành phố trước.');
      return;
    }

    if (!selectedCommuneId) {
      setErrorMessage('Vui lòng chọn Xã/Phường đã mua dịch vụ.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    // Check duplicate phone or email
    const duplicate = users.find((u) => u.phone === phone || u.email === email);
    if (duplicate) {
      setErrorMessage('Số điện thoại hoặc email này đã được đăng ký trong hệ thống.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Bạn phải đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }

    // Passed initial validation -> Open OTP Modal (Screen 11)
    setShowOtpModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Đăng Ký Tài Khoản AI Cấp Xã (Màn 10)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hệ thống nhận diện người dùng và tự động gắn kết với không gian dữ liệu xã của bạn
          </p>
        </div>

        {/* Role Switcher Button (Người dân / Cán bộ) */}
        <div className="flex p-1.5 rounded-2xl bg-slate-100 mb-8 border border-slate-200">
          <button
            type="button"
            onClick={() => setAccountType('citizen')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              accountType === 'citizen'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Người Dân Cư Trú
          </button>
          <button
            type="button"
            onClick={() => setAccountType('officer')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              accountType === 'officer'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Cán Bộ, Công Chức Xã
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left text-xs sm:text-sm">
          {/* Row 1: Full name & CCCD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Họ và tên *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Số Căn cước công dân (12 số) *</label>
              <input
                type="text"
                required
                maxLength={12}
                value={idCard}
                onChange={(e) => setIdCard(e.target.value.replace(/\D/g, ''))}
                placeholder="001095007744"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Row 2: DOB & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Ngày tháng năm sinh *</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Giới tính *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Row 3: Province & Commune Selection (STRICT SPEC) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Tỉnh / Thành phố *</label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedCommuneId('');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              >
                <option value="TP. Hà Nội">TP. Hà Nội</option>
                <option value="Tỉnh Hà Giang">Tỉnh Hà Giang</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Xã / Phường trực thuộc *</label>
              <select
                required
                disabled={!selectedProvince}
                value={selectedCommuneId}
                onChange={(e) => setSelectedCommuneId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden disabled:bg-slate-100"
              >
                <option value="">-- Chọn xã đã kích hoạt dịch vụ --</option>
                {validCommunes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.communeCode})
                  </option>
                ))}
              </select>
              {/* Hint text specified in Screen 10 */}
              <p className="text-[11px] text-slate-500 mt-1">
                Không thấy xã của bạn? Xã chưa sử dụng dịch vụ, vui lòng{' '}
                <button
                  type="button"
                  onClick={() => navigateTo(3)}
                  className="text-red-600 font-bold hover:underline"
                >
                  liên hệ đội phát triển (3)
                </button>
                .
              </p>
            </div>
          </div>

          {/* Row 4: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Số điện thoại *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Địa chỉ Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Officer specific fields */}
          {accountType === 'officer' && (
            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200/80 space-y-4">
              <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-red-600" />
                <span>Thông tin nghiệp vụ cán bộ (Cần Quản lý xã xét duyệt)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức vụ *</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Ví dụ: Công chức Tư pháp - Hộ tịch"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn vị công tác *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ví dụ: Bộ phận Một cửa UBND xã"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Giấy tờ minh chứng (Quyết định tuyển dụng / Thẻ công chức / Hợp đồng)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setProofFileName('quyet-dinh-cong-tac-can-bo.pdf')}
                    className="px-3.5 py-2 rounded-xl border border-dashed border-red-300 bg-white hover:bg-red-50 text-red-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{proofFileName ? 'Đã tải lên tệp' : 'Chọn tệp đính kèm (PDF, JPG)'}</span>
                  </button>
                  {proofFileName && (
                    <span className="text-xs text-emerald-700 font-mono font-medium">
                      ✓ {proofFileName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Row 5: Password & Confirm & Strength bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700">Mật khẩu *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Ẩn' : 'Hiện'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
              {/* Password strength bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                      style={{ width: `${pwdStrength.score}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-right font-semibold text-slate-500">
                    Độ mạnh: {pwdStrength.text}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                Tôi đồng ý với{' '}
                <button
                  type="button"
                  onClick={() => navigateTo(8)}
                  className="font-bold text-red-600 hover:underline"
                >
                  Điều khoản sử dụng (8)
                </button>{' '}
                và{' '}
                <button
                  type="button"
                  onClick={() => navigateTo(9)}
                  className="font-bold text-red-600 hover:underline"
                >
                  Chính sách bảo mật (9)
                </button>{' '}
                của nền tảng AI Cấp Xã.
              </span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!agreedTerms}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Tiến hành đăng ký</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <span className="text-slate-500 text-xs">Đã có tài khoản? </span>
            <button
              type="button"
              onClick={() => navigateTo(13)}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Đăng nhập tại đây (13)
            </button>
          </div>
        </form>
      </div>

      {/* OTP Verification Modal (Screen 11) */}
      {showOtpModal && (
        <OtpModal
          phone={phone}
          email={email}
          onSuccess={() => {
            setShowOtpModal(false);
            navigateTo(12, accountType); // Navigate to Screen 12 (Result)
          }}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </div>
  );
};
