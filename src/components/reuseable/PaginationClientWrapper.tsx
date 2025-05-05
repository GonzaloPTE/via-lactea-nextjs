'use client';

import Pagination from './Pagination';

// Define props if needed, matching PaginationProps without client-specific hooks
interface PaginationWrapperProps {
  className?: string;
  altStyle?: boolean;
  totalPages: number;
  currentPage: number;
}

// This component acts as the client boundary
export default function PaginationClientWrapper(props: PaginationWrapperProps) {
  // The hooks (usePathname, useSearchParams) are used inside the Pagination component
  return <Pagination {...props} />;
} 