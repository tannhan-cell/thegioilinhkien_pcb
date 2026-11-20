import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldAlert,
  Cpu,
  Lock,
  User,
  KeyRound,
  CheckCircle,
  AlertCircle,
  FolderTree
} from 'lucide-react';
import { db } from '../../lib/db';
import { AdminAccount } from '../../lib/types';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [hasAdminAccount, setHasAdminAccount] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // First time register form
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('Võ Tấn Nhân');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const checkAuth = async () => {
    try {
      const admin = await db.getAdminAccount();
      setHasAdminAccount(Boolean(admin));
      const session = db.getAdminSession();
      setIsLoggedIn(Boolean(session));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleRegisterFirstAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Vui lòng nhập Email hợp lệ!');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Mật khẩu quản trị phải có ít nhất 6 ký tự!');
      return;
    }

    if (regPassword !== regConfirm) {
      setRegError('Xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      await db.registerFirstAdmin(regEmail, regName, regPassword);
      db.setAdminSession(true);
      setIsLoggedIn(true);
      setHasAdminAccount(true);
    } catch (err: any) {
      setRegError(err.message || 'Lỗi khi tạo tài khoản.');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const ok = await db.verifyAdminLogin(loginEmail, loginPassword);
      if (ok) {
        db.setAdminSession(true);
        setIsLoggedIn(true);
      } else {
        setLoginError('Email hoặc Mật khẩu quản trị không chính xác!');
      }
    } catch (err: any) {
      setLoginError('Lỗi đăng nhập: ' + err.message);
    }
  };

  const handleLogout = () => {
    db.setAdminSession(false);
    setIsLoggedIn(false);
  };

  const navItems = [
    { label: 'Tổng Quan (Dashboard)', path: '/admin270906', icon: LayoutDashboard },
    { label: 'Yêu Cầu Gia Công PCB & PCBA', path: '/admin270906/pcb-requests', icon: Layers },
    { label: 'Đơn Hàng Mua Linh Kiện', path: '/admin270906/orders', icon: ShoppingCart },
    { label: 'Quản Lý Sản Phẩm', path: '/admin270906/products', icon: Package },
    { label: 'Cài Đặt Cửa Hàng, Tele & VietQR', path: '/admin270906/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-mono text-xs">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-3" />
        Đang xác thực hệ thống quản trị...
      </div>
    );
  }

  // 1. CHƯA CÓ ACC ADMIN NÀO -> MÀN HÌNH ĐĂNG KÝ MASTER ADMIN ĐẦU TIÊN
  if (!hasAdminAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-600 uppercase tracking-widest block">
              BẢO MẬT HỆ THỐNG CẤP CAO
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
              Khởi Tạo Tài Khoản Admin Đầu Tiên
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hệ thống chưa có quản trị viên. Tài khoản bạn đăng ký ngay lúc này sẽ là <b>Master Admin duy nhất</b>. Sau khi tạo, quyền đăng ký sẽ tự động khóa vĩnh viễn.
            </p>
          </div>

          <form onSubmit={handleRegisterFirstAdmin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Họ và tên Quản trị viên:</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email đăng nhập Admin:</label>
              <input
                type="email"
                required
                placeholder="admin@thegioilinhkienpcb.vn"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mật khẩu bảo vệ (Tối thiểu 6 ký tự):</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Xác nhận lại mật khẩu:</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              />
            </div>

            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition text-xs uppercase tracking-wider"
            >
              KHỞI TẠO TÀI KHOẢN MASTER ADMIN & KHÓA
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. ĐÃ CÓ ACC ADMIN NHƯNG CHƯA ĐĂNG NHẬP -> MÀN HÌNH ĐĂNG NHẬP ADMIN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-600 uppercase tracking-widest block">
              KHU VỰC BẢO MẬT NỘI BỘ
            </span>
            <h2 className="text-xl font-bold font-display text-slate-900">
              Đăng Nhập Quản Trị Viên
            </h2>
            <p className="text-xs text-slate-400">
              Đường dẫn bảo mật: <code className="text-blue-600 font-mono">/admin270906</code>
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Quản Trị:</label>
              <input
                type="email"
                required
                placeholder="admin@thegioilinhkienpcb.vn"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mật Khẩu:</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition text-xs uppercase tracking-wider"
            >
              ĐĂNG NHẬP ADMIN
            </button>
          </form>

          <div className="text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 transition">
              ← Quay về trang chủ website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. ĐÃ ĐĂNG NHẬP ADMIN THÀNH CÔNG -> HIỂN THỊ GIAO DIỆN QUẢN TRỊ ADMIN
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Logo & Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin270906" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white font-display">TGLK & PCB</div>
                <div className="text-[10px] text-cyan-400 font-mono">BẢO MẬT: /admin270906</div>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2 py-1 text-slate-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <b className="text-white">Admin Master</b>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 p-1 flex items-center gap-1"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl transition font-medium"
          >
            <span>Xem Website Bán Hàng</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
