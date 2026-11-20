// ==========================================
// THẾ GIỚI LINH KIỆN & PCB - PRICING ENGINE
// ==========================================
import { PCBSpec } from './types';

export const PCB_CONFIG_DATA = {
  appName: 'Thế Giới Linh Kiện & PCB',
  version: '2.5.0',

  CONTACT: {
    facebook: 'https://www.facebook.com/nhan.votan.395',
    zaloPhone: '0392733577',
    zaloUrl: 'https://zalo.me/0392733577',
    hotlineDisplay: '0392.733.577'
  },

  STATUSES: {
    pending_quote: {
      key: 'pending_quote',
      label: 'Chờ báo giá',
      color: '#f59e0b',
      badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      icon: 'fa-clock',
      step: 1
    },
    quoted: {
      key: 'quoted',
      label: 'Đã báo giá',
      color: '#00b4d8',
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      icon: 'fa-file-invoice-dollar',
      step: 2
    },
    confirmed: {
      key: 'confirmed',
      label: 'Khách đã cọc / Chốt',
      color: '#9d4edd',
      badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      icon: 'fa-check-circle',
      step: 3
    },
    producing: {
      key: 'producing',
      label: 'Đang sản xuất',
      color: '#10b981',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: 'fa-microchip',
      step: 4
    },
    shipping: {
      key: 'shipping',
      label: 'Đang giao hàng',
      color: '#38bdf8',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      icon: 'fa-truck-fast',
      step: 5
    },
    completed: {
      key: 'completed',
      label: 'Hoàn tất',
      color: '#059669',
      badgeClass: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      icon: 'fa-flag-checkered',
      step: 6
    },
    cancelled: {
      key: 'cancelled',
      label: 'Đã hủy',
      color: '#ef4444',
      badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
      icon: 'fa-times-circle',
      step: 0
    }
  },

  // Color mapping for 3D Viewer & UI
  MASK_COLORS: {
    'Xanh lá': { hex: '#0a632d', metalness: 0.1, roughness: 0.35, emissive: '#021f0e' },
    'Xanh dương': { hex: '#0c4a9e', metalness: 0.15, roughness: 0.3, emissive: '#03173d' },
    'Đỏ': { hex: '#a81c1c', metalness: 0.1, roughness: 0.35, emissive: '#2d0303' },
    'Đen': { hex: '#141416', metalness: 0.3, roughness: 0.45, emissive: '#050505' },
    'Trắng': { hex: '#eceff1', metalness: 0.05, roughness: 0.4, emissive: '#1a1f26' },
    'Vàng': { hex: '#eab308', metalness: 0.1, roughness: 0.35, emissive: '#3b2502' },
    'Tím': { hex: '#6b21a8', metalness: 0.15, roughness: 0.3, emissive: '#24073d' },
    'Không phủ': { hex: '#b45309', metalness: 0.6, roughness: 0.4, emissive: '#291102' }
  },

  // Plating / Finish material mapping
  FINISH_MATERIALS: {
    'Mạ Thiếc': { hex: '#cbd5e1', metalness: 0.85, roughness: 0.25 },
    'Mạ Vàng': { hex: '#f59e0b', metalness: 0.95, roughness: 0.18 }, // ENIG
    'Mạ OSP': { hex: '#b45309', metalness: 0.7, roughness: 0.35 },
    'Mạ Thiếc không chì': { hex: '#e2e8f0', metalness: 0.88, roughness: 0.22 },
    'Không mạ': { hex: '#92400e', metalness: 0.6, roughness: 0.45 }
  }
};

/**
 * Thuật toán ước tính chi phí gia công PCB tham khảo
 * Chuẩn giá thị trường: <=10x10cm, 2 lớp, thông số tiêu chuẩn:
 * - Đường bộ: 5 bo ~150.000đ | 10 bo ~210.000đ
 * - Đường bay: 5 bo ~400.000đ | 10 bo ~490.000đ
 */
export function estimatePCBPrice(spec: Partial<PCBSpec>): number | null {
  if (spec.serviceType === 'assembly') return null;
  const qty = Math.max(1, parseInt(String(spec.quantity || 10), 10) || 10);
  const isAir = (spec.deliveryTime || '').toLowerCase().includes('bay');
  const w = Number(spec.width) || 100;
  const h = Number(spec.height) || 100;

  const fixed = isAir ? 310000 : 90000;
  const perBoard = isAir ? 18000 : 12000;
  const areaFactor = Math.max(1, (w * h) / 10000);

  const pick = <T extends Record<string, number>>(table: T, key?: string, fallback: number | null = 1): number | null => {
    if (!key) return fallback;
    return key in table ? table[key] : fallback;
  };

  const layers = pick({ '1 Lớp': 0.9, '2 Lớp': 1, '4 Lớp': 2.2, '6 Lớp': 3.5 }, spec.layers, null);
  const material = pick({ 'FR-4': 1, 'CEM-1': 0.9, 'FR-1': 0.9, '94HB': 0.9, '99V0': 1, 'Alu (Nhôm)': 1.6, 'FPC (Dẻo)': 2.5 }, spec.material, null);
  const thickness = pick({ '0.4mm': 1.15, '0.6mm': 1.15, '0.8mm': 1, '1.0mm': 1, '1.2mm': 1, '1.6mm': 1, '2.0mm': 1.15, '2.5mm': 1.3, '3.0mm': 1.3 }, spec.thickness, null);
  const copper = pick({ '0.5oz': 1, '1.0oz': 1, '1.5oz': 1.25, '2.0oz': 1.5 }, spec.copperWeight, null);
  const finish = pick({ 'Mạ Vàng': 1.35, 'Mạ Thiếc không chì': 1.1 }, spec.surfaceFinish, 1) || 1;
  const mask = spec.maskColor === 'Xanh lá' || !spec.maskColor ? 1 : 1.05;
  const trace = pick({ '0.1mm (4mils) ↑': 1.15, '< 0.1mm (4mils) ↓': null }, spec.minTrace, 1);
  const drill = pick({ '0.2mm ↑': 1.1, '< 0.2mm ↓': null }, spec.minDrill, 1);

  const extras = spec.extraRequirements || [];
  let extra = 1;
  if (extras.includes('Impedance Control')) extra *= 1.2;
  if (extras.includes('Mạ nửa lỗ (đường kính từ 0.8mm)')) extra *= 1.25;

  const needsContact = extras.includes('Hàn linh kiện (từ 20 mạch)') || (spec.bgaPitch && spec.bgaPitch !== 'Không có');

  const factors = [layers, material, thickness, copper, trace, drill];
  if (needsContact || factors.some((f) => f == null) || w * h > 500 * 500) return null;

  const multiplier = (factors as number[]).reduce((a, b) => a * b, 1) * finish * mask * extra;
  let price = fixed + qty * perBoard * areaFactor * multiplier;

  if (spec.stencil && spec.stencil !== 'Không') {
    price += spec.stencil === 'Không khung' ? 80000 : 200000;
  }

  return Math.round(price / 1000) * 1000;
}
