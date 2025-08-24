import { useSearchParams } from "next/navigation";

interface GetParamsResult {
  limit: number;
  offset: number;
  search: string;
  sort?: string;
  order?: "asc" | "desc";
}

export default function useGetParams(): GetParamsResult {
  const searchParams = useSearchParams();

  const limit = parseInt(searchParams.get("limit") || "10");

  const offset = parseInt(searchParams.get("offset") || "1");

  const search = searchParams.get("search") || "";

  const sort = searchParams.get("sort") || undefined;

  const order = (searchParams.get("order") as "asc" | "desc") || "asc";

  return {
    limit,
    offset,
    search,
    sort,
    order,
  };
}
