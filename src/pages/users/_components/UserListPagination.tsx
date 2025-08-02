import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

interface UserListPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  loading?: boolean;
}

const UserListPagination: React.FC<UserListPaginationProps> = ({
  pagination,
  onPageChange,
  onPerPageChange,
  loading = false
}) => {
  const { current_page, last_page, per_page, total, from, to } = pagination;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (last_page <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (current_page <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(last_page);
      } else if (current_page >= last_page - 2) {
        // Near the end
        pages.push(1);
        pages.push('ellipsis');
        for (let i = last_page - 3; i <= last_page; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('ellipsis');
        for (let i = current_page - 1; i <= current_page + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(last_page);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= last_page && page !== current_page && !loading) {
      onPageChange(page);
    }
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (newPerPage !== per_page && !loading) {
      onPerPageChange(newPerPage);
    }
  };

  if (last_page <= 1) {
    return (
      <div className="flex items-center justify-between bg-white px-4 py-3 border rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <select 
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={per_page}
            onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
            disabled={loading}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-700">per page</span>
        </div>
        
        <div className="text-sm text-gray-700">
          Showing {from || 0} to {to || 0} of {total} results
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border rounded-lg">
      {/* Items Per Page */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Show</span>
        <select 
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={per_page}
          onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
          disabled={loading}
        >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span className="text-sm text-gray-700">per page</span>
      </div>
      
      {/* Results Info */}
      <div className="hidden sm:block text-sm text-gray-700">
        Showing {from || 0} to {to || 0} of {total} results
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={current_page === 1 || loading}
          className="h-8 w-8 p-0"
          title="First Page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(current_page - 1)}
          disabled={current_page === 1 || loading}
          className="h-8 w-8 p-0"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {generatePageNumbers().map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </span>
              );
            }

            const pageNum = page as number;
            const isCurrentPage = pageNum === current_page;

            return (
              <Button
                key={pageNum}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`h-8 w-8 p-0 ${
                  isCurrentPage 
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                    : ''
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(current_page + 1)}
          disabled={current_page === last_page || loading}
          className="h-8 w-8 p-0"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(last_page)}
          disabled={current_page === last_page || loading}
          className="h-8 w-8 p-0"
          title="Last Page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserListPagination;