import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Sparkles,
  BookOpen,
  ClipboardList,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Lock,
  Building,
  Users,
  Search,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Layers,
  FileText,
  BadgeCheck,
  Send,
  Zap,
  Globe2,
  Minus,
  MessageSquare,
  HelpCircle,
  FileSpreadsheet,
  Share2,
} from 'lucide-react';
import { DataScope } from '../../types';

interface SamplePrompt {
  id: string;
  category: string;
  question: string;
  answerSummary: string;
  points: string[];
  citation: string;
  docId: string;
}

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'p1',
    category: 'Hộ tịch & Cư trú',
    question: 'Tôi muốn làm thủ tục đăng ký khai sinh cho con và nhập khẩu thì cần mang những giấy tờ gì?',
    answerSummary: 'Thủ tục liên thông điện tử 3 trong 1 tại UBND cấp xã gồm:',
    points: [
      'Tờ khai đăng ký khai sinh (theo mẫu trực tuyến trên Cổng DVC)',
      'Giấy chứng sinh do Bệnh viện / Trạm y tế cấp (bản chính)',
      'Căn cước công dân hoặc tài khoản định danh VNeID mức 2 của cha, mẹ',
      'Giấy chứng nhận kết hôn của cha mẹ (nếu đã đăng ký kết hôn)',
    ],
    citation: 'TTHC-BTP-2.000185 (Dùng chung)',
    docId: 'proc-shared-1',
  },
  {
    id: 'p2',
    category: 'Đất đai & Nhà ở',
    question: 'Điều kiện và hồ sơ xin cấp đổi Giấy chứng nhận quyền sử dụng đất (Sổ đỏ)?',
    answerSummary: 'Căn cứ Luật Đất đai số 31/2024/QH15, hồ sơ nộp tại UBND cấp xã gồm:',
    points: [
      'Đơn đề nghị cấp đổi Giấy chứng nhận quyền sử dụng đất (Mẫu số 10/ĐK)',
      'Bản gốc Giấy chứng nhận đã cấp (bị ố, rách hoặc có nhu cầu đổi mới)',
      'Bản sao CCCD hoặc định danh điện tử VNeID của người sử dụng đất',
      'Thời hạn giải quyết: không quá 07 ngày làm việc kể từ ngày nhận đủ hồ sơ',
    ],
    citation: 'Luật Đất đai số 31/2024/QH15',
    docId: 'doc-shared-1',
  },
  {
    id: 'p3',
    category: 'Bảo hiểm y tế',
    question: 'Mức đóng và quyền lợi khi tham gia Bảo hiểm y tế (BHYT) hộ gia đình?',
    answerSummary: 'Mức đóng BHYT hộ gia đình theo quy định hiện hành:',
    points: [
      'Người thứ nhất: đóng 4,5% mức lương cơ sở hiện hành',
      'Người thứ hai: đóng 70% mức đóng của người thứ nhất',
      'Người thứ ba: đóng 60% mức đóng của người thứ nhất',
      'Được thanh toán từ 80% - 100% chi phí khám chữa bệnh đúng tuyến',
    ],
    citation: 'Luật BHYT & Nghị định 146/2018/NĐ-CP',
    docId: 'doc-shared-3',
  },
  {
    id: 'p4',
    category: 'Chứng thực điện tử',
    question: 'Chứng thực bản sao điện tử từ bản chính tại UBND xã thực hiện thế nào?',
    answerSummary: 'Quy trình chứng thực bản sao điện tử theo Nghị định 45/2020/NĐ-CP:',
    points: [
      'Xuất trình bản chính giấy tờ, văn bản cần chứng thực tại Bộ phận Một cửa',
      'Cán bộ số hóa hồ sơ, ký chữ ký số chuyên dùng của UBND cấp xã',
      'Công dân nhận bản sao điện tử vào kho dữ liệu cá nhân trên Cổng DVC / VNeID',
      'Bản sao điện tử có giá trị pháp lý sử dụng vô thời hạn',
    ],
    citation: 'Nghị định 45/2020/NĐ-CP & Nghị định 104/2022/NĐ-CP',
    docId: 'doc-shared-3',
  },
];

export const HomeScreen: React.FC = () => {
  const {
    currentRole,
    currentUser,
    currentCommune,
    getVisibleDocuments,
    navigateTo,
  } = useApp();

  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [selectedDocFilter, setSelectedDocFilter] = useState<'all' | 'shared' | 'commune_public' | 'commune_internal'>('all');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('week');
  const [inputQuery, setInputQuery] = useState('');

  const visibleDocs = getVisibleDocuments();
  const allPolicyDocs = visibleDocs.filter((d) => d.category === 'policy');
  
  const filteredPolicyDocs = allPolicyDocs
    .filter((d) => {
      if (selectedDocFilter === 'all') return true;
      return d.scope === selectedDocFilter;
    })
    .slice(0, 5);

  const activePrompt = SAMPLE_PROMPTS[activePromptIndex];

  const handleCopyAnswer = () => {
    const text = `${activePrompt.question}\n\n${activePrompt.answerSummary}\n${activePrompt.points.map((p) => `- ${p}`).join('\n')}\n\nTrích dẫn: ${activePrompt.citation}`;
    navigator.clipboard.writeText(text);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === 'guest') {
      navigateTo(13, 'redirect_to_22');
    } else {
      navigateTo(22);
    }
  };

  const getScopeBadge = (scope: DataScope) => {
    switch (scope) {
      case 'shared':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
            Dùng chung
          </span>
        );
      case 'commune_public':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
            Của xã
          </span>
        );
      case 'commune_internal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
            <Lock className="w-3 h-3 text-amber-600" />
            Nội bộ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-16 pb-24 overflow-x-hidden">
      {/* ========================================================
          HERO SECTION: Clean, minimal, crisp SaaS AI aesthetic
          Exact match to the reference image (Aashabul Imam / Dribbble)
          ======================================================== */}
      <section className="relative w-full pt-14 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft radial ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-sky-400/15 via-blue-400/10 to-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Headline (Exact typography cadence of image.png) */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-5xl mx-auto">
            Cổng Hành Chính Số, Nay Có{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Trợ Lý AI Chuẩn Xác.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal">
            Trợ lý AI Cấp Xã số hóa quy định pháp luật, thủ tục hành chính và tài liệu nghiệp vụ
            thành trợ lý thông minh giải đáp tức thì, dẫn nguồn chính xác 24/7 cho người dân và cán bộ.
          </p>

          {/* Dual Pill CTA Buttons (Exact match to image.png: Try AI Chatbot Free & See Pricing) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => {
                if (currentRole === 'guest') {
                  navigateTo(13, 'redirect_to_22');
                } else {
                  navigateTo(22);
                }
              }}
              className="px-8 py-3.5 rounded-full font-semibold text-sm text-white bg-blue-700 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 flex items-center gap-2 group cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Hỏi Trợ Lý AI Miễn Phí</span>
            </button>

            <button
              onClick={() => navigateTo(6)}
              className="px-8 py-3.5 rounded-full font-semibold text-sm text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-slate-600" />
              <span>Tra Cứu Thủ Tục</span>
            </button>
          </div>

          {/* ========================================================
              LAYERED MOCKUP SHOWCASE (MATCHING IMAGE.PNG EXACTLY)
              1. Large wide Administrative Dashboard container
              2. Floating Mobile AI Chatbot Card OVERLAPPING on the right!
              ======================================================== */}
          <div className="mt-14 sm:mt-18 relative w-full max-w-[1280px] mx-auto text-left">
            {/* 1. Large Wide Dashboard Container */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/8 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                {/* Left Mini Sidebar (Matching the 150 Store sidebar in image.png) */}
                <div className="hidden lg:block lg:col-span-3 border-r border-slate-100 p-5 bg-white space-y-6">
                  {/* Commune selector dropdown */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                      1
                    </div>
                    <span className="truncate flex-1">
                      {currentCommune ? currentCommune.name : 'UBND Xã Hòa Lạc'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Chính thức
                    </span>
                  </div>

                  {/* Search box with shortcut */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      readOnly
                      className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 focus:outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 border border-slate-200 px-1 rounded bg-white">
                      ⌘K
                    </span>
                  </div>

                  {/* Sidebar Menu items */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 text-blue-600">
                      <span className="flex items-center gap-2.5">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>Tổng quan</span>
                      </span>
                    </div>

                    <button
                      onClick={() => navigateTo(6)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <ClipboardList className="w-4 h-4 text-slate-400" />
                        <span>Hồ sơ Một cửa</span>
                      </span>
                      <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-mono">12</span>
                    </button>

                    <button
                      onClick={() => navigateTo(4)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>Văn bản pháp luật</span>
                      </span>
                      <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-mono">142</span>
                    </button>

                    <button
                      onClick={() => navigateTo(22)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>Công dân hỏi đáp</span>
                      </span>
                    </button>

                    <button
                      onClick={() => navigateTo(41)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span>Thống kê & Báo cáo</span>
                      </span>
                    </button>

                    <div className="pt-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3">
                      Hệ thống
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600">
                      <span className="flex items-center gap-2.5">
                        <Globe2 className="w-4 h-4 text-slate-400" />
                        <span>Đồng bộ CSDL QG</span>
                      </span>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">Mới</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Area (Matching "Welcome, Peter" & cards in image.png) */}
                <div className="lg:col-span-9 p-6 sm:p-8 space-y-6">
                  {/* Top Welcome Title & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Xin chào, {currentUser ? currentUser.fullName : 'Cán bộ & Người dân'}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Tổng quan tình hình chuyển đổi số và giải đáp hồ sơ trực tuyến
                      </p>
                    </div>

                    {/* Time range pills (Today, Week, Month, Quarter, Year...) */}
                    <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-100 rounded-xl self-start sm:self-auto">
                      {(['today', 'week', 'month', 'quarter', 'year'] as const).map((r) => {
                        const labels = { today: 'Hôm nay', week: 'Tuần', month: 'Tháng', quarter: 'Quý', year: 'Năm' };
                        return (
                          <button
                            key={r}
                            onClick={() => setTimeRange(r)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                              timeRange === r
                                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            {labels[r]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3 Metric Cards (Matching Gross revenue, Avg order value, Conversion rate in image.png) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Metric 1 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-2">
                      <div className="text-xs font-medium text-slate-400">Lượt hỏi đáp AI tự động</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                        14,509
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>21% so với tuần trước</span>
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-2">
                      <div className="text-xs font-medium text-slate-400">Thủ tục hành chính số hóa</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                        204
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        <span>100% Căn cứ pháp lý</span>
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-2">
                      <div className="text-xs font-medium text-slate-400">Tỷ lệ công dân hài lòng</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                        98.5%
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>4% từ khảo sát Một cửa</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue / Inquiries Trend Curve Graph (Matching image.png wave curve) */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Biểu đồ hỏi đáp & giải quyết hồ sơ
                        </div>
                        <div className="text-[11px] text-slate-400">20 Tháng 3 – 27 Tháng 3</div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        Đang tăng trưởng đều
                      </span>
                    </div>

                    {/* Smooth Spline SVG Curve */}
                    <div className="relative h-48 sm:h-56 w-full">
                      <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="curveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#729ac7" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#729ac7" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5d82b0" />
                            <stop offset="60%" stopColor="#729ac7" />
                            <stop offset="100%" stopColor="#91b7e0" />
                          </linearGradient>
                        </defs>

                        {/* Subtle Horizontal grid lines */}
                        <line x1="0" y1="40" x2="600" y2="40" stroke="#f8fafc" strokeWidth="1" />
                        <line x1="0" y1="85" x2="600" y2="85" stroke="#f8fafc" strokeWidth="1" />
                        <line x1="0" y1="130" x2="600" y2="130" stroke="#f8fafc" strokeWidth="1" />
                        <line x1="0" y1="175" x2="600" y2="175" stroke="#f8fafc" strokeWidth="1" />

                        {/* Area gradient under curve */}
                        <path
                          d="M 0 170 Q 75 160 140 120 T 280 115 T 420 70 T 560 40 L 600 35 L 600 200 L 0 200 Z"
                          fill="url(#curveFill)"
                        />

                        {/* Main blue curve */}
                        <path
                          d="M 0 170 Q 75 160 140 120 T 280 115 T 420 70 T 560 40 L 600 35"
                          fill="none"
                          stroke="url(#strokeGrad)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        {/* Chart Node Points */}
                        <circle cx="140" cy="120" r="4" fill="#5d82b0" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="280" cy="115" r="4" fill="#5d82b0" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="420" cy="70" r="4" fill="#5d82b0" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="560" cy="40" r="4.5" fill="#5d82b0" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                2. FLOATING OVERLAPPING MOBILE AI CHATBOT WIDGET
                (Directly reproducing the right-side overlay in image.png)
                ======================================================== */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:right-6 lg:-bottom-10 lg:w-[380px] xl:w-[410px] z-30">
              <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200/90 ring-1 ring-slate-900/5">
                {/* Chatbot Window Header (Matching "AI Chatbot" header in image.png) */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    {/* Overlapping colored icon circles like in image.png */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">AI Chatbot Cấp Xã</h4>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Đang hoạt động 24/7
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (currentRole === 'guest') navigateTo(13, 'redirect_to_22');
                      else navigateTo(22);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Mở toàn màn hình"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                {/* Conversation Body (Deep purple/indigo chat bubbles matching image.png) */}
                <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1 text-left">
                  {/* AI Opening bubble (Dark purple/indigo container like image.png) */}
                  <div className="bg-[#244b70] text-white p-3.5 rounded-2xl rounded-tl-xs text-xs leading-relaxed shadow-sm">
                    <p className="font-medium text-slate-100">
                      Xin chào! Bạn có muốn biết Trợ lý AI có thể hỗ trợ giải quyết thủ tục gì cho bạn hôm nay không?
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>7:20</span>
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3 h-3 cursor-pointer hover:text-white" />
                        <ThumbsDown className="w-3 h-3 cursor-pointer hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Citizen Question message bubble (User bubble like image.png) */}
                  <div className="flex items-start justify-end gap-2">
                    <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl rounded-tr-xs text-xs max-w-[85%] leading-relaxed border border-slate-200/60">
                      <div className="text-[10px] font-bold text-slate-400 mb-0.5">Công dân hỏi:</div>
                      {activePrompt.question}
                    </div>
                  </div>

                  {/* Detailed AI Response bubble (Dark purple/indigo like image.png) */}
                  <div className="bg-[#244b70] text-white p-4 rounded-2xl rounded-tl-xs text-xs leading-relaxed shadow-sm space-y-2">
                    <div className="font-semibold text-slate-100 flex items-center justify-between">
                      <span>{activePrompt.answerSummary}</span>
                      <button
                        onClick={handleCopyAnswer}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Sao chép"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ul className="space-y-1 text-slate-200 pl-1 text-[11px]">
                      {activePrompt.points.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-sky-500 font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Official Citation Chip */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <button
                        onClick={() => {
                          if (activePrompt.docId.startsWith('proc')) {
                            navigateTo(7, activePrompt.docId);
                          } else {
                            navigateTo(5, activePrompt.docId);
                          }
                        }}
                        className="text-blue-300 hover:text-white font-semibold underline truncate max-w-[200px]"
                      >
                        Căn cứ: {activePrompt.citation}
                      </button>
                      <span className="text-slate-400">7:21</span>
                    </div>
                  </div>
                </div>

                {/* Prompt Selectors & Full Screen Button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
                    <span>Thử chọn câu hỏi khác:</span>
                    {copiedAnswer && <span className="text-emerald-600 font-bold">Đã sao chép!</span>}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PROMPTS.map((prompt, idx) => (
                      <button
                        key={prompt.id}
                        onClick={() => setActivePromptIndex(idx)}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                          activePromptIndex === idx
                            ? 'bg-blue-100 text-blue-800 font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {prompt.category}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (currentRole === 'guest') navigateTo(13, 'redirect_to_22');
                      else navigateTo(22);
                    }}
                    className="w-full mt-3 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Vào khung chat trực tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4 CORE FUNCTIONAL MODULES (BENTO-GRID)
          Retaining all 4 features: Chatbot AI, AI Tài liệu / Cổng TT Xã,
          Văn bản chính sách, Thủ tục hành chính
          ======================================================== */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">
            Hạ tầng chuyển đổi số toàn diện
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Các Phân Hệ Chức Năng Chính
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Phân định rõ ràng giữa cổng tra cứu công khai cho nhân dân và không gian nghiệp vụ chuyên sâu của cán bộ xã.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Chatbot AI */}
          <div
            onClick={() => {
              if (currentRole === 'guest') navigateTo(13, 'redirect_to_22');
              else navigateTo(22);
            }}
            className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Chatbot AI Thông Minh
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Hỏi đáp tự nhiên về thủ tục hành chính, chính sách pháp luật. Tự động gắn chip trích dẫn căn cứ pháp lý rõ ràng.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Bắt đầu hỏi ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: AI Tài liệu (Officer / Commune Admin) or Cổng Thông Tin Xã (Citizen / Guest) */}
          {(currentRole === 'officer' || currentRole === 'commune_admin') ? (
            <div
              onClick={() => navigateTo(26)}
              className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    AI Tài Liệu Chuyên Môn
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    Cán bộ
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Tải lên tài liệu nghiệp vụ cá nhân, tự động tóm tắt, trích xuất dữ liệu và đối chiếu với kho quy định xã.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Vào không gian tài liệu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ) : (
            <div
              onClick={() => navigateTo(2)}
              className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-xl hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Cổng Thông Tin Xã
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Xem thông tin giới thiệu, cơ cấu lãnh đạo, địa bàn dân cư và lịch tiếp công dân định kỳ của UBND xã.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Tìm hiểu thêm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Card 3: Văn bản chính sách */}
          <div
            onClick={() => navigateTo(4)}
            className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Văn Bản, Chính Sách
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Kho văn bản quy phạm pháp luật trung ương, nghị định, luật đất đai và các kế hoạch chỉ đạo điều hành của địa phương.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Tra cứu văn bản</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Thủ tục hành chính */}
          <div
            onClick={() => navigateTo(6)}
            className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Thủ Tục Hành Chính
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Hướng dẫn chi tiết từng bước quy trình giải quyết hồ sơ một cửa: hộ tịch, chứng thực, đất đai, xây dựng...
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Xem thủ tục</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3-STEP PROCESS
          ======================================================== */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-100">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Quy trình minh bạch
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              3 Bước Tiếp Cận Dịch Vụ Công AI Nhanh Chóng
            </h3>
            <p className="text-xs text-slate-500 mt-1.5">
              Từ thắc mắc ban đầu đến kết quả giải quyết thủ tục tại Bộ phận Một cửa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs relative">
              <div className="text-2xl font-black text-slate-300 font-mono mb-3">01</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                Đặt câu hỏi tự nhiên bằng tiếng Việt
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Người dân hỏi bằng văn bản hoặc giọng nói về bất kỳ thủ tục, giấy tờ, chế độ trợ cấp hay văn bản chỉ đạo nào.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs relative">
              <div className="text-2xl font-black text-slate-300 font-mono mb-3">02</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                AI trích dẫn căn cứ pháp luật chính xác
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hệ thống rà soát kho tri thức đã kiểm chứng, đính kèm số hiệu văn bản, điều luật và biểu mẫu tương ứng.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs relative">
              <div className="text-2xl font-black text-slate-300 font-mono mb-3">03</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                Chuẩn bị hồ sơ & Nộp Một cửa
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Người dân nộp hồ sơ online qua Cổng DVC hoặc mang đủ giấy tờ đến UBND xã mà không lo thiếu sót hay đi lại nhiều lần.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          RECENT DOCUMENTS SECTION (Screen 1 Spec)
          ======================================================== */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Văn Bản Mới Ban Hành
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currentRole === 'guest'
                  ? 'Hiển thị các văn bản pháp quy dùng chung cấp cao'
                  : currentRole === 'citizen'
                  ? 'Hiển thị văn bản dùng chung và các quyết định, kế hoạch công khai của xã'
                  : 'Hiển thị toàn bộ văn bản dùng chung, công khai và nội bộ cấp xã'}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {/* Segmented Filter Buttons */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setSelectedDocFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedDocFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setSelectedDocFilter('shared')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedDocFilter === 'shared'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dùng chung
                </button>
                <button
                  onClick={() => setSelectedDocFilter('commune_public')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedDocFilter === 'commune_public'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Của xã
                </button>
                {(currentRole === 'officer' || currentRole === 'commune_admin') && (
                  <button
                    onClick={() => setSelectedDocFilter('commune_internal')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      selectedDocFilter === 'commune_internal'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Nội bộ
                  </button>
                )}
              </div>

              <button
                onClick={() => navigateTo(4)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document List */}
          <div className="divide-y divide-slate-100">
            {filteredPolicyDocs.length > 0 ? (
              filteredPolicyDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigateTo(5, doc.id)}
                  className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 -mx-3 px-3 rounded-2xl transition-all cursor-pointer group"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-700">
                        {doc.docNumber}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      {getScopeBadge(doc.scope)}
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Ban hành: {doc.issueDate}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-emerald-700 font-medium">{doc.validityStatus}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {doc.title}
                    </h4>

                    {doc.summary && (
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {doc.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:text-right pt-1 sm:pt-0">
                    <span className="text-xs text-slate-500 font-medium">{doc.issuingAgency}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Không tìm thấy văn bản phù hợp trong phạm vi đã chọn.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECURITY & PRIVACY ARCHITECTURE
          ======================================================== */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-200/80 text-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-blue-900 border border-blue-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CAM KẾT CÔNG NGHỆ & BẢO MẬT DỮ LIỆU</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Kiến Trúc Tách Biệt Kho Dữ Liệu Từng Xã
              </h2>

              <p className="text-sm text-slate-800 leading-relaxed">
                Đội ngũ phát triển tuân thủ nghiêm ngặt nguyên tắc bảo vệ quyền riêng tư: Cơ sở dữ liệu và kho vector tri thức được phân lập riêng biệt cho từng xã. Đội phát triển hoàn toàn không truy cập dữ liệu cá nhân hay nội dung tài liệu của xã trong mọi trường hợp.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => navigateTo(2)}
                  className="px-6 py-2.5 rounded-full bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  Tìm hiểu thêm giới thiệu (2)
                </button>
                <button
                  onClick={() => navigateTo(9)}
                  className="px-6 py-2.5 rounded-full bg-white text-blue-800 font-bold text-xs border border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Chính sách bảo mật (9)
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-blue-300 p-5 sm:p-6 rounded-2xl shadow-md">
                <ShieldCheck className="w-8 h-8 text-blue-600 mb-2.5" />
                <h4 className="text-sm font-bold text-slate-900">Bảo mật đa tầng</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Mã hóa nội dung, ẩn danh mã tài liệu DOC-xxxx khi đội kỹ thuật hỗ trợ khắc phục sự cố.
                </p>
              </div>

              <div className="bg-white border border-blue-300 p-5 sm:p-6 rounded-2xl shadow-md">
                <Users className="w-8 h-8 text-blue-600 mb-2.5" />
                <h4 className="text-sm font-bold text-slate-900">Kiểm soát phân quyền</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Lọc quyền ngay tại khâu truy xuất vector, ngăn tuyệt đối rò rỉ tài liệu nội bộ giữa các xã.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
