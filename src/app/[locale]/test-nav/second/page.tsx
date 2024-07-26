"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useRouter from "@/hooks/use-router";

function Page() {
  const router = useRouter();

  return (
    <div>
      <Button asChild>
        <Link href={"/test-nav/first"}>First</Link>
      </Button>
      <Button onClick={() => router.push("/test-nav/first")}>Push first</Button>
    </div>
  );
}

export default Page;
