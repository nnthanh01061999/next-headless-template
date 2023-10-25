import noteApi from "@/apis/note";
import List from "@/components/hydrate/List";
import getQueryClient from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", 1],
    queryFn: () =>
      noteApi.getNotesServer({
        page: 1,
        size: 20,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <List />
    </HydrationBoundary>
  );
}
