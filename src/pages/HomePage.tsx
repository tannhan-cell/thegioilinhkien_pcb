import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/db';
import { Product, Category } from '../lib/types';
import { ProductCard } from '../components/shop/ProductCard';
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  Wrench, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Truck,
  Eye,
  Menu
} from 'lucide-react';
import { PCB_CONFIG_DATA } from '../lib/pricing';

interface HomePageProps {
  onOpenLookup: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenLookup }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodList, catList] = await Promise.all([
          db.getProducts(),
          db.getCategories(),
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const newProducts = products.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-8 font-sans">
      {/* 1. MAIN GRID: LEFT CATEGORY SIDEBAR + RIGHT BANNER (Y HỆT ẢNH ICDAYROI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Danh mục sản phẩm Sidebar (Col 3) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="bg-[#007bff] text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <Menu className="w-4 h-4" />
              <span>DANH MỤC SẢN PHẨM</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="px-3.5 py-2.5 flex items-center justify-between text-slate-700 hover:text-blue-600 hover:bg-sky-50 transition group font-medium"
                >
                  <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    <span className="text-slate-400 text-[10px]">▶</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-blue-600">›</span>
                </Link>
              ))}

              {/* PCB & PCBA Fast Links */}
              <Link
                to="/pcb-quote?service=pcb"
                className="px-3.5 py-2.5 flex items-center justify-between text-blue-700 bg-sky-50/60 hover:bg-sky-100 font-bold transition"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>GIA CÔNG MẠCH IN (PCB)</span>
                </span>
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">HOT</span>
              </Link>

              <Link
                to="/pcb-quote?service=assembly"
                className="px-3.5 py-2.5 flex items-center justify-between text-orange-700 bg-orange-50/60 hover:bg-orange-100 font-bold transition"
              >
                <span className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-orange-600" />
                  <span>GIA CÔNG HÀN LẮP (PCBA)</span>
                </span>
                <span className="text-[10px] bg-orange-600 text-white px-1.5 py-0.5 rounded">NEW</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Hero Banner (Col 9) - Đã thay ảnh banner chuẩn theo hình */}
        <div className="lg:col-span-9 space-y-3.5">
          <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
            <Link to="/products" className="block">
              <img 
                src="/images/banner-hero.jpg" 
                alt="Chuyên phân phối sỉ lẻ linh kiện điện tử & gia công bo mạch PCB" 
                className="w-full h-auto object-cover block"
              />
            </Link>
          </div>

          {/* Quick Actions cho Gia Công Bo Mạch & Xem 3D */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/pcb-quote?service=pcb"
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>ĐẶT GIA CÔNG MẠCH IN (149K)</span>
            </Link>

            <Link
              to="/pcb-quote#viewer3d"
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-2xs flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>XEM 3D GERBER TRỰC TUYẾN</span>
            </Link>
          </div>

          {/* Quick Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 shadow-2xs">
              <Truck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-800">Giao Toàn Quốc</div>
                <div className="text-[11px] text-slate-500">Đường bộ & Hỏa tốc bay</div>
              </div>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-800">100% Bảo Mật File</div>
                <div className="text-[11px] text-slate-500">Bảo vệ bản quyền thiết kế</div>
              </div>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-800">Kiểm Tra DFM Miễn Phí</div>
                <div className="text-[11px] text-slate-500">Kỹ sư kiểm tra trước khi phơi</div>
              </div>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <div className="font-bold text-slate-800">Xem 3D Thời Gian Thực</div>
                <div className="text-[11px] text-slate-500">Auto đo kích thước Gerber</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SẢN PHẨM MỚI (Y HỆT BỐ CỤC ẢNH ICDAYROI) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-blue-600 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-blue-700 uppercase tracking-wide flex items-center gap-2">
            <span>SẢN PHẨM MỚI</span>
          </h2>
          <Link
            to="/products"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Xem thêm tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Đang tải sản phẩm...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. SẢN PHẨM BÁN CHẠY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-sky-600 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span>SẢN PHẨM NỔI BẬT & BÁN CHẠY</span>
          </h2>
          <Link
            to="/products"
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
          >
            <span>Xem thêm</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SEO LOCAL CONTENT — Thủ Đức, Làng Đại Học, TP.HCM */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
            Linh Kiện Điện Tử & Gia Công Mạch In PCB Tại Thủ Đức, TP. Hồ Chí Minh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-2">
              <p>
                <span className="font-bold text-slate-900">Thế Giới Linh Kiện & PCB</span> tọa lạc tại{' '}
                <span className="font-semibold text-blue-700">Làng Đại Học, Phường Đông Hòa, TP. Thủ Đức, TP. Hồ Chí Minh</span> —
                chuyên cung cấp linh kiện điện tử Arduino, Raspberry Pi, IC, cảm biến, module cho sinh viên{' '}
                <span className="font-semibold">ĐHQG TP.HCM, ĐH Bách Khoa, ĐH Quốc Tế</span> và toàn khu vực Thủ Đức.
              </p>
              <p>
                Dịch vụ <span className="font-semibold text-[#004d26]">gia công mạch in PCB</span> từ 1 đến 32 lớp, giá từ{' '}
                <span className="font-bold text-red-600">149.000đ</span> với công nghệ xem <span className="font-semibold">3D Gerber WebGL</span> trực tuyến,
                tự động đo kích thước từ file Gerber và báo giá tức thì.
              </p>
            </div>
            <div className="space-y-2">
              <p>
                Dịch vụ <span className="font-semibold text-[#004d26]">hàn lắp linh kiện SMT/PCBA</span> chuyên nghiệp,
                hỗ trợ 0402, BGA, QFN, kiểm tra quang học AOI sau lò Reflow.
                Giao hàng toàn quốc qua <span className="font-semibold">ViettelPost, GHTK, VNPost</span>.
              </p>
              <p>
                Phục vụ khách hàng tại <span className="font-semibold">Thủ Đức, Bình Dương, Đồng Nai, TP.HCM</span> và toàn quốc.
                Hỗ trợ sinh viên Làng Đại Học, quận 9 (Thủ Đức), Dĩ An Bình Dương.
                Hotline Zalo: <span className="font-bold text-blue-700">0392.733.577</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DUAL PCB SERVICES SHOWCASE BANNER */}
      <section className="bg-gradient-to-r from-blue-700 via-sky-600 to-blue-800 text-white rounded-xl p-6 sm:p-8 shadow-md">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider inline-block">
            DỊCH VỤ GIA CÔNG MẠCH IN HÀNG ĐẦU
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            Gia Công Bo Mạch In PCB & Hàn Lắp Dán SMT Trọn Gói
          </h3>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl mx-auto leading-relaxed">
            Hỗ trợ từ 5 bo mẫu thử nghiệm đến hàng vạn sản phẩm thương mại. Miễn phí kiểm tra DFM, tự động đo kích thước chính xác từ file Gerber và xem 3D trực quan trên nền tảng WebGL.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/pcb-quote?service=pcb"
              className="px-7 py-3 bg-white text-blue-700 hover:bg-sky-50 font-bold rounded-lg text-xs uppercase tracking-wider transition shadow"
            >
              Đặt Gia Công Mạch In (PCB)
            </Link>
            <Link
              to="/pcb-quote?service=assembly"
              className="px-7 py-3 bg-[#f37021] hover:bg-[#d85d10] text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow"
            >
              Đặt Gia Công Hàn Lắp (PCBA)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
