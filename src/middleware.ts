import { AUTH, STATE } from "@/data";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const state = request.cookies.get(STATE);
  const value = state?.value ? JSON.parse(state?.value) : undefined;
  const auth = !!value?.[AUTH];

  const handleI18nRouting = createMiddleware({
    locales: ["vi", "en"],
    defaultLocale: "vi",
    localeDetection: false,
  });

  return handleI18nRouting(request);
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
