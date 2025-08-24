import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getCandidate } from "@/actions/candidate";
import { CANDIDATE_KEY } from "@/services/candidate";

export default async function CandidateDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ candidate_id: string }>;
}) {
  const { candidate_id } = await params;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: CANDIDATE_KEY.GET_CANDIDATE(candidate_id),
      queryFn: () => getCandidate(candidate_id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
