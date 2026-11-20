import React from 'react';
import { Link } from 'react-router-dom';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { Cpu, PhoneCall, Mail, MapPin, MessageCircle, ShieldCheck, Truck, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b101b] text-slate-400 text-xs border-t border-slate-800 font-sans">
      {/* 4 Feature Highlights */}
      <div className="border-b border-slate-800/80 py-8 bg-[#070b13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[#00f5d4] flex items-center justify-center shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Linh Kiện Chuẩn Kỹ Thuật</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">IC, Module, Cảm biến, SMD chất lượng cao</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#f37021] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Gia Công Mạch In & Hàn Lắp</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Báo giá trực tuyến & Dán SMT / THT chuẩn xác</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Tuân Thủ An Ninh Mạng</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Bảo vệ 100% bản quyền file Gerber & BOM</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Giao Hàng & VietQR 24/7</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Hỗ trợ COD toàn quốc và chuyển khoản tự động</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#00f5d4] text-slate-950 flex items-center justify-center shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-white tracking-wider font-mono">
                PCB QUOTE HUB
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Hệ thống chuyên nghiệp gia công mạch in PCB 1-32 lớp, hàn lắp linh kiện PCBA và phân phối linh kiện điện tử R&D hàng đầu Việt Nam.
            </p>

            <div className="space-y-2 pt-1 font-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hotline: {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zalo hỗ trợ: {PCB_CONFIG_DATA.CONTACT.zaloPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Khu vực: Hà Nội & TP. Hồ Chí Minh (Giao hàng toàn quốc)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Gia công PCB */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
              Gia Công Bo Mạch
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/pcb-quote?service=pcb" className="text-[#f37021] hover:underline font-semibold transition">Báo giá mạch in PCB</Link></li>
              <li><Link to="/pcb-quote?service=assembly" className="text-[#f37021] hover:underline font-semibold transition">Báo giá hàn lắp PCBA</Link></li>
              <li><Link to="/pcb-services" className="hover:text-cyan-400 transition">Tiêu chuẩn kiểm định DFM</Link></li>
              <li><Link to="/pcb-services" className="hover:text-cyan-400 transition">Mạch in 1 - 32 Lớp</Link></li>
            </ul>
          </div>

          {/* Column 3: Linh kiện */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
              Linh Kiện Điện Tử
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=vi-dieu-khien" className="hover:text-cyan-400 transition">Vi điều khiển & Mạch nạp</Link></li>
              <li><Link to="/products?category=cam-bien" className="hover:text-cyan-400 transition">Cảm biến thông minh</Link></li>
              <li><Link to="/products?category=nguon-ha-ap" className="hover:text-cyan-400 transition">Nguồn & Mạch hạ áp</Link></li>
              <li><Link to="/products?category=linh-kien-smd" className="hover:text-cyan-400 transition">Linh kiện dán SMD</Link></li>
            </ul>
          </div>

          {/* Column 4: Hỗ trợ & An ninh mạng */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
              An Ninh Mạng & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/policy" className="hover:text-cyan-400 transition">Tuân thủ Luật An ninh mạng</Link></li>
              <li><Link to="/policy" className="hover:text-cyan-400 transition">Bảo mật Gerber & Thỏa thuận NDA</Link></li>
              <li><Link to="/order-lookup" className="hover:text-cyan-400 transition">Tra cứu tiến độ đơn hàng</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition">Liên hệ tư vấn kỹ thuật</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Thế Giới Linh Kiện & PCB (PCB QUOTE HUB). Bản quyền thuộc về hệ thống Thế Giới Linh Kiện & PCB.
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
              VietQR Napas 247
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
              COD Bưu Điện
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
              RoHS & ISO9001
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
