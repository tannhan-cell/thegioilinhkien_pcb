import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, RefreshCw, PhoneCall, CheckCircle2, MessageCircle } from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const SupportPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in font-sans text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>TRUNG TÂM CHĂM SÓC KHÁCH HÀNG</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Chính Sách Hỗ Trợ Kỹ Thuật & Bảo Hành Đổi Trả
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cam kết đồng hành cùng khách hàng từ khâu kiểm tra file DFM, gia công bo mạch đến khi sản phẩm vận hành hoàn hảo
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1: Hỗ trợ DFM miễn phí */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            1. Hỗ Trợ Kiểm Tra File Gerber DFM Hoàn Toàn Miễn Phí
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Tư vấn cấu hình stackup chuẩn (độ dày phíp 0.4mm - 3.0mm, độ dày đồng 1oz/2oz).</li>
            <li>Hỗ trợ xem trước 3D WebGL trực quan trên trình duyệt (xoay 360 độ, tách lớp phôi đồng, kiểm tra chân linh kiện).</li>
            <li>Kiểm tra kích thước đường mạch tối thiểu (track width/spacing), đường kính via/lỗ khoan để tránh lỗi chế tạo.</li>
          </ul>
        </div>

        {/* Section 2: Chính sách bảo hành mạch in */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            2. Chính Sách Bảo Hành & Đổi Trả Mạch In (PCB / PCBA)
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><b>Lỗi do xưởng sản xuất:</b> Bo mạch bị đứt mạch ngầm, chập lớp ngầm, bong tróc lớp phủ hàn (solder mask) hoặc sai kích thước so với file Gerber gốc đã duyệt sẽ được <b>hỗ trợ làm lại miễn phí 100%</b> hoặc hoàn cọc theo yêu cầu.</li>
            <li><b>Linh kiện điện tử bán lẻ:</b> Đổi mới trong vòng 07 ngày đối với linh kiện còn nguyên bao bì chân dán SMD hoặc chân cắm DIP chưa qua hàn nhiệt.</li>
            <li>Thời gian tiếp nhận và xử lý bảo hành trong vòng 24h làm việc.</li>
          </ul>
        </div>

        {/* Section 3: Kênh hỗ trợ trực tiếp */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 font-mono text-xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-sky-400 font-bold block uppercase tracking-wider text-[11px]">HOTLINE & ZALO KỸ THUẬT VIÊN TRỰC TIẾP</span>
            <div className="text-xl sm:text-2xl font-black text-white">{PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</div>
            <div className="text-slate-400 font-sans text-xs">Hỗ trợ từ 7h30 đến 22h00 các ngày trong tuần (kể cả Thứ 7 & Chủ Nhật)</div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Zalo Ngay</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold">
          <Link to="/terms" className="text-sky-600 hover:text-sky-800 underline">
            → Xem Điều khoản sử dụng dịch vụ
          </Link>
          <span className="text-slate-300">|</span>
          <Link to="/privacy" className="text-sky-600 hover:text-sky-800 underline">
            → Xem Chính sách bảo mật thông tin & bản quyền
          </Link>
        </div>
      </div>
    </div>
  );
};
