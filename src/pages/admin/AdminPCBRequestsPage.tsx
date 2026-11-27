import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../lib/db';
import { PCBRequest, PCBOrderStatus, PCBAttachedFile } from '../../lib/types';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { fileStorage } from '../../lib/fileStorage';
import { 
  Layers, 
  Search, 
  Eye, 
  Edit3, 
  CheckCircle, 
  X, 
  FileText, 
  DollarSign, 
  Clock, 
  Save, 
  PhoneCall, 
  Mail, 
  MapPin,
  FileArchive,
  Download,
  Trash2
} from 'lucide-react';

export const AdminPCBRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<PCBRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<PCBRequest | null>(null);

  // Edit fields in modal
  const [editStatus, setEditStatus] = useState<PCBOrderStatus>('pending_quote');
  const [editQuotePrice, setEditQuotePrice] = useState<string>('');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await db.getPCBRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openDetailModal = (req: PCBRequest) => {
    setSelectedRequest(req);
    setEditStatus(req.status);
    setEditQuotePrice(req.quotePrice ? String(req.quotePrice) : '');
    setEditAdminNotes(req.adminNotes || '');
  };

  const handleSaveModal = async () => {
    if (!selectedRequest) return;
    setIsSaving(true);
    try {
      const numPrice = editQuotePrice.trim() ? parseFloat(editQuotePrice) : null;
      await db.updatePCBRequest(selectedRequest.id, {
        status: editStatus,
        statusText: PCB_CONFIG_DATA.STATUSES[editStatus]?.label || 'Đang xử lý',
        quotePrice: numPrice,
        adminNotes: editAdminNotes.trim() || undefined,
      });

      await fetchRequests();
      setSelectedRequest(null);
    } catch (e) {
      alert('Lỗi cập nhật yêu cầu: ' + e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequest = async (id: string, orderCode: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn yêu cầu ${orderCode} không? Thao tác này sẽ xóa vĩnh viễn đơn.`)) {
      await db.deletePCBRequest(id);
      await fetchRequests();
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
    }
  };

  const handleDownloadFile = async (f: PCBAttachedFile | any) => {
    const filename = f.name || String(f);
    const key = f.fileKey || filename;

    // 1. Thử lấy từ IndexedDB
    try {
      const blob = await fileStorage.getFile(key);
      if (blob) {
        fileStorage.downloadBlob(blob, filename);
        return;
      }
    } catch (e) {
      console.warn('Lỗi đọc IndexedDB:', e);
    }

    // 2. Thử tải qua DataUrl / Url nếu có
    if (f.dataUrl || f.url) {
      const a = document.createElement('a');
      a.href = f.dataUrl || f.url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 200);
      return;
    }

    alert(`Không tìm thấy dữ liệu file "${filename}". Có thể do file được gửi từ thiết bị khác hoặc bộ nhớ đệm máy đã bị xóa.`);
  };

  const filteredRequests = requests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchCode = r.orderCode.toLowerCase().includes(q);
      const matchName = r.customerName.toLowerCase().includes(q);
      const matchPhone = r.customerPhone.includes(q);
      if (!matchCode && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Quản Lý Yêu Cầu Gia Công PCB &amp; PCBA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem hồ sơ kỹ thuật, tải file Gerber trực tiếp, nhập báo giá chính thức và xóa đơn khi cần
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Tổng cộng: <b className="text-blue-600">{requests.length}</b> yêu cầu
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Họ tên hoặc Số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 shrink-0">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.values(PCB_CONFIG_DATA.STATUSES).map((st) => (
              <option key={st.key} value={st.key}>{st.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Đang tải danh sách...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">Không tìm thấy yêu cầu PCB nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Mã Đơn / Ngày</th>
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Bo Mạch</th>
                  <th className="py-3.5 px-4">Giá Báo (Admin)</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRequests.map((req) => {
                  const st = PCB_CONFIG_DATA.STATUSES[req.status] || PCB_CONFIG_DATA.STATUSES.pending_quote;
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-blue-600 block">{req.orderCode}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{req.customerName}</div>
                        <div className="font-mono text-slate-500 text-[11px]">{req.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span>{req.specs?.length || 1} bo mạch</span>
                        {req.specs?.[0] && (
                          <span className="block text-slate-400">
                            {req.specs[0].width}x{req.specs[0].height}mm • {req.specs[0].layers}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {req.quotePrice ? (
                          <span className="font-bold text-emerald-600">
                            {Number(req.quotePrice).toLocaleString('vi-VN')} đ
                          </span>
                        ) : (
                          <span className="text-amber-500 font-medium">Chưa báo giá</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.badgeClass}`}>
                          {st.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetailModal(req)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition text-xs inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Chi tiết &amp; Báo giá</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRequest(req.id, req.orderCode)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title={`Xóa đơn ${req.orderCode}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Quote Modal (SỬ DỤNG PORTAL ĐỂ 100% TOÀN MÀN HÌNH KHÔNG BỊ TRÀN HAY CẮT CẢ TRÊN LẪN DƯỚI) */}
      {selectedRequest && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto p-4 sm:p-6 flex justify-center items-start sm:items-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[85vh] my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header (Cố định ở trên, luôn nhìn thấy đầy đủ) */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between shrink-0 sticky top-0 z-10">
              <div>
                <span className="text-xs font-mono text-cyan-400">CHI TIẾT YÊU CẦU PCB</span>
                <h3 className="text-lg font-bold font-mono">{selectedRequest.orderCode}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body (Có cuộn riêng, min-h-0) */}
            <div className="p-4 sm:p-6 overflow-y-auto min-h-0 flex-1 space-y-6 text-xs">
              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block">KHÁCH HÀNG:</span>
                  <b className="text-slate-800 text-sm">{selectedRequest.customerName}</b>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block">SỐ ĐIỆN THOẠI:</span>
                  <a href={`tel:${selectedRequest.customerPhone}`} className="font-mono font-bold text-blue-600 text-sm hover:underline">
                    {selectedRequest.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block">EMAIL:</span>
                  <span className="text-slate-700">{selectedRequest.customerEmail || '—'}</span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-slate-400 font-mono text-[10px] block">ĐỊA CHỈ:</span>
                  <span className="text-slate-700">{selectedRequest.customerAddress || '—'}</span>
                </div>
                {selectedRequest.notes && (
                  <div className="sm:col-span-3 text-slate-700 pt-1 border-t border-slate-200">
                    <span className="font-semibold text-blue-900">Ghi chú của khách:</span> {selectedRequest.notes}
                  </div>
                )}
              </div>

              {/* Specs List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
                  Danh Sách Thông Số Bo Mạch ({selectedRequest.specs?.length || 1})
                </h4>

                <div className="space-y-3">
                  {selectedRequest.specs?.map((spec, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between font-bold text-blue-800 text-sm">
                        <span>Bo #{idx + 1}: {spec.tabName}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-mono font-normal">
                          {spec.serviceType === 'assembly' ? 'Hàn lắp PCBA' : 'Mạch in PCB'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 font-mono text-[11px]">
                        <div>Kích thước: <b>{spec.width}x{spec.height}mm</b></div>
                        <div>Số lượng: <b>{spec.quantity} bo</b></div>
                        <div>Vật liệu: <b>{spec.material}</b></div>
                        <div>Số lớp: <b>{spec.layers}</b></div>
                        <div>Độ dày: <b>{spec.thickness}</b></div>
                        <div>Độ dày đồng: <b>{spec.copperWeight}</b></div>
                        <div>Màu sơn: <b>{spec.maskColor}</b></div>
                        <div>Mạ bề mặt: <b>{spec.surfaceFinish}</b></div>
                        <div>Giao hàng: <b>{spec.deliveryTime}</b></div>
                        <div>Stencil: <b>{spec.stencil}</b></div>
                      </div>

                      {/* Files list with Direct Download Button */}
                      {(spec.files || []).length > 0 && (
                        <div className="pt-2 border-t border-slate-200 space-y-1.5">
                          <span className="font-semibold text-slate-700 block">File đính kèm bo này: </span>
                          <div className="flex flex-wrap gap-2">
                            {spec.files?.map((f, fi) => (
                              <div key={fi} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl shadow-2xs">
                                <FileArchive className="w-4 h-4 text-blue-600 shrink-0" />
                                <div className="font-mono text-slate-800">
                                  <span className="font-bold">{f.name}</span>{' '}
                                  <span className="text-slate-400">({f.size})</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(f)}
                                  className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title={`Tải xuống file ${f.name}`}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Tải về</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote & Status Action Form */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-4">
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Cập Nhật Báo Giá Chính Thức &amp; Trạng Thái Đơn
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Giá báo chính thức cho khách (VNĐ):
                    </label>
                    <input
                      type="number"
                      placeholder="VD: 250000"
                      value={editQuotePrice}
                      onChange={(e) => setEditQuotePrice(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Cập nhật trạng thái tiến độ:
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as PCBOrderStatus)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(PCB_CONFIG_DATA.STATUSES).map((st) => (
                        <option key={st.key} value={st.key}>{st.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Phản hồi kỹ thuật / Ghi chú cho khách (hiển thị khi tra cứu):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="VD: File Gerber đã chuẩn, miễn phí kiểm tra DFM, dự kiến giao sau 10 ngày..."
                      value={editAdminNotes}
                      onChange={(e) => setEditAdminNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons (Ghim cố định ở dưới, không bao giờ bị che) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => handleDeleteRequest(selectedRequest.id, selectedRequest.orderCode)}
                className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Xóa vĩnh viễn đơn yêu cầu này"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Đơn Này</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveModal}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  {isSaving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Lưu Thay Đổi &amp; Gửi Báo Giá</span>
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
