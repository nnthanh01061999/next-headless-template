import { IMainUpdatePayload, IPaginationParams } from "@/types";
import { getBeURL, networkHandler } from "@/utils";
import { serverNetworkHandler, setServerToken } from "@/utils/network-server";

function getNotes(params: IPaginationParams) {
  return networkHandler
    .get(getBeURL("/note"), { params })
    .then((rp) => rp.data);
}

interface IToken {
  accessToken: string;
  refreshToken: string;
}

function getNotesServer(params: IPaginationParams) {
  return serverNetworkHandler
    .get(getBeURL("/note"), {
      params,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJuZ3V5dGVlc2t5MTY1QGdtYWlsLmNvbSIsImlhdCI6MTY5OTIzOTA4MywiZXhwIjoxNjk5ODQzODgzfQ.DgHjPaAI3YHax3of_9jZVo27E4_tfut9hlcI_I5oNO0",
      },
    })
    .then((rp) => rp.data);
}

function getNoteByID(id: number | string) {
  return networkHandler.get(getBeURL(`/note/${id}`)).then((rp) => rp.data);
}

function createNote(payload: any) {
  return networkHandler
    .post(getBeURL("/note"), { ...payload })
    .then((rp) => rp.data);
}

function updateNote(payload: IMainUpdatePayload<any>) {
  const { id, payload: payload_ } = payload;
  return networkHandler
    .patch(getBeURL(`/note/${id}`), { ...payload_ })
    .then((rp) => rp.data);
}

function deleteNote(id: number | string) {
  return networkHandler.delete(getBeURL(`/note/${id}`)).then((rp) => rp.data);
}

const api = {
  getNotes,
  getNotesServer,
  getNoteByID,
  createNote,
  updateNote,
  deleteNote,
};

export default api;
