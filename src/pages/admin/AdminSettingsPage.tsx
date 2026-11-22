import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { SystemSettings } from '../../lib/types';
import { telegramService } from '../../lib/telegram';
import { 
  Settings, 
  Save, 
  QrCode, 
  PhoneCall, 
  Mail, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Truck,
  Send,
  BellRing,
  AlertCircle
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Telegram test state
  const [isTestingTele, setIsTestingTele] = useState(false);
  const [teleStatusMsg, setTeleStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    db.getSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleChange = (field: keyof SystemSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await db.saveSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert('Lỗi lưu cài đặt: ' + e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    if (!settings) return;
    setIsTestingTele(true);
    setTeleStatusMsg(null);

    const res = await telegramService.sendTestMessage(
      settings.telegramBotToken || '',
      settings.telegramChatId || ''
    );

    setTeleStatusMsg({ success: res.success, text: res.message });
    setIsTestingTele(false);
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-slate-400 text-xs">Đang tải cài đặt...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Cài Đặt Cửa Hàng, Telegram & VietQR
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình nhận thông báo đơn qua Telegram Bot, tài khoản ngân hàng VietQR và hotline
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Đã lưu cài đặt thành công!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. TELEGRAM BOT NOTIFICATIONS (Tính năng mới theo yêu cầu) */}
        <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <BellRing className="w-4 h-4 text-blue-600" />
              1. Báo Đơn Tự Động Qua Telegram Bot
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={settings.enableTelegramNotify ?? true}
                onChange={(e) => handleChange('enableTelegramNotify', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Bật thông báo Telegram</span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Khi có khách đặt mạch PCB, gia công hàn lắp PCBA hoặc mua linh kiện, bot sẽ tự động gửi thông báo chi tiết ngay lập tức vào Telegram của bạn.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Telegram Bot Token:
              </label>
              <input
                type="text"
                placeholder="VD: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
                value={settings.telegramBotToken || ''}
                onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tạo bot miễn phí bằng cách chat với <b>@BotFather</b> trên Telegram để lấy token.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Telegram Chat ID (hoặc Group ID):
              </label>
              <input
                type="text"
                placeholder="VD: 123456789 hoặc -100123456789"
                value={settings.telegramChatId || ''}
                onChange={(e) => handleChange('telegramChatId', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Lấy Chat ID của bạn qua bot <b>@userinfobot</b> trên Telegram.
              </span>
            </div>
          </div>

          {/* Test Telegram button */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isTestingTele}
              onClick={handleTestTelegram}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5 border border-blue-200"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestingTele ? 'Đang gửi tin...' : 'Gửi Thử Tin Nhắn Test Telegram'}</span>
            </button>

            {teleStatusMsg && (
              <span className={`text-xs font-medium flex items-center gap-1.5 ${teleStatusMsg.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                {teleStatusMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{teleStatusMsg.text}</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. Contact Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <PhoneCall className="w-4 h-4 text-blue-600" />
            2. Thông Tin Cửa Hàng & Hotline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tên cửa hàng:</label>
              <input
                type="text"
                value={settings.shopName}
                onChange={(e) => handleChange('shopName', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Hotline tư vấn hiển thị:</label>
              <input
                type="text"
                value={settings.hotline}
                onChange={(e) => handleChange('hotline', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Số điện thoại Zalo:</label>
              <input
                type="text"
                value={settings.zaloPhone}
                onChange={(e) => handleChange('zaloPhone', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Link Facebook Fanpage / Cá nhân:</label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email hỗ trợ:</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Địa chỉ kho / xưởng:</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. VietQR Bank Account Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <QrCode className="w-4 h-4 text-emerald-600" />
            3. Cấu Hình Tài Khoản Ngân Hàng & VietQR (Napas 247)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tên ngân hàng:</label>
              <input
                type="text"
                placeholder="VD: MBBank, Vietcombank..."
                value={settings.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Số tài khoản nhận tiền:</label>
              <input
                type="text"
                placeholder="VD: 0392733577"
                value={settings.bankAccount}
                onChange={(e) => handleChange('bankAccount', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-blue-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tên chủ tài khoản (Viết hoa):</label>
              <input
                type="text"
                placeholder="VD: VO TAN NHAN"
                value={settings.bankOwner}
                onChange={(e) => handleChange('bankOwner', e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm uppercase font-bold"
              />
            </div>
          </div>
        </div>

        {/* 4. Marquee Running Announcement & Shipping Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-600" />
              4. Cài Đặt Thông Báo Chạy Chữ Đầu Trang & Phí Ship
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={settings.showAnnouncement ?? true}
                onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>Bật thông báo chạy chữ</span>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            {/* Announcement Text */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Nội dung thông báo chạy chữ (Marquee Banner):
              </label>
              <textarea
                rows={2}
                value={settings.announcementText || ''}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                placeholder="VD: 📢 QUÝ KHÁCH CÓ VẤN ĐỀ CẦN HỖ TRỢ VUI LÒNG LIÊN HỆ ADMIN: BÊN MÌNH NHẬN GIA CÔNG MẠCH IN & HÀN LINH KIỆN..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Color & Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Màu nền thanh thông báo:
                </label>
                <select
                  value={settings.announcementBgColor || '#5b21b6'}
                  onChange={(e) => handleChange('announcementBgColor', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="#5b21b6">Tím Đậm Hoàng Gia (#5b21b6)</option>
                  <option value="#0284c7">Xanh Dương Tươi Sáng (#0284c7)</option>
                  <option value="#004d26">Xanh Lá Công Nghiệp (#004d26)</option>
                  <option value="#b91c1c">Đỏ Nổi Bật (#b91c1c)</option>
                  <option value="#0f172a">Đen Xám Tối Giản (#0f172a)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tốc độ chạy chữ (giây/vòng - càng nhỏ càng chạy nhanh):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="45"
                    step="1"
                    value={settings.announcementSpeed || 22}
                    onChange={(e) => handleChange('announcementSpeed', Number(e.target.value))}
                    className="flex-1 accent-purple-600 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-slate-800 w-12 text-center">
                    {settings.announcementSpeed || 22}s
                  </span>
                </div>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Xem Trước (Live Preview):
              </span>
              <div 
                style={{ backgroundColor: settings.announcementBgColor || '#5b21b6' }}
                className="py-1.5 px-3 rounded text-white text-xs font-semibold overflow-hidden whitespace-nowrap shadow-xs"
              >
                <div className="flex items-center gap-2 animate-pulse">
                  <span>📢</span>
                  <span>{settings.announcementText || 'QUÝ KHÁCH CÓ VẤN ĐỀ CẦN HỖ TRỢ VUI LÒNG LIÊN HỆ ADMIN...'}</span>
                </div>
              </div>
            </div>

            {/* Shipping Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phí ship mặc định (VNĐ):</label>
                <input
                  type="number"
                  min="0"
                  value={settings.defaultShippingFee}
                  onChange={(e) => handleChange('defaultShippingFee', Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngưỡng đơn miễn phí ship (Freeship):</label>
                <input
                  type="number"
                  min="0"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-60"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>LƯU TẤT CẢ CÀI ĐẶT</span>
          </button>
        </div>
      </form>
    </div>
  );
};
