import React from 'react';
import { Link } from 'react-router-dom';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { Cpu, PhoneCall, Mail, MapPin, MessageCircle, ShieldCheck, Truck, Clock, Layers, Wrench, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 font-sans">
      {/* 4 Feature Highlights */}
      <div className="border-b border-slate-800 py-6 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase">Linh Kiện Điện Tử Sỉ Lẻ</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">IC, Module, Cảm biến, Arduino, STM32</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase">Gia Công Bo Mạch PCB</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Chỉ từ 149.000đ • Soi 3D & Auto kích thước</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase">Bảo Mật File 100%</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Cam kết không chia sẻ bản quyền Gerber</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase">Giao Hàng & VietQR</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Đường bộ 10-14 ngày • Đường bay 7-10 ngày</p>
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
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-white tracking-wide">
                THẾ GIỚI LINH KIỆN & PCB
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Hệ sinh thái phân phối sỉ lẻ linh kiện điện tử R&D, vi điều khiển, module cảm biến cùng dịch vụ gia công mạch in PCB 1-32 lớp và gia công hàn lắp PCBA chuyên nghiệp.
            </p>

            <div className="space-y-1.5 pt-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-2 font-mono">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                <span>Hotline: {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zalo Kỹ Thuật: {PCB_CONFIG_DATA.CONTACT.zaloPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Khu vực: Hà Nội & TP. Hồ Chí Minh (Giao hàng toàn quốc)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Gia công PCB */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              Dịch Vụ Gia Công
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/pcb-quote?service=pcb" className="text-blue-400 hover:underline font-semibold transition">Gia công mạch in (PCB)</Link></li>
              <li><Link to="/pcb-quote?service=assembly" className="text-orange-400 hover:underline font-semibold transition">Gia công hàn lắp (PCBA)</Link></li>
              <li><Link to="/pcb-quote#viewer3d" className="hover:text-yellow-400 transition">Xem 3D Gerber WebGL</Link></li>
              <li><Link to="/pcb-services" className="hover:text-white transition">Quy trình sản xuất & DFM</Link></li>
            </ul>
          </div>

          {/* Column 3: Linh kiện */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              Linh Kiện Điện Tử
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=raspberry-pi" className="hover:text-white transition">Raspberry Pi & Phụ kiện</Link></li>
              <li><Link to="/products?category=arduino" className="hover:text-white transition">Bo mạch Arduino</Link></li>
              <li><Link to="/products?category=module-cam-bien" className="hover:text-white transition">Module cảm biến</Link></li>
              <li><Link to="/products?category=mach-nap-kit" className="hover:text-white transition">Mạch nạp & Kit phát triển</Link></li>
            </ul>
          </div>

          {/* Column 4: 3 Chính Sách Chuẩn (Y Hệt Yêu Cầu) */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/terms" className="text-slate-300 hover:text-white transition flex items-center gap-1.5"><span>•</span> Điều khoản sử dụng</Link></li>
              <li><Link to="/privacy" className="text-slate-300 hover:text-white transition flex items-center gap-1.5"><span>•</span> Chính sách bảo mật</Link></li>
              <li><Link to="/support" className="text-slate-300 hover:text-white transition flex items-center gap-1.5"><span>•</span> Chính sách hỗ trợ</Link></li>
              <li><Link to="/order-lookup" className="text-blue-400 hover:underline transition flex items-center gap-1.5"><span>•</span> Tra cứu đơn hàng</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition flex items-center gap-1.5"><span>•</span> Liên hệ tư vấn</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Thế Giới Linh Kiện & PCB. All rights reserved. Giao hàng toàn quốc.
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
              Napas VietQR 24/7
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
              ViettelPost / GHTK
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
              ISO 9001:2015
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
