import React, { useState } from 'react';
import { PCB3DViewer } from '../components/pcb/PCB3DViewer';
import { PCBQuoteForm } from '../components/pcb/PCBQuoteForm';
import { OrderSuccessModal } from '../components/pcb/OrderSuccessModal';
import { OrderLookupModal } from '../components/pcb/OrderLookupModal';
import { PCBSpec, PCBRequest, GerberAnalysisResult } from '../lib/types';
import { Sparkles, HelpCircle, Layers, ShieldCheck, PhoneCall } from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const PCBQuotePage: React.FC = () => {
  // Active PCB Specification State
  const [currentSpec, setCurrentSpec] = useState<PCBSpec>({
    id: 1,
    specId: 1,
    tabName: 'Thông số 1',
    serviceType: 'pcb',
    width: 100,
    height: 80,
    deliveryTime: '13 - 17 Ngày (Đường bộ)',
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
  });

  const [gerberAnalysis, setGerberAnalysis] = useState<GerberAnalysisResult | null>(null);

  // Modals state
  const [successRequest, setSuccessRequest] = useState<PCBRequest | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');

  // When dimensions are extracted from Gerber upload
  const handleDimensionsExtracted = (w: number, h: number) => {
    setCurrentSpec(prev => ({ ...prev, width: w, height: h }));
  };

  const handleOpenLookupWithCode = (code: string) => {
    setLookupQuery(code);
    setIsLookupOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-fade-in">
      {/* Page Title & Slogan */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            PCB QUOTE HUB • BÁO GIÁ MẠCH IN ĐIỆN TỬ & 3D VIEWER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Đặt Gia Công Mạch In PCB & Lắp Ráp PCBA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hỗ trợ xem trước 3D tương tác theo thời gian thực, đọc file Gerber .ZIP và tính toán chi phí tham khảo chuẩn xác.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLookupOpen(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs font-mono transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Tra Cứu Tiến Độ Đơn</span>
          </button>

          <a
            href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs font-mono transition flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Zalo Kỹ Thuật</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Left 3D Viewer, Right Quote Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 3D PCB Canvas (Sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="font-semibold text-slate-700 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                Mô Phỏng 3D Bo Mạch (Real-time)
              </span>
              <span>Kéo chuột để xoay / cuộn để phóng to</span>
            </div>

            {/* Three.js Viewer Component */}
            <PCB3DViewer
              maskColor={currentSpec.maskColor}
              surfaceFinish={currentSpec.surfaceFinish}
              thickness={currentSpec.thickness}
              widthMm={currentSpec.width}
              heightMm={currentSpec.height}
              gerberAnalysis={gerberAnalysis}
              onDimensionsExtracted={handleDimensionsExtracted}
              onAnalysisComplete={(res) => setGerberAnalysis(res)}
            />
          </div>

          {/* Quick Technical Help & Privacy Note */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 text-xs text-blue-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Cam Kết Bảo Mật Thiết Kế Kỹ Thuật
            </div>
            <p className="text-[11px] text-blue-800/80 leading-relaxed">
              Mọi file Gerber, BOM, Pick&Place tải lên đều được lưu trữ bảo mật trong hạ tầng private, chỉ kỹ sư thẩm định nội bộ được cấp quyền tiếp cận.
            </p>
          </div>
        </div>

        {/* Right Column: Full Tabbed Quotation Form */}
        <div className="lg:col-span-7">
          <PCBQuoteForm
            currentSpec={currentSpec}
            onSpecChange={(updated) => setCurrentSpec(updated)}
            onOpenLookup={() => setIsLookupOpen(true)}
            onOrderSuccess={(request) => setSuccessRequest(request)}
          />
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        request={successRequest}
        onClose={() => setSuccessRequest(null)}
        onOpenLookup={handleOpenLookupWithCode}
      />

      {/* Lookup Modal */}
      <OrderLookupModal
        isOpen={isLookupOpen}
        initialQuery={lookupQuery}
        onClose={() => {
          setIsLookupOpen(false);
          setLookupQuery('');
        }}
      />
    </div>
  );
};
