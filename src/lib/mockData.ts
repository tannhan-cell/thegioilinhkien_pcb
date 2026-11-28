import { Product, Category, SystemSettings } from './types';

export const DEFAULT_SETTINGS: SystemSettings = {
  shopName: 'Thế Giới Linh Kiện & PCB',
  hotline: '0392.733.577',
  zaloPhone: '0392733577',
  facebookUrl: 'https://www.facebook.com/nhan.votan.395',
  email: 'votannhan8@gmail.com',
  address: 'Hà Nội & TP. Hồ Chí Minh (Giao hàng toàn quốc)',
  bankName: 'MBBank (Quân Đội)',
  bankAccount: '0392733577',
  bankOwner: 'VO TAN NHAN',
  defaultShippingFee: 30000,
  freeShippingThreshold: 500000,
  announcementText: 'QUÝ KHÁCH CÓ VẤN ĐỀ CẦN HỖ TRỢ VUI LÒNG LIÊN HỆ ADMIN: BÊN MÌNH NHẬN GIA CÔNG MẠCH IN & HÀN LINH KIỆN TỪ SỐ LƯỢNG NHỎ ĐẾN LỚN!',
  showAnnouncement: true,
  announcementSpeed: 22,
  announcementBgColor: '#0284c7', // Bright blue or purple
  announcementTextColor: '#ffffff',
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'RASPBERRY PI', slug: 'raspberry-pi', description: 'Bo mạch máy tính nhúng Raspberry Pi 4, Pi 5, phụ kiện case, quạt tản nhiệt', icon: 'fa-cube', productCount: 3 },
  { id: 'cat-2', name: 'ARDUINO', slug: 'arduino', description: 'Arduino Uno R3, Mega 2560, Nano, Pro Mini và phụ kiện shield', icon: 'fa-microchip', productCount: 4 },
  { id: 'cat-3', name: 'MÀN HÌNH LCD', slug: 'man-hinh-lcd', description: 'Màn hình LCD 1602, OLED 0.96, TFT cảm ứng SPI/I2C', icon: 'fa-tv', productCount: 2 },
  { id: 'cat-4', name: 'CNC & PRINTER 3D', slug: 'cnc-printer-3d', description: 'Driver động cơ bước A4988, DRV8825, ray trượt, đai GT2', icon: 'fa-gears', productCount: 2 },
  { id: 'cat-5', name: 'MẠCH NẠP & KÍT PHÁT TRIỂN', slug: 'mach-nap-kit', description: 'STM32, ESP32, ST-Link V2, J-Link, USB-UART CH340/CP2102', icon: 'fa-laptop-code', productCount: 5 },
  { id: 'cat-6', name: 'MODULE CẢM BIẾN', slug: 'module-cam-bien', description: 'Cảm biến nhiệt độ, khoảng cách, hồng ngoại, quang trở, gas', icon: 'fa-satellite-dish', productCount: 4 },
  { id: 'cat-7', name: 'IC & VI ĐIỀU KHIỂN', slug: 'ic-vi-dieu-khien', description: 'IC nguồn, Op-Amp, Logic TTL/CMOS, Vi điều khiển dán/cắm', icon: 'fa-microchip', productCount: 4 },
  { id: 'cat-8', name: 'NGUỒN & PIN', slug: 'nguon-pin', description: 'Nguồn xung 5V/12V/24V, module hạ áp LM2596, pin sạc 18650', icon: 'fa-bolt', productCount: 3 },
  { id: 'cat-9', name: 'LINH KIỆN THỤ ĐỘNG & SMD', slug: 'linh-kien-smd', description: 'Điện trở cuộn, tụ gốm, cuộn cảm, diode, LED 0805, 0603', icon: 'fa-boxes-stacked', productCount: 3 },
  { id: 'cat-10', name: 'GIA CÔNG MẠCH IN (PCB)', slug: 'gia-cong-pcb', description: 'Gia công bo mạch in FR-4 chất lượng cao 1-32 lớp, xem 3D Gerber', icon: 'fa-layer-group', productCount: 1 },
  { id: 'cat-11', name: 'GIA CÔNG HÀN LẮP (PCBA)', slug: 'gia-cong-pcba', description: 'Hàn dán SMT tự động, hàn cắm DIP, cắt Stencil laser', icon: 'fa-screwdriver-wrench', productCount: 1 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'MCU-STM32F401',
    name: 'Kit STM32F401CCU6 BlackPill (ARM Cortex-M4 84MHz)',
    slug: 'kit-stm32f401ccu6-blackpill',
    category: 'Vi điều khiển & Mạch nạp',
    categorySlug: 'vi-dieu-khien',
    brand: 'WeAct Studio',
    price: 85000,
    comparePrice: 110000,
    stock: 120,
    unit: 'Cái',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Kit phát triển vi điều khiển STM32F401CCU6 với chip lõi ARM Cortex-M4 32-bit tốc độ 84MHz, bộ nhớ Flash 256KB, SRAM 64KB. Cổng nạp và giao tiếp USB Type-C hiện đại. Tương thích chuẩn lập trình Arduino IDE, Keil C, STM32CubeIDE.',
    datasheetUrl: 'https://www.st.com/resource/en/datasheet/stm32f401cc.pdf',
    attributes: [
      { name: 'Vi điều khiển', value: 'STM32F401CCU6 (ARM Cortex-M4)' },
      { name: 'Xung nhịp', value: '84 MHz' },
      { name: 'Bộ nhớ Flash', value: '256 KB' },
      { name: 'SRAM', value: '64 KB' },
      { name: 'Cổng giao tiếp', value: 'USB Type-C' },
      { name: 'Điện áp hoạt động', value: '3.3V DC (Nguồn vào 5V qua USB)' }
    ],
    isFeatured: true,
    status: 'active',
    createdAt: '2026-11-15T08:00:00Z'
  },
  {
    id: 'prod-2',
    sku: 'MCU-ESP32-WROOM',
    name: 'Module ESP32-WROOM-32D Type-C WiFi + Bluetooth Dual Core',
    slug: 'module-esp32-wroom-32d-type-c',
    category: 'Vi điều khiển & Mạch nạp',
    categorySlug: 'vi-dieu-khien',
    brand: 'Espressif Systems',
    price: 95000,
    comparePrice: 125000,
    stock: 85,
    unit: 'Cái',
    thumbnail: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Bo mạch phát triển IoT ESP32 tích hợp vi xử lý 2 nhân Xtensa 32-bit LX6 240MHz, kết nối WiFi 802.11 b/g/n và Bluetooth 4.2 BR/EDR & BLE. Phiên bản nâng cấp Type-C truyền dữ liệu tốc độ cao, IC nạp CH340 / CP2102 ổn định.',
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32d_esp32-wroom-32u_datasheet_en.pdf',
    attributes: [
      { name: 'Nhân xử lý', value: 'Dual-core Xtensa 32-bit LX6 @ 240MHz' },
      { name: 'Kết nối', value: 'WiFi 2.4GHz + Bluetooth 4.2 BLE' },
      { name: 'Bộ nhớ Flash', value: '4 MB (32 Mbit)' },
      { name: 'SRAM', value: '520 KB' },
      { name: 'Cổng nạp', value: 'USB Type-C' }
    ],
    isFeatured: true,
    status: 'active',
    createdAt: '2026-11-16T09:30:00Z'
  },
  {
    id: 'prod-3',
    sku: 'SEN-DHT22-AM2302',
    name: 'Cảm biến Nhiệt Độ & Độ Ẩm Kỹ Thuật Số DHT22 (AM2302)',
    slug: 'cam-bien-nhiet-do-do-am-dht22',
    category: 'Cảm biến (Sensors)',
    categorySlug: 'cam-bien',
    brand: 'Aosong',
    price: 65000,
    comparePrice: 85000,
    stock: 64,
    unit: 'Cái',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Cảm biến DHT22 (AM2302) đo nhiệt độ và độ ẩm kỹ thuật số với độ chính xác cao hơn so với DHT11. Thích hợp cho các trạm thời tiết, nhà kính thông minh, điều hòa tự động.',
    datasheetUrl: 'https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf',
    attributes: [
      { name: 'Dải đo độ ẩm', value: '0 - 100% RH (±2% RH)' },
      { name: 'Dải đo nhiệt độ', value: '-40 đến 80°C (±0.5°C)' },
      { name: 'Chuẩn giao tiếp', value: '1-Wire Digital' },
      { name: 'Điện áp hoạt động', value: '3.3V - 5.5V DC' }
    ],
    isFeatured: true,
    status: 'active',
    createdAt: '2026-11-14T11:00:00Z'
  },
  {
    id: 'prod-4',
    sku: 'SEN-MPU6050',
    name: 'Module Cảm Biến Góc Nghiêng & Gia Tốc 6 Trục MPU-6050 (GY-521)',
    slug: 'module-cam-bien-gia-toc-mpu6050',
    category: 'Cảm biến (Sensors)',
    categorySlug: 'cam-bien',
    brand: 'InvenSense',
    price: 45000,
    comparePrice: 60000,
    stock: 90,
    unit: 'Cái',
    thumbnail: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Module tích hợp con quay hồi chuyển 3 trục (Gyroscope) và cảm biến gia tốc 3 trục (Accelerometer) cùng bộ xử lý chuyển động kỹ thuật số phần cứng DMP. Chuẩn giao tiếp I2C.',
    datasheetUrl: 'https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf',
    attributes: [
      { name: 'Cảm biến', value: '3 Trục Con quay + 3 Trục Gia tốc' },
      { name: 'Chuẩn giao tiếp', value: 'I2C (tối đa 400kHz)' },
      { name: 'Bộ chuyển đổi ADC', value: '16-bit tích hợp' },
      { name: 'Điện áp cấp', value: '3V - 5V DC' }
    ],
    isFeatured: false,
    status: 'active',
    createdAt: '2026-11-13T10:00:00Z'
  },
  {
    id: 'prod-5',
    sku: 'PWR-LM2596-VOLT',
    name: 'Mạch Giảm Áp DC-DC LM2596 Có Màn Hình LED Đo Điện Áp 3A',
    slug: 'mach-giam-ap-dc-dc-lm2596-co-led',
    category: 'Nguồn & Biến đổi áp',
    categorySlug: 'nguon-ha-ap',
    brand: 'OEM High-Grade',
    price: 48000,
    comparePrice: 65000,
    stock: 75,
    unit: 'Cái',
    thumbnail: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Mạch Buck hạ áp xung tần số cao với hiệu suất chuyển đổi lên tới 92%. Tích hợp màn hình LED 3 số hiển thị điện áp vào/ra thuận tiện và nút bấm chuyển đổi đo kiểm.',
    datasheetUrl: 'https://www.ti.com/lit/ds/symlink/lm2596.pdf',
    attributes: [
      { name: 'Điện áp đầu vào', value: '4.0V - 40V DC' },
      { name: 'Điện áp đầu ra', value: '1.25V - 37V DC (Điều chỉnh biến trở)' },
      { name: 'Dòng điện ra tối đa', value: '3A (Khuyên dùng 2A nếu không tản nhiệt)' },
      { name: 'Tần số chuyển mạch', value: '150 kHz' }
    ],
    isFeatured: true,
    status: 'active',
    createdAt: '2026-11-12T07:00:00Z'
  },
  {
    id: 'prod-6',
    sku: 'SMD-RES-0805-KIT',
    name: 'Tập Sổ Điện Trở Dán SMD 0805 Chính Xác 1% (50 Giá Trị x 25 Con)',
    slug: 'tap-so-dien-tro-dan-smd-0805',
    category: 'Linh kiện dán SMD',
    categorySlug: 'linh-kien-smd',
    brand: 'Yageo',
    price: 180000,
    comparePrice: 220000,
    stock: 45,
    unit: 'Cuốn',
    thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Sổ mẫu linh kiện điện trở dán SMD 0805 đóng gói dạng tập sổ tiện lợi cho kỹ sư R&D và sinh viên điện tử. Gồm 50 dải giá trị từ 10 Ohm đến 1 Mega Ohm, dung sai chuẩn 1%.',
    attributes: [
      { name: 'Kích thước đóng gói', value: 'SMD 0805 (2.0 x 1.25mm)' },
      { name: 'Dung sai', value: '±1%' },
      { name: 'Công suất', value: '1/8W (0.125W)' },
      { name: 'Tổng số lượng', value: '1250 con (50 giá trị x 25 con)' }
    ],
    isFeatured: false,
    status: 'active',
    createdAt: '2026-11-11T14:00:00Z'
  },
  {
    id: 'prod-7',
    sku: 'CONN-TYPEC-16P',
    name: 'Jack Cắm USB Type-C 16 Chân SMD Chân Cắm PCB (Gói 10 Cái)',
    slug: 'jack-cam-usb-type-c-16p-smd',
    category: 'Đầu nối & Jack cắm',
    categorySlug: 'dau-noi-connector',
    brand: 'Korean Precision',
    price: 35000,
    comparePrice: 45000,
    stock: 200,
    unit: 'Gói (10 cái)',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Cổng cắm USB Type-C 16 Pin chân dán bề mặt SMD kết hợp 4 chân định vị xuyên lỗ củng cố cơ khí, chịu lực cắm rút cao. Hỗ trợ sạc nhanh và truyền dữ liệu USB 2.0.',
    attributes: [
      { name: 'Kiểu chân', value: '16 Pin SMD + 4 DIP leg' },
      { name: 'Dòng định mức', value: '3A Max' },
      { name: 'Độ bền cơ khí', value: '> 10.000 lần cắm rút' }
    ],
    isFeatured: false,
    status: 'active',
    createdAt: '2026-11-10T12:00:00Z'
  },
  {
    id: 'prod-8',
    sku: 'MOD-RL2-5V-OPTO',
    name: 'Module Relay 5V 2 Kênh Kích Cao/Thấp Cách Ly Quang Opto',
    slug: 'module-relay-5v-2-kenh-opto',
    category: 'Vi điều khiển & Mạch nạp',
    categorySlug: 'vi-dieu-khien',
    brand: 'Songle / OEM',
    price: 32000,
    comparePrice: 42000,
    stock: 110,
    unit: 'Cái',
    thumbnail: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Module điều khiển đóng cắt tải AC 250V 10A hoặc DC 30V 10A với 2 rơ-le Songle độc lập. Có Optocoupler cách ly an toàn bảo vệ vi điều khiển, jumper chọn kích mức Cao (High) hoặc Thấp (Low).',
    attributes: [
      { name: 'Điện áp cuộn hút', value: '5V DC' },
      { name: 'Tiếp điểm chịu tải', value: '10A 250VAC / 10A 30VDC' },
      { name: 'Cách ly', value: 'Optocoupler cách ly quang' }
    ],
    isFeatured: false,
    status: 'active',
    createdAt: '2026-11-09T09:00:00Z'
  }
];
