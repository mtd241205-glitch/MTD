import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Building,
  Headphones,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactScreen: React.FC = () => {
  const { currentUser, currentCommune, submitFeedback, navigateTo } = useApp();
  const { showToast } = useToast();

  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackContact, setFeedbackContact] = useState(
    currentUser?.phone || currentUser?.email || ''
  );
  const [feedbackName, setFeedbackName] = useState(currentUser?.fullName || '');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackContent.trim()) {
      setErrorMsg('Vui lòng nhập nội dung phản ánh, góp ý.');
      showToast('warning', 'Vui lòng nhập nội dung phản ánh, góp ý.');
      return;
    }
    if (!feedbackContact.trim()) {
      setErrorMsg('Vui lòng cung cấp số điện thoại hoặc email liên hệ.');
      showToast('warning', 'Vui lòng cung cấp số điện thoại hoặc email liên hệ.');
      return;
    }

    submitFeedback(feedbackContent, feedbackContact, feedbackName);
    setIsSuccess(true);
    setFeedbackContent('');
    setErrorMsg('');
    showToast('success', 'Gửi phản ánh thành công. Cảm ơn bạn đã đóng góp.');
  };

  return (
    <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 space-y-12">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Thông tin liên hệ & Đóng góp ý kiến (Màn 3)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          Liên Hệ & Tiếp Nhận Phản Ánh
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Kênh kết nối trực tiếp giữa nhân dân, cơ quan hành chính xã và đội ngũ kỹ thuật phát triển hệ thống
        </p>
      </div>

      {/* Top 2 Columns: Contact Blocks & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Blocks */}
        <div className="lg:col-span-6 space-y-6">
          {/* Dev Team Contact */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-blue-700 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Đội Ngũ Kỹ Thuật & Phát Triển Nền Tảng
                </h3>
                <p className="text-xs text-slate-500">Hỗ trợ vận hành hệ thống, giải pháp số hóa cấp xã</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Email kỹ thuật:{' '}
                  <a href="mailto:support@aicapxa.vn" className="font-semibold text-slate-900 hover:text-blue-600">
                    support@aicapxa.vn
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Hotline hỗ trợ:{' '}
                  <a href="tel:1900889988" className="font-semibold text-slate-900 hover:text-blue-600">
                    1900.88.99.88 (Nhánh 2)
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Thời gian hỗ trợ: 07h30 - 18h00 từ Thứ 2 đến Thứ 7</span>
              </div>
            </div>
          </div>

          {/* Commune Contact (When Logged in) */}
          {currentUser && currentCommune ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ủy Ban Nhân Dân {currentCommune.name}
                  </h3>
                  <p className="text-xs text-slate-500">{currentCommune.province}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Địa chỉ: <strong className="text-slate-900">{currentCommune.address}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Điện thoại Một cửa:{' '}
                    <a href={`tel:${currentCommune.phone}`} className="font-semibold text-slate-900 hover:text-blue-600">
                      {currentCommune.phone}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Email công vụ:{' '}
                    <a href={`mailto:${currentCommune.email}`} className="font-semibold text-slate-900 hover:text-blue-600">
                      {currentCommune.email}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Giờ tiếp công dân: 08h00 - 11h30, 13h30 - 17h00 (Thứ 2 - Thứ 6)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-slate-600 text-sm flex items-center justify-between shadow-2xs">
              <div>
                <p className="font-semibold text-slate-900">Bạn muốn xem thông tin liên hệ của xã mình?</p>
                <p className="text-xs text-slate-500 mt-1">Vui lòng đăng nhập vào tài khoản xã của bạn.</p>
              </div>
              <button
                onClick={() => navigateTo(13)}
                className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shrink-0 ml-3 cursor-pointer"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Map Simulation */}
        <div className="lg:col-span-6">
          <div className="bg-sky-50/60 rounded-3xl overflow-hidden border border-sky-100 h-[380px] relative shadow-inner flex flex-col items-center justify-center text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-600 mb-3">
              <MapPin className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">
              {currentCommune ? currentCommune.name : 'Trung Tâm Hành Chính Xã'}
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mb-4">
              {currentCommune
                ? currentCommune.address
                : 'Bản đồ trực quan vị trí địa lý UBND cấp xã và Bộ phận Một cửa'}
            </p>
            <div className="bg-white/95 backdrop-blur-xs px-4 py-2 rounded-xl text-xs font-mono text-slate-700 border border-slate-200 shadow-2xs">
              Tọa độ: 21.0125° B, 105.5264° Đ (Khu công nghệ cao Hòa Lạc)
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Feedback Form (Screen 3 spec) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs">
        <div className="max-w-2xl">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Hòm Thư Phản Ánh, Góp Ý Của Công Dân
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Ý kiến phản ánh của bạn sẽ được chuyển thẳng tới Ban Lãnh đạo UBND xã và cán bộ phụ trách chuyên môn để kịp thời xem xét, trả lời công khai.
          </p>

          {!currentUser ? (
            /* Guest Warning */
            <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
                <span className="text-sm text-blue-950 font-medium">
                  Đăng nhập để gửi phản ánh tới xã của bạn
                </span>
              </div>
              <button
                onClick={() => navigateTo(13)}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          ) : (
            /* Logged in Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong>Gửi phản ánh thành công!</strong> Ý kiến của bạn đã được ghi nhận vào hệ thống quản lý phản ánh của xã (Màn 44) và sẽ được phản hồi sớm qua SĐT/Email.
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="validation-message p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Họ và tên người gửi
                  </label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Số điện thoại hoặc Email
                  </label>
                  <input
                    type="text"
                    value={feedbackContact}
                    onChange={(e) => setFeedbackContact(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    placeholder="0912345678 hoặc email@domain.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nội dung phản ánh, kiến nghị, góp ý
                </label>
                <textarea
                  rows={4}
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-y"
                  placeholder="Ghi rõ nội dung sự việc, thời gian, địa điểm hoặc các kiến nghị cải cách thủ tục hành chính tại địa phương..."
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Gửi phản ánh tới UBND Xã</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
