import React from 'react';
import { ShieldCheck, FileLock2, RefreshCw, Truck, PhoneCall, Mail } from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const PolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 animate-fade-in">
      <div className="text-center space-y-2 border-b border-slate-200 pb-6">
        <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
          ĐIỀU KHOẢN & BẢO HÀNH
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold font-display text-slate-900">
          Chính Sách & Cam Kết Dịch Vụ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Quy định về bảo mật thiết kế, bảo hành linh kiện và quyền lợi khách hàng tại Thế Giới Linh Kiện & PCB
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1: Security */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-blue-700 font-bold text-base">
            <FileLock2 className="w-5 h-5 text-blue-600" />
            <h2>1. Cam Kết Bảo Mật File Thiết Kế (Gerber, BOM, Pick & Place)</h2>
          </div>
          <p>
            Thế Giới Linh Kiện & PCB coi trọng bảo mật quyền sở hữu trí tuệ của mọi khách hàng là nguyên tắc sống còn:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Mọi file Gerber, sơ đồ nguyên lý (Schematic) và danh mục linh kiện (BOM) được lưu trữ trên hạ tầng lưu trữ phân quyền riêng tư (Private Storage), không bao giờ công khai link ra bên ngoài.</li>
            <li>Hệ thống cam kết 100% không chuyển giao, sao chép hoặc chia sẻ thiết kế của quý khách cho bên thứ ba dưới bất kỳ hình thức nào.</li>
            <li>Hỗ trợ ký thỏa thuận bảo mật thông tin (NDA) cho các dự án thương mại và doanh nghiệp theo yêu cầu.</li>
          </ul>
        </section>

        {/* Section 2: Warranty */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base">
            <RefreshCw className="w-5 h-5 text-emerald-600" />
            <h2>2. Quy Định Bảo Hành & Đổi Trả Linh Kiện</h2>
          </div>
          <p>
            Chúng tôi cam kết chất lượng linh kiện điện tử nguyên đai nguyên kiện chuẩn nhà sản xuất:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><b>Linh kiện điện tử:</b> Bảo hành đổi mới trong vòng 07 ngày kể từ khi nhận hàng nếu phát hiện lỗi do nhà sản xuất (chưa hàn, chưa cắm sai nguồn phân cực).</li>
            <li><b>Bo mạch in gia công (PCB):</b> Cam kết 100% đúng theo file Gerber gốc đã duyệt. Nếu bo mạch bị lỗi đứt đường mạch ngầm, chập lớp ngầm hoặc sai thông số kỹ thuật do quá trình sản xuất, chúng tôi hỗ trợ làm lại miễn phí hoặc hoàn tiền.</li>
            <li>Thời gian tiếp nhận và xử lý yêu cầu khiếu nại trong vòng 24 - 48 giờ làm việc.</li>
          </ul>
        </section>

        {/* Section 3: Shipping */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <Truck className="w-5 h-5 text-blue-600" />
            <h2>3. Vận Chuyển & Thanh Toán</h2>
          </div>
          <p>
            Hỗ trợ giao hàng qua các đơn vị vận chuyển uy tín (Viettel Post, Giao Hàng Tiết Kiệm, AhaMove, GrabExpress):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Đơn hàng linh kiện từ <b>500.000đ</b> được <b>Miễn phí vận chuyển</b> tiêu chuẩn toàn quốc.</li>
            <li>Khách hàng được quyền đồng kiểm tra bưu phẩm trước khi thanh toán tiền mặt (COD).</li>
            <li>Với hình thức chuyển khoản: Thanh toán tiện lợi qua cổng VietQR Napas 24/7 tự động xác nhận.</li>
          </ul>
        </section>

        {/* Support hotline */}
        <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>
            <span className="text-xs text-cyan-400">CẦN HỖ TRỢ TRỰC TIẾP?</span>
            <div className="text-lg font-bold">Hotline: {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</div>
          </div>
          <a
            href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition"
          >
            Nhắn Zalo Kỹ Thuật
          </a>
        </div>
      </div>
    </div>
  );
};
