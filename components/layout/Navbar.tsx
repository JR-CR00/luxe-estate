'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Navbar({ locale, dict }: { locale: Locale; dict: any }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setUserRole(profile?.role || 'user');
      } else {
        setUserRole(null);
      }
    };

    getUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      if (newUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', newUser.id)
          .single();
        
        setUserRole(profile?.role || 'user');
      } else {
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.user-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    try {
      setIsMenuOpen(false);
      await supabase.auth.signOut();
      // Hard redirect to home to clear all cache and state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">
              Luxe Estate
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1"
              href="#"
            >
              {dict.nav.buy}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {dict.nav.rent}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {dict.nav.sell}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {dict.nav.savedHomes}
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <LanguageSelector currentLocale={locale} />
            <button className="text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            
            <div className="relative user-menu-container">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a3833] overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative cursor-pointer group flex items-center justify-center"
              >
                {user ? (
                  avatarUrl ? (
                    <Image
                      alt={dict.nav.profileAlt}
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      fill
                      sizes="40px"
                      src={avatarUrl}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-mosque/10 text-mosque">
                      <span className="material-icons text-xl">person</span>
                    </div>
                  )
                ) : (
                  <span className="material-icons text-nordic-dark/40 group-hover:text-mosque transition-colors">account_circle</span>
                )}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a3833] rounded-xl shadow-xl border border-nordic-dark/5 dark:border-[#006655]/20 py-2 z-[60] animate-in fade-in zoom-in duration-200 origin-top-right">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-nordic-dark/5 dark:border-[#006655]/10 mb-1">
                        <p className="text-xs text-nordic-dark/50 dark:text-gray-400 font-medium truncate uppercase tracking-wider">
                          {user.email}
                        </p>
                      </div>
                      {userRole === 'admin' && (
                        <Link 
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-nordic-dark dark:text-gray-200 hover:bg-mosque/5 dark:hover:bg-[#006655]/10 transition-colors font-semibold"
                        >
                          <span className="material-icons text-lg text-amber-500">admin_panel_settings</span>
                          {dict.nav.adminDashboard}
                        </Link>
                      )}
                      <Link 
                        href="#"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-nordic-dark dark:text-gray-200 hover:bg-mosque/5 dark:hover:bg-[#006655]/10 transition-colors"
                      >
                        <span className="material-icons text-lg text-mosque">person_outline</span>
                        Profile Settings
                      </Link>
                      <Link 
                        href="#"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-nordic-dark dark:text-gray-200 hover:bg-mosque/5 dark:hover:bg-[#006655]/10 transition-colors"
                      >
                        <span className="material-icons text-lg text-mosque">favorite_border</span>
                        {dict.nav.savedHomes}
                      </Link>
                      <div className="h-px bg-nordic-dark/5 dark:border-[#006655]/10 my-1"></div>
                      <button 
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      >
                        <span className="material-icons text-lg">logout</span>
                        {dict.nav.logout}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-nordic-dark dark:text-gray-200 hover:bg-mosque/5 dark:hover:bg-[#006655]/10 transition-colors"
                      >
                        <span className="material-icons text-lg text-mosque">login</span>
                        {dict.nav.login}
                      </Link>
                      <Link 
                        href="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-nordic-dark dark:text-gray-200 hover:bg-mosque/5 dark:hover:bg-[#006655]/10 transition-colors"
                      >
                        <span className="material-icons text-lg text-mosque">person_add</span>
                        {dict.nav.signup}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10"
            href="#"
          >
            {dict.nav.buy}
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            {dict.nav.rent}
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            {dict.nav.sell}
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            {dict.nav.savedHomes}
          </Link>
        </div>
      </div>
    </nav>
  );
}
