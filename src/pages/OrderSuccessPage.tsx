import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/db';
import { CommerceOrder, SystemSettings } from '../lib/types';
import { getVietQRUrl } from '../lib/vietqr';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  Home, 
  QrCode, 
  Clock, 
  PhoneCall, 
  MessageCircle 
} from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const OrderSuccessPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [order, setOrder] = useState<CommerceOrder | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allOrders, currentSettings] = await Promise.all([
          db.getCommerceOrders(),
          db.getSettings(),
        ]);
        setSettings(currentSettings);
        const found = allOrders.find(o => o.orderCode === code || o.id === code);
        if (found) setOrder(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy mã đơn hàng!</h2>
        <p className="text-xs text-slate-500">Mã đơn hàng không tồn tại hoặc đã được xử lý.</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold">
          Về trang chủ
        </Link>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyAcc = () => {
    if (settings?.bankAccount) {
      navigator.clipboard.writeText(settings.bankAccount);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2500);
    }
  };

  const qrImageUrl = settings && order.paymentMethod === 'bank_transfer'
    ? getVietQRUrl({
        bankId: 'MB',
        accountNo: settings.bankAccount || '0392733577',
        accountName: settings.bankOwner || 'VO TAN NHAN',
        amount: order.totalAmount,
        memo: `${order.orderCode}`,
      })
    : '';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6 text-center">
        {/* Success Header Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider block">
            ĐẶT HÀNG THÀNH CÔNG
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Cảm Ơn Bạn Đã Mua Sắm!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đơn hàng của bạn đã được ghi nhận vào hệ thống Thế Giới Linh Kiện & PCB.
          </p>
        </div>

        {/* Order Code Callout */}
        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">MÃ ĐƠN HÀNG</span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono font-bold text-xl sm:text-2xl text-blue-600">
              {order.orderCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-700 transition"
              title="Sao chép"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Đã chép' : 'Chép mã'}</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Họ tên: <b>{order.customerName}</b> • SĐT: <b>{order.customerPhone}</b>
          </span>
        </div>

        {/* VietQR Bank Transfer Box if selected */}
        {order.paymentMethod === 'bank_transfer' && qrImageUrl && (
          <div className="p-6 bg-gradient-to-b from-slate-900 to-blue-950 text-white rounded-3xl border border-cyan-500/30 text-left space-y-4 max-w-xl mx-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Quét Mã VietQR Chuyển Khoản 24/7</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[11px] font-mono border border-cyan-500/30">
                Napas 247
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* QR Code image */}
              <div className="bg-white p-3 rounded-2xl shadow-lg shrink-0">
                <img
                  src={qrImageUrl}
                  alt="VietQR Transfer"
                  className="w-44 h-44 object-contain rounded-lg"
                />
              </div>

              {/* Bank credentials */}
              <div className="space-y-2.5 font-mono text-xs w-full">
                <div>
                  <span className="text-slate-400 text-[10px] block">NGÂN HÀNG:</span>
                  <span className="font-bold text-white text-sm">{settings?.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">SỐ TÀI KHOẢN:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300 text-base">{settings?.bankAccount}</span>
                    <button
                      type="button"
                      onClick={handleCopyAcc}
                      className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                    >
                      {copiedAcc ? 'Đã chép' : 'Chép'}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">CHỦ TÀI KHOẢN:</span>
                  <span className="font-bold text-white uppercase">{settings?.bankOwner}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">SỐ TIỀN THANH TOÁN:</span>
                  <span className="font-bold text-emerald-400 text-base">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">NỘI DUNG CHUYỂN KHOẢN:</span>
                  <span className="font-bold text-amber-300">{order.orderCode}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              * Hệ thống sẽ tự động đối soát giao dịch và chuẩn bị hàng gửi bưu điện ngay sau khi nhận được chuyển khoản.
            </p>
          </div>
        )}

        {/* COD message */}
        {order.paymentMethod === 'cod' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl max-w-md mx-auto text-xs text-blue-900 text-left space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Hình Thức: Thanh Toán Khi Nhận Hàng (COD)
            </div>
            <p className="text-slate-600 text-[11px]">
              Bạn sẽ thanh toán số tiền <b className="text-blue-700 font-mono">{order.totalAmount.toLocaleString('vi-VN')} đ</b> cho nhân viên bưu điện khi nhận bưu phẩm tại: <b>{order.customerAddress}</b>.
            </p>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/order-lookup"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Search className="w-4 h-4" />
            <span>Tra Cứu Tiến Độ Đơn Hàng</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
