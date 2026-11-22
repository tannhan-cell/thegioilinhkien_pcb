import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, Trash2, FileCheck } from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in font-sans text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>CAM KẾT BẢO MẬT TUYỆT ĐỐI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Chính Sách Bảo Mật Thông Tin & Bản Quyền Thiết Kế
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Bảo vệ 100% tài sản trí tuệ (Gerber, BOM, Sơ đồ nguyên lý) và thông tin cá nhân của khách hàng
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            1. Cam Kết Bảo Vệ File Thiết Kế (Gerber, BOM, Schematics)
          </h2>
          <p className="text-slate-600">
            Chúng tôi hiểu rõ file thiết kế bo mạch và danh mục linh kiện là bí mật kinh doanh và linh hồn của mọi sản phẩm công nghệ:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><b>Không bao giờ chia sẻ:</b> Chúng tôi cam kết tuyệt đối không sao chép, không chia sẻ, không chuyển nhượng hoặc thương mại hóa bất kỳ file Gerber nào của khách hàng cho bất kỳ bên thứ ba nào khác.</li>
            <li><b>Lưu trữ an toàn cách ly:</b> File đính kèm tải lên hệ thống được mã hóa đường truyền SSL và lưu trữ trong vùng nhớ riêng biệt, chỉ có kỹ thuật viên phụ trách trực tiếp đơn hàng mới có quyền xem để gia công.</li>
            <li><b>Ký thỏa thuận NDA:</b> Với các công ty R&D, doanh nghiệp khởi nghiệp hoặc viện nghiên cứu, chúng tôi sẵn sàng ký thỏa thuận bảo mật thông tin (NDA) pháp lý trước khi tiếp nhận bản vẽ.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-sky-600" />
            2. Bảo Mật Thông Tin Cá Nhân & Liên Hệ Khách Hàng
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Thông tin cá nhân (Họ tên, Số điện thoại, Địa chỉ giao hàng, Email) chỉ được dùng cho mục đích xác nhận đơn hàng, gửi báo giá và điều phối đơn vị vận chuyển (ViettelPost, GHTK, Grab).</li>
            <li>Không sử dụng số điện thoại của quý khách để gửi tin nhắn rác hoặc quảng cáo làm phiền.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-600" />
            3. Quyền Yêu Cầu Hủy File Sau Khi Hoàn Thành Đơn
          </h2>
          <p className="text-slate-600">
            Khách hàng có toàn quyền yêu cầu kỹ thuật viên xóa bỏ vĩnh viễn toàn bộ file Gerber và BOM khỏi máy chủ ngay sau khi nhận mạch và kiểm tra đạt yêu cầu bằng cách liên hệ Zalo Hotline: <b>{PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</b>.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold">
          <Link to="/terms" className="text-sky-600 hover:text-sky-800 underline">
            → Xem Điều khoản sử dụng dịch vụ
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
