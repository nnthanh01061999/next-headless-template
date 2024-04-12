"use client";
import { useActions, useLoading } from "@/store/routing-store";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const path = usePathname();
  const { setLoading: setLoadingStore } = useActions();
  const loadingStore = useLoading();

  useEffect(() => {
    // Bind react router navigation event to all a tags
    const onClick = (e: any) => {
      const target = e.target as HTMLElement;

      var foundTarget = target;

      if (target.tagName.toLowerCase() !== "a" && target.tagName.toLowerCase() !== "button") {
        const closestAnchor = target.closest("a");
        if (closestAnchor) {
          foundTarget = closestAnchor;
        }
      }
      const lcTagName = foundTarget.tagName.toLowerCase();

      if (lcTagName === "a" || lcTagName === "button") {
        const href = foundTarget.getAttribute("href");
        if (href && href.startsWith("/")) {
          e.preventDefault();
          if (href !== path) {
            setLoadingStore(true);
          }
          router.push(href);
        }
      }
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [router, path, setLoadingStore]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoadingStore(false);
  }, [path, setLoadingStore]);

  return (
    <div>
      {children}
      {loadingStore ? "loading" : "stop"}
    </div>
  );
}

export default Layout;
