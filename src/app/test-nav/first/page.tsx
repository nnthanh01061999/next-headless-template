"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import useRouter from "@/utils/use-router";

function Page() {
  const router = useRouter();
  return (
    <div>
      <Button asChild>
        <Link href={"/test-nav/second"}>Second</Link>
      </Button>
      <Button onClick={() => router.push("/test-nav/second")}>
        Push second
      </Button>
    </div>
  );
}

export default Page;
