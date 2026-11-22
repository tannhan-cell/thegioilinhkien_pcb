import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../lib/db';
import { PaymentMethod, SystemSettings } from '../lib/types';
import { getVietQRUrl } from '../lib/vietqr';
import { 
  ShieldCheck, 
  Truck, 
  QrCode, 
  CreditCard, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();

  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const freeShippingThreshold = 500000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 30000;
  const totalAmount = subtotal + shippingFee;

  useEffect(() => {
    db.getSettings().then(setSettings);
    const profile = db.getCustomerProfile();
    if (profile.name) setCustomerName(profile.name);
    if (profile.phone) setCustomerPhone(profile.phone);
    if (profile.email) setCustomerEmail(profile.email);
    if (profile.address) setAddress(profile.address);
  }, []);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Giỏ hàng của bạn đang trống!</h2>
        <p className="text-xs text-slate-500">Vui lòng chọn linh kiện trước khi thanh toán.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold">
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 9) {
      setErrorMessage('Vui lòng nhập Số điện thoại hợp lệ (tối thiểu 9 chữ số)!');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên người nhận hàng!');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Vui lòng nhập Địa chỉ chi tiết để giao hàng!');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save customer profile for future visits
      db.saveCustomerProfile({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: `${address}${city ? ', ' + city : ''}`,
      });

      const orderItems = cart.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        sku: i.product.sku,
        price: i.product.price,
        quantity: i.quantity,
        total: i.product.price * i.quantity,
        thumbnail: i.product.thumbnail || i.product.images[0],
      }));

      const newOrder = await db.createCommerceOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerAddress: `${address.trim()}${city ? ' - ' + city.trim() : ''}`,
        notes: notes.trim() || undefined,
        items: orderItems,
        subtotal,
        shippingFee,
        discount: 0,
        totalAmount,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending_payment',
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}

      clearCart();
      navigate(`/order-success/${newOrder.orderCode}`);

    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi tạo đơn hàng. Vui lòng liên hệ hotline/Zalo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview QR code URL for VietQR
  const qrUrl = settings
    ? getVietQRUrl({
        bankId: 'MB',
        accountNo: settings.bankAccount || '0392733577',
        accountName: settings.bankOwner || 'VO TAN NHAN',
        amount: totalAmount,
        memo: `THANH TOAN LINH KIEN`,
      })
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Thanh Toán Đơn Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Điền thông tin giao hàng & chọn phương thức thanh toán an toàn
          </p>
        </div>

        <Link to="/cart" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại giỏ hàng</span>
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Form & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-5 h-5 text-blue-600" />
              1. Thông Tin Nhận Hàng (Giao Tận Nơi)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Số điện thoại người nhận <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="VD: 0392733577"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email nhận hóa đơn (tùy chọn):
                </label>
                <input
                  type="email"
                  placeholder="VD: email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tỉnh / Thành phố:
                </label>
                <input
                  type="text"
                  placeholder="VD: Hà Nội, TP. HCM, Đà Nẵng..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Địa chỉ số nhà, tên đường, phường/xã <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Số 123 Đường Nguyễn Trãi, Phường Bến Thành..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Ghi chú cho shipper (tùy chọn):
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Giao hàng vào giờ hành chính, gọi trước khi đến..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              2. Phương Thức Thanh Toán
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* COD Option */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>Thanh toán COD</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Nhận hàng kiểm tra linh kiện và thanh toán tiền mặt cho shipper bưu điện.
                  </p>
                </div>
              </label>

              {/* VietQR Bank Option */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Quét mã VietQR (Napas)</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Quét mã QR tự động điền số tài khoản, số tiền và nội dung chuyển khoản 24/7.
                  </p>
                </div>
              </label>
            </div>

            {/* If VietQR selected, preview banking details */}
            {paymentMethod === 'bank_transfer' && settings && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 text-xs animate-fade-in">
                <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px]">
                  <span>THÔNG TIN TÀI KHOẢN NHẬN TIỀN</span>
                  <span className="text-emerald-400">VietQR Napas 24/7</span>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">NGÂN HÀNG:</span>
                    <b className="text-white">{settings.bankName}</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SỐ TÀI KHOẢN:</span>
                    <b className="text-cyan-300 text-sm">{settings.bankAccount}</b>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">CHỦ TÀI KHOẢN:</span>
                    <b className="text-white uppercase">{settings.bankOwner}</b>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  * Sau khi bạn bấm "Xác Nhận Đặt Hàng", mã QR động chính xác kèm mã đơn hàng sẽ được hiển thị ngay tại trang tiếp theo.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Confirmation */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Đơn Hàng Của Bạn ({cart.reduce((s, i) => s + i.quantity, 0)} món)
          </h3>

          {/* List items */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
            {cart.map((item) => (
              <div key={item.product.id} className="pt-2 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.product.thumbnail || item.product.images[0]}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 border shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-semibold text-slate-800 truncate">{item.product.name}</div>
                    <div className="text-slate-400 text-[11px] font-mono">
                      {item.quantity} x {item.product.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 shrink-0">
                  {(item.product.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
          </div>

          {/* Subtotal, Shipping, Total */}
          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính sản phẩm:</span>
              <span className="font-mono font-semibold text-slate-900">{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển bưu điện:</span>
              <span className="font-mono font-semibold text-slate-900">
                {shippingFee === 0 ? <span className="text-emerald-600 font-bold">Miễn phí (Freeship)</span> : `${shippingFee.toLocaleString('vi-VN')} đ`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Tổng thanh toán:</span>
              <span className="font-mono font-extrabold text-2xl text-blue-700">
                {totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>ĐANG XỬ LÝ ĐẶT HÀNG...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>XÁC NHẬN ĐẶT HÀNG ({totalAmount.toLocaleString('vi-VN')} đ)</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500">
            Bằng cách đặt hàng, bạn đồng ý với{' '}
            <Link to="/terms" target="_blank" className="text-sky-600 underline font-medium">Điều khoản sử dụng</Link>
            {', '}
            <Link to="/privacy" target="_blank" className="text-sky-600 underline font-medium">Chính sách bảo mật</Link>
            {' và '}
            <Link to="/support" target="_blank" className="text-sky-600 underline font-medium">Chính sách hỗ trợ</Link>
            {' của Thế Giới Linh Kiện & PCB.'}
          </p>
        </div>
      </form>
    </div>
  );
};
