import { noteApiKey } from "@/data/api-key/note";
import { authApiKey } from "./auth";

export const API_KEY = {
  ...authApiKey,
  ...noteApiKey,
};
