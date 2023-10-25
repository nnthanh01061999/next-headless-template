import { STATE, AUTH } from "@/data";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const state = request.cookies.get(STATE);
  const value = state?.value ? JSON.parse(state?.value) : undefined;
  const auth = !!value?.[AUTH];

  return NextResponse.next();
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
