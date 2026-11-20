import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { 
  Cpu, 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  MessageCircle,
  FileSearch,
  ExternalLink,
  Layers,
  Wrench,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLookup }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const serviceQuery = queryParams.get('service');

  const isPCBActive = location.pathname === '/pcb-quote' && (!serviceQuery || serviceQuery === 'pcb');
  const isAssemblyActive = (location.pathname === '/pcb-quote' && serviceQuery === 'assembly') || location.pathname === '/pcb-assembly';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* 1. TOP PURPLE NOTIFICATION BANNER (Y HỆT ẢNH 3) */}
      {showBanner && (
        <div className="bg-[#5b21b6] text-white text-[12px] sm:text-[13px] font-medium py-1.5 px-4 flex items-center justify-between border-b border-purple-800">
          <div className="max-w-7xl mx-auto flex-1 flex items-center justify-center gap-2 text-center truncate">
            <span>📢</span>
            <span className="font-semibold uppercase tracking-wide">
              QUÝ KHÁCH CÓ VẤN ĐỀ CẦN HỖ TRỢ VUI LÒNG LIÊN HỆ ADMIN: BÊN MÌNH NHẬN GIA CÔNG MẠCH IN & HÀN LINH KIỆN TỪ SỐ LƯỢNG NHỎ ĐẾN LỚN!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="p-1 hover:bg-purple-800 rounded transition text-purple-200 hover:text-white shrink-0 ml-2"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. MAIN HEADER BAR (Dark Industrial Cyber Tech as in Image 3) */}
      <div className="bg-[#0b101b] text-white border-b border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#00f5d4] text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider text-white font-mono uppercase">
                  PCB QUOTE HUB
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-[#00f5d4] border border-cyan-500/40 text-[10px] font-mono font-bold tracking-widest">
                  3D FAB LAB
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                Hệ thống đặt gia công & báo giá bo mạch in tự động
              </div>
            </div>
          </Link>

          {/* Search Box on Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative flex-1 max-w-sm mx-4">
            <input
              type="text"
              placeholder="Tìm kiếm nhanh chóng với 1 thông số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3.5 pr-9 py-1.5 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg focus:outline-none focus:border-cyan-400 font-sans"
            />
            <button type="submit" className="absolute right-2.5 text-slate-400 hover:text-cyan-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Contact & Action Buttons */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <a
              href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zalo {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</span>
            </a>

            <a
              href={PCB_CONFIG_DATA.CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Facebook</span>
            </a>

            <button
              type="button"
              onClick={onOpenLookup}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-lg transition"
            >
              <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tra cứu đơn</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#004d26] hover:bg-[#00381c] text-white rounded-lg transition font-semibold"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>({itemCount}) MỤC</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. WHITE NAVIGATION BAR WITH ORANGE TAB HIGHLIGHT (Y HỆT ẢNH 1 & ẢNH 2) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-bold uppercase tracking-wider">
            <nav className="flex items-center gap-1 h-full">
              <Link
                to="/products"
                className={`px-4 h-full flex items-center transition ${
                  location.pathname === '/products'
                    ? 'bg-[#f37021] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#f37021] hover:bg-slate-50'
                }`}
              >
                LINH KIỆN ĐIỆN TỬ
              </Link>

              {/* GIA CÔNG MẠCH IN (PCB) */}
              <Link
                to="/pcb-quote?service=pcb"
                className={`px-4 h-full flex items-center transition ${
                  isPCBActive
                    ? 'bg-[#f37021] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#f37021] hover:bg-slate-50'
                }`}
              >
                GIA CÔNG MẠCH IN
              </Link>

              {/* GIA CÔNG HÀN LẮP (PCBA) */}
              <Link
                to="/pcb-quote?service=assembly"
                className={`px-4 h-full flex items-center transition ${
                  isAssemblyActive
                    ? 'bg-[#f37021] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#f37021] hover:bg-slate-50'
                }`}
              >
                GIA CÔNG HÀN LẮP
              </Link>

              <Link
                to="/pcb-services"
                className={`hidden md:flex px-4 h-full items-center transition ${
                  location.pathname === '/pcb-services'
                    ? 'bg-[#f37021] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#f37021] hover:bg-slate-50'
                }`}
              >
                QUY TRÌNH & DFM
              </Link>

              <Link
                to="/contact"
                className={`hidden md:flex px-4 h-full items-center transition ${
                  location.pathname === '/contact'
                    ? 'bg-[#f37021] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#f37021] hover:bg-slate-50'
                }`}
              >
                LIÊN HỆ
              </Link>

              <Link
                to="/policy"
                className={`hidden lg:flex px-4 h-full items-center transition ${
                  location.pathname === '/policy'
                    ? 'bg-[#f37021] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#f37021] hover:bg-slate-50'
                }`}
              >
                AN NINH MẠNG & BẢO MẬT
              </Link>
            </nav>

            <div className="hidden sm:flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <span className="font-bold text-slate-800">🇻🇳 VN</span>
              <span>|</span>
              <span className="hover:text-slate-800 cursor-pointer">🇬🇧 EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DARK GREEN SUBNAV BAR (Y HỆT ẢNH 1: GỬI ĐƠN HÀNG, QUY TRÌNH, THÔNG SỐ...) */}
      <div className="bg-[#004d26] text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              to="/pcb-quote"
              className="px-2.5 py-1 rounded bg-[#00381c] border border-green-600/60 hover:bg-green-800 transition flex items-center gap-1.5 text-amber-300"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>GỬI ĐƠN HÀNG</span>
            </Link>
            <Link to="/pcb-services" className="hover:text-amber-300 transition">
              QUY TRÌNH ĐẶT HÀNG
            </Link>
            <Link to="/pcb-services" className="hover:text-amber-300 transition">
              THÔNG SỐ KỸ THUẬT
            </Link>
            <button type="button" onClick={onOpenLookup} className="hover:text-amber-300 transition uppercase">
              TỔNG HỢP ĐƠN HÀNG
            </button>
            <Link to="/pcb-quote" className="hover:text-amber-300 transition">
              HÌNH ẢNH 3D
            </Link>
            <Link to="/policy" className="hover:text-amber-300 transition">
              BẢO MẬT GERBER
            </Link>
          </div>

          <div className="font-mono text-[11px] text-emerald-300">
            Hotline: <b>{PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</b>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-xs font-bold animate-fade-in shadow-xl">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
          >
            LINH KIỆN ĐIỆN TỬ
          </Link>
          <Link
            to="/pcb-quote?service=pcb"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded bg-orange-50 text-[#f37021]"
          >
            GIA CÔNG MẠCH IN (PCB)
          </Link>
          <Link
            to="/pcb-quote?service=assembly"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded bg-orange-50 text-[#f37021]"
          >
            GIA CÔNG HÀN LẮP (PCBA)
          </Link>
          <Link
            to="/pcb-services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
          >
            QUY TRÌNH ĐẶT HÀNG & DFM
          </Link>
          <Link
            to="/policy"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
          >
            CHÍNH SÁCH AN NINH MẠNG & BẢO MẬT
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLookup();
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-slate-800 flex items-center justify-between"
          >
            <span>TRA CỨU TIẾN ĐỘ ĐƠN HÀNG</span>
            <FileSearch className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}
    </header>
  );
};
