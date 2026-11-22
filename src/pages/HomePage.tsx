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

        {/* Right: Hero Banner + Working Hours Box (Col 9) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white min-h-[260px] sm:min-h-[300px] flex flex-col justify-between p-6 sm:p-8">
            {/* Background Circuit Decors */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Top Row: Working Hours Box (Y hệt ảnh góc trái trên của ICDAYROI) */}
            <div className="relative z-10 self-start p-3 bg-black/60 backdrop-blur border border-sky-400/30 rounded-lg text-xs space-y-1 font-mono text-slate-200 max-w-xs shadow-lg">
              <div className="font-bold text-sky-300 flex items-center gap-1.5 uppercase text-[11px]">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Thời gian làm việc</span>
              </div>
              <div>T2 - T6: Sáng 7h30 &gt; 12h00 • Chiều 13h30 &gt; 18h00</div>
              <div>T7 - CN: Sáng 8h00 &gt; 12h00 • Chiều 13h30 &gt; 17h00</div>
            </div>

            {/* Middle Big Heading */}
            <div className="relative z-10 my-4 space-y-2">
              <div className="inline-block px-3 py-1 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold uppercase tracking-wider border border-sky-500/40">
                CHUYÊN PHÂN PHỐI SỈ LẺ CÁC LOẠI
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight">
                LINH KIỆN ĐIỆN TỬ & GIA CÔNG BO MẠCH PCB
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Báo giá tự động trực tuyến • Xem mạch 3D WebGL • Tự động đo kích thước từ file Gerber • Giao hàng toàn quốc
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <Link
                to="/pcb-quote?service=pcb"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>ĐẶT GIA CÔNG MẠCH IN (149K)</span>
              </Link>

              <Link
                to="/pcb-quote#viewer3d"
                className="px-5 py-2.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-500/50 font-bold rounded-lg text-xs uppercase tracking-wider transition flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>XEM 3D GERBER TRỰC TUYẾN</span>
              </Link>
            </div>
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

      {/* 4. DUAL PCB SERVICES SHOWCASE BANNER */}
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
