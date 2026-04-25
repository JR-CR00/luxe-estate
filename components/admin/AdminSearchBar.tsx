"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("location") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("location", query);
    } else {
      params.delete("location");
    }
    params.set("page", "1");
    router.push(`/admin/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="material-icons text-gray-400 text-lg">search</span>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-primary/30 rounded-lg bg-white dark:bg-[#152e2a] text-nordic-dark dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
        placeholder="Search by location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete("location");
            params.set("page", "1");
            router.push(`/admin/properties?${params.toString()}`);
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <span className="material-icons text-base">close</span>
        </button>
      )}
    </form>
  );
}
