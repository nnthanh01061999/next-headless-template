import { IMainUpdatePayload, IPaginationParams } from "@/types";
import { getBeURL, networkHandler } from "@/utils";
import { AxiosRequestConfig } from "axios";

function getNotes(params: IPaginationParams, config?: AxiosRequestConfig) {
  return networkHandler.get(getBeURL("noteIndex"), { params, ...config }).then((rp) => rp.data);
}

function getNoteByID(id: number | string, config?: AxiosRequestConfig) {
  return networkHandler.get(getBeURL("noteDetail", { id }), config).then((rp) => rp.data);
}

function createNote(payload: any, config?: AxiosRequestConfig) {
  return networkHandler.post(getBeURL("noteCreate"), { ...payload, config }).then((rp) => rp.data);
}

function updateNote(payload: IMainUpdatePayload<any>, config?: AxiosRequestConfig) {
  const { id, payload: payload_ } = payload;
  return networkHandler.patch(getBeURL("noteUpdate", { id }), { ...payload_, config }).then((rp) => rp.data);
}

function deleteNote(id: number | string) {
  return networkHandler.delete(getBeURL("noteDelete", { id })).then((rp) => rp.data);
}

const noteApi = {
  getNotes,
  getNoteByID,
  createNote,
  updateNote,
  deleteNote,
};

export default noteApi;
