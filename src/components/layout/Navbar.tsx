import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { PCB_CONFIG_DATA } from '../../lib/pricing';
import { 
  Cpu, 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  Layers, 
  Sparkles, 
  ShieldAlert, 
  User, 
  MessageCircle,
  FileSearch
} from 'lucide-react';

interface NavbarProps {
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLookup }) => {
  const location = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Announcement & Quick Contact Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[10px] font-bold uppercase font-mono">
              HOT
            </span>
            <span className="text-slate-300 truncate">
              🔥 Đặt mạch in PCB 2 lớp chỉ từ 150.000đ - Miễn phí soi 3D & kiểm tra DFM!
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 font-mono text-[11px] text-slate-300">
            <a
              href={`tel:${PCB_CONFIG_DATA.CONTACT.zaloPhone}`}
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hotline: {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={PCB_CONFIG_DATA.CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-cyan-400 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zalo Kỹ Thuật</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="text-cyan-300 hover:text-cyan-200 transition font-semibold">
              Quản Trị Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Slogan */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5 font-display">
                <span>THẾ GIỚI LINH KIỆN</span>
                <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                  & PCB
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Linh Kiện Điện Tử • Mạch In 3D • PCBA Assembly
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Trang Chủ
            </Link>
            <Link
              to="/products"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/products') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Linh Kiện Điện Tử
            </Link>
            <Link
              to="/pcb-services"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/pcb-services') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Dịch Vụ PCB
            </Link>
            <Link
              to="/pcb-quote"
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                isActive('/pcb-quote')
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Báo Giá Đặt PCB (3D)</span>
            </Link>
            <button
              type="button"
              onClick={onOpenLookup}
              className="px-3 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <FileSearch className="w-4 h-4 text-slate-500" />
              <span>Tra Cứu Đơn</span>
            </button>
          </nav>

          {/* Right Action Icons: Cart, Lookup, Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Lookup Button on Mobile */}
            <button
              type="button"
              onClick={onOpenLookup}
              className="lg:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
              title="Tra cứu đơn hàng"
            >
              <FileSearch className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition"
              title="Xem giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full text-[11px] font-bold font-mono flex items-center justify-center shadow-md animate-scale">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Admin Portal Pill */}
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-blue-900 rounded-xl text-xs font-mono font-medium transition shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Trang Chủ
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Linh Kiện Điện Tử
          </Link>
          <Link
            to="/pcb-services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Dịch Vụ Gia Công PCB
          </Link>
          <Link
            to="/pcb-quote"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 shadow-md"
          >
            ✨ Báo Giá Đặt PCB & 3D Viewer
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLookup();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Tra Cứu Tiến Độ Đơn Hàng</span>
            <FileSearch className="w-4 h-4 text-slate-400" />
          </button>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-mono font-medium text-slate-700 bg-slate-100"
          >
            Quản Trị Admin
          </Link>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Hotline: {PCB_CONFIG_DATA.CONTACT.hotlineDisplay}</span>
            <a href={PCB_CONFIG_DATA.CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold">
              Nhắn Zalo
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
