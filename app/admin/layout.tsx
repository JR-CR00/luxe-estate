'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Properties', href: '/admin/properties', icon: 'home' },
    { name: 'Users & Roles', href: '/admin/users', icon: 'people' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
  ];

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a1a17] flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#19322F] text-white transition-all duration-300 flex flex-col fixed h-full z-30`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <span className="text-xl font-bold tracking-tight text-[#D9ECC8]">Luxe Admin</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-icons">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>
        </div>

        <nav className="flex-grow mt-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#006655] text-white shadow-lg shadow-[#006655]/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`material-icons ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <span className="material-icons">arrow_back</span>
            {isSidebarOpen && <span className="font-medium">Exit Admin</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`flex-grow transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } min-h-screen`}
      >
        <header className="bg-white dark:bg-[#152e2a] border-b border-gray-200 dark:border-[#006655]/20 h-20 flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="text-xl font-semibold text-[#19322F] dark:text-white">
            {menuItems.find(item => item.href === pathname)?.name || 'Admin'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-mosque transition-colors">
              <span className="material-icons">notifications</span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <span className="material-icons">logout</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#006655] flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
