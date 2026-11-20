import React, { useState } from 'react';
import { db } from '../lib/db';
import { PCBRequest, CommerceOrder } from '../lib/types';
import { PCB_CONFIG_DATA } from '../lib/pricing';
import { 
  Search, 
  Layers, 
  Package, 
  CheckCircle, 
  FileText, 
  AlertCircle, 
  Clock, 
  Truck 
} from 'lucide-react';

export const OrderLookupPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pcbOrders, setPcbOrders] = useState<PCBRequest[]>([]);
  const [commerceOrders, setCommerceOrders] = useState<CommerceOrder[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const { commerce, pcb } = await db.lookupOrder(query);
      setPcbOrders(pcb);
      setCommerceOrders(commerce);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { step: 1, label: 'Nhận đơn' },
    { step: 2, label: 'Báo giá' },
    { step: 3, label: 'Khách chốt' },
    { step: 4, label: 'Sản xuất' },
    { step: 5, label: 'Giao hàng' },
    { step: 6, label: 'Hoàn tất' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
          HỆ THỐNG TRA CỨU TIẾN ĐỘ THỜI GIAN THỰC
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
          Tra Cứu Đơn Hàng & Gia Công PCB
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Nhập số điện thoại đặt hàng hoặc mã đơn hàng (VD: 0392733577, PCB-2026-..., TLK-2026-...) để xem tiến độ tức thì.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex gap-2 pt-2">
          <input
            type="text"
            required
            placeholder="Nhập Số điện thoại hoặc Mã đơn hàng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm transition shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Tìm Kiếm</span>
          </button>
        </form>
      </div>

      {/* Results Area */}
      <div className="space-y-6">
        {loading && (
          <div className="text-center py-12 text-slate-500 text-sm">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Đang tìm kiếm đơn hàng trên hệ thống...
          </div>
        )}

        {!loading && hasSearched && pcbOrders.length === 0 && commerceOrders.length === 0 && (
          <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-slate-800">Không tìm thấy đơn hàng nào!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không tìm thấy đơn hàng nào với từ khóa "{query}". Hãy kiểm tra lại số điện thoại hoặc mã đơn.
            </p>
          </div>
        )}

        {/* PCB Orders */}
        {!loading && pcbOrders.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Đơn Gia Công Mạch In PCB ({pcbOrders.length})
            </h3>

            {pcbOrders.map((order) => {
              const st = PCB_CONFIG_DATA.STATUSES[order.status] || PCB_CONFIG_DATA.STATUSES.pending_quote;
              return (
                <div key={order.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-mono text-slate-400">
                        Ngày tạo: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <h4 className="text-lg font-bold font-mono text-blue-600">{order.orderCode}</h4>
                      <span className="text-xs text-slate-500">{order.customerName} • {order.customerPhone}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${st.badgeClass}`}>
                      <i className={`fas ${st.icon}`} />
                      <span>{st.label}</span>
                    </span>
                  </div>

                  {/* 5-Step Timeline */}
                  <div className="py-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Tiến độ sản xuất:
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {steps.map((s, idx) => {
                        const isReached = (st.step || 1) >= s.step;
                        return (
                          <div key={s.step} className="flex flex-col items-center text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isReached ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[10px] mt-1 ${isReached ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quote price */}
                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Giá báo từ Admin:</span>
                      <span className="font-mono font-bold text-emerald-600 text-sm">
                        {order.quotePrice ? `${Number(order.quotePrice).toLocaleString('vi-VN')} đ` : 'Đang thẩm định Gerber...'}
                      </span>
                    </div>
                    {order.adminNotes && (
                      <div className="text-slate-700 pt-1 border-t border-slate-200">
                        <b>Phản hồi:</b> {order.adminNotes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Commerce Orders */}
        {!loading && commerceOrders.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              Đơn Mua Linh Kiện ({commerceOrders.length})
            </h3>

            {commerceOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="text-slate-400 font-mono">Đơn linh kiện • {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                    <h4 className="text-base font-bold font-mono text-blue-600">{order.orderCode}</h4>
                  </div>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {order.totalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="space-y-1 text-slate-700">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{i.quantity}x {i.productName}</span>
                      <span className="font-mono">{i.total.toLocaleString('vi-VN')} đ</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-500">
                  <span>Giao tới: {order.customerAddress}</span>
                  <span className="font-semibold text-blue-700">
                    {order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
