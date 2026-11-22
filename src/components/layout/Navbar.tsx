import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { db } from '../../lib/db';
import { SystemSettings, Category } from '../../lib/types';
import { 
  Cpu, 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  User,
  ChevronDown,
  Layers,
  Wrench,
  Eye,
  FileSearch,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLookup }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerVisible, setBannerVisible] = useState(true);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    db.getSettings().then(setSettings);
    db.getCategories().then(setCategories);
  }, []);

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

  const handleKeywordClick = (kw: string) => {
    setSearchQuery(kw);
    navigate(`/products?search=${encodeURIComponent(kw)}`);
  };

  const announcementText = settings?.announcementText || 'QUÝ KHÁCH CÓ VẤN ĐỀ CẦN HỖ TRỢ VUI LÒNG LIÊN HỆ ADMIN: BÊN MÌNH NHẬN GIA CÔNG MẠCH IN & HÀN LINH KIỆN TỪ SỐ LƯỢNG NHỎ ĐẾN LỚN!';
  const showAnnouncement = settings?.showAnnouncement ?? true;
  const announcementBgColor = settings?.announcementBgColor || '#0284c7';
  const marqueeSpeed = `${settings?.announcementSpeed || 22}s`;

  return (
    <header className="sticky top-0 z-40 w-full shadow-md font-sans">
      {/* 1. TOP MARQUEE RUNNING ANNOUNCEMENT BANNER (Y HỆT ẢNH 4, CÓ THỂ SỬA TRONG ADMIN) */}
      {showAnnouncement && bannerVisible && (
        <div 
          style={{ backgroundColor: announcementBgColor }}
          className="text-white text-[12px] sm:text-[13px] font-medium py-1.5 px-3 flex items-center justify-between border-b border-black/10 select-none overflow-hidden"
        >
          <div className="flex-1 overflow-hidden relative mx-2">
            <div 
              style={{ '--marquee-speed': marqueeSpeed } as React.CSSProperties}
              className="animate-marquee inline-block font-semibold uppercase tracking-wide cursor-default"
            >
              <span className="mr-3">📢</span>
              <span>{announcementText}</span>
              <span className="mx-8">•</span>
              <span className="mr-3">📢</span>
              <span>{announcementText}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            className="p-1 hover:bg-black/20 rounded-md transition text-white/80 hover:text-white shrink-0 ml-2"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. WHITE TOP HEADER BAR (TONE TRẮNG XANH DƯƠNG THEO ẢNH ICDAYROI) */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          {/* Logo Brand Styled Like ICDAYROI */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-blue-700 font-display">
                  THẾ GIỚI LINH KIỆN
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold tracking-wider uppercase">
                  & PCB
                </span>
              </div>
              <div className="text-[11px] text-slate-500 -mt-0.5 font-medium">
                Thế giới điện tử & Bo mạch in 3D
              </div>
            </div>
          </Link>

          {/* Search Box in Center */}
          <div className="hidden md:flex flex-col flex-1 max-w-xl">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <input
                type="text"
                placeholder="Nhập từ khóa cần tìm (Arduino, STM32, ESP32, linh kiện, PCB...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-r-0 border-slate-300 rounded-l-lg text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-r-lg transition flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Tìm kiếm</span>
              </button>
            </form>
            {/* Quick keyword hints */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 truncate">
              <span className="text-slate-500">Gợi ý:</span>
              {['Arduino', 'STM32', 'ESP32', 'Module', 'Cảm biến', 'Nguồn', 'Gia công PCB'].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleKeywordClick(kw)}
                  className="hover:text-sky-600 hover:underline transition"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Login & Cart Actions */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs">
            {/* Order Lookup shortcut */}
            <button
              type="button"
              onClick={onOpenLookup}
              className="hidden lg:flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-medium transition"
            >
              <FileSearch className="w-4 h-4 text-sky-600" />
              <span>Tra cứu đơn</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-100 hover:bg-sky-50 text-slate-800 rounded-lg border border-slate-200 transition"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-sky-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">Giỏ hàng ({itemCount})</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-sky-600 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY BLUE MAIN NAVIGATION BAR (TONE XANH DƯƠNG ĐẶC TRƯNG NHƯ ICDAYROI) */}
      <div className="bg-[#007bff] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-bold uppercase tracking-wider">
            {/* Left: Category Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2.5 px-4 h-11 bg-blue-800 hover:bg-blue-900 text-white transition select-none shadow-inner"
              >
                <Menu className="w-4 h-4" />
                <span>DANH MỤC SẢN PHẨM</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu on Click */}
              {categoryDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white text-slate-800 border border-slate-200 shadow-2xl rounded-b-lg py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 hover:bg-sky-50 hover:text-sky-700 text-xs font-semibold transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400">›</span>
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 my-1" />
                  <Link
                    to="/pcb-quote?service=pcb"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sky-700 hover:bg-sky-50 text-xs font-bold"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Gia Công Mạch In (PCB)</span>
                  </Link>
                  <Link
                    to="/pcb-quote?service=assembly"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 text-xs font-bold"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Gia Công Hàn Lắp (PCBA)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Middle Nav Items */}
            <nav className="hidden md:flex items-center h-full">
              <Link
                to="/"
                className={`px-3.5 h-full flex items-center transition ${
                  location.pathname === '/' ? 'bg-blue-800 text-white' : 'hover:bg-blue-700/80 text-white/95'
                }`}
              >
                TRANG CHỦ
              </Link>

              <Link
                to="/products"
                className={`px-3.5 h-full flex items-center transition ${
                  location.pathname === '/products' ? 'bg-blue-800 text-white' : 'hover:bg-blue-700/80 text-white/95'
                }`}
              >
                SẢN PHẨM
              </Link>

              {/* GIA CÔNG MẠCH IN */}
              <Link
                to="/pcb-quote?service=pcb"
                className={`px-3.5 h-full flex items-center transition ${
                  isPCBActive ? 'bg-blue-800 text-white' : 'hover:bg-blue-700/80 text-white/95'
                }`}
              >
                GIA CÔNG MẠCH IN
              </Link>

              {/* GIA CÔNG HÀN LẮP */}
              <Link
                to="/pcb-quote?service=assembly"
                className={`px-3.5 h-full flex items-center transition ${
                  isAssemblyActive ? 'bg-blue-800 text-white' : 'hover:bg-blue-700/80 text-white/95'
                }`}
              >
                GIA CÔNG HÀN LẮP
              </Link>

              {/* XEM 3D GERBER */}
              <Link
                to="/pcb-quote#viewer3d"
                className="px-3.5 h-full flex items-center gap-1.5 hover:bg-blue-700/80 text-yellow-300 font-bold transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>XEM 3D GERBER</span>
              </Link>

              <Link
                to="/pcb-services"
                className={`px-3.5 h-full flex items-center transition ${
                  location.pathname === '/pcb-services' ? 'bg-blue-800 text-white' : 'hover:bg-blue-700/80 text-white/95'
                }`}
              >
                QUY TRÌNH & DFM
              </Link>

              <Link
                to="/contact"
                className={`px-3.5 h-full flex items-center transition ${
                  location.pathname === '/contact' ? 'bg-blue-800 text-white' : 'hover:bg-blue-700/80 text-white/95'
                }`}
              >
                LIÊN HỆ
              </Link>
            </nav>

            {/* Right: Hotline */}
            <div className="flex items-center gap-2">
              <a
                href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 bg-white text-blue-700 hover:bg-sky-50 rounded text-xs font-bold font-mono transition shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                <span>Hotline: {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MOBILE MENU ACCORDION */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-fade-in text-xs font-semibold">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, linh kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-l-lg text-xs"
            />
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-r-lg">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-800 hover:text-sky-600 uppercase"
            >
              TRANG CHỦ
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-800 hover:text-sky-600 uppercase"
            >
              DANH MỤC SẢN PHẨM
            </Link>
            <Link
              to="/pcb-quote?service=pcb"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sky-700 font-bold uppercase"
            >
              GIA CÔNG MẠCH IN (PCB)
            </Link>
            <Link
              to="/pcb-quote?service=assembly"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-orange-600 font-bold uppercase"
            >
              GIA CÔNG HÀN LẮP (PCBA)
            </Link>
            <Link
              to="/pcb-services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-800 hover:text-sky-600 uppercase"
            >
              QUY TRÌNH & DFM
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-800 hover:text-sky-600 uppercase"
            >
              LIÊN HỆ
            </Link>
            <Link
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-500 hover:text-slate-800"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-500 hover:text-slate-800"
            >
              Chính sách bảo mật
            </Link>
            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-500 hover:text-slate-800"
            >
              Chính sách hỗ trợ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
