import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../lib/db';
import { PCBRequest, CommerceOrder } from '../../lib/types';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { 
  Search, 
  X, 
  Clock, 
  Layers, 
  Package, 
  CheckCircle, 
  FileText, 
  Phone, 
  AlertCircle,
  Truck,
  DollarSign
} from 'lucide-react';

interface OrderLookupModalProps {
  isOpen: boolean;
  initialQuery?: string;
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  initialQuery = '',
  onClose,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pcbResults, setPcbResults] = useState<PCBRequest[]>([]);
  const [commerceResults, setCommerceResults] = useState<CommerceOrder[]>([]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performLookup(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  const performLookup = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const { commerce, pcb } = await db.lookupOrder(searchTerm);
      setPcbResults(pcb);
      setCommerceResults(commerce);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(query);
  };

  const steps = [
    { step: 1, label: 'Nhận đơn', color: 'bg-amber-500' },
    { step: 2, label: 'Báo giá', color: 'bg-cyan-500' },
    { step: 3, label: 'Khách chốt', color: 'bg-purple-500' },
    { step: 4, label: 'Sản xuất', color: 'bg-emerald-500' },
    { step: 5, label: 'Giao hàng', color: 'bg-sky-500' },
    { step: 6, label: 'Hoàn tất', color: 'bg-teal-500' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto p-4 sm:p-6 flex justify-center items-start sm:items-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] my-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display">
                Tra Cứu Tiến Độ Đơn Hàng
              </h3>
              <p className="text-xs text-slate-300">
                Nhập số điện thoại hoặc mã đơn để theo dõi tiến độ gia công & giao hàng
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập Số điện thoại (VD: 0392733577) hoặc Mã đơn (PCB-..., TLK-...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow flex items-center gap-2 disabled:opacity-60"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Tra Cứu</span>
            </button>
          </form>
        </div>

        {/* Results Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-100">
          {loading && (
            <div className="text-center py-12 text-slate-500 text-sm">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Đang tra cứu dữ liệu đơn hàng...
            </div>
          )}

          {!loading && hasSearched && pcbResults.length === 0 && commerceResults.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Không tìm thấy đơn hàng nào!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Không tìm thấy đơn hàng với thông tin "{query}". Vui lòng kiểm tra lại số điện thoại hoặc mã đơn chính xác.
              </p>
              <div className="pt-2">
                <a
                  href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold border border-emerald-300 transition"
                >
                  Liên hệ Zalo hỗ trợ: {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}
                </a>
              </div>
            </div>
          )}

          {/* PCB Orders Results */}
          {!loading && pcbResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Layers className="w-4 h-4" />
                  ĐƠN ĐẶT GIA CÔNG PCB & PCBA ({pcbResults.length})
                </span>
              </div>

              {pcbResults.map((order) => {
                const st = PCB_CONFIG_DATA.STATUSES[order.status] || PCB_CONFIG_DATA.STATUSES.pending_quote;
                const formattedDate = new Date(order.createdAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs text-slate-400 font-mono">
                          Mã đơn PCB • {formattedDate}
                        </div>
                        <h4 className="text-lg font-bold font-mono text-blue-600 mt-0.5">
                          {order.orderCode}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{order.customerName}</span>
                          <span>•</span>
                          <span className="font-mono">{order.customerPhone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${st.badgeClass}`}>
                          <i className={`fas ${st.icon}`} />
                          <span>{st.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Visual 5-Step Timeline */}
                    <div className="py-2 px-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        TIẾN ĐỘ THỰC HIỆN:
                      </div>
                      <div className="grid grid-cols-6 gap-1 sm:gap-2">
                        {steps.map((s, idx) => {
                          const isReached = (st.step || 1) >= s.step;
                          return (
                            <div key={s.step} className="flex flex-col items-center text-center">
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm ${
                                  isReached
                                    ? 'bg-blue-600 text-white ring-2 ring-blue-600/30'
                                    : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                {idx + 1}
                              </div>
                              <span className={`text-[10px] mt-1 font-medium truncate w-full ${isReached ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Official Quote Price & Admin Notes Box */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Báo giá chính thức từ Admin:</span>
                        <span className="text-base font-bold font-mono text-emerald-600">
                          {order.quotePrice ? `${Number(order.quotePrice).toLocaleString('vi-VN')} đ` : 'Đang xử lý thẩm định file...'}
                        </span>
                      </div>
                      {order.adminNotes && (
                        <div className="pt-1.5 border-t border-slate-200 text-slate-700">
                          <span className="font-semibold text-blue-900">Phản hồi kỹ thuật:</span> {order.adminNotes}
                        </div>
                      )}
                    </div>

                    {/* Specs Details */}
                    <div className="space-y-2 text-xs">
                      {order.specs?.map((spec, i) => (
                        <div key={i} className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 text-slate-700 space-y-1">
                          <div className="font-semibold text-blue-900 flex items-center justify-between">
                            <span>Bo #{i + 1}: {spec.tabName}</span>
                            <span className="text-[11px] font-mono font-normal text-slate-500">
                              {spec.serviceType === 'assembly' ? 'Hàn lắp linh kiện' : 'Gia công mạch in'}
                            </span>
                          </div>
                          <div>• Kích thước: <b>{spec.width} x {spec.height} mm</b> | Số lượng: <b>{spec.quantity} bo</b></div>
                          <div>• Vật liệu: <b>{spec.material}</b> | Số lớp: <b>{spec.layers}</b> | Màu sơn: <b>{spec.maskColor}</b> | Mạ: <b>{spec.surfaceFinish}</b></div>
                          <div>• Vận chuyển: <b>{spec.deliveryTime}</b></div>
                        </div>
                      ))}
                    </div>

                    {/* Attached files */}
                    {order.files && order.files.length > 0 && (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>File đính kèm: <b>{order.files.join(', ')}</b></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Commerce Orders Results */}
          {!loading && commerceResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Package className="w-4 h-4" />
                  ĐƠN MUA LINH KIỆN ĐIỆN TỬ ({commerceResults.length})
                </span>
              </div>

              {commerceResults.map((order) => {
                const formattedDate = new Date(order.createdAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-slate-400 font-mono">Đơn linh kiện • {formattedDate}</span>
                        <h4 className="text-base font-bold font-mono text-blue-600">{order.orderCode}</h4>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-slate-900 block">
                          {order.totalAmount.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-none">
                          <span className="text-slate-700">
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="font-mono text-slate-900 font-medium">
                            {item.total.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500">
                      <span>Địa chỉ: {order.customerAddress}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                        {order.orderStatus === 'completed' ? 'Đã giao' : 'Đang xử lý giao hàng'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
