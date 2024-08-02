import { ExtractState } from "@/types/store";
import { createStore, useStore } from "zustand";

type RoutingStore = {
  loading: boolean;
  actions: {
    setLoading: (loading: boolean) => void;
  };
};
const routingStore = createStore<RoutingStore>()((set) => ({
  loading: false,
  actions: {
    setLoading: (loading: boolean) => {
      set({
        loading,
      });
    },
  },
}));

type Params<U> = Parameters<typeof useStore<typeof routingStore, U>>;

// Selectors
const loadingSelector = (state: ExtractState<typeof routingStore>) => state.loading;
const actionsSelector = (state: ExtractState<typeof routingStore>) => state.actions;

// getters
export const getLoading = () => loadingSelector(routingStore.getState());
export const getRoutingActions = () => actionsSelector(routingStore.getState());

function useRoutingStore<U>(selector: Params<U>[1]) {
  return useStore(routingStore, selector);
}

// Hooks
export const useLoading = () => useRoutingStore(loadingSelector);
export const useRoutingActions = () => useRoutingStore(actionsSelector);
