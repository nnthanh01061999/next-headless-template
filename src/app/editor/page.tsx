"use client";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
const BaseEditor = dynamic(() => import("@/components/editor/base-editor"), { ssr: false });

function Page() {
  return (
    <main className="grid overflow-hidden p-24 font-mono">
      <div className={cn(["overflow-hidden"])}>
        <div className="grid h-full grid-rows-[auto,minmax(0,1fr)] gap-2">
          <BaseEditor />
        </div>
      </div>
    </main>
  );
}

export default Page;
