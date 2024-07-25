import noteFetchApi from "@/apis/note-fetch";
import { AUTH } from "@/data";
import getQueryClient from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

const List = dynamic(() => import("@/components/hydrate/List"));

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
