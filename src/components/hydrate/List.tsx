"use client";
import noteFetchApi from "@/apis/note-fetch";
import { Button } from "@/components/ui/button";
import { API_KEY } from "@/data";
import { cn } from "@/lib/utils";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function List() {
  const [page, setPage] = useState<number>(1);
  const { data, refetch, isPending, isPlaceholderData } = useQuery({
    queryKey: [API_KEY.noteIndex, page],
    queryFn: () =>
      noteFetchApi.getNotes({
        params: {
          page,
          size: 20,
        },
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm space-y-2">
        <div className={cn(["grid gap-2 grid-flow-col"])}>
          <Button onClick={() => refetch()}>Refetch</Button>
          <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
            Prev page
          </Button>
          <Button disabled={page * 5 >= (data?.responseData?.data?.total || 0) || isPlaceholderData} onClick={() => setPage((prev) => prev + 1)}>
            Next page
          </Button>
          <Button asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button asChild>
            <Link href={"/"}>Client render</Link>
          </Button>
        </div>
        {isPending ? <div>Loading...</div> : <div>{data?.responseData?.data?.items?.map((item: any) => <p key={item.id}>{item.name}</p>)}</div>}
      </div>
    </main>
  );
}
