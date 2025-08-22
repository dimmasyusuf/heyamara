"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

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
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
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
  const offsetParam = "page";
  const limitParam = "limit";

  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const [rowsPerPage, setRowsPerPage] = useState(pagination?.per_page || 10);
  const [sortColumn, setSortColumn] = useState<string | null>(
    searchParams.get(sortParam) || null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (searchParams.get(orderParam) as "asc" | "desc") || "asc",
  );

  const keys = useMemo(
    () => Array.from({ length: columns.length }, () => nanoid()),
    [columns.length],
  );

  // Dynamic rows per page options based on total data
  const getDynamicRowsPerPageOptions = () => {
    const baseOptions = [5, 10, 25, 50];

    if (!pagination?.total) return baseOptions;

    // Filter options that are less than or equal to total items
    const filteredOptions = baseOptions.filter(
      (option) => option <= pagination.total,
    );

    // If no options are available (total is very small), include the smallest option
    if (filteredOptions.length === 0) {
      return [baseOptions[0]];
    }

    return filteredOptions;
  };

  const rowsPerPageOptions = getDynamicRowsPerPageOptions();

  // Update local state when pagination prop changes
  useEffect(() => {
    if (pagination) {
      setCurrentPage(pagination.page);
    }
  }, [pagination]);

  // Update URL search params
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  };

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
    setRowsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing rows per page

    updateSearchParams({
      [limitParam]: newRowsPerPage,
      [offsetParam]: "1",
    });
  };

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
    if (!pagination) return { start: 0, end: 0, total: 0 };

    const { page, total } = pagination;
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, total);

    return { start, end, total };
  };

  const { start, end, total } = getItemsRange();

  return (
    <div className="flex flex-col overflow-auto rounded-2xl">
      <div className="flex items-center justify-between rounded-t-2xl border border-b-0 px-6 py-4">
        <Input type="text" placeholder="Search" className="max-w-64" />
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
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="w-fit">
              <SelectValue />
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
          <span className="text-pro-gray-200 whitespace-nowrap text-sm">
            {start}-{end} of {total}
          </span>

          <div className="flex items-center gap-1">
            {/* First page */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              className="border-pro-snow-200 hover:bg-pro-snow-100 disabled:bg-pro-snow-100 flex h-10 w-10 items-center justify-center rounded-lg border text-sm [&_svg]:size-4"
            >
              <ChevronsLeftIcon />
            </button>

            {/* Previous page */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="border-pro-snow-200 hover:bg-pro-snow-100 disabled:bg-pro-snow-100 flex h-10 w-10 items-center justify-center rounded-lg border text-sm [&_svg]:size-4"
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
                      ? "border-pro-primary bg-pro-primary-100 text-pro-primary"
                      : "border-pro-snow-200 text-pro-gray-400 hover:bg-pro-snow-100",
                  )}
                >
                  {pageNum}
                </button>
              ),
            )}

            {/* Next page */}
            <button
              type="button"
              disabled={currentPage === pagination.total_pages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="border-pro-snow-200 hover:bg-pro-snow-100 disabled:bg-pro-snow-100 flex h-10 w-10 items-center justify-center rounded-lg border text-sm [&_svg]:size-4"
            >
              <ChevronRightIcon />
            </button>

            {/* Last page */}
            <button
              type="button"
              disabled={currentPage === pagination.total_pages}
              onClick={() => handlePageChange(pagination.total_pages)}
              className="border-pro-snow-200 hover:bg-pro-snow-100 disabled:bg-pro-snow-100 flex h-10 w-10 items-center justify-center rounded-lg border text-sm [&_svg]:size-4"
            >
              <ChevronsRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
