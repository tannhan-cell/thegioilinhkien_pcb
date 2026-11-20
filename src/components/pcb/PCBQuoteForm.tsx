import React, { useState, useEffect } from 'react';
import { PCBSpec, PCBRequest, PCBAttachedFile, GerberAnalysisResult } from '../../lib/types';
import { estimatePCBPrice, PCB_CONFIG_DATA } from '../../lib/pricing';
import { db } from '../../lib/db';
import { 
  Plus, 
  Trash2, 
  UploadCloud, 
  FileArchive, 
  CheckCircle, 
  Clock, 
  Send, 
  ShieldCheck, 
  Search,
  Sparkles,
  Layers,
  Wrench,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PCBQuoteFormProps {
  currentSpec: PCBSpec;
  onSpecChange: (updated: PCBSpec) => void;
  onOpenLookup: () => void;
  onOrderSuccess: (request: PCBRequest) => void;
}

export const PCBQuoteForm: React.FC<PCBQuoteFormProps> = ({
  currentSpec,
  onSpecChange,
  onOpenLookup,
  onOrderSuccess,
}) => {
  // Specs Tabs State
  const [specs, setSpecs] = useState<Record<number, PCBSpec>>({
    1: currentSpec,
  });
  const [currentTabId, setCurrentTabId] = useState<number>(1);
  const [tabCounter, setTabCounter] = useState<number>(1);

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill customer profile if available
  useEffect(() => {
    const profile = db.getCustomerProfile();
    if (profile.name) setCustomerName(profile.name);
    if (profile.phone) setCustomerPhone(profile.phone);
    if (profile.email) setCustomerEmail(profile.email);
    if (profile.address) setCustomerAddress(profile.address);
  }, []);

  // Update parent when current tab spec changes
  const updateCurrentSpecField = (fields: Partial<PCBSpec>) => {
    setSpecs(prev => {
      const updated = { ...prev[currentTabId], ...fields };
      onSpecChange(updated);
      return { ...prev, [currentTabId]: updated };
    });
  };

  const activeSpec = specs[currentTabId] || currentSpec;

  // Add new spec tab
  const handleAddTab = () => {
    const count = Object.keys(specs).length;
    if (count >= 10) {
      alert('Mỗi yêu cầu nhận tối đa 10 thông số.');
      return;
    }
    const nextId = tabCounter + 1;
    setTabCounter(nextId);

    const newSpec: PCBSpec = {
      ...currentSpec,
      id: nextId,
      specId: nextId,
      tabName: `Thông số ${nextId}`,
      files: [],
    };

    setSpecs(prev => ({ ...prev, [nextId]: newSpec }));
    setCurrentTabId(nextId);
    onSpecChange(newSpec);
  };

  // Remove spec tab
  const handleRemoveTab = (tabId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const keys = Object.keys(specs).map(Number);
    if (keys.length <= 1) return;

    const newSpecs = { ...specs };
    delete newSpecs[tabId];

    const remainingKeys = Object.keys(newSpecs).map(Number);
    const newActiveId = remainingKeys[0];

    setSpecs(newSpecs);
    setCurrentTabId(newActiveId);
    onSpecChange(newSpecs[newActiveId]);
  };

  // Switch tab
  const handleSwitchTab = (tabId: number) => {
    setCurrentTabId(tabId);
    onSpecChange(specs[tabId]);
  };

  // Handle File Upload per tab
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: PCBAttachedFile[] = Array.from(files).map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'file',
    }));

    const currentFiles = activeSpec.files || [];
    if (currentFiles.length + newFiles.length > 5) {
      alert('Mỗi thông số nhận tối đa 5 file.');
      return;
    }

    updateCurrentSpecField({ files: [...currentFiles, ...newFiles] });
    e.target.value = '';
  };

  // Remove attached file
  const handleRemoveFile = (index: number) => {
    const updatedFiles = (activeSpec.files || []).filter((_, i) => i !== index);
    updateCurrentSpecField({ files: updatedFiles });
  };

  // Price estimate for current tab
  const estimatedPrice = estimatePCBPrice(activeSpec);

  // Submit quote request
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 9) {
      setErrorMessage('Vui lòng nhập Số điện thoại hợp lệ (tối thiểu 9 chữ số) để kỹ thuật viên liên hệ báo giá!');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Vui lòng tích đồng ý với điều khoản dịch vụ và chính sách bảo mật!');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save profile for subsequent visits
      db.saveCustomerProfile({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
      });

      const allSpecsList: PCBSpec[] = Object.values(specs);

      // Collect all file names
      const allFileNames: string[] = allSpecsList.flatMap(s => (s.files || []).map(f => f.name));

      const newRequest = await db.createPCBRequest({
        customerName: customerName || 'Khách Hàng',
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerAddress: customerAddress.trim() || undefined,
        notes: notes.trim() || undefined,
        specs: allSpecsList,
        estimatedPrice: estimatedPrice || null,
        files: allFileNames,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onOrderSuccess(newRequest);

    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi gửi yêu cầu báo giá. Vui lòng liên hệ trực tiếp qua Zalo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden text-slate-800">
      {/* Top Header & Service Tabs */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              CÔNG CỤ TÍNH BÁO GIÁ TRỰC TUYẾN
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5 text-white">
              Cấu Hình Mạch In & Hàn Lắp
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenLookup}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-mono font-medium transition shadow"
          >
            <Search className="w-3.5 h-3.5" />
            Tra cứu đơn hàng
          </button>
        </div>

        {/* Service Type Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/60 rounded-xl border border-slate-700/60 max-w-md">
          <button
            type="button"
            onClick={() => updateCurrentSpecField({ serviceType: 'pcb' })}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
              activeSpec.serviceType === 'pcb'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Gia Công Mạch In (PCB)
          </button>
          <button
            type="button"
            onClick={() => updateCurrentSpecField({ serviceType: 'assembly' })}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
              activeSpec.serviceType === 'assembly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Hàn Lắp Linh Kiện (PCBA)
          </button>
        </div>
      </div>

      {/* Multi-Tab Specification Tabs */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto">
        {Object.entries(specs).map(([idStr, spec]) => {
          const tabId = Number(idStr);
          const isActive = tabId === currentTabId;
          return (
            <div
              key={tabId}
              onClick={() => handleSwitchTab(tabId)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition select-none ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-300 font-semibold'
                  : 'text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span>{spec.tabName}</span>
              {Object.keys(specs).length > 1 && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveTab(tabId, e)}
                  className="p-0.5 text-slate-400 hover:text-rose-500 rounded transition"
                  title="Xóa thông số này"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={handleAddTab}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 border border-dashed border-blue-300 transition"
        >
          <Plus className="w-3 h-3" />
          Thêm Bo Mạch
        </button>
      </div>

      {/* Main Spec Form Body */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Assembly specific code inputs */}
        {activeSpec.serviceType === 'assembly' && (
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-blue-600" />
              Thông Tin Hàn Lắp PCB Assembly
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Mã đơn mua linh kiện tại shop (nếu có):</label>
                <input
                  type="text"
                  placeholder="VD: TLK-2026-123456"
                  value={activeSpec.componentOrderCode || ''}
                  onChange={(e) => updateCurrentSpecField({ componentOrderCode: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Mã đơn đặt PCB tương ứng (nếu có):</label>
                <input
                  type="text"
                  placeholder="VD: PCB-2026-987654"
                  value={activeSpec.pcbOrderCode || ''}
                  onChange={(e) => updateCurrentSpecField({ pcbOrderCode: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1.5 text-xs">Mặt cần dán & hàn linh kiện:</label>
              <div className="flex flex-wrap gap-2">
                {['Mặt Top (Trên)', 'Mặt Bottom (Dưới)', 'Cả 2 mặt (Top & Bot)'].map((side) => {
                  const isChecked = (activeSpec.assemblySides || []).includes(side);
                  return (
                    <label
                      key={side}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentSides = activeSpec.assemblySides || [];
                          const updated = e.target.checked
                            ? [...currentSides, side]
                            : currentSides.filter(s => s !== side);
                          updateCurrentSpecField({ assemblySides: updated });
                        }}
                        className="hidden"
                      />
                      <span>{side}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Board Dimensions */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. Kích Thước Bo Mạch (Dài x Rộng mm)
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={activeSpec.width}
                  onChange={(e) => updateCurrentSpecField({ width: Math.max(10, parseFloat(e.target.value) || 10) })}
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">mm</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Chiều rộng bo</span>
            </div>
            <div>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={activeSpec.height}
                  onChange={(e) => updateCurrentSpecField({ height: Math.max(10, parseFloat(e.target.value) || 10) })}
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">mm</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Chiều dài bo</span>
            </div>
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Số Lượng Bo Mạch (Pcs)
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            {['5', '10', '15', '20', '25', '30', '50', '100'].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => updateCurrentSpecField({ quantity: qty })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                  String(activeSpec.quantity) === qty
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {qty} bo
              </button>
            ))}
            <div className="flex items-center gap-1.5 pl-2">
              <span className="text-xs text-slate-500">Hoặc tùy chỉnh:</span>
              <input
                type="number"
                min="1"
                placeholder="Số khác"
                value={activeSpec.quantity}
                onChange={(e) => updateCurrentSpecField({ quantity: e.target.value })}
                className="w-20 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Delivery Time */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Thời Gian Giao Hàng & Vận Chuyển
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                name: 'Đường bộ tiết kiệm: 13 - 17 Ngày (TB: 10.7 ngày)',
                desc: 'Phù hợp làm đồ án, thử nghiệm mẫu R&D tiết kiệm chi phí tối đa'
              },
              {
                name: 'Đường bay hỏa tốc: 5 - 7 Ngày',
                desc: 'Giao hỏa tốc bằng đường hàng không, ưu tiên dây chuyền sản xuất gấp'
              }
            ].map((option) => {
              const isSelected = activeSpec.deliveryTime.startsWith(option.name.substring(0, 15));
              return (
                <div
                  key={option.name}
                  onClick={() => updateCurrentSpecField({ deliveryTime: option.name })}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                    <span>{option.name}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{option.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solder Mask Color (3D synced) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            4. Màu Lớp Phủ Hàn (Solder Mask Color) - Cập nhật trực tiếp 3D
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Xanh lá', bg: 'bg-[#0a632d]', border: 'border-green-600' },
              { name: 'Xanh dương', bg: 'bg-[#0c4a9e]', border: 'border-blue-700' },
              { name: 'Đỏ', bg: 'bg-[#a81c1c]', border: 'border-red-700' },
              { name: 'Đen', bg: 'bg-[#141416]', border: 'border-black' },
              { name: 'Trắng', bg: 'bg-[#eceff1]', border: 'border-slate-400' },
              { name: 'Vàng', bg: 'bg-[#eab308]', border: 'border-yellow-500' },
              { name: 'Tím', bg: 'bg-[#6b21a8]', border: 'border-purple-700' },
              { name: 'Không phủ', bg: 'bg-amber-800', border: 'border-amber-700' },
            ].map((col) => {
              const isSelected = activeSpec.maskColor === col.name;
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => updateCurrentSpecField({ maskColor: col.name })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${col.bg} border ${col.border}`} />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Surface Finish & Thickness & Layers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Layers */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              5. Số Lớp Bo (Layers)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['1 Lớp', '2 Lớp', '4 Lớp', '6 Lớp'].map((layer) => (
                <button
                  key={layer}
                  type="button"
                  onClick={() => updateCurrentSpecField({ layers: layer })}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition ${
                    activeSpec.layers === layer
                      ? 'bg-blue-600 text-white border-blue-600 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* Thickness */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              6. Độ Dày Bo (Thickness)
            </label>
            <select
              value={activeSpec.thickness}
              onChange={(e) => updateCurrentSpecField({ thickness: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {['0.4mm', '0.6mm', '0.8mm', '1.0mm', '1.2mm', '1.6mm', '2.0mm', '2.5mm', '3.0mm'].map((t) => (
                <option key={t} value={t}>{t} (Tiêu chuẩn phổ biến: 1.6mm)</option>
              ))}
            </select>
          </div>

          {/* Surface Finish */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              7. Mạ Bề Mặt (Finish)
            </label>
            <select
              value={activeSpec.surfaceFinish}
              onChange={(e) => updateCurrentSpecField({ surfaceFinish: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Mạ Thiếc">Mạ Thiếc (HASL chì - Rẻ & Dễ hàn)</option>
              <option value="Mạ Vàng">Mạ Vàng (ENIG - Phẳng tuyệt đối cho BGA/SMD)</option>
              <option value="Mạ OSP">Mạ OSP (Bảo vệ đồng hữu cơ)</option>
              <option value="Mạ Thiếc không chì">Mạ Thiếc không chì (HASL Lead-free RoHS)</option>
            </select>
          </div>
        </div>

        {/* Technical Specs: Copper weight, Min trace, Min drill, Stencil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Độ Dày Đồng:</label>
            <select
              value={activeSpec.copperWeight}
              onChange={(e) => updateCurrentSpecField({ copperWeight: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
            >
              {['0.5oz', '1.0oz', '1.5oz', '2.0oz'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Min Trace/Space:</label>
            <select
              value={activeSpec.minTrace}
              onChange={(e) => updateCurrentSpecField({ minTrace: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="0.15mm (6mils) ↑">0.15mm (6mils) ↑ Tiêu chuẩn</option>
              <option value="0.1mm (4mils) ↑">0.1mm (4mils) ↑ Cao cấp</option>
              <option value="< 0.1mm (4mils) ↓">&lt; 0.1mm (4mils) ↓ Siêu mịn</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lỗ Khoan Nhỏ Nhất:</label>
            <select
              value={activeSpec.minDrill}
              onChange={(e) => updateCurrentSpecField({ minDrill: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="0.3mm ↑">0.3mm ↑ Tiêu chuẩn</option>
              <option value="0.2mm ↑">0.2mm ↑ Lỗ nhỏ</option>
              <option value="< 0.2mm ↓">&lt; 0.2mm ↓ Micro-via</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mặt Nạ Hàn (Stencil):</label>
            <select
              value={activeSpec.stencil}
              onChange={(e) => updateCurrentSpecField({ stencil: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="Không">Không</option>
              <option value="Không khung">Không khung (+80.000đ)</option>
              <option value="Có khung">Có khung (+200.000đ)</option>
            </select>
          </div>
        </div>

        {/* Extra Requirements Checkboxes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            8. Yêu Cầu Kỹ Thuật Bổ Sung (Tùy chọn)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Kiểm soát trở kháng (Impedance Control)',
              'Mạ nửa lỗ (Castellated Holes)',
              'Hàn linh kiện (từ 20 mạch)'
            ].map((req) => {
              const isChecked = activeSpec.extraRequirements.includes(req);
              return (
                <label
                  key={req}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition ${
                    isChecked
                      ? 'bg-blue-50 text-blue-800 border-blue-400 font-medium'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...activeSpec.extraRequirements, req]
                        : activeSpec.extraRequirements.filter(r => r !== req);
                      updateCurrentSpecField({ extraRequirements: updated });
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{req}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Drag & Drop File Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            9. Tải Lên File Thiết Kế (Gerber .ZIP, BOM .XLSX, Pick&Place .TXT)
          </label>
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50 hover:bg-blue-50/40 transition cursor-pointer text-center group">
            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-600 transition mb-2" />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
              Kéo thả hoặc nhấp để tải file thiết kế cho {activeSpec.tabName}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Chấp nhận file Gerber ZIP, BOM CSV/Excel, CPL (Tối đa 20MB/file, tối đa 5 file/bo)
            </span>
            <input
              type="file"
              multiple
              accept=".zip,.rar,.csv,.xlsx,.xls,.txt,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Uploaded File List */}
          {(activeSpec.files || []).length > 0 && (
            <div className="space-y-1.5 pt-1">
              {activeSpec.files?.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileArchive className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-mono text-slate-800 truncate font-medium">{file.name}</span>
                    <span className="text-slate-400 shrink-0">({file.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition shrink-0"
                    title="Xóa file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Estimated Price Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-cyan-400 font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              GIÁ DỰ KIẾN THAM KHẢO CHO {activeSpec.tabName.toUpperCase()}
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300 mt-1">
              {estimatedPrice ? `${estimatedPrice.toLocaleString('vi-VN')} đ` : 'Báo giá trực tiếp qua Zalo/SĐT'}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              * Giá mang tính chất tham khảo chuẩn xác theo diện tích & thông số. Kỹ thuật viên sẽ kiểm tra Gerber và gửi báo giá chốt chính thức.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono">
              Miễn phí DFM check
            </span>
          </div>
        </div>

        {/* Customer Contact Form */}
        <form onSubmit={handleSubmitQuote} className="space-y-4 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-4 h-4 text-blue-600" />
              10. Thông Tin Liên Hệ Nhận Báo Giá
            </h3>
            <span className="text-xs text-slate-400 font-mono">* SĐT là bắt buộc</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Họ và tên của bạn:</label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Số điện thoại liên hệ <span className="text-rose-500">*</span>:
              </label>
              <input
                type="tel"
                required
                placeholder="VD: 0392733577"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Email nhận file báo giá PDF (tùy chọn):</label>
              <input
                type="email"
                placeholder="VD: example@gmail.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Địa chỉ nhận mạch (Tỉnh/Thành):</label>
              <input
                type="text"
                placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1 text-xs">Ghi chú kỹ thuật bổ sung:</label>
            <textarea
              rows={2}
              placeholder="VD: Mạch cần phủ thêm lớp chống ẩm, test xung nguồn, đóng gói chân cắm riêng..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          {/* Privacy Consent Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>
              Tôi đồng ý gửi thông số kỹ thuật và cam kết file Gerber/BOM được bảo mật 100% theo chính sách bảo mật của Thế Giới Linh Kiện & PCB.
            </span>
          </label>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-60 text-sm tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>ĐANG GỬI THÔNG TIN BÁO GIÁ...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>GỬI YÊU CẦU BÁO GIÁ NGAY ({Object.keys(specs).length} BO MẠCH)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
