import { PathWithOptionalColon } from "@/data/api-key";

const baseUrl = "/note";

export const noteApiKey = {
  noteIndex: `${baseUrl}/index`,
  noteDetail: `${baseUrl}/:id`,
  noteCreate: `${baseUrl}`,
  noteUpdate: `${baseUrl}/:id`,
  noteDelete: `${baseUrl}/:id`,
} satisfies Record<string, PathWithOptionalColon>;
