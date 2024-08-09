import { PathWithOptionalColon } from "@/data/api-key";

const baseURL = "/auth";

export const authApiKey = {
  authSignIn: `${baseURL}/sign-in`,
  authRefreshToken: `${baseURL}/refresh-token`,
  authGetMe: "user/general-user/find-me",
} satisfies Record<string, PathWithOptionalColon>;
