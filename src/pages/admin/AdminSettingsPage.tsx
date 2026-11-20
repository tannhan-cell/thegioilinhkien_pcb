import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { SystemSettings } from '../../lib/types';
import { 
  Settings, 
  Save, 
  QrCode, 
  PhoneCall, 
  Mail, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  if (loading || !settings) {
    return <div className="p-12 text-center text-slate-400 text-xs">Đang tải cài đặt...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Cài Đặt Cửa Hàng & VietQR
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tùy chỉnh thông tin liên hệ, hotline, tài khoản ngân hàng và chính sách phí ship
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Đã lưu cài đặt!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <PhoneCall className="w-4 h-4 text-blue-600" />
            1. Thông Tin Liên Hệ & Thương Hiệu
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

        {/* VietQR Bank Account Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <QrCode className="w-4 h-4 text-emerald-600" />
            2. Cấu Hình Tài Khoản Ngân Hàng & VietQR (Napas 247)
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
              <label className="block text-slate-700 font-semibold mb-1">Tên chủ tài khoản (Viết hoa không dấu):</label>
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

        {/* Shipping & Announcement Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-purple-600" />
            3. Phí Vận Chuyển & Banner Khuyến Mãi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
              <label className="block text-slate-700 font-semibold mb-1">Ngưỡng đơn miễn phí vận chuyển (Freeship):</label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Chữ thông báo chạy trên Header:</label>
              <input
                type="text"
                value={settings.announcementText || ''}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-60"
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
