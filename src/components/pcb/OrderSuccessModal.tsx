import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { PCBRequest } from '../../lib/types';
import { CheckCircle2, Copy, Check, MessageCircle, X, Search } from 'lucide-react';
import { PCB_CONFIG_DATA } from '../../lib/pricing';

interface OrderSuccessModalProps {
  request: PCBRequest | null;
  onClose: () => void;
  onOpenLookup: (code: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  request,
  onClose,
  onOpenLookup,
}) => {
  const [copied, setCopied] = useState(false);

  if (!request) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(request.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto p-4 sm:p-6 flex justify-center items-start sm:items-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg my-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8 space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-2xl font-bold font-display text-slate-900">
            Gửi Yêu Cầu Thành Công!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kỹ thuật viên của Thế Giới Linh Kiện & PCB đang tiến hành kiểm tra file và sẽ liên hệ báo giá sớm nhất.
          </p>
        </div>

        {/* Order Code Box */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            MÃ ĐƠN HÀNG CỦA BẠN
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-blue-600">
              {request.orderCode}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-medium transition border border-blue-200"
              title="Sao chép mã"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Số điện thoại nhận báo giá: <b className="text-slate-700">{request.customerPhone}</b>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLookup(request.orderCode);
            }}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-sm"
          >
            <Search className="w-4 h-4" />
            Tra Cứu Tiến Độ Đơn Hàng Ngay
          </button>

          <a
            href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl border border-emerald-300 transition flex items-center justify-center gap-2 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Nhắn Zalo Với Kỹ Thuật Viên ({PCB_CONFIG_DATA.CONTACT.hotlineDisplay})
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};
