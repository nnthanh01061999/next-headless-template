import { createStore, useStore } from "zustand";

type RoutingStore = {
  loading: boolean;
  actions: {
    setLoading: (loading: boolean) => void;
  };
};
const routingStore = createStore<RoutingStore>()((set, get) => ({
  loading: false,
  actions: {
    setLoading: (loading: boolean) => {
      set({
        loading,
      });
    },
  },
}));

export type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

type Params<U> = Parameters<typeof useStore<typeof routingStore, U>>;

// Selectors
const loadingSelector = (state: ExtractState<typeof routingStore>) => state.loading;
const actionsSelector = (state: ExtractState<typeof routingStore>) => state.actions;

// getters
export const getActions = () => actionsSelector(routingStore.getState());
export const getLoading = () => loadingSelector(routingStore.getState());

function useRoutingStore<U>(selector: Params<U>[1]) {
  return useStore(routingStore, selector);
}

// Hooks
export const useActions = () => useRoutingStore(actionsSelector);
export const useLoading = () => useRoutingStore(loadingSelector);
