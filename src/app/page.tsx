"use client";
import noteApi from "@/apis/note";
import { BaseAlertDialog } from "@/components/alert-dialog/BaseAlertDialog";
import { BaseDialog } from "@/components/dialog/BaseDialog";
import BaseSheet from "@/components/sheet/BaseSheet";
import { Button } from "@/components/ui/button";
import { useNotify } from "@/components/ui/use-notify";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const { data, refetch, isPending, isPlaceholderData } = useQuery({
    queryKey: ["note", page],
    queryFn: () =>
      noteApi.getNotes({
        page,
        size: 20,
      }),
    placeholderData: keepPreviousData,
  });
  const { toast } = useToast();
  const { notify } = useNotify();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between space-y-2 font-mono">
        <div className={cn(["grid grid-flow-col gap-2"])}>
          <Button
            onClick={() => {
              toast({
                title: "Scheduled: Catch up",
                description: dayjs().toString(),
                position: "top-right",
              });
            }}
          >
            Toast
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Scheduled: Catch up",
                description: dayjs().toString(),
              });
            }}
          >
            Toast
          </Button>
          <Button
            onClick={() => {
              notify({
                title: "Notify",
                description: dayjs().toString(),
                onOk: () => console.log("ok"),
                type: "error",
              });
            }}
          >
            Notify
          </Button>
          <BaseSheet />
          <BaseDialog />
          <BaseAlertDialog />
        </div>
        <div className={cn(["grid h-[200000px] grid-flow-col gap-2"])}>
          <Button onClick={() => refetch()}>Refetch</Button>
          <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
            Prev page
          </Button>
          <Button disabled={page * 5 >= data?.data?.total || isPlaceholderData} onClick={() => setPage((prev) => prev + 1)}>
            Next page
          </Button>
          <Button asChild>
            <Link href={"/hydrate"}>Hydrate render</Link>
          </Button>
          <Button asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
        </div>
        {isPending ? (
          <div className={cn(["text-3.5"])}>Loading...</div>
        ) : (
          <div>
            {data?.data?.items?.map((item: any) => (
              <p key={item.id}>
                {item.id}
                {item.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
