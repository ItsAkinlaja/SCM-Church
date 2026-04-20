import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Quote,
  Settings,
  ShieldCheck,
  Users,
  UserPlus,
  Image as ImageIcon,
  Video,
  Globe,
  X,
  Heart,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Close sidebar on navigation (mobile)
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Subscribers', path: '/admin/subscribers', icon: UserPlus },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Sermons Media', path: '/admin/sermons', icon: Video },
    { name: 'Members', path: '/admin/members', icon: Users },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Prayer Requests', path: '/admin/prayer-requests', icon: Heart },
    { name: 'Testimonies', path: '/admin/testimonies', icon: Quote },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f6f1e7] text-slate-900" translate="no" suppressHydrationWarning>
      <div className="flex min-h-screen">
        <div
          key="admin-sidebar-overlay"
          className={`fixed inset-0 z-40 bg-[#071126]/55 backdrop-blur-sm transition-opacity lg:hidden ${
            isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <aside
          key="admin-sidebar-aside"
          className={`fixed inset-y-0 left-0 z-50 flex w-[19rem] flex-col border-r border-white/10 bg-[#071126] text-white shadow-[18px_0_60px_rgba(7,17,38,0.24)] transition-transform duration-300 lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="border-b border-white/10 px-6 pb-6 pt-6">
            <div className="flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/72 transition hover:bg-white/10 hover:text-white"
              >
                <span className="flex items-center justify-center"><X size={20} /></span>
              </button>
            </div>

            <Link to="/" className="mt-4 flex items-center gap-4 lg:mt-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b53a2d] shadow-[0_16px_35px_rgba(181,58,45,0.32)]">
                <span className="flex items-center justify-center"><ShieldCheck size={24} className="text-white" /></span>
              </div><div>
                <div className="text-lg font-bold tracking-tight"><span>SCM&nbsp;Admin</span></div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45"><span>Ministry&nbsp;Control&nbsp;Room</span></div>
              </div>
            </Link>
          </div>

          <div className="px-4 pt-5">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 px-4 py-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#d96858]">
                <span>Admin Portal</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/68">
                <span>Manage ministry resources and updates.</span>
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#b53a2d] text-white shadow-[0_14px_28px_rgba(181,58,45,0.32)]'
                      : 'text-white/72 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className="flex items-center justify-center"><Icon size={18} /></span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#b53a2d] bg-white transition hover:bg-gray-100"
            >
              <span className="flex items-center justify-center"><Globe size={18} /></span>
              <span>Visit Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white/72 transition hover:bg-white/8 hover:text-white"
            >
              <span className="flex items-center justify-center"><LogOut size={18} /></span>
              <span>Logout</span>
            </button>
          </div>
        </aside><div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[#eadfca] bg-[#f6f1e7]/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#eadfca] bg-white text-slate-700 shadow-sm transition hover:border-[#d8c5bb] hover:text-[#b53a2d] lg:hidden"
                >
                  <span className="flex items-center justify-center"><Menu size={20} /></span>
                </button>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b53a2d]"><span>SCM&nbsp;Administration</span></div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"><span>{navItems.find((item) => isActive(item.path))?.name || 'Admin Portal'}</span></h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  to="/"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#eadfca] bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#d8c5bb] hover:text-[#b53a2d]"
                >
                  <span>View Website</span>
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div key={location.pathname} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
