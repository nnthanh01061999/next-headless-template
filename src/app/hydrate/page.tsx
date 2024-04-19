import noteFetchApi from "@/apis/note-fetch";
import List from "@/components/hydrate/List";
import { AUTH } from "@/data";
import getQueryClient from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function Page() {
  const queryClient = getQueryClient();
  const cookieValues = cookies();

  await queryClient.prefetchQuery({
    queryKey: ["note", 1],
    queryFn: () =>
      noteFetchApi.getNotes({
        params: { page: 1, size: 20 },
        headers: {
          Authorization: JSON.parse(cookieValues.get(AUTH)?.value || "")?.accessToken,
        },
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <List />
    </HydrationBoundary>
  );
}
