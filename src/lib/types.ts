// ==========================================
// THẾ GIỚI LINH KIỆN & PCB - CORE TYPES
// ==========================================

export type ServiceType = 'pcb' | 'assembly';

export type PCBOrderStatus = 
  | 'pending_quote'    // Chờ báo giá (B1)
  | 'quoted'           // Đã báo giá (B2)
  | 'confirmed'        // Khách đã cọc / Chốt (B3)
  | 'producing'        // Đang sản xuất (B4)
  | 'shipping'         // Đang giao hàng (B5)
  | 'completed'        // Hoàn tất (B6)
  | 'cancelled';       // Đã hủy

export type CommerceOrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipping'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'prepaid';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface SystemSettings {
  shopName: string;
  hotline: string;
  zaloPhone: string;
  facebookUrl: string;
  email: string;
  address: string;
  bankName: string;
  bankAccount: string;
  bankOwner: string;
  defaultShippingFee: number;
  freeShippingThreshold: number;
  announcementText?: string;
  showAnnouncement?: boolean;
  announcementSpeed?: number; // seconds
  announcementBgColor?: string;
  announcementTextColor?: string;
  
  // Telegram Bot Notifications
  telegramBotToken?: string;
  telegramChatId?: string;
  enableTelegramNotify?: boolean;
}

export interface AdminAccount {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  comparePrice?: number;
  stock: number;
  unit: string;
  images: string[];
  thumbnail: string;
  description: string;
  datasheetUrl?: string;
  attributes: ProductAttribute[];
  isFeatured?: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail?: string;
}

export interface CommerceOrder {
  id: string;
  orderCode: string; // e.g. TLK-2026-XXXXXX
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: CommerceOrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface PCBSpec {
  id: string | number;
  specId?: string | number;
  tabName: string;
  serviceType: ServiceType; // 'pcb': Gia công mạch in, 'assembly': Gia công hàn lắp
  
  // Board dimensions & base specs
  width: number;
  height: number;
  quantity: string | number;
  deliveryTime: string; // "13 - 17 Ngày (Đường bộ)" hoặc "8 - 12 Ngày (Đường bay)"
  material: string;     // FR-4, CEM-1, FR-1, 94HB, 99V0, Alu (Nhôm), FPC (Dẻo), Cu (Đồng), Rogers, Teflon
  layers: string;       // 1 Lớp, 2 Lớp, 4 Lớp, 6 Lớp, 8 -> 20 Lớp
  thickness: string;    // 0.4mm, 0.6mm, 0.8mm, 1.0mm, 1.2mm, 1.6mm, 2.0mm, 2.5mm, 3.0mm, Theo Stackup
  copperWeight: string; // 0.5oz, 1.0oz, 1.5oz, 2.0oz, Theo Stackup
  surfaceFinish: string;// Mạ Thiếc, Mạ Vàng, Mạ OSP, Mạ Thiếc không chì, Không mạ
  maskColor: string;    // Xanh lá, Xanh dương, Trắng, Đỏ, Đen, Vàng, Tím, Không phủ
  silkscreenColor?: string;
  minTrace: string;     // 0.15mm (6mils) ↑, 0.127mm (5mils) ↑, 0.1mm (4mils) ↑, < 0.1mm (4mils) ↓
  minDrill: string;     // 0.3mm ↑, 0.25mm ↑, 0.2mm ↑, < 0.2mm ↓
  bgaPitch: string;     // 0.35mm ↑, 0.3mm ↑, 0.25mm ↑, 0.25mm ↓, Không có
  stencil: string;      // 370x470 mm, 300x400 mm, ..., Không khung, Không
  extraRequirements: string[]; // Ghép mạch, Xác nhận file, Impedance Control, Không in linh kiện, Mạ nửa lỗ...
  shippingMethod: string; // Đến lấy, AhaMove/Grab, ViettelPost, Giao hàng tiết kiệm, VNPost
  
  // Assembly specific fields
  componentOrderCode?: string; // Mã đơn hàng linh kiện (nếu có)
  pcbOrderCode?: string;       // Mã đơn hàng mạch in (nếu có)
  assemblySides?: string[];    // "Mặt Top", "Mặt Bottom"
  assemblyReqs?: string[];     // "SMT mặt TOP", "SMT mặt BOTTOM", "Hàn cắm mặt TOP", "Hàn cắm mặt BOTTOM"
  
  // Attached files for this specific board
  files?: PCBAttachedFile[];
}

export interface PCBAttachedFile {
  name: string;
  size: string;
  url?: string;
  type?: string;
  analysis?: GerberAnalysisResult;
}

export interface GerberLayerSummary {
  topCopper?: string;
  botCopper?: string;
  topMask?: string;
  botMask?: string;
  topSilk?: string;
  botSilk?: string;
  drill?: string;
  outline?: string;
}

export interface GerberAnalysisResult {
  success: boolean;
  message?: string;
  fileName?: string;
  fileSize?: string;
  layers?: GerberLayerSummary;
  layerCount?: number;
  boardWidthMm?: number;
  boardHeightMm?: number;
}

export interface PCBRequest {
  id: string;
  orderCode: string; // e.g. PCB-2026-XXXXXXX
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  notes?: string;
  specs: PCBSpec[];
  status: PCBOrderStatus;
  statusText?: string;
  quotePrice?: number | null;
  adminNotes?: string;
  estimatedPrice?: number | null;
  files?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'customer' | 'staff' | 'technician' | 'admin' | 'super_admin';
}
