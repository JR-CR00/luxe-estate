'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as Element).closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const menuItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Properties', href: '/admin/properties' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Inquiries', href: '#' },
  ];

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false);
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display antialiased">
      {/* Horizontal Navbar */}
      <nav className="bg-white dark:bg-[#152e2a] border-b border-nordic-dark/5 dark:border-primary/20 sticky top-0 z-50 shadow-sm h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group transition-all">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                L
              </div>
              <span className="font-bold text-xl tracking-tight text-nordic-dark dark:text-white">Luxe Estate</span>
            </Link>

            {/* Main Nav Links */}
            <div className="hidden md:flex items-center space-x-8 h-16">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`h-full flex items-center px-1 border-b-2 text-sm font-bold transition-all ${isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-nordic-dark/60 hover:text-primary'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button className="text-nordic-dark/60 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            <button className="text-nordic-dark/60 hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#152e2a]"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative user-menu-container flex items-center gap-3 pl-4 border-l border-nordic-dark/10">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-nordic-dark dark:text-white leading-none">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  Premium Admin
                </span>
              </div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 rounded-full bg-nordic-dark/5 dark:bg-[#1a3833] overflow-hidden ring-2 ring-white dark:ring-primary/20 hover:ring-primary transition-all relative cursor-pointer group flex items-center justify-center border border-nordic-dark/10"
              >
                {user ? (
                  avatarUrl ? (
                    <Image
                      alt="Avatar"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      fill
                      sizes="40px"
                      src={avatarUrl}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <span className="material-icons text-xl font-bold">person</span>
                    </div>
                  )
                ) : (
                  <span className="material-icons text-nordic-dark/40 group-hover:text-primary transition-colors">account_circle</span>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-14 w-56 bg-white dark:bg-[#1a3833] rounded-2xl shadow-xl border border-nordic-dark/5 dark:border-primary/20 py-2 z-[60] animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-nordic-dark/5 dark:border-primary/10 mb-1">
                    <p className="text-xs text-nordic-dark/50 dark:text-gray-400 font-bold truncate uppercase tracking-widest">
                      {user?.email || 'Admin User'}
                    </p>
                  </div>
                  <Link
                    href="/"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-nordic-dark dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-primary">public</span>
                    View Website
                  </Link>
                  <Link
                    href="#"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-nordic-dark dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-primary">settings</span>
                    Account Settings
                  </Link>
                  <div className="h-px bg-nordic-dark/5 dark:border-primary/10 my-1"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-nordic-dark/5 bg-white dark:bg-[#152e2a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-nordic-dark/40 dark:text-gray-500">
            © 2023 Luxe Estate Property Management. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs font-bold text-nordic-dark/40 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs font-bold text-nordic-dark/40 hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs font-bold text-nordic-dark/40 hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
