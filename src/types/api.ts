export interface Response<T = any> {
  status: number;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
