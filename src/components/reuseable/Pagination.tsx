+'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';

// Utility to generate pagination numbers (e.g., [1, ..., 4, 5, 6, ..., 10])
const generatePagination = (currentPage: number, totalPages: number): (number | '...')[] => {
  const delta = 2; // How many pages to show around the current page
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  const range: number[] = [];
  const rangeWithDots: (number | '...')[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      range.push(i);
    }
  }

  let l: number | undefined;
  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l > 2) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

// ==========================================================
interface PaginationProps {
  className?: string;
  altStyle?: boolean;
  totalPages: number;
  currentPage: number;
}
// ==========================================================

export default function Pagination({ 
  altStyle = false, 
  className = "justify-content-center", 
  totalPages, 
  currentPage 
}: PaginationProps) {

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams ?? undefined);
    params.set('pagina', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const paginationNumbers = generatePagination(currentPage, totalPages);

  if (totalPages <= 1) {
    return null; // Don't render pagination if only one page
  }

  return (
    <nav className={`d-flex ${className}`} aria-label="pagination">
      <ul className={clsx({ pagination: true, "pagination-alt": altStyle })}>
        {/* Previous Button */}
        <li className={clsx("page-item", { disabled: currentPage <= 1 })}>
          <Link 
            href={createPageURL(currentPage - 1)}
            className="page-link"
            scroll={false}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
          >
            <i className="uil uil-arrow-left" />
          </Link>
        </li>

        {/* Page Number Buttons */}
        {paginationNumbers.map((page, index) => (
          page === '...' ? (
            <li key={`ellipsis-${index}`} className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          ) : (
            <li key={page} className={clsx("page-item", { active: currentPage === page })}>
              <Link 
                href={createPageURL(page)}
                className="page-link"
                scroll={false}
              >
                {page}
              </Link>
          </li>
          )
        ))}

        {/* Next Button */}
        <li className={clsx("page-item", { disabled: currentPage >= totalPages })}>
          <Link 
            href={createPageURL(currentPage + 1)} 
            className="page-link"
            scroll={false}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
          >
            <i className="uil uil-arrow-right" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
