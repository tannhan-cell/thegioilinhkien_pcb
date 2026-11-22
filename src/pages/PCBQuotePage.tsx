import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PCB3DViewer } from '../components/pcb/PCB3DViewer';
import { PCBQuoteForm } from '../components/pcb/PCBQuoteForm';
import { OrderSuccessModal } from '../components/pcb/OrderSuccessModal';
import { OrderLookupModal } from '../components/pcb/OrderLookupModal';
import { PCBSpec, PCBRequest, GerberAnalysisResult, ServiceType } from '../lib/types';
import { Sparkles, Eye, Layers, Wrench, ShieldCheck, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

export const PCBQuotePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceParam = (searchParams.get('service') as ServiceType) || 'pcb';

  const [activeService, setActiveService] = useState<ServiceType>(
    serviceParam === 'assembly' ? 'assembly' : 'pcb'
  );

  useEffect(() => {
    const s = searchParams.get('service');
    if (s === 'assembly' || s === 'pcb') {
      setActiveService(s);
    }
  }, [searchParams]);

  const handleSwitchService = (service: ServiceType) => {
    setActiveService(service);
    setSearchParams({ service });
  };

  // Active PCB Specification State
  const [currentSpec, setCurrentSpec] = useState<PCBSpec>({
    id: 1,
    specId: 1,
    tabName: 'THÔNG SỐ 1',
    serviceType: activeService,
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
    assemblyReqs: ['SMT mặt TOP', 'Hàn cắm mặt TOP'],
    files: [],
  });

  const [gerberAnalysis, setGerberAnalysis] = useState<GerberAnalysisResult | null>(null);
  const [show3DViewer, setShow3DViewer] = useState(true);

  // Modals state
  const [successRequest, setSuccessRequest] = useState<PCBRequest | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');

  const handleDimensionsExtracted = (w: number, h: number) => {
    setCurrentSpec(prev => ({ ...prev, width: w, height: h }));
  };

  const handleOpenLookupWithCode = (code: string) => {
    setLookupQuery(code);
    setIsLookupOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5 animate-fade-in">
      {/* 1. TOP DUAL SERVICE SWITCHER BAR (Y HỆT ẢNH 1 & 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 border border-slate-200 rounded shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSwitchService('pcb')}
            className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
              activeService === 'pcb'
                ? 'bg-[#f37021] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>GIA CÔNG MẠCH IN (PCB)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchService('assembly')}
            className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
              activeService === 'assembly'
                ? 'bg-[#f37021] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>GIA CÔNG HÀN LẮP (PCBA)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setShow3DViewer(!show3DViewer)}
            className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs flex items-center gap-1.5 hover:bg-slate-800 transition"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{show3DViewer ? 'Ẩn Mô Hình 3D' : 'Xem Mô Hình 3D'}</span>
            {show3DViewer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <a
            href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#004d26] text-white rounded text-xs flex items-center gap-1.5 hover:bg-[#00381c] transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Zalo Kỹ Thuật</span>
          </a>
        </div>
      </div>

      {/* 2. OPTIONAL COLLAPSIBLE 3D VIEWER */}
      {show3DViewer && (
        <div className="bg-slate-950 p-3 rounded border border-slate-800 shadow-xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="flex items-center gap-2 text-cyan-300 font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              MÔ HÌNH 3D WEBGL THEO THỜI GIAN THỰC (ĐỒNG BỘ VỚI MÀU SƠN, MẠ & FILE GERBER)
            </span>
            <span className="text-[11px] text-slate-500">Giữ chuột trái để xoay • Cuộn để zoom</span>
          </div>

          <div className="w-full">
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
        </div>
      )}

      {/* 3. MAIN SPECIFICATION & ORDER FORM (Y HỆT ẢNH 1 & 2) */}
      <PCBQuoteForm
        currentSpec={currentSpec}
        activeService={activeService}
        onSpecChange={(updated) => setCurrentSpec(updated)}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOrderSuccess={(request) => setSuccessRequest(request)}
      />

      {/* Modals */}
      <OrderSuccessModal
        request={successRequest}
        onClose={() => setSuccessRequest(null)}
        onOpenLookup={handleOpenLookupWithCode}
      />

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
