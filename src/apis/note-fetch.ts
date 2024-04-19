import { IDataSource, IMainResponse, IMainUpdatePayload, IPaginationParams, TNote, TNotePayload } from "@/types";

import { getBeURL } from "@/utils";
import { sendRequest } from "@/utils/fetch/sendRequest";
import { SendRequest } from "@/utils/fetch/type";

function getNotes(config: SendRequest<IMainResponse<IDataSource<TNote>>, { params: IPaginationParams }>) {
  return sendRequest({
    method: "GET",
    url: getBeURL("noteIndex"),
    ...config,
  });
}

function getNoteByID({ id, ...config }: SendRequest<IMainResponse<TNote>, { id: number | string }>) {
  return sendRequest({
    method: "GET",
    url: getBeURL("noteDetail", { id }),
    ...config,
  });
}

function createNote(config: SendRequest<IMainResponse<TNote>, { payload: TNotePayload }>) {
  return sendRequest({
    method: "POST",
    url: getBeURL("noteCreate"),
    ...config,
  });
}

function updateNote({ id, payload, ...config }: SendRequest<IMainResponse<TNote>, IMainUpdatePayload<TNotePayload>>) {
  return sendRequest({
    method: "PATCH",
    url: getBeURL("noteUpdate", { id }),
    payload,
    ...config,
  });
}

function deleteNote({ id, ...config }: SendRequest<IMainResponse<TNote>, { id: number | string }>) {
  return sendRequest({
    method: "DELETE",
    url: getBeURL("noteDelete", { id }),
    ...config,
  });
}

const noteFetchApi = {
  getNotes,
  getNoteByID,
  createNote,
  updateNote,
  deleteNote,
};

export default noteFetchApi;
