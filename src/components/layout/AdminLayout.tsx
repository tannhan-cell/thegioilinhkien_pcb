import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: 'Tổng Quan (Dashboard)', path: '/admin', icon: LayoutDashboard },
    { label: 'Yêu Cầu Gia Công PCB', path: '/admin/pcb-requests', icon: Layers },
    { label: 'Đơn Hàng Mua Linh Kiện', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Quản Lý Sản Phẩm', path: '/admin/products', icon: Package },
    { label: 'Cài Đặt Cửa Hàng & VietQR', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Logo & Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white font-display">TGLK & PCB</div>
                <div className="text-[10px] text-cyan-400 font-mono">ADMIN CONTROL</div>
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

        {/* Bottom User & Store link */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 px-2 py-1 text-slate-400 font-mono text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quyền: <b className="text-white">Admin</b></span>
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
