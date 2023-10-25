"use client";

import AsyncSelect from "@/components/share/AsyncSelect";
import { getBeURL } from "@/utils";

function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono space-y-2">
        <AsyncSelect
          mode="multiple"
          config={{
            name: "note",
            url: getBeURL("/note"),
            valueField: "id",
            labelField: "name",
            responseKey: "data.items",
            search: {
              searchKey: "keyword",
            },
          }}
        />
      </div>
    </main>
  );
}

export default Page;
