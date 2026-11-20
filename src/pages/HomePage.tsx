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
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Package, 
  Search,
  ChevronRight
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

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Ambient glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 font-mono text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>NỀN TẢNG LINH KIỆN & GIA CÔNG PCB CHUYÊN NGHIỆP</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
              Gia Công Mạch In PCB <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Báo Giá & Soi 3D Trực Tuyến
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Hệ sinh thái Thế Giới Linh Kiện & PCB cung cấp đầy đủ linh kiện điện tử R&D, mạch nạp, vi điều khiển cùng giải pháp gia công mạch in PCB 1-32 lớp, SMT Stencil và hàn cắm PCBA tốc độ cao.
            </p>

            {/* Dual Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/pcb-quote"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base font-display"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>BÁO GIÁ ĐẶT PCB & 3D NGAY</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/products"
                className="w-full sm:w-auto px-7 py-4 bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold rounded-2xl border border-slate-700/80 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Cpu className="w-5 h-5 text-blue-400" />
                <span>Mua Linh Kiện Điện Tử</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left font-mono">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-xl sm:text-2xl font-bold text-cyan-400">150.000đ</div>
                <div className="text-[11px] text-slate-400">Từ 5 bo 2 lớp 10x10cm</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">5 - 7 Ngày</div>
                <div className="text-[11px] text-slate-400">Giao hỏa tốc đường bay</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">3D Gerber</div>
                <div className="text-[11px] text-slate-400">Soi mạch trực quan WebGL</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">100% Free</div>
                <div className="text-[11px] text-slate-400">Kiểm tra DFM trước khi làm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
              DANH MỤC SẢN PHẨM & DỊCH VỤ
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
              Khám Phá Danh Mục Linh Kiện
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-center space-y-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                <i className={`fas ${cat.icon || 'fa-microchip'} text-xl`} />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-slate-800 group-hover:text-blue-600 transition line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                  {cat.productCount || 0}+ sản phẩm
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
              SẢN PHẨM NỔI BẬT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
              Linh Kiện Bán Chạy Nhất
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>Xem thêm</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. PCB 3D PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden p-6 sm:p-12 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/40">
                ✨ Công Cụ Báo Giá 3D Độc Quyền
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display leading-tight text-white">
                Tải Lên Gerber ZIP & <br />
                Soi Mô Hình Mạch In 3D
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Hệ thống tự động đọc các lớp Top/Bottom Copper, Solder Mask, Silkscreen và NC Drill. Bạn có thể tự do đổi màu sơn phủ hàn, chuyển lớp mạ vàng ENIG và tách lớp xem từng chi tiết đường mạch!
              </p>

              <div className="space-y-2 font-mono text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tính giá tức thì theo diện tích & số lớp</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hỗ trợ ghép nhiều bo trong một lần gửi (Multi-tab)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tra cứu tiến độ 5 bước với mã đơn riêng biệt</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  to="/pcb-quote"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition text-xs sm:text-sm font-display flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>MỞ TRÌNH BÁO GIÁ 3D</span>
                </Link>

                <button
                  type="button"
                  onClick={onOpenLookup}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  Tra Cứu Tiến Độ Đơn
                </button>
              </div>
            </div>

            {/* Right Graphic Preview */}
            <div className="relative flex items-center justify-center">
              <div className="w-full aspect-video sm:aspect-square max-w-md bg-gradient-to-tr from-blue-950 via-slate-900 to-cyan-950 rounded-2xl border border-cyan-500/30 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    LIVE 3D PREVIEW
                  </span>
                  <span>100 x 80 mm</span>
                </div>

                <div className="my-auto text-center space-y-3 py-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Layers className="w-10 h-10" />
                  </div>
                  <div className="font-bold text-base text-white">Three.js WebGL Engine</div>
                  <div className="text-xs text-slate-400 font-mono">
                    Hỗ trợ FR4, Alu, Mạ Vàng ENIG, Stencil Laser
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                  <span>Solder Mask: 8 Màu</span>
                  <span className="text-emerald-400">RoHS Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW: 4 BƯỚC ĐẶT MẠCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            QUY TRÌNH CHUẨN CÔNG NGHIỆP
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
            4 Bước Đặt Mạch PCB Dễ Dàng
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Quy trình khép kín giúp bạn tối ưu thời gian từ khâu thiết kế đến khi nhận bo mạch hoàn chỉnh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Tải Gerber & Chọn Thông Số',
              desc: 'Tải file nén .ZIP Gerber, chọn số lớp, kích thước, số lượng bo và màu sơn phủ.',
              icon: 'fa-file-zipper',
              color: 'text-blue-600 bg-blue-50'
            },
            {
              step: '02',
              title: 'DFM Check & Báo Giá',
              desc: 'Kỹ thuật viên kiểm tra lỗi đường mạch, via và gửi báo giá chính thức kèm ưu đãi.',
              icon: 'fa-magnifying-glass-chart',
              color: 'text-cyan-600 bg-cyan-50'
            },
            {
              step: '03',
              title: 'Sản Xuất & Hàn PCBA',
              desc: 'Gia công trên dây chuyền tự động, kiểm tra quang học tự động AOI và gắn linh kiện.',
              icon: 'fa-microchip',
              color: 'text-emerald-600 bg-emerald-50'
            },
            {
              step: '04',
              title: 'Đóng Gói & Giao Tận Nơi',
              desc: 'Đóng gói hút chân không chống tĩnh điện ESD và giao hàng hỏa tốc toàn quốc.',
              icon: 'fa-truck-fast',
              color: 'text-purple-600 bg-purple-50'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.color}`}>
                  <i className={`fas ${item.icon}`} />
                </div>
                <span className="font-mono font-bold text-2xl text-slate-200">
                  {item.step}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
