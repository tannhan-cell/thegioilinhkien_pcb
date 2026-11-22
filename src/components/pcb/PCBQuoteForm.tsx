import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PCBSpec, PCBRequest, PCBAttachedFile, ServiceType } from '../../lib/types';
import { estimatePCBPrice, PCB_CONFIG_DATA } from '../../lib/pricing';
import { analyzeGerberZip } from '../../lib/gerberParser';
import { db } from '../../lib/db';
import { 
  Plus, 
  Trash2, 
  UploadCloud, 
  FileArchive, 
  Send, 
  AlertCircle,
  FileText,
  Ruler,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PCBQuoteFormProps {
  currentSpec: PCBSpec;
  activeService: ServiceType; // 'pcb' or 'assembly'
  onSpecChange: (updated: PCBSpec) => void;
  onOpenLookup: () => void;
  onOrderSuccess: (request: PCBRequest) => void;
}

const DEFAULT_PCB_SPEC: PCBSpec = {
  id: 1,
  specId: 1,
  tabName: 'THÔNG SỐ 1',
  serviceType: 'pcb',
  width: 100,
  height: 80,
  deliveryTime: '13 - 17 Ngày (Trung bình 50 đơn gần nhất: 10.8 ngày)',
  quantity: '10',
  material: 'FR-4',
  layers: '2 Lớp',
  thickness: '1.6mm',
  copperWeight: '1.0oz',
  surfaceFinish: 'Mạ Thiếc',
  maskColor: 'Xanh lá',
  minTrace: '0.15mm (6mils) ↑',
  minDrill: '0.3mm ↑',
  bgaPitch: 'Không có',
  stencil: 'Không',
  extraRequirements: [],
  shippingMethod: 'ViettelPost',
  files: [],
};

const DEFAULT_ASSEMBLY_SPEC: PCBSpec = {
  id: 1,
  specId: 1,
  tabName: 'THÔNG SỐ 1',
  serviceType: 'assembly',
  width: 100,
  height: 80,
  deliveryTime: '13 - 17 Ngày (Trung bình 50 đơn gần nhất: 10.8 ngày)',
  quantity: '10',
  material: 'FR-4',
  layers: '2 Lớp',
  thickness: '1.6mm',
  copperWeight: '1.0oz',
  surfaceFinish: 'Mạ Vàng',
  maskColor: 'Xanh lá',
  minTrace: '0.15mm (6mils) ↑',
  minDrill: '0.3mm ↑',
  bgaPitch: 'Không có',
  stencil: 'Không',
  extraRequirements: [],
  shippingMethod: 'ViettelPost',
  assemblyReqs: ['SMT mặt TOP', 'Hàn cắm mặt TOP'],
  componentOrderCode: '',
  pcbOrderCode: '',
  files: [],
};

export const PCBQuoteForm: React.FC<PCBQuoteFormProps> = ({
  currentSpec,
  activeService,
  onSpecChange,
  onOpenLookup,
  onOrderSuccess,
}) => {
  // SEPARATE STATE FOR PCB AND ASSEMBLY (100% ISOLATED)
  const [pcbSpecs, setPcbSpecs] = useState<Record<number, PCBSpec>>({
    1: { ...DEFAULT_PCB_SPEC, ...currentSpec, serviceType: 'pcb', files: currentSpec.files || [] },
  });
  const [pcbTabId, setPcbTabId] = useState<number>(1);
  const [pcbTabCounter, setPcbTabCounter] = useState<number>(1);

  const [assemblySpecs, setAssemblySpecs] = useState<Record<number, PCBSpec>>({
    1: { ...DEFAULT_ASSEMBLY_SPEC, serviceType: 'assembly', files: [] },
  });
  const [assemblyTabId, setAssemblyTabId] = useState<number>(1);
  const [assemblyTabCounter, setAssemblyTabCounter] = useState<number>(1);

  // Customer Contact Fields
  const [customerCode, setCustomerCode] = useState('CXT' + Math.floor(100000 + Math.random() * 900000));
  const [customerName, setCustomerName] = useState('Võ Tấn Nhân');
  const [customerPhone, setCustomerPhone] = useState('0392733577');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [parsingNotice, setParsingNotice] = useState<string | null>(null);

  const isPCB = activeService === 'pcb';

  // Load customer profile from DB
  useEffect(() => {
    const profile = db.getCustomerProfile();
    if (profile.name) setCustomerName(profile.name);
    if (profile.phone) setCustomerPhone(profile.phone);
    if (profile.email) setCustomerEmail(profile.email);
    if (profile.address) setCustomerAddress(profile.address);
  }, []);

  // Get active spec according to current activeService
  const activeSpec: PCBSpec = isPCB 
    ? (pcbSpecs[pcbTabId] || DEFAULT_PCB_SPEC) 
    : (assemblySpecs[assemblyTabId] || DEFAULT_ASSEMBLY_SPEC);

  // Notify parent of spec changes for 3D viewer
  useEffect(() => {
    onSpecChange(activeSpec);
  }, [activeService, pcbTabId, assemblyTabId, pcbSpecs, assemblySpecs]);

  const updateCurrentSpecField = (fields: Partial<PCBSpec>) => {
    if (isPCB) {
      setPcbSpecs(prev => {
        const updated = { ...prev[pcbTabId], ...fields };
        return { ...prev, [pcbTabId]: updated };
      });
    } else {
      setAssemblySpecs(prev => {
        const updated = { ...prev[assemblyTabId], ...fields };
        return { ...prev, [assemblyTabId]: updated };
      });
    }
  };

  // Add Spec Tab
  const handleAddTab = () => {
    if (isPCB) {
      const count = Object.keys(pcbSpecs).length;
      if (count >= 10) return alert('Mỗi yêu cầu nhận tối đa 10 thông số.');
      const nextId = pcbTabCounter + 1;
      setPcbTabCounter(nextId);
      const newSpec: PCBSpec = {
        ...DEFAULT_PCB_SPEC,
        id: nextId,
        specId: nextId,
        tabName: `THÔNG SỐ ${nextId}`,
        serviceType: 'pcb',
        files: [],
      };
      setPcbSpecs(prev => ({ ...prev, [nextId]: newSpec }));
      setPcbTabId(nextId);
    } else {
      const count = Object.keys(assemblySpecs).length;
      if (count >= 10) return alert('Mỗi yêu cầu nhận tối đa 10 thông số.');
      const nextId = assemblyTabCounter + 1;
      setAssemblyTabCounter(nextId);
      const newSpec: PCBSpec = {
        ...DEFAULT_ASSEMBLY_SPEC,
        id: nextId,
        specId: nextId,
        tabName: `THÔNG SỐ ${nextId}`,
        serviceType: 'assembly',
        files: [],
      };
      setAssemblySpecs(prev => ({ ...prev, [nextId]: newSpec }));
      setAssemblyTabId(nextId);
    }
  };

  // Remove Spec Tab
  const handleRemoveTab = (tabId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPCB) {
      const keys = Object.keys(pcbSpecs).map(Number);
      if (keys.length <= 1) return;
      const next = { ...pcbSpecs };
      delete next[tabId];
      const remaining = Object.keys(next).map(Number);
      setPcbSpecs(next);
      setPcbTabId(remaining[0]);
    } else {
      const keys = Object.keys(assemblySpecs).map(Number);
      if (keys.length <= 1) return;
      const next = { ...assemblySpecs };
      delete next[tabId];
      const remaining = Object.keys(next).map(Number);
      setAssemblySpecs(next);
      setAssemblyTabId(remaining[0]);
    }
  };

  // Upload file - Completely isolated per service and per tab
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setParsingNotice(null);
    const newFiles: PCBAttachedFile[] = Array.from(fileList).map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'file',
    }));

    const curFiles = activeSpec.files || [];
    if (curFiles.length + newFiles.length > 5) {
      alert('Mỗi thông số nhận tối đa 5 file.');
      return;
    }

    const updatedFiles = [...curFiles, ...newFiles];
    updateCurrentSpecField({ files: updatedFiles });

    // If it's a Gerber ZIP file in PCB mode: Auto extract dimensions!
    const zipFile = Array.from(fileList).find(f => f.name.toLowerCase().endsWith('.zip'));
    if (isPCB && zipFile) {
      try {
        const analysis = await analyzeGerberZip(zipFile);
        if (analysis.success && analysis.boardWidthMm && analysis.boardHeightMm) {
          updateCurrentSpecField({
            width: analysis.boardWidthMm,
            height: analysis.boardHeightMm,
            files: updatedFiles,
          });
          setParsingNotice(`✓ Đã tự động nhận diện kích thước chính xác từ file Gerber: ${analysis.boardWidthMm} x ${analysis.boardHeightMm} mm`);
        }
      } catch (err) {
        console.warn('Lỗi phân tích file Gerber:', err);
      }
    }

    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    const updated = (activeSpec.files || []).filter((_, i) => i !== index);
    updateCurrentSpecField({ files: updated });
  };

  const estimatedPrice = isPCB ? estimatePCBPrice(activeSpec) : null;

  // Handle Form Submit
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!termsAccepted) {
      setErrorMessage('Quý khách vui lòng tích chọn đồng ý với Điều khoản sử dụng, Chính sách bảo mật và Chính sách hỗ trợ.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 9) {
      setErrorMessage('Vui lòng nhập Số điện thoại hợp lệ (tối thiểu 9 chữ số) để kỹ thuật viên liên hệ báo giá!');
      return;
    }

    setIsSubmitting(true);
    try {
      db.saveCustomerProfile({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
      });

      const currentSpecsList = isPCB ? Object.values(pcbSpecs) : Object.values(assemblySpecs);
      const allFileNames = currentSpecsList.flatMap(s => (s.files || []).map(f => f.name));

      const newRequest = await db.createPCBRequest({
        customerName: customerName || 'Khách Hàng',
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerAddress: customerAddress.trim() || undefined,
        notes: notes.trim() || undefined,
        specs: currentSpecsList,
        estimatedPrice: estimatedPrice || null,
        files: allFileNames,
      });

      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {}

      onOrderSuccess(newRequest);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi gửi yêu cầu báo giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTabs = isPCB ? pcbSpecs : assemblySpecs;
  const currentTab = isPCB ? pcbTabId : assemblyTabId;

  return (
    <form onSubmit={handleSubmitQuote} className="space-y-5 text-slate-800 text-[13px] font-sans">
      {/* 1. KHỐI THÔNG TIN LIÊN HỆ */}
      <div className="bg-white border-2 border-[#004d26] rounded-sm p-4 space-y-3 shadow-xs">
        <h3 className="font-bold text-[13px] text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">
          THÔNG TIN LIÊN HỆ
        </h3>

        {/* If assembly: Show red notes banner as in Image 3 */}
        {!isPCB && (
          <div className="p-3 bg-red-50/80 border border-red-200 text-red-700 text-xs space-y-1 font-medium leading-relaxed">
            <div>• Quý khách gửi file và yêu cầu đến email <b>smt@thegioilinhkienpcb.vn</b> hoặc đặt online với form dưới</div>
            <div>• CXT cam kết bảo mật file thiết kế của khách hàng</div>
            <div>• Nếu quý khách đã đặt linh kiện, mạch in vui lòng nhập mã đơn hàng tương ứng</div>
            <div>• File đính kèm bao gồm: <b>BOM + Gerber + Pick and Place file</b>. Hoặc: <b>BOM + PCB file</b></div>
            <div>• Thêm <b>TAB THÔNG SỐ</b> để đặt thêm mạch cần hàn lắp</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Left inputs */}
          <div className="md:col-span-5 space-y-2">
            <div className="grid grid-cols-3 items-center gap-2">
              <label className="text-[12px] font-medium text-slate-600">Mã KH / Số ĐT:</label>
              <input
                type="text"
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
                className="col-span-2 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <label className="text-[12px] font-medium text-slate-600">Họ tên:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="col-span-2 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <label className="text-[12px] font-medium text-slate-600">Điện thoại <span className="text-red-500">*</span>:</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="col-span-2 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-blue-700"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <label className="text-[12px] font-medium text-slate-600">Địa chỉ:</label>
              <input
                type="text"
                placeholder="Số nhà, đường, quận/huyện..."
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="col-span-2 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <label className="text-[12px] font-medium text-slate-600">Email:</label>
              <input
                type="email"
                placeholder="email@..."
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="col-span-2 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          {/* Center Notice Box */}
          {isPCB ? (
            <div className="md:col-span-4 p-2.5 bg-amber-50/70 border border-amber-200 rounded text-[11px] space-y-1.5 text-slate-700 leading-snug">
              <div className="font-bold text-red-600 uppercase">
                GIÁ MẠCH MẪU (dưới 10x10cm, 2 lớp, thông số mặc định):
              </div>
              <div className="font-semibold text-slate-900">
                • 5 mạch: <span className="text-red-600 font-bold">149.000đ</span> | 10 mạch: <span className="text-red-600 font-bold">199.000đ</span> (Đường bộ)
              </div>
              <div className="font-semibold text-slate-900">
                • 5 mạch: <span className="text-red-600 font-bold">349.000đ</span> | 10 mạch: <span className="text-red-600 font-bold">399.000đ</span> (Đường bay)
              </div>
              <div className="font-bold text-red-600 pt-0.5">GIÁ MẠCH SẢN XUẤT (theo m2): Liên hệ qua Zalo!</div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-200">
                Mạch in luôn được kiểm tra sau khi sản xuất để đảm bảo không có lỗi. Cam kết bảo mật file thiết kế của khách hàng.
              </div>
            </div>
          ) : (
            <div className="md:col-span-4 p-2.5 bg-blue-50/70 border border-blue-200 rounded text-[11px] space-y-1 text-slate-700">
              <div className="font-bold text-blue-900 uppercase">TIÊU CHUẨN GIA CÔNG HÀN LẮP (PCBA):</div>
              <div>• Hỗ trợ dán SMT linh kiện 0402, 0603, 0805, QFP, QFN, BGA</div>
              <div>• Kiểm tra quang học tự động AOI 100% sau lò hàn Reflow</div>
              <div>• Vui lòng gửi kèm BOM + Gerber + CPL Pick and Place</div>
            </div>
          )}

          {/* Right Ghi chú */}
          <div className="md:col-span-3 flex flex-col">
            <label className="text-[12px] font-medium text-slate-600 mb-1">Ghi chú:</label>
            <textarea
              rows={4}
              placeholder="Yêu cầu riêng về đóng gói, tiến độ, test mạch..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full flex-1 p-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. KHỐI YÊU CẦU KỸ THUẬT */}
      <div className="bg-white border-2 border-[#004d26] rounded-sm p-4 space-y-4 shadow-xs">
        {/* Title & Multi-Tab Buttons */}
        <div className="border-b border-slate-200 pb-3">
          <div className="text-[13px] font-bold text-slate-900">
            YÊU CẦU KỸ THUẬT (Chọn các file có cùng yêu cầu trên một tab THÔNG SỐ) - <span className="text-[#004d26] underline">ONLINE PCB/GERBER REVIEW</span>
          </div>

          <div className="flex items-center gap-2 pt-2.5 overflow-x-auto">
            {Object.entries(activeTabs).map(([idStr, spec]) => {
              const tabId = Number(idStr);
              const isActive = tabId === currentTab;
              return (
                <div
                  key={tabId}
                  onClick={() => {
                    if (isPCB) setPcbTabId(tabId);
                    else setAssemblyTabId(tabId);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-bold uppercase cursor-pointer border transition select-none ${
                    isActive
                      ? 'bg-[#004d26] text-white border-[#004d26]'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{spec.tabName}</span>
                  {Object.keys(activeTabs).length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveTab(tabId, e)}
                      className="p-0.5 text-slate-400 hover:text-red-400"
                      title="Xóa thông số này"
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddTab}
              className="px-2.5 py-1 bg-[#004d26] hover:bg-[#00381c] text-white rounded text-xs font-bold transition flex items-center gap-1"
              title="Thêm thông số mới"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Assembly Specific Code Inputs (Image 3) */}
        {!isPCB && (
          <div className="space-y-3 pb-3 border-b border-slate-200">
            <div className="font-bold text-xs uppercase text-slate-800">Đơn Hàng:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <input
                type="text"
                placeholder="Mã đơn hàng linh kiện (nếu có)"
                value={activeSpec.componentOrderCode || ''}
                onChange={(e) => updateCurrentSpecField({ componentOrderCode: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Mã đơn hàng mạch in (nếu có)"
                value={activeSpec.pcbOrderCode || ''}
                onChange={(e) => updateCurrentSpecField({ pcbOrderCode: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* CHỌN FILE ĐÍNH KÈM (Orange Button as in Image 2 & 3) */}
        <div className="space-y-2 pb-3 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="px-5 py-2 bg-[#f37021] hover:bg-[#d85d10] text-white font-bold text-xs uppercase rounded cursor-pointer transition shadow-sm inline-flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              <span>CHỌN FILE ĐÍNH KÈM</span>
              <input
                type="file"
                multiple
                accept={isPCB ? ".zip,.rar" : ".zip,.rar,.csv,.xlsx,.xls,.txt,.pdf"}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-xs text-slate-500 italic">
              {isPCB 
                ? 'Kéo và thả file ở đây (quý khách chọn 1 file nén Gerber .ZIP mỗi tab thông số để xem 3D và tự động đo kích thước)'
                : 'Kéo và thả file ở đây (quý khách chọn 1 file mỗi tab thông số: BOM + Gerber + Pick and Place)'
              }
            </span>
          </div>

          {parsingNotice && (
            <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs font-mono font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{parsingNotice}</span>
            </div>
          )}

          {/* Uploaded File List */}
          {(activeSpec.files || []).length > 0 && (
            <div className="space-y-1.5 pt-1">
              {activeSpec.files?.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileArchive className="w-4 h-4 text-[#f37021] shrink-0" />
                    <span className="font-mono text-slate-800 font-semibold truncate">{file.name}</span>
                    <span className="text-slate-400">({file.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1 text-slate-400 hover:text-red-500 transition"
                    title="Xóa file này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kích thước bo mạch (mm) */}
        <div className="space-y-1.5 pb-3 border-b border-slate-200">
          <div className="flex items-center justify-between max-w-sm">
            <label className="block font-bold text-xs uppercase text-slate-800">
              Kích thước bo mạch (mm):
            </label>
            <span className="text-[11px] text-blue-600 font-mono">Tự động lấy từ Gerber</span>
          </div>
          <div className="flex items-center gap-3 max-w-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Rộng:</span>
              <input
                type="number"
                min="5"
                max="1000"
                step="0.1"
                value={activeSpec.width}
                onChange={(e) => updateCurrentSpecField({ width: Math.max(5, parseFloat(e.target.value) || 10) })}
                className="w-24 px-2 py-1 border border-slate-300 rounded font-mono text-xs text-center font-bold text-blue-700 bg-white"
              />
              <span className="text-xs text-slate-400 font-mono">mm</span>
            </div>
            <span className="text-slate-400">x</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Dài:</span>
              <input
                type="number"
                min="5"
                max="1000"
                step="0.1"
                value={activeSpec.height}
                onChange={(e) => updateCurrentSpecField({ height: Math.max(5, parseFloat(e.target.value) || 10) })}
                className="w-24 px-2 py-1 border border-slate-300 rounded font-mono text-xs text-center font-bold text-blue-700 bg-white"
              />
              <span className="text-xs text-slate-400 font-mono">mm</span>
            </div>
          </div>
        </div>

        {/* Thời gian giao hàng (Image 2) */}
        {isPCB && (
          <div className="space-y-1.5 pb-3 border-b border-slate-200">
            <label className="block font-bold text-xs uppercase text-slate-800">Thời gian giao hàng:</label>
            <div className="flex flex-wrap gap-4 text-xs">
              {[
                '13 - 17 Ngày (Trung bình 50 đơn gần nhất: 10.8 ngày)',
                '8 - 12 Ngày (bay) (Trung bình 20 đơn gần nhất: 8.9 ngày)'
              ].map((time) => (
                <label key={time} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryTime"
                    value={time}
                    checked={activeSpec.deliveryTime.startsWith(time.substring(0, 10))}
                    onChange={() => updateCurrentSpecField({ deliveryTime: time })}
                    className="accent-[#004d26]"
                  />
                  <span>{time}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Số lượng (Image 2 & 3) */}
        <div className="space-y-1.5 pb-3 border-b border-slate-200">
          <label className="block font-bold text-xs uppercase text-slate-800">Số lượng:</label>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs items-center">
            {[5, 10, 20, 30, 40, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 450, 500].map((qty) => (
              <label key={qty} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="quantity"
                  value={String(qty)}
                  checked={String(activeSpec.quantity) === String(qty)}
                  onChange={() => updateCurrentSpecField({ quantity: String(qty) })}
                  className="accent-[#004d26]"
                />
                <span>{qty}</span>
              </label>
            ))}
            <input
              type="number"
              placeholder="Số khác"
              value={activeSpec.quantity}
              onChange={(e) => updateCurrentSpecField({ quantity: e.target.value })}
              className="w-20 px-2 py-0.5 border border-slate-300 rounded text-xs font-mono text-center ml-2"
            />
          </div>
        </div>

        {/* IF ASSEMBLY: Yêu cầu hàn linh kiện (Image 3) */}
        {!isPCB && (
          <div className="space-y-1.5 pb-3 border-b border-slate-200">
            <label className="block font-bold text-xs uppercase text-slate-800">Yêu cầu hàn linh kiện:</label>
            <div className="flex flex-wrap gap-5 text-xs">
              {['SMT mặt TOP', 'SMT mặt BOTTOM', 'Hàn cắm mặt TOP', 'Hàn cắm mặt BOTTOM'].map((req) => {
                const isChecked = (activeSpec.assemblyReqs || []).includes(req);
                return (
                  <label key={req} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const cur = activeSpec.assemblyReqs || [];
                        const updated = e.target.checked ? [...cur, req] : cur.filter(r => r !== req);
                        updateCurrentSpecField({ assemblyReqs: updated });
                      }}
                      className="accent-[#004d26]"
                    />
                    <span>{req}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* IF PCB: Vật liệu, Số lớp, Độ dày phíp, Độ dày đồng, Kiểu mạ, Màu phủ (Image 2) */}
        {isPCB && (
          <>
            {/* Vật liệu */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Vật liệu:</label>
              <div className="flex flex-wrap gap-4 text-xs">
                {['FR-4', 'CEM-1', 'FR-1', '94HB', '99V0', 'Alu (Nhôm)', 'FPC (Dẻo)', 'Cu (Đồng)', 'Rogers', 'Teflon'].map((mat) => (
                  <label key={mat} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="material"
                      value={mat}
                      checked={activeSpec.material === mat}
                      onChange={() => updateCurrentSpecField({ material: mat })}
                      className="accent-[#004d26]"
                    />
                    <span>{mat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Số lớp */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Số lớp:</label>
              <div className="flex flex-wrap gap-5 text-xs">
                {['1 Lớp', '2 Lớp', '4 Lớp', '6 Lớp', '8 -> 20 Lớp'].map((layer) => (
                  <label key={layer} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="layers"
                      value={layer}
                      checked={activeSpec.layers === layer}
                      onChange={() => updateCurrentSpecField({ layers: layer })}
                      className="accent-[#004d26]"
                    />
                    <span>{layer}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Độ dày phíp */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Độ dày phíp:</label>
              <div className="flex flex-wrap gap-4 text-xs">
                {['0.4mm', '0.6mm', '0.8mm', '1.0mm', '1.2mm', '1.6mm', '2.0mm', '2.5mm', '3.0mm', 'Theo Stackup'].map((th) => (
                  <label key={th} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="thickness"
                      value={th}
                      checked={activeSpec.thickness === th}
                      onChange={() => updateCurrentSpecField({ thickness: th })}
                      className="accent-[#004d26]"
                    />
                    <span>{th}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Độ dày đồng */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Độ dày đồng:</label>
              <div className="flex flex-wrap gap-5 text-xs">
                {['0.5oz', '1.0oz', '1.5oz', '2.0oz', 'Theo Stackup'].map((cop) => (
                  <label key={cop} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="copperWeight"
                      value={cop}
                      checked={activeSpec.copperWeight === cop}
                      onChange={() => updateCurrentSpecField({ copperWeight: cop })}
                      className="accent-[#004d26]"
                    />
                    <span>{cop}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kiểu mạ */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Kiểu mạ:</label>
              <div className="flex flex-wrap gap-5 text-xs">
                {['Mạ Thiếc', 'Mạ Vàng', 'Mạ OSP', 'Mạ Thiếc không chì', 'Không mạ'].map((fin) => (
                  <label key={fin} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="surfaceFinish"
                      value={fin}
                      checked={activeSpec.surfaceFinish === fin}
                      onChange={() => updateCurrentSpecField({ surfaceFinish: fin })}
                      className="accent-[#004d26]"
                    />
                    <span>{fin}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Màu phủ */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Màu phủ:</label>
              <div className="flex flex-wrap gap-5 text-xs">
                {[
                  { name: 'Xanh lá', color: 'bg-emerald-600' },
                  { name: 'Xanh dương', color: 'bg-blue-600' },
                  { name: 'Trắng', color: 'bg-slate-100 border border-slate-300' },
                  { name: 'Đỏ', color: 'bg-red-600' },
                  { name: 'Đen', color: 'bg-zinc-900' },
                  { name: 'Vàng', color: 'bg-amber-400' },
                  { name: 'Tím', color: 'bg-purple-700' },
                  { name: 'Không phủ', color: 'bg-amber-700' }
                ].map((c) => (
                  <label key={c.name} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="maskColor"
                      value={c.name}
                      checked={activeSpec.maskColor === c.name}
                      onChange={() => updateCurrentSpecField({ maskColor: c.name })}
                      className="accent-[#004d26]"
                    />
                    <span className={`w-3 h-3 rounded-full ${c.color} inline-block`} />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kích thước đường mạch */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Kích thước đường mạch:</label>
              <div className="flex flex-wrap gap-5 text-xs">
                {['0.15mm (6mils) ↑', '0.127mm (5mils) ↑', '0.1mm (4mils) ↑', '< 0.1mm (4mils) ↓'].map((trace) => (
                  <label key={trace} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="minTrace"
                      value={trace}
                      checked={activeSpec.minTrace === trace}
                      onChange={() => updateCurrentSpecField({ minTrace: trace })}
                      className="accent-[#004d26]"
                    />
                    <span>{trace}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Đường kính lỗ khoan */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Đường kính lỗ khoan:</label>
              <div className="flex flex-wrap gap-5 text-xs">
                {['0.3mm ↑', '0.25mm ↑', '0.2mm ↑', '< 0.2mm ↓'].map((drill) => (
                  <label key={drill} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="minDrill"
                      value={drill}
                      checked={activeSpec.minDrill === drill}
                      onChange={() => updateCurrentSpecField({ minDrill: drill })}
                      className="accent-[#004d26]"
                    />
                    <span>{drill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Chip BGA pitch */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Chip BGA pitch:</label>
              <div className="flex flex-wrap gap-5 text-xs">
                {['0.35mm ↑', '0.3mm ↑', '0.25mm ↑', '< 0.25mm ↓', 'Không có'].map((bga) => (
                  <label key={bga} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="bgaPitch"
                      value={bga}
                      checked={activeSpec.bgaPitch === bga}
                      onChange={() => updateCurrentSpecField({ bgaPitch: bga })}
                      className="accent-[#004d26]"
                    />
                    <span>{bga}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Yêu cầu thêm */}
            <div className="space-y-1.5 pb-3 border-b border-slate-200">
              <label className="block font-bold text-xs uppercase text-slate-800">Yêu cầu thêm:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  'Ghép mạch',
                  'Ghép mạch có lỗ',
                  'Xác nhận file sản xuất',
                  'Impedance Control',
                  'Không in linh kiện',
                  'Không in mã sản xuất',
                  'Hàn linh kiện (từ 20 mạch)',
                  'Mạ nửa lỗ (đường kính từ 0.8mm)'
                ].map((req) => {
                  const isChecked = activeSpec.extraRequirements.includes(req);
                  return (
                    <label key={req} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...activeSpec.extraRequirements, req]
                            : activeSpec.extraRequirements.filter(r => r !== req);
                          updateCurrentSpecField({ extraRequirements: updated });
                        }}
                        className="accent-[#004d26]"
                      />
                      <span>{req}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Đặt kèm Stencil (Image 2 & 3) */}
        <div className="space-y-1.5 pb-3 border-b border-slate-200">
          <label className="block font-bold text-xs uppercase text-slate-800">Đặt kèm Stencil:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            {[
              '370x470 mm', '300x400 mm', '420x520 mm', '400x600 mm', '400x800 mm', '400x1000 mm',
              '450x550 mm', '500x650 mm', '500x800 mm', '400x1200 mm', '500x1200 mm', 'Không khung', 'Không'
            ].map((st) => (
              <label key={st} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="stencil"
                  value={st}
                  checked={activeSpec.stencil === st}
                  onChange={() => updateCurrentSpecField({ stencil: st })}
                  className="accent-[#004d26]"
                />
                <span>{st}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cách thức nhận hàng (Image 2 & 3) */}
        <div className="space-y-1.5 pb-3">
          <label className="block font-bold text-xs uppercase text-slate-800">Cách thức nhận hàng:</label>
          <div className="flex flex-wrap gap-5 text-xs">
            {['Đến lấy', 'AhaMove/Grab', 'ViettelPost', 'Giao hàng tiết kiệm', 'VNPost (đơn hàng lớn)'].map((method) => (
              <label key={method} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="shippingMethod"
                  value={method}
                  checked={activeSpec.shippingMethod === method}
                  onChange={() => updateCurrentSpecField({ shippingMethod: method })}
                  className="accent-[#004d26]"
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. POLICIES CONSENT CHECKBOX (Y HỆT ẢNH 5) */}
        <div className="pt-3 pb-1 border-t border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 accent-sky-600"
            />
            <span className="text-slate-700">
              Tôi đã đọc và đồng ý với{' '}
              <Link to="/terms" target="_blank" className="text-cyan-600 hover:text-cyan-700 underline font-medium">
                Điều khoản sử dụng
              </Link>
              {', '}
              <Link to="/privacy" target="_blank" className="text-cyan-600 hover:text-cyan-700 underline font-medium">
                Chính sách bảo mật
              </Link>
              {' và '}
              <Link to="/support" target="_blank" className="text-cyan-600 hover:text-cyan-700 underline font-medium">
                Chính sách hỗ trợ
              </Link>
              .
            </span>
          </label>
        </div>

        {/* Giá dự kiến & Nút Submit YÊU CẦU BÁO GIÁ */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs">
            <span className="text-slate-500">Giá dự kiến tham khảo: </span>
            <span className="font-mono font-bold text-lg text-[#004d26]">
              {estimatedPrice ? `${estimatedPrice.toLocaleString('vi-VN')} đ` : 'Báo giá trực tiếp'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-[#004d26] hover:bg-[#00381c] text-white font-bold text-xs uppercase tracking-wider rounded transition shadow flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>YÊU CẦU BÁO GIÁ</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </form>
  );
};
