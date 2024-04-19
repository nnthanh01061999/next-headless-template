export type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;
