import React from 'react';
import { 
  ShieldCheck, 
  FileLock2, 
  RefreshCw, 
  Truck, 
  Lock, 
  Scale, 
  FileText, 
  UserCheck, 
  Trash2,
  PhoneCall
} from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const PolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in font-sans text-slate-800">
      {/* Title Header */}
      <div className="text-center space-y-2 border-b border-slate-200 pb-6">
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-mono font-bold uppercase tracking-wider inline-block">
          AN NINH MẠNG & BẢO VỆ DỮ LIỆU CÁ NHÂN
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
          Chính Sách Bảo Mật, Sở Hữu Trí Tuệ & Tuân Thủ Luật An Ninh Mạng
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
          Cam kết bảo vệ 100% bí mật thiết kế kỹ thuật, quyền sở hữu trí tuệ của khách hàng theo quy định của pháp luật Việt Nam
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* 1. CĂN CỨ PHÁP LÝ */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-blue-900 font-bold text-base">
            <Scale className="w-5 h-5 text-blue-600" />
            <h2>1. Căn Cứ Pháp Lý & Nguyên Tắc Tuân Thủ</h2>
          </div>
          <p>
            Hệ sinh thái <b>Thế Giới Linh Kiện & PCB</b> (PCB QUOTE HUB) hoạt động tuân thủ nghiêm ngặt theo các văn bản quy phạm pháp luật hiện hành của Nhà nước Cộng hòa Xã hội Chủ nghĩa Việt Nam:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><b>Luật An ninh mạng số 24/2018/QH14:</b> Đảm bảo an toàn thông tin trên không gian mạng, phòng chống các hành vi xâm nhập, đánh cắp dữ liệu trái phép.</li>
            <li><b>Nghị định số 13/2023/NĐ-CP:</b> Về bảo vệ dữ liệu cá nhân (Personal Data Protection Decree - PDPD), tôn trọng tuyệt đối quyền riêng tư của khách hàng.</li>
            <li><b>Luật Sở hữu trí tuệ số 50/2005/QH11 (sửa đổi, bổ sung 2022):</b> Bảo vệ quyền tác giả, kiểu dáng công nghiệp, thiết kế vi mạch và bí mật kinh doanh.</li>
          </ul>
        </section>

        {/* 2. BẢO MẬT GERBER & BOM */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
            <FileLock2 className="w-5 h-5 text-emerald-600" />
            <h2>2. Cam Kết Bảo Vệ Quyền Sở Hữu Trí Tuệ (Gerber, BOM, Schematics)</h2>
          </div>
          <p>
            Chúng tôi hiểu rằng file thiết kế bo mạch và danh mục linh kiện là tài sản trí tuệ và cốt lõi kinh doanh của quý khách:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><b>Lưu trữ cách ly an toàn:</b> Toàn bộ file tải lên (Gerber .ZIP, BOM .XLSX, Pick&Place .TXT, Schematic PDF) được lưu trữ trong hạ tầng phân quyền bảo mật cao (Private Storage), không tạo link public ra ngoài Internet.</li>
            <li><b>Không chia sẻ / Không bán lại:</b> Cam kết 100% không thương mại hóa, không sao chép, không chia sẻ thiết kế của khách hàng cho bất kỳ bên thứ ba nào.</li>
            <li><b>Ký kết thỏa thuận NDA pháp lý:</b> Đối với các doanh nghiệp, công ty R&D hoặc dự án khởi nghiệp công nghệ, chúng tôi sẵn sàng ký thỏa thuận bảo mật thông tin (Non-Disclosure Agreement - NDA) có đóng dấu pháp nhân trước khi nhận file.</li>
          </ul>
        </section>

        {/* 3. QUY TRÌNH HỦY FILE & QUYỀN ĐƯỢC QUÊN */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <h2>3. Quyền Của Khách Hàng & Quy Trình Hủy Dữ Liệu Thiết Kế</h2>
          </div>
          <p>
            Theo Nghị định 13/2023/NĐ-CP, khách hàng có toàn quyền quyết định đối với dữ liệu của mình:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><b>Quyền yêu cầu xóa vĩnh viễn (Right to be Forgotten):</b> Ngay sau khi đơn hàng được sản xuất và giao thành công, khách hàng có thể liên hệ Admin để yêu cầu xóa vĩnh viễn toàn bộ file Gerber/BOM khỏi hệ thống máy chủ.</li>
            <li><b>Thời hạn lưu trữ:</b> Các file kỹ thuật của các đơn không yêu cầu lưu trữ mẫu sẽ được tự động xóa định kỳ sau 90 ngày để giải phóng bộ nhớ và đảm bảo an toàn tuyệt đối.</li>
          </ul>
        </section>

        {/* 4. CHÍNH SÁCH BẢO HÀNH */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <h2>4. Chính Sách Bảo Hành & Đổi Trả</h2>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><b>Bo mạch in gia công (PCB):</b> Cam kết 100% đúng theo file Gerber gốc đã duyệt. Nếu bo mạch bị đứt mạch ngầm, chập lớp ngầm hoặc sai thông số kỹ thuật do lỗi của dây chuyền sản xuất, chúng tôi hỗ trợ làm lại miễn phí hoặc hoàn tiền 100%.</li>
            <li><b>Linh kiện điện tử:</b> Đổi mới trong vòng 07 ngày đối với linh kiện còn nguyên bao bì chân dán SMD hoặc chân cắm DIP chưa qua hàn chì.</li>
          </ul>
        </section>

        {/* Contact Hotline */}
        <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div>
            <span className="text-cyan-400 block text-[11px]">HỖ TRỢ PHÁP LÝ & BẢO MẬT DỰ ÁN</span>
            <span className="text-base font-bold">Hotline / Zalo: {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</span>
          </div>
          <a
            href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition"
          >
            Nhắn Zalo Trực Tiếp
          </a>
        </div>
      </div>
    </div>
  );
};
