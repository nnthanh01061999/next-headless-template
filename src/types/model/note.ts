import { Assign } from "@/types";

export type TNote = {
  id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  name: string;
  description?: string;
  content: string;
  book_id?: number;
  user_id?: number;
};

export type TNotePayload = Assign<
  TNote,
  {
    id?: number;
  }
>;
