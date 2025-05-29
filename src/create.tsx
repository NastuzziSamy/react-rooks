import * as React from "react";

import Rook from "./rook";
import type {
  RookStore,
  RookContext,
  RookContextValue,
  UseStoreHookReturn,
  RookInit,
  RookStoreReducer,
  RookReducers,
  RookComponent,
} from "./type";

export const createUseRook =
  <Store extends RookStore>(context: RookContext<Store>) =>
  <StoreKey extends keyof Store | undefined = undefined>(
    key?: StoreKey
  ): UseStoreHookReturn<Store, StoreKey> => {
    const { store, update } =
      React.useContext<RookContextValue<Store>>(context);

    if (key === undefined) {
      return [store, update] as UseStoreHookReturn<Store, StoreKey>;
    }

    const setValue = (
      value:
        | Store[Extract<StoreKey, keyof Store>]
        | ((
            prev: Store[Extract<StoreKey, keyof Store>]
          ) => Store[Extract<StoreKey, keyof Store>])
    ) => {
      if (typeof value === "function") {
        const transformValue = value as (
          prev: Store[Extract<StoreKey, keyof Store>]
        ) => Store[Extract<StoreKey, keyof Store>];

        update({
          [key]: transformValue(
            store[key] as Store[Extract<StoreKey, keyof Store>]
          ),
        } as unknown as Partial<Store>);

        return;
      }

      update({
        [key]: value,
      } as unknown as Partial<Store>);
    };

    return [store[key], setValue] as UseStoreHookReturn<Store, StoreKey>;
  };

// Helper function for better type inference when using init
export function createRookWithInit<
  DefaultStore extends RookStore,
  Store extends RookStore
>(config: {
  defaultStore: DefaultStore;
  init: (store: DefaultStore) => Promise<Store>;
  storeReducer?: RookStoreReducer<Store>;
  reducers?: RookReducers<Store>;
}): [
  RookComponent,
  <StoreKey extends keyof Store | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
] {
  return createRook<Store, DefaultStore>(config);
}

export const createRook = <
  Store extends RookStore,
  DefaultStore extends RookStore = Store
>({
  defaultStore,
  init,
  storeReducer,
  reducers,
}:
  | {
      init: RookInit<Store, DefaultStore>;
      defaultStore?: DefaultStore;
      storeReducer?: RookStoreReducer<Store>;
      reducers?: RookReducers<Store>;
    }
  | {
      init?: undefined;
      defaultStore: Store;
      storeReducer?: RookStoreReducer<Store>;
      reducers?: RookReducers<Store>;
    }): [
  RookComponent,
  <StoreKey extends keyof Store | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
] => {
  const context = React.createContext({} as RookContextValue<Store>);

  const CreatedRook = ({
    // onInit,
    children,
  }: React.PropsWithChildren) =>
    init ? (
      <Rook<Store, DefaultStore>
        Provider={context.Provider}
        storeReducer={storeReducer}
        reducers={reducers}
        init={init}
        defaultStore={defaultStore as DefaultStore}
      >
        {children}
      </Rook>
    ) : (
      <Rook<Store, Store>
        Provider={context.Provider}
        storeReducer={storeReducer}
        reducers={reducers}
        defaultStore={defaultStore as Store}
      >
        {children}
      </Rook>
    );

  const useRook = createUseRook<Store>(context);

  return [CreatedRook, useRook];
};

export const createStoreRook = <Store extends RookStore>(
  defaultStore: Store,
  {
    reducers,
    storeReducer,
  }: {
    reducers?: RookReducers<Store>;
    storeReducer?: RookStoreReducer<Store>;
  } = {}
): [
  RookComponent,
  <StoreKey extends keyof Store | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
] => {
  return createRook<Store, Store>({
    defaultStore,
    reducers,
    storeReducer,
  });
};
