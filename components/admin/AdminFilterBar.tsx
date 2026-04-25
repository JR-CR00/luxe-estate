"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSearchBar from "./AdminSearchBar";
import FilterModal from "../ui/FilterModal";

export default function AdminFilterBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentStatus = searchParams.get("status") || "All";
  const currentType = searchParams.get("type") || "All";

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`/admin/properties?${params.toString()}`);
  };

  const hasActiveFilters = searchParams.toString().length > 0 && !(searchParams.has("page") && searchParams.size === 1);

  const clearFilters = () => {
    router.push("/admin/properties");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <AdminSearchBar />
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Status Filter Dropdown */}
        <div className="relative group">
          <select
            value={currentStatus}
            onChange={(e) => setFilter("status", e.target.value)}
            className="appearance-none bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic-dark dark:text-gray-300 pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="FOR SALE">For Sale</option>
            <option value="FOR RENT">For Rent</option>
            <option value="PENDING">Pending</option>
            <option value="SOLD">Sold</option>
          </select>
          <span className="material-icons absolute right-3 top-2.5 text-gray-400 pointer-events-none text-lg">expand_more</span>
        </div>

        {/* Type Filter Dropdown */}
        <div className="relative group">
          <select
            value={currentType}
            onChange={(e) => setFilter("type", e.target.value)}
            className="appearance-none bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic-dark dark:text-gray-300 pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Penthouse">Penthouse</option>
          </select>
          <span className="material-icons absolute right-3 top-2.5 text-gray-400 pointer-events-none text-lg">expand_more</span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <span className="material-icons text-base">tune</span>
          <span className="hidden md:inline">Advanced</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors underline decoration-gray-300 underline-offset-4"
          >
            Clear
          </button>
        )}
      </div>

      <FilterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        totalResults={0}
        targetPath="/admin/properties"
      />
    </div>
  );
}
