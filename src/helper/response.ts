import { Response as ResponseType } from "@/types/api";

export const Response = <T = any>({
  status,
  message,
  data,
  pagination,
}: ResponseType<T>) => {
  return {
    status,
    message,
    data,
    pagination,
  };
};
