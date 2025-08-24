import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getCandidates } from "@/actions/candidate";
import { CANDIDATE_KEY } from "@/services/candidate";

export default async function CandidateDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: CANDIDATE_KEY.GET_CANDIDATES({
        search: "",
        limit: 10,
        offset: 0,
      }),
      queryFn: () => getCandidates({ search: "", limit: 10, offset: 0 }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
