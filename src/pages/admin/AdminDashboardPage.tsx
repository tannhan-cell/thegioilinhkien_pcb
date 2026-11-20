import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { PCBRequest, CommerceOrder, Product } from '../../lib/types';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { 
  DollarSign, 
  Layers, 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  AlertTriangle 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [pcbRequests, setPcbRequests] = useState<PCBRequest[]>([]);
  const [orders, setOrders] = useState<CommerceOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRequests, comOrders, prodList] = await Promise.all([
          db.getPCBRequests(),
          db.getCommerceOrders(),
          db.getProducts(),
        ]);
        setPcbRequests(pRequests);
        setOrders(comOrders);
        setProducts(prodList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingQuotesCount = pcbRequests.filter(r => r.status === 'pending_quote').length;
  const lowStockProducts = products.filter(p => p.stock <= 50);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
          Bảng Điều Khiển Quản Trị (Dashboard)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tổng quan chỉ số kinh doanh linh kiện và dịch vụ gia công PCB
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Doanh Thu Linh Kiện</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalRevenue.toLocaleString('vi-VN')} đ
          </div>
          <span className="text-[11px] text-slate-400">Từ {orders.length} đơn hàng</span>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Yêu Cầu Chờ Báo Giá</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">
            {pendingQuotesCount} yêu cầu
          </div>
          <span className="text-[11px] text-slate-400">Cần kỹ thuật viên thẩm định</span>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Tổng Đơn Gia Công PCB</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-600">
            {pcbRequests.length} đơn
          </div>
          <span className="text-[11px] text-slate-400">PCB & PCB Assembly</span>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Mã Linh Kiện Trong Kho</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {products.length} sản phẩm
          </div>
          <span className="text-[11px] text-slate-400">{lowStockProducts.length} sản phẩm sắp hết hàng</span>
        </div>
      </div>

      {/* Grid: Latest PCB Requests & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Latest PCB Requests */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Yêu Cầu PCB Mới Nhất
            </h3>
            <Link to="/admin/pcb-requests" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pcbRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">Chưa có yêu cầu PCB nào.</div>
          ) : (
            <div className="space-y-3">
              {pcbRequests.slice(0, 5).map((req) => {
                const st = PCB_CONFIG_DATA.STATUSES[req.status] || PCB_CONFIG_DATA.STATUSES.pending_quote;
                return (
                  <div key={req.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-mono font-bold text-blue-600">{req.orderCode}</div>
                      <div className="text-slate-500 mt-0.5">{req.customerName} • {req.customerPhone}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{req.specs?.length || 1} bo mạch</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.badgeClass}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Latest Commerce Orders */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              Đơn Mua Linh Kiện Mới Nhất
            </h3>
            <Link to="/admin/orders" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">Chưa có đơn hàng linh kiện nào.</div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-mono font-bold text-blue-600">{order.orderCode}</div>
                    <div className="text-slate-500 mt-0.5">{order.customerName} • {order.customerPhone}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">
                      {order.totalAmount.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {order.orderStatus === 'completed' ? 'Hoàn tất' : 'Đang xử lý'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
