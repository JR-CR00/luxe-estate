import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Prev */}
      <Link
        href={hasPrev ? `/?page=${currentPage - 1}` : '#'}
        aria-disabled={!hasPrev}
        className={`
          flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all
          ${hasPrev
            ? 'border-nordic-dark/10 text-nordic-dark bg-white hover:border-mosque hover:text-mosque hover:shadow-md'
            : 'border-nordic-dark/5 text-nordic-muted/40 bg-white/50 pointer-events-none'}
        `}
      >
        <span className="material-icons text-base leading-none">arrow_back</span>
        Anterior
      </Link>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={`/?page=${page}`}
              className={`
                w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-mosque text-white shadow-lg shadow-mosque/20'
                  : 'bg-white border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque hover:shadow-md'}
              `}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next */}
      <Link
        href={hasNext ? `/?page=${currentPage + 1}` : '#'}
        aria-disabled={!hasNext}
        className={`
          flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all
          ${hasNext
            ? 'border-nordic-dark/10 text-nordic-dark bg-white hover:border-mosque hover:text-mosque hover:shadow-md'
            : 'border-nordic-dark/5 text-nordic-muted/40 bg-white/50 pointer-events-none'}
        `}
      >
        Siguiente
        <span className="material-icons text-base leading-none">arrow_forward</span>
      </Link>
    </div>
  );
}
