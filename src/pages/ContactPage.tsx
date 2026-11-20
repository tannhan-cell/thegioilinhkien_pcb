import React from 'react';
import { PhoneCall, Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 animate-fade-in">
      <div className="text-center space-y-2 border-b border-slate-200 pb-6">
        <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
          LIÊN HỆ & TƯ VẤN KỸ THUẬT
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold font-display text-slate-900">
          Trung Tâm Hỗ Trợ Khách Hàng
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Đội ngũ kỹ sư của Thế Giới Linh Kiện & PCB luôn sẵn sàng giải đáp thắc mắc và hỗ trợ báo giá dự án
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-bold text-lg text-slate-900">Thông Tin Liên Hệ</h3>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-mono block">HOTLINE TƯ VẤN:</span>
                <a href={`tel:${PCB_CONFIG_DATA.CONTACT.zaloPhone}`} className="font-bold text-base text-blue-600 hover:underline">
                  {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-mono block">ZALO KỸ THUẬT:</span>
                <a href={PCB_CONFIG_DATA.CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-base text-emerald-600 hover:underline">
                  {PCB_CONFIG_DATA.CONTACT.zaloPhone} (Nhấn để chat)
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-mono block">EMAIL LIÊN HỆ:</span>
                <span className="font-bold text-slate-800">contact@thegioilinhkienpcb.vn</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-mono block">ĐỊA CHỈ:</span>
                <span className="font-medium text-slate-800">Hà Nội & TP. Hồ Chí Minh (Giao hàng toàn quốc qua ViettelPost / GHTK)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-mono block">GIỜ LÀM VIỆC:</span>
                <span className="font-medium text-slate-800">08:00 - 21:00 (Từ Thứ 2 đến Chủ Nhật)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-bold text-lg text-slate-900">Gửi Tin Nhắn Cho Chúng Tôi</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi qua Zalo/SĐT trong giây lát.'); }} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Họ và tên của bạn:</label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Số điện thoại / Zalo:</label>
              <input
                type="tel"
                required
                placeholder="VD: 0392733577"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nội dung cần hỗ trợ:</label>
              <textarea
                rows={4}
                required
                placeholder="Nhập yêu cầu báo giá dự án, tư vấn linh kiện hoặc hỏi tiến độ..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Tin Nhắn Ngay</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
