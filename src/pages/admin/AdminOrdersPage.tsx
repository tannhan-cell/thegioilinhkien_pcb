import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../lib/db';
import { CommerceOrder, CommerceOrderStatus, PaymentStatus } from '../../lib/types';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  DollarSign, 
  X, 
  Save, 
  Package,
  MapPin,
  PhoneCall,
  Trash2
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<CommerceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CommerceOrder | null>(null);

  // Edit fields
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('pending');
  const [editOrderStatus, setEditOrderStatus] = useState<CommerceOrderStatus>('pending_payment');
  const [isSaving, setIsSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await db.getCommerceOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order: CommerceOrder) => {
    setSelectedOrder(order);
    setEditPaymentStatus(order.paymentStatus);
    setEditOrderStatus(order.orderStatus);
  };

  const handleSaveModal = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      await db.updateCommerceOrder(selectedOrder.id, {
        paymentStatus: editPaymentStatus,
        orderStatus: editOrderStatus,
      });
      await fetchOrders();
      setSelectedOrder(null);
    } catch (e) {
      alert('Lỗi cập nhật: ' + e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOrder = async (id: string, code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${code} không? Thao tác này sẽ xóa vĩnh viễn đơn.`)) {
      await db.deleteCommerceOrder(id);
      await fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  const filteredOrders = orders.filter(o => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchCode = o.orderCode.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      if (!matchCode && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Quản Lý Đơn Hàng Mua Linh Kiện
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi tình trạng đơn đặt linh kiện, cập nhật thanh toán, trạng thái giao hàng và xóa đơn khi cần
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Tổng số đơn: <b className="text-blue-600">{orders.length}</b>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm theo Mã đơn (TLK-...), Tên khách hoặc Số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Đang tải danh sách...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">Chưa có đơn hàng linh kiện nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Mã Đơn / Ngày</th>
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Tổng Tiền</th>
                  <th className="py-3.5 px-4">Phương Thức</th>
                  <th className="py-3.5 px-4">Thanh Toán</th>
                  <th className="py-3.5 px-4">Vận Chuyển</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-blue-600 block">{o.orderCode}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{o.customerName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{o.customerPhone}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {o.totalAmount.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {o.paymentMethod === 'cod' ? 'Thanh toán COD' : 'VietQR Chuyển khoản'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        o.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}>
                        {o.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {o.orderStatus === 'completed' ? 'Hoàn tất' : o.orderStatus === 'shipping' ? 'Đang giao' : 'Đang xử lý'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openModal(o)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition text-xs"
                        >
                          Xem &amp; Cập nhật
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(o.id, o.orderCode)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title={`Xóa đơn ${o.orderCode}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal (SỬ DỤNG PORTAL ĐỂ 100% TOÀN MÀN HÌNH KHÔNG BỊ TRÀN HAY CẮT CẢ TRÊN LẪN DƯỚI) */}
      {selectedOrder && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto p-4 sm:p-6 flex justify-center items-start sm:items-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between shrink-0 sticky top-0 z-10">
              <div>
                <span className="text-xs font-mono text-cyan-400">CHI TIẾT ĐƠN HÀNG LINH KIỆN</span>
                <h3 className="text-lg font-bold font-mono">{selectedOrder.orderCode}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto min-h-0 space-y-5 text-xs flex-1">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div><b>Người nhận:</b> {selectedOrder.customerName} - <b>SĐT:</b> {selectedOrder.customerPhone}</div>
                <div><b>Địa chỉ:</b> {selectedOrder.customerAddress}</div>
                {selectedOrder.notes && <div><b>Ghi chú:</b> {selectedOrder.notes}</div>}
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Danh Sách Món</h4>
                <div className="space-y-1.5 border border-slate-200 rounded-2xl p-3 bg-white">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                      <span>{it.quantity}x {it.productName} ({it.sku})</span>
                      <span className="font-mono font-bold text-slate-800">{it.total.toLocaleString('vi-VN')} đ</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Tổng đơn:</span>
                    <span className="font-mono text-blue-700">{selectedOrder.totalAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Trạng thái thanh toán:</label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="pending">Chờ thanh toán</option>
                    <option value="paid">Đã thanh toán thành công</option>
                    <option value="failed">Thanh toán thất bại</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Trạng thái đơn hàng:</label>
                  <select
                    value={editOrderStatus}
                    onChange={(e) => setEditOrderStatus(e.target.value as CommerceOrderStatus)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="pending_payment">Chờ xử lý</option>
                    <option value="processing">Đang đóng gói</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="completed">Đã giao thành công</option>
                    <option value="cancelled">Đã hủy đơn</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.orderCode)}
                className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Xóa vĩnh viễn đơn hàng này"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Đơn Này</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Cập Nhật</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
