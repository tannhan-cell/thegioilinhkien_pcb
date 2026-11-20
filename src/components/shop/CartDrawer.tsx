import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-base">
                Giỏ Hàng Của Bạn ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-700">Giỏ hàng đang trống</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Hãy khám phá hàng ngàn linh kiện điện tử chất lượng cao tại cửa hàng.
                </p>
                <Link
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
                >
                  <img
                    src={item.product.thumbnail || item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {item.product.name}
                      </div>
                      <div className="font-mono text-blue-600 font-bold mt-0.5">
                        {item.product.price.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono font-medium text-slate-700">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Tạm tính:</span>
                <span className="font-mono font-bold text-base text-blue-700">
                  {subtotal.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                * Phí vận chuyển sẽ được tính tại bước thanh toán (Miễn phí từ 500.000đ).
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-2.5 px-3 text-center border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  Xem Giỏ Hàng
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="py-2.5 px-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
                >
                  <span>Thanh Toán</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
