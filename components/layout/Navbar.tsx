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
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

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
            
            {user ? (
              <button 
                onClick={() => supabase.auth.signOut()}
                className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2 group"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative">
                  {avatarUrl ? (
                    <Image
                      alt={dict.nav.profileAlt}
                      className="object-cover"
                      fill
                      sizes="36px"
                      src={avatarUrl}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-mosque/10 text-mosque">
                      <span className="material-icons text-xl">person</span>
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <Link 
                href="/auth/login"
                className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2 group"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-transparent group-hover:ring-mosque transition-all">
                  <span className="material-icons text-nordic-dark/50 group-hover:text-mosque">person</span>
                </div>
              </Link>
            )}
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
