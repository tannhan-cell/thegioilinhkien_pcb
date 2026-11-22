import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in font-sans text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>VĂN BẢN QUY ĐỊNH DỊCH VỤ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Điều Khoản Sử Dụng Dịch Vụ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Áp dụng cho toàn bộ hoạt động đặt gia công mạch in PCB, gia công hàn lắp PCBA và mua linh kiện điện tử tại Thế Giới Linh Kiện & PCB
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-mono font-bold">1</span>
            Quy Định Về File Thiết Kế & Trách Nhiệm DFM
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Khách hàng chịu trách nhiệm về tính chính xác của file thiết kế Gerber RS-274X, danh mục linh kiện BOM và file tọa độ Pick and Place tải lên hệ thống.</li>
            <li>Hệ thống cung cấp công cụ <b>Xem 3D trực quan</b> và thuật toán tự động nhận diện kích thước (width x height mm) nhằm hỗ trợ khách hàng kiểm tra trước khi đặt hàng.</li>
            <li>Đội ngũ kỹ sư của chúng tôi sẽ rà soát DFM (Design for Manufacturing) miễn phí trước khi chuyển xưởng sản xuất và liên hệ khách hàng nếu phát hiện lỗi ngắn mạch, hở mạch hoặc vi phạm khoảng cách an toàn (clearance).</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-mono font-bold">2</span>
            Báo Giá, Xác Nhận Đơn Hàng & Đặt Cọc
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Mức giá dự kiến trên bảng tính trực tuyến là giá tham khảo tiêu chuẩn (bo mạch dưới 10x10cm, 2 lớp FR-4). Mức giá chính thức sẽ được kỹ thuật viên xác nhận sau khi phân tích lớp Gerber.</li>
            <li>Đối với đơn hàng gia công bo mạch in và hàn lắp linh kiện theo yêu cầu riêng, khách hàng cần thanh toán cọc theo quy định trước khi xưởng tiến hành xuất phim và chế tạo.</li>
            <li>Sau khi đơn hàng chuyển sang trạng thái "Đang sản xuất", khách hàng không thể hủy ngang hoặc chỉnh sửa file thiết kế mà không chịu chi phí phát sinh nếu phim đã được phơi.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-mono font-bold">3</span>
            Tiến Độ Sản Xuất & Giao Nhận Hàng
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><b>Đường bộ:</b> Thời gian giao hàng từ 13 - 17 ngày (trung bình thực tế 10.8 ngày).</li>
            <li><b>Đường bay (Hỏa tốc):</b> Thời gian giao hàng từ 8 - 12 ngày (trung bình thực tế 8.9 ngày).</li>
            <li>Hàng hóa được đóng gói hút chân không chuyên dụng, kèm túi chống ẩm và xốp bóng khí bảo vệ chống sốc. Hỗ trợ giao tận nơi qua ViettelPost, Giao hàng tiết kiệm, Grab/AhaMove hoặc nhận trực tiếp.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-mono font-bold">4</span>
            Giải Quyết Khiếu Nại & Trọng Tài
          </h2>
          <p className="text-slate-600">
            Mọi khiếu nại liên quan đến chất lượng mạch in (đứt mạch, hở via, sai kích thước) cần được gửi bằng hình ảnh/video qua Zalo Hotline trong vòng 07 ngày kể từ khi nhận hàng để được giải quyết đổi mới hoặc hoàn cọc theo chính sách hỗ trợ.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold">
          <Link to="/privacy" className="text-sky-600 hover:text-sky-800 underline">
            → Xem Chính sách bảo mật thông tin & file Gerber
          </Link>
          <span className="text-slate-300">|</span>
          <Link to="/support" className="text-sky-600 hover:text-sky-800 underline">
            → Xem Chính sách hỗ trợ kỹ thuật & bảo hành
          </Link>
        </div>
      </div>
    </div>
  );
};
