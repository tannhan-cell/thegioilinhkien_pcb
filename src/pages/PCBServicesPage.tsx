import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  FileCheck2,
  Zap
} from 'lucide-react';

export const PCBServicesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          NĂNG LỰC SẢN XUẤT CHUẨN CÔNG NGHIỆP IPC-A-600
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white max-w-3xl leading-tight">
          Dịch Vụ Gia Công Bo Mạch In PCB & Lắp Ráp PCBA
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Chúng tôi nhận gia công mạch in từ 1 đến 32 lớp với chất lượng cao nhất, kiểm tra quang học tự động AOI 100%, test điện tử Flying Probe Test và hỗ trợ hàn dán linh kiện dán SMD / cắm DIP trọn gói.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            to="/pcb-quote"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition flex items-center gap-2 text-sm sm:text-base font-display"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>MỞ CÔNG CỤ TÍNH GIÁ & XEM 3D</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Capabilities Table */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Năng Lực Kỹ Thuật Chi Tiết
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Thông số kỹ thuật tiêu chuẩn gia công tại Thế Giới Linh Kiện & PCB
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-white font-mono text-xs">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Hạng Mục Kỹ Thuật</th>
                <th className="py-3.5 px-4 sm:px-6">Tiêu Chuẩn (Standard)</th>
                <th className="py-3.5 px-4 sm:px-6">Nâng Cao (Advanced / Hỗ trợ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Số Lớp Bo (Layers)</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono text-blue-650">1 - 6 Lớp</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-500">Lên đến 32 Lớp (HDI, Blind/Buried Vias)</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Vật Liệu Nền (Base Material)</td>
                <td className="py-3.5 px-4 sm:px-6">FR-4 Tiêu Chuẩn (TG130 - TG140)</td>
                <td className="py-3.5 px-4 sm:px-6">High-TG170, Alu (Nhôm), Rogers, FPC Dẻo</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Kích Thước Bo Tối Đa</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono">500 x 500 mm</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-500">Lên tới 1200 x 600 mm (Bo LED dài)</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Độ Dày Bo Mạch</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono">0.8mm, 1.0mm, 1.2mm, 1.6mm</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-500">0.4mm đến 3.0mm</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Độ Dày Đồng (Copper Weight)</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono">1.0 oz (35 µm)</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-500">0.5 oz, 2.0 oz, 3.0 oz</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Đường Mạch / Khoảng Cách (Min Trace/Space)</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono">0.15mm / 0.15mm (6/6 mils)</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-500">0.08mm / 0.08mm (3.2/3.2 mils)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Lỗ Khoan Nhỏ Nhất (Min Drill)</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono">0.3 mm (12 mils)</td>
                <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-500">0.15 mm (Micro-via Laser)</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Xử Lý Mạ Bề Mặt (Surface Finish)</td>
                <td className="py-3.5 px-4 sm:px-6">Mạ Thiếc HASL (Có chì & Không chì)</td>
                <td className="py-3.5 px-4 sm:px-6">Mạ Vàng ENIG (Nickel/Gold), Mạ OSP, Hard Gold</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-semibold">Màu Sơn Phủ Hàn (Solder Mask)</td>
                <td className="py-3.5 px-4 sm:px-6">Xanh lá, Xanh dương, Đỏ, Đen, Trắng</td>
                <td className="py-3.5 px-4 sm:px-6">Vàng, Tím, Đen mờ, Xanh lá mờ, Không phủ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Assembly Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">SMT Pick & Place Tự Động</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dán chính xác các linh kiện dán siêu nhỏ kích thước 0201, 0402, 0603, 0805, các chip vi điều khiển chân QFP, QFN và BGA pitch &gt;= 0.35mm.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">Laser Stencil Chuẩn Xác</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Gia công mặt nạ thiếc hàn Stencil cắt bằng tia Laser độ chính xác cực cao, hỗ trợ cả loại Không khung (dành cho máy gạt tay) và Có khung nhôm công nghiệp.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">Kiểm Tra AOI & Test Xung</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mọi bo mạch PCBA sau khi qua lò hàn Reflow đều được kiểm tra tự động quang học AOI để phát hiện chân hàn thiếu thiếc, chạm chập hoặc lệch cực linh kiện.
          </p>
        </div>
      </div>
    </div>
  );
};
