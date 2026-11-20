import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  const freeShippingThreshold = 500000;
  const missingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900">
          Giỏ Hàng Của Bạn Đang Trống
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Chưa có linh kiện nào trong giỏ. Hãy thêm các sản phẩm điện tử hoặc đặt mạch in PCB ngay!
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/products"
            className="px-6 py-3 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Mua sắm linh kiện
          </Link>
          <Link
            to="/pcb-quote"
            className="px-6 py-3 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
          >
            Đặt mạch PCB 3D
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Giỏ Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem lại các linh kiện bạn đã chọn trước khi tiến hành thanh toán
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa tất cả</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free shipping bar */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between text-blue-900 font-medium">
              <span>
                {missingForFreeShip === 0 ? (
                  <b className="text-emerald-700">🎉 Đơn hàng của bạn đủ điều kiện MIỄN PHÍ VẬN CHUYỂN!</b>
                ) : (
                  <>Mua thêm <b className="font-mono text-blue-700">{missingForFreeShip.toLocaleString('vi-VN')} đ</b> để được FREESHIP!</>
                )}
              </span>
              <span className="font-mono text-[11px] text-blue-700 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product.thumbnail || item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">SKU: {item.product.sku}</div>
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-bold text-sm text-slate-800 hover:text-blue-600 transition line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-xs font-mono text-blue-600 font-semibold mt-0.5">
                      {item.product.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-mono font-medium text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Total for item */}
                  <div className="font-mono font-bold text-sm text-slate-900 w-24 text-right">
                    {(item.product.price * item.quantity).toLocaleString('vi-VN')} đ
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tiếp tục chọn thêm sản phẩm khác</span>
          </Link>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Tóm Tắt Đơn Hàng
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính sản phẩm:</span>
              <span className="font-mono font-semibold text-slate-900">{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển dự kiến:</span>
              <span className="font-mono font-semibold text-slate-900">
                {shippingFee === 0 ? <span className="text-emerald-600">Miễn phí</span> : `${shippingFee.toLocaleString('vi-VN')} đ`}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <span className="font-bold text-slate-800 text-sm">Tổng cộng:</span>
            <span className="font-mono font-extrabold text-xl text-blue-700">
              {total.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <Link
            to="/checkout"
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 text-sm"
          >
            <span>TIẾN HÀNH THANH TOÁN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="pt-2 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Hỗ trợ thanh toán COD khi nhận hàng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Quét mã VietQR chuyển khoản nhanh 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
