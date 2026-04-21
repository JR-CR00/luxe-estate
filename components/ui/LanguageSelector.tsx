'use client';

import { useState, useRef, useEffect } from 'react';
import { locales, Locale, getLocaleDisplayName } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export default function LanguageSelector({ currentLocale }: { currentLocale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setIsOpen(false);
    // Refresh page to apply changes
    router.refresh();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-nordic-dark hover:bg-black/5 rounded-full transition-colors"
      >
        <span className="material-icons text-lg">language</span>
        <span>{getLocaleDisplayName(currentLocale)}</span>
        <span className={`material-icons text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden">
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                  currentLocale === locale
                    ? 'bg-mosque/10 text-mosque font-semibold'
                    : 'text-nordic-dark hover:bg-black/5'
                }`}
              >
                {getLocaleDisplayName(locale)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
