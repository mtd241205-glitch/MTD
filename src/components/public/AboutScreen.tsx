import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Landmark,
  Shield,
  Bot,
  Users,
  MapPin,
  Phone,
  Mail,
  LogIn,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const { currentRole, currentUser, currentCommune, navigateTo } = useApp();

  const devTeamMembers = [
    {
      name: 'Trần Minh Cường',
      role: 'Kỹ sư Trưởng Kiến trúc Hệ thống & AI',
      bio: 'Chuyên gia thiết kế mô hình RAG phân tán và bảo mật dữ liệu hành chính công.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    },
    {
      name: 'Lê Thu Trang',
      role: 'Chuyên gia Pháp chế & Quy trình Hành chính Cấp xã',
      bio: 'Nguyên cán bộ tư pháp, phụ trách chuẩn hóa dữ liệu TTHC và cây quyết định pháp luật.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    },
    {
      name: 'Nguyễn Đăng Khoa',
      role: 'Kỹ sư An toàn Thông tin & Hạ tầng Đám mây',
      bio: 'Phụ trách mã hóa end-to-end, cô lập dữ liệu đa xã và phòng chống tấn công mạng.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    {
      name: 'Hoàng Thị Yến',
      role: 'Thiết kế Trải nghiệm Người dùng (UX/UI)',
      bio: 'Tối ưu giao diện thân thiện với người dân nông thôn, cán bộ cấp cơ sở và người cao tuổi.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    },
  ];

  return (
    <div className="w-full space-y-0 bg-[#F8FAFC]">
      {/* Section 1: Product Introduction with Celestial Blue Header */}
      <section className="bg-gradient-to-b from-[#1853ED] via-[#38BDF8] to-[#F8FAFC] py-16 lg:py-20 border-b border-sky-100 text-white">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold">
                <Landmark className="w-3.5 h-3.5" />
                <span>GIỚI THIỆU SẢN PHẨM (MÀN 2)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-xs">
                Nền Tảng AI Cấp Xã: Đột Phá Chuyển Đổi Số Chính Quyền Cơ Sở
              </h1>
              <p className="text-sky-50 leading-relaxed text-base sm:text-lg">
                AI Cấp Xã là giải pháp công nghệ tiên phong được phát triển nhằm mục tiêu giải quyết trực tiếp "nút thắt cổ chai" trong giải quyết thủ tục hành chính tại UBND xã, phường, thị trấn.
              </p>
              <div className="space-y-3 pt-2 text-white">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-sky-200 shrink-0 mt-0.5" />
                  <p className="text-sm text-sky-50">
                    <strong className="text-white">Trợ lý AI công dân:</strong> Giải đáp tự nhiên quy trình, hồ sơ, giấy tờ cần chuẩn bị theo Luật Cư trú, Luật Đất đai, Luật Hộ tịch mọi lúc mọi nơi.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-sky-200 shrink-0 mt-0.5" />
                  <p className="text-sm text-sky-50">
                    <strong className="text-white">Kho tri thức phân quyền:</strong> Tách biệt dữ liệu dùng chung toàn quốc, dữ liệu văn bản điều hành của xã, và hồ sơ nội bộ lưu hành hạn chế.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-sky-200 shrink-0 mt-0.5" />
                  <p className="text-sm text-sky-50">
                    <strong className="text-white">Bảo vệ dữ liệu tuyệt đối:</strong> Kiến trúc mã hóa cô lập hoàn toàn giữa các xã. Đội ngũ phát triển cam kết không xem nội dung hay thông tin cá nhân.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl text-center">
                <Bot className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-black text-slate-900">24/7</div>
                <p className="text-xs text-slate-600 font-medium mt-1">Trợ lý giải đáp thường trực</p>
              </div>
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl text-center">
                <Shield className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <div className="text-3xl font-black text-slate-900">100%</div>
                <p className="text-xs text-slate-600 font-medium mt-1">Mã hóa cô lập theo xã</p>
              </div>
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl text-center">
                <Layers className="w-10 h-10 text-sky-600 mx-auto mb-3" />
                <div className="text-3xl font-black text-slate-900">4 Vùng</div>
                <p className="text-xs text-slate-600 font-medium mt-1">Dữ liệu kiểm soát chặt chẽ</p>
              </div>
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl text-center">
                <Cpu className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                <div className="text-3xl font-black text-slate-900">RAG AI</div>
                <p className="text-xs text-slate-600 font-medium mt-1">Trích dẫn nguồn minh bạch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Dev Team */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Đội Ngũ Xây Dựng & Vận Hành
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Đội Phát Triển Hệ Thống AI Cấp Xã
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Tập hợp các chuyên gia công nghệ và chuyên gia quản lý hành chính công giàu kinh nghiệm
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {devTeamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200 shadow-2xs text-center flex flex-col items-center hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 mb-4 ring-4 ring-blue-500/10 shadow-sm">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-blue-600 mt-1 mb-2">{member.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Commune Info */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          {currentRole === 'guest' || !currentCommune ? (
            /* Guest State: prompt to login */
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl p-10 border border-sky-200 text-center max-w-2xl mx-auto shadow-sm">
              <Landmark className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">
                Đăng Nhập Để Xem Thông Tin Xã Của Bạn
              </h3>
              <p className="text-sm text-slate-600 mt-2 mb-6">
                Khi đăng nhập bằng tài khoản thuộc xã đã đăng ký dịch vụ, bạn sẽ xem được toàn bộ thông tin địa bàn, dân số, các phòng ban chuyên môn và lịch tiếp công dân của xã mình.
              </p>
              <button
                onClick={() => navigateTo(13)}
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          ) : (
            /* Logged in: shows user's commune details */
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Thông tin đơn vị hành chính
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                    {currentCommune.name} - {currentCommune.province}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Mã đơn vị: {currentCommune.communeCode}</p>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{currentCommune.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-sky-600" />
                    <span>{currentCommune.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>{currentCommune.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Quy mô dân cư & địa bàn</h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>• <strong>Dân số:</strong> ~12.500 nhân khẩu (4 thôn/xóm)</li>
                    <li>• <strong>Diện tích tự nhiên:</strong> 15,8 km²</li>
                    <li>• <strong>Người dùng số hóa trên hệ thống:</strong> {currentCommune.userCount} tài khoản</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Bộ máy tiếp nhận Một cửa</h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>• <strong>Địa điểm:</strong> Tầng 1, Trụ sở UBND xã</li>
                    <li>• <strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6 (8h00 - 17h00)</li>
                    <li>• <strong>Cán bộ thường trực:</strong> Tư pháp, Địa chính, LĐTBXH</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Kho tri thức số của xã</h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>• <strong>Văn bản đã số hóa:</strong> {currentCommune.processedDocsCount} tài liệu</li>
                    <li>• <strong>Dung lượng lưu trữ:</strong> {currentCommune.storageUsedMb} MB / {currentCommune.storageTotalMb} MB</li>
                    <li>• <strong>Trạng thái dịch vụ:</strong> <span className="font-semibold text-emerald-600">Đang hoạt động tốt</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Link to Contact */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigateTo(3)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>Liên hệ với chúng tôi để biết thêm chi tiết (3)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
