"use client";
import BaseEditor from "@/components/editor/base-editor";
import { cn } from "@/lib/utils";

function Page() {
  return (
    <main className="overflow-hidden grid p-24 font-mono">
      <div className={cn(["overflow-hidden"])}>
        <div className="h-full grid grid-rows-[auto,minmax(0,1fr)] gap-2">
          <BaseEditor />
        </div>
      </div>
    </main>
  );
}

export default Page;
