"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface AdminPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

export default function AdminPagination({ currentPage, totalCount, pageSize }: AdminPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const totalPages = Math.ceil(totalCount / pageSize);
  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalCount);

  if (totalCount === 0) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/properties?${params.toString()}`);
  };

  return (
    <div className="px-8 py-6 border-t border-gray-100 dark:border-primary/20 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-[#152e2a] gap-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-nordic-dark dark:text-white">{startRange}</span> to <span className="font-medium text-nordic-dark dark:text-white">{endRange}</span> of <span className="font-medium text-nordic-dark dark:text-white">{totalCount}</span> results
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 text-sm border border-gray-200 dark:border-primary/30 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logic to show a few pages around current page if many pages exist
            let pageNum = i + 1;
            if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum + 2 > totalPages) pageNum = totalPages - 4 + i;
            }
            
            if (pageNum <= 0 || pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  currentPage === pageNum
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-nordic-dark dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary/10"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 text-sm border border-gray-200 dark:border-primary/30 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
