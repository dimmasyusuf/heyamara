export interface Response {
  status: number;
  message: string;
  error?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
