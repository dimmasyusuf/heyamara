export interface BaseResponse {
  status: number;
  message: string;
}

export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginationResponse {
  pagination: Pagination;
}
