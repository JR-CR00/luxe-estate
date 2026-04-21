"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterModal from "./FilterModal";
import { useI18n } from "@/components/providers/I18nProvider";

export default function FilterBar() {
  const { dict } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "All";

  const setType = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "All") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4 w-full">
        <button
          onClick={() => setType("All")}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
            currentType === "All"
              ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10"
              : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark"
          }`}
        >
          {dict.common.types.all}
        </button>
        {[
          { id: "House", label: dict.common.types.house },
          { id: "Apartment", label: dict.common.types.apartment },
          { id: "Villa", label: dict.common.types.villa },
          { id: "Penthouse", label: dict.common.types.penthouse }
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setType(type.id)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentType === type.id
                ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10"
                : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
            }`}
          >
            {type.label}
          </button>
        ))}
        <div className="w-px h-6 bg-nordic-dark/10 mx-2 flex-shrink-0"></div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
        >
          <span className="material-icons text-base">tune</span> {dict.common.filters}
        </button>
      </div>

      <FilterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        totalResults={0} // Can be wired later if needed
      />
    </div>
  );
}
