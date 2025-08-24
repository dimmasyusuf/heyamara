import { Pagination } from "@/types/api";

export const Response = <
  T extends {
    status: number;
    message: string;
    error?: string;
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    pagination?: Pagination;
  },
>({
  status,
  message,
  error,
  data,
  pagination,
}: T) => {
  return {
    status,
    message,
    error,
    data,
    pagination,
  };
};
