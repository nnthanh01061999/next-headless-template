import { cn } from "@/lib/utils";

function Page({ searchParams: { total } }: any) {
  const list = Array(total || 11).fill(1);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between space-y-2 font-mono">
        <div
          className={cn([
            "grid",
            "[&>div]:border-b",
            "grid-cols-1",
            "sm:grid-cols-2",
            "md:grid-cols-3",
            "max-[639px]:[&>div:nth-child(n)>div]:border-l-0",
            "max-[767px]:[&>div:nth-child(2n)>div]:border-l",
            "min-[767px]:[&>div:nth-child(3n+2)>div]:border-l min-[767px]:[&>div:nth-child(3n+3)>div]:border-l",
            "[&>div:last-child]:border-b-0",
            list.length % 2 === 0
              ? cn(["min-[640px]:[&>div:nth-last-child(2)]:border-b-0", "min-[768px]:[&>div:nth-last-child(2)]:border-b", "min-[640px]:[&>div:last-child]:border-b-0"])
              : "min-[640px]:[&>div:last-child]:border-b-0 max-[767px]:[&>div:last-child]:border-b-0",
            list.length % 3 === 2 ? cn(["min-[768px]:[&>div:nth-last-child(2)]:border-b-0"]) : "",
            list.length % 3 === 0 ? cn(["min-[768px]:[&>div:nth-last-child(2)]:border-b-0", "min-[768px]:[&>div:nth-last-child(3)]:border-b-0"]) : "",
          ])}
        >
          {list.map((_, index) => (
            <div key={index} className="flex items-center border-solid border-black py-2 first:last:justify-center">
              <div className={cn([" w-full p-2 border-black border-solid"])}>
                <div className={cn(["bg-blue-300 h-20 w-full border-black border-solid"])}>Card</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Page;
