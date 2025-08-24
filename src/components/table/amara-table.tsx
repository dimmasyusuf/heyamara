"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EllipsisIcon,
} from "lucide-react";
import { nanoid } from "nanoid";

import { EmptyState } from "@/components/state";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

import { AmaraSpinner } from "@/components/spinner";
import { Input } from "../ui/input";
import { Pagination } from "@/types/api";

export interface AmaraTableColumn {
  key: string;
  header: string | React.ReactNode;
  icon?: React.ReactNode;
  cell?: (data: any) => React.ReactNode;
  sortable?: boolean;
  className?: string | ((data: any) => string);
}

interface AmaraTableProps {
  id: string;
  columns: AmaraTableColumn[];
  data: any[];
  isLoading?: boolean;
  pagination?: Pagination;
  actions?: React.ReactNode;
}

export default function AmaraTable({
  id,
  columns,
  data = [],
  pagination,
  isLoading = false,
  actions,
}: AmaraTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parameter constants
  const sortParam = "sort";
  const orderParam = "order";
  const offsetParam = "offset";
  const limitParam = "limit";
  const searchParam = "search";

  const [currentPage, setCurrentPage] = useState(() => {
    const urlPage = searchParams.get(offsetParam);
    if (urlPage) return parseInt(urlPage);
    return 1; // Always default to 1 if no URL param
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const urlLimit = searchParams.get(limitParam);
    if (urlLimit) {
      const parsed = parseInt(urlLimit);
      return isNaN(parsed) || parsed <= 0 ? 10 : parsed;
    }
    return 10; // Always default to 10 if no URL param
  });

  // Explicit select value state - separate from rowsPerPage for better control
  const [selectValue, setSelectValue] = useState<string>("");

  const [sortColumn, setSortColumn] = useState<string | null>(
    searchParams.get(sortParam) || null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (searchParams.get(orderParam) as "asc" | "desc") || "asc",
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get(searchParam) || "",
  );

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const keys = useMemo(
    () => Array.from({ length: columns.length }, () => nanoid()),
    [columns.length],
  );

  // Dynamic rows per page options based on total data
  const getDynamicRowsPerPageOptions = useCallback(() => {
    const baseOptions = [1, 5, 10, 25, 50];

    // Always return base options if no pagination or total is 0
    if (!pagination?.total || pagination.total === 0)
      return baseOptions.slice(1); // Skip 1 for empty state

    // If total is very small, include relevant small options
    if (pagination.total <= 5) {
      return [1, 5, 10];
    }

    // Filter options that are less than or equal to total items, but keep at least some options
    const filteredOptions = baseOptions.filter(
      (option) => option <= pagination.total,
    );

    return filteredOptions.length > 0
      ? filteredOptions
      : baseOptions.slice(0, 2); // [1, 5]
  }, [pagination?.total]);

  const rowsPerPageOptions = getDynamicRowsPerPageOptions();

  // Update URL search params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  // Sync select value with rowsPerPage - this ensures the select always shows the correct value
  useEffect(() => {
    const currentOptions = getDynamicRowsPerPageOptions();

    // If current rowsPerPage is not in available options, reset to first available option
    if (!currentOptions.includes(rowsPerPage)) {
      const newRowsPerPage = currentOptions[0] || 10;
      setRowsPerPage(newRowsPerPage);
      setSelectValue(newRowsPerPage.toString());

      // Update URL as well
      updateSearchParams({
        [limitParam]: newRowsPerPage.toString(),
      });
    } else {
      // Set select value to current rowsPerPage if it's valid
      setSelectValue(rowsPerPage.toString());
    }
  }, [
    rowsPerPage,
    pagination?.total,
    updateSearchParams,
    limitParam,
    getDynamicRowsPerPageOptions,
  ]);

  // Update local state when pagination prop changes or URL params change
  useEffect(() => {
    const urlPage = searchParams.get(offsetParam);
    const urlLimit = searchParams.get(limitParam);
    const urlSearch = searchParams.get(searchParam);

    // Always set a valid page number
    if (urlPage) {
      const parsedPage = parseInt(urlPage);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        setCurrentPage(parsedPage);
      }
    } else if (pagination?.page && pagination.page > 0) {
      setCurrentPage(pagination.page);
    }

    // Always set a valid rows per page
    if (urlLimit) {
      const parsedLimit = parseInt(urlLimit);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        setRowsPerPage(parsedLimit);
      }
    } else if (pagination?.per_page && pagination.per_page > 0) {
      setRowsPerPage(pagination.per_page);
    }

    // Update search query from URL
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
  }, [pagination, searchParams]);

  const handleSort = (column: string) => {
    let newDirection: "asc" | "desc" = "asc";

    if (sortColumn === column) {
      newDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortColumn(column);
    setSortDirection(newDirection);

    updateSearchParams({
      [sortParam]: column,
      [orderParam]: newDirection,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateSearchParams({
      [offsetParam]: newPage.toString(),
    });
  };

  const handleRowsPerPageChange = (newRowsPerPage: string) => {
    const newLimit = parseInt(newRowsPerPage);
    if (isNaN(newLimit) || newLimit <= 0) return;

    // Update both select value and rows per page state
    setSelectValue(newRowsPerPage);
    setRowsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing rows per page

    updateSearchParams({
      [limitParam]: newRowsPerPage,
      [offsetParam]: "1",
    });
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to first page when searching

      updateSearchParams({
        [searchParam]: query || null,
        [offsetParam]: "1",
      });
    },
    [updateSearchParams, searchParam, offsetParam],
  );

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(query);
      }, 500); // 500ms delay
    },
    [handleSearch],
  );

  // Utility to get nested value by path (e.g., 'source_file.size')
  function getValueByPath(obj: any, path: string) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  const sortedData = [...data].sort((a: any, b: any) => {
    if (!sortColumn) return 0;
    const aValue = getValueByPath(a, sortColumn);
    const bValue = getValueByPath(b, sortColumn);
    if (aValue === undefined || bValue === undefined) return 0;

    // Handle different data types
    const compareValue = (valA: any, valB: any) => {
      if (typeof valA === "string" && typeof valB === "string") {
        return valA.localeCompare(valB);
      }
      if (valA > valB) return 1;
      if (valA < valB) return -1;
      return 0;
    };

    const result = compareValue(aValue, bValue);
    return sortDirection === "asc" ? result : -result;
  });

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!pagination) return [];

    const { page, total_pages } = pagination;
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (total_pages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(total_pages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < total_pages - 2) {
        pages.push("...");
      }

      // Show last page
      if (total_pages > 1) {
        pages.push(total_pages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // Calculate items range for display
  const getItemsRange = () => {
    // During loading or when no pagination data, show loading state
    if (isLoading || !pagination) return { start: 0, end: 0, total: 0 };

    const { page, total } = pagination;

    // If no data, return zeros
    if (total === 0) return { start: 0, end: 0, total: 0 };

    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, total);

    return { start, end, total };
  };

  const { start, end, total } = getItemsRange();

  return (
    <div className="flex flex-col overflow-auto rounded-2xl bg-background">
      <div className="flex items-center justify-between rounded-t-2xl border border-b-0 px-6 py-4">
        <Input
          type="text"
          placeholder="Search"
          className="max-w-64"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
        {actions}
      </div>

      <table className="table min-w-full table-auto border-collapse border">
        <thead>
          <tr className="rounded-t-2xl">
            {columns.map((column, index) => (
              <th
                key={keys[index]}
                onClick={
                  column.sortable && column.key
                    ? () => handleSort(column.key as string)
                    : undefined
                }
                className={cn(
                  "text-pro-gray-300 bg-neutral-50 px-6 py-2.5 text-sm font-semibold",
                  column.sortable &&
                    "hover:cursor-pointer hover:bg-neutral-100",
                )}
              >
                <div className="flex w-full items-center gap-2 [&_svg]:size-4">
                  {column.icon}
                  {column.header}
                  {column.sortable &&
                    sortColumn === column.key &&
                    (sortDirection === "asc" ? (
                      <ArrowUpIcon
                        color="#454545"
                        size={16}
                        className="ml-auto"
                      />
                    ) : (
                      <ArrowDownIcon
                        color="#454545"
                        size={16}
                        className="ml-auto"
                      />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr className="border-t">
              <td colSpan={columns.length} className="h-96">
                <AmaraSpinner />
              </td>
            </tr>
          )}

          {!isLoading && data.length === 0 && (
            <tr className="border-t">
              <td colSpan={columns.length} className="h-96">
                <EmptyState
                  title="Data Not Found"
                  description="No data available. Please check your search or filters, refresh, or contact support."
                  className="m-auto"
                />
              </td>
            </tr>
          )}

          {!isLoading &&
            sortedData.map((item, index) => (
              <tr
                key={`${id}-row-${index}`}
                className="border-t hover:bg-neutral-50"
              >
                {columns.map((column, columnIndex) => {
                  let cellClassName = "";
                  if (typeof column.className === "function") {
                    cellClassName = column.className(item);
                  } else if (typeof column.className === "string") {
                    cellClassName = column.className;
                  }
                  return (
                    <td
                      key={keys[columnIndex]}
                      className={cn(
                        "text-pro-gray-300 px-6 py-2.5 text-sm",
                        cellClassName,
                      )}
                    >
                      {column.cell
                        ? column.cell(item)
                        : getValueByPath(item, column.key)}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex min-w-full items-center justify-between gap-6 rounded-b-2xl border border-t-0 px-6 py-3">
        {/* Left side - Rows per page and total items */}
        <div className="flex items-center gap-2">
          <span className="text-pro-gray-200 whitespace-nowrap text-sm">
            Show
          </span>
          <Select
            value={selectValue}
            onValueChange={(value) => {
              setSelectValue(value);
              handleRowsPerPageChange(value);
            }}
          >
            <SelectTrigger className="w-fit min-w-[60px]">
              <SelectValue>{selectValue || rowsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-pro-gray-200 whitespace-nowrap text-sm">
            per page
          </span>
        </div>

        {/* Right side - Pagination */}
        <div className="flex items-center gap-6">
          {!isLoading && total > 0 && (
            <span className="text-pro-gray-200 whitespace-nowrap text-sm">
              {`${start}-${end} of ${total}`}
            </span>
          )}

          <div className="flex items-center gap-1">
            {/* First page */}
            <button
              type="button"
              disabled={!pagination?.total_pages || currentPage === 1}
              onClick={() => handlePageChange(1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm hover:border disabled:cursor-not-allowed disabled:bg-secondary [&_svg]:size-4"
            >
              <ChevronsLeftIcon />
            </button>

            {/* Previous page */}
            <button
              type="button"
              disabled={!pagination?.total_pages || currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm hover:border disabled:cursor-not-allowed disabled:bg-secondary [&_svg]:size-4"
            >
              <ChevronLeftIcon />
            </button>

            {/* Page numbers */}
            {pageNumbers.map((pageNum, index) =>
              pageNum === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                >
                  <EllipsisIcon className="size-4" />
                </span>
              ) : (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum as number)}
                  className={cn(
                    `h-10 w-10 rounded-lg border text-sm`,
                    currentPage === pageNum
                      ? "border-pro-primary text-pro-primary"
                      : "border-pro-snow-200 text-pro-gray-400 hover:border-pro-primary",
                  )}
                >
                  {pageNum}
                </button>
              ),
            )}

            {/* Next page */}
            <button
              type="button"
              disabled={
                !pagination?.total_pages ||
                currentPage >= pagination.total_pages
              }
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm hover:border disabled:cursor-not-allowed disabled:bg-secondary [&_svg]:size-4"
            >
              <ChevronRightIcon />
            </button>

            {/* Last page */}
            <button
              type="button"
              disabled={
                !pagination?.total_pages ||
                currentPage >= pagination.total_pages
              }
              onClick={() => handlePageChange(pagination?.total_pages || 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm hover:border disabled:cursor-not-allowed disabled:bg-secondary [&_svg]:size-4"
            >
              <ChevronsRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
